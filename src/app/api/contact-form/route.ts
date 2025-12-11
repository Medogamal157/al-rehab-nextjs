import { NextRequest, NextResponse } from 'next/server';
import { rateLimitContactForm } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (5 messages per day per IP)
    const rateLimitResult = await rateLimitContactForm(request, 'contact-form');

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many messages sent. Please try again later.',
          remaining: rateLimitResult.remaining,
          retryAfter: Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, company, country, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Limit message length to prevent abuse
    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    // Get client IP for logging
    const forwarded = request.headers.get('x-forwarded-for');
    const real = request.headers.get('x-real-ip');
    const cfConnecting = request.headers.get('cf-connecting-ip');
    const clientIp = cfConnecting || (forwarded ? forwarded.split(',')[0].trim() : null) || real || 'unknown';

    // Save contact form submission to database
    const contactSubmission = await prisma.exportRequest.create({
      data: {
        name,
        email,
        company: company || null,
        country: country || null,
        phone: phone || null,
        message,
        status: 'new',
        source: 'contact-form',
        clientIp,
      },
    });

    // TODO: Send email notification to admin
    // await sendAdminNotificationEmail({
    //   name,
    //   email,
    //   company,
    //   message,
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We will contact you within 24 hours.',
        submissionId: contactSubmission.id,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': (5 - rateLimitResult.remaining - 1).toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
