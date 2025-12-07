import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'al-rehab-super-secret-key-change-in-production-2024'
);

// Rate limiting constants
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// Helper to get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

// Check if IP/device is locked out
async function isLockedOut(ipAddress: string, deviceId: string | null): Promise<{ locked: boolean; remainingMinutes?: number }> {
  const lockoutTime = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000);
  
  // Count failed attempts in the lockout window
  const failedAttempts = await prisma.loginAttempt.count({
    where: {
      OR: [
        { ipAddress },
        ...(deviceId ? [{ deviceId }] : []),
      ],
      success: false,
      createdAt: { gte: lockoutTime },
    },
  });

  if (failedAttempts >= MAX_ATTEMPTS) {
    // Get the most recent failed attempt to calculate remaining lockout time
    const lastAttempt = await prisma.loginAttempt.findFirst({
      where: {
        OR: [
          { ipAddress },
          ...(deviceId ? [{ deviceId }] : []),
        ],
        success: false,
        createdAt: { gte: lockoutTime },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (lastAttempt) {
      const unlockTime = new Date(lastAttempt.createdAt.getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      const remainingMs = unlockTime.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      
      if (remainingMinutes > 0) {
        return { locked: true, remainingMinutes };
      }
    }
  }

  return { locked: false };
}

// Record login attempt
async function recordLoginAttempt(ipAddress: string, deviceId: string | null, email: string | null, success: boolean) {
  await prisma.loginAttempt.create({
    data: {
      ipAddress,
      deviceId,
      email,
      success,
    },
  });

  // Clean up old attempts (older than 24 hours)
  const cleanupTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await prisma.loginAttempt.deleteMany({
    where: {
      createdAt: { lt: cleanupTime },
    },
  }).catch(() => {}); // Ignore cleanup errors
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, deviceId } = body;

    const ipAddress = getClientIp(request);

    console.log('Login attempt for:', email, 'from IP:', ipAddress);

    // Check if locked out
    const lockoutStatus = await isLockedOut(ipAddress, deviceId || null);
    if (lockoutStatus.locked) {
      return NextResponse.json(
        { 
          error: `Too many failed login attempts. Please try again in ${lockoutStatus.remainingMinutes} minute(s).`,
          lockedOut: true,
          remainingMinutes: lockoutStatus.remainingMinutes,
        },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      // Record failed attempt
      await recordLoginAttempt(ipAddress, deviceId || null, email, false);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      // Record failed attempt
      await recordLoginAttempt(ipAddress, deviceId || null, email, false);
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      // Record failed attempt
      await recordLoginAttempt(ipAddress, deviceId || null, email, false);
      
      // Check remaining attempts
      const lockoutTime = new Date(Date.now() - LOCKOUT_DURATION_MINUTES * 60 * 1000);
      const failedAttempts = await prisma.loginAttempt.count({
        where: {
          OR: [
            { ipAddress },
            ...(deviceId ? [{ deviceId }] : []),
          ],
          success: false,
          createdAt: { gte: lockoutTime },
        },
      });
      
      const remainingAttempts = MAX_ATTEMPTS - failedAttempts;
      
      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0,
        },
        { status: 401 }
      );
    }

    // Record successful login
    await recordLoginAttempt(ipAddress, deviceId || null, email, true);

    // Clear failed attempts on successful login
    await prisma.loginAttempt.deleteMany({
      where: {
        OR: [
          { ipAddress },
          ...(deviceId ? [{ deviceId }] : []),
        ],
        success: false,
      },
    }).catch(() => {});

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .setIssuedAt()
      .sign(JWT_SECRET);

    console.log('Token created, setting cookie');

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      token, // Include token in response for localStorage fallback
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set the cookie on the response
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });

    console.log('Cookie set on response');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
