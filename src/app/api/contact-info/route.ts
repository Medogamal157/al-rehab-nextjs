import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { verifyAdminToken } from '@/lib/admin-auth';
import { contactInfoSchema } from '@/lib/validations';
import { rateLimitApi, getRateLimitHeaders } from '@/lib/rate-limit';

// Helper to convert null JSON values to Prisma's JsonNull
function preparePrismaData(data: Record<string, unknown>): Prisma.ContactInfoCreateInput {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'workingHours') {
      // Handle workingHours JSON field
      result[key] = value === null ? Prisma.JsonNull : value ?? Prisma.JsonNull;
    } else {
      result[key] = value;
    }
  }
  return result as Prisma.ContactInfoCreateInput;
}

// GET /api/contact-info - Get contact info (public can only get main)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || 'main';
    const admin = await verifyAdminToken(request);

    // Non-authenticated users can only get main contact info
    if (!admin && key !== 'main') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (admin && key === 'all') {
      // Get all contact info for admin
      const contactInfos = await prisma.contactInfo.findMany({
        where: { isActive: true },
      });
      return NextResponse.json({ success: true, data: contactInfos });
    }

    const contactInfo = await prisma.contactInfo.findUnique({
      where: { key },
    });

    if (!contactInfo) {
      return NextResponse.json(
        { success: false, error: 'Contact info not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// POST /api/contact-info - Create new contact info entry
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'contact-info-create');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const body = await request.json();
    const validatedData = contactInfoSchema.parse(body);

    // Check if key already exists
    const existingInfo = await prisma.contactInfo.findUnique({
      where: { key: validatedData.key },
    });

    if (existingInfo) {
      return NextResponse.json(
        { success: false, error: 'Contact info with this key already exists' },
        { status: 400 }
      );
    }

    const contactInfo = await prisma.contactInfo.create({
      data: preparePrismaData(validatedData as unknown as Record<string, unknown>),
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE',
        entity: 'ContactInfo',
        entityId: contactInfo.id,
        newData: JSON.parse(JSON.stringify(contactInfo)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json(
      { success: true, data: contactInfo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact info:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create contact info' },
      { status: 500 }
    );
  }
}

// PUT /api/contact-info - Update contact info by key
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimitApi(request, 'contact-info-update');
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.reset) }
      );
    }

    const body = await request.json();
    const validatedData = contactInfoSchema.parse(body);

    // Upsert - create if doesn't exist, update if exists
    const existingInfo = await prisma.contactInfo.findUnique({
      where: { key: validatedData.key },
    });

    const prismaData = preparePrismaData(validatedData as unknown as Record<string, unknown>);
    const contactInfo = await prisma.contactInfo.upsert({
      where: { key: validatedData.key },
      update: prismaData,
      create: prismaData,
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: existingInfo ? 'UPDATE' : 'CREATE',
        entity: 'ContactInfo',
        entityId: contactInfo.id,
        oldData: existingInfo ? JSON.parse(JSON.stringify(existingInfo)) : null,
        newData: JSON.parse(JSON.stringify(contactInfo)),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Error updating contact info:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
