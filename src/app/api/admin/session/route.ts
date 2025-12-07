import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'al-rehab-super-secret-key-change-in-production-2024'
);

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value;
    
    if (!adminToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { payload } = await jwtVerify(adminToken, JWT_SECRET);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
      token: adminToken,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
