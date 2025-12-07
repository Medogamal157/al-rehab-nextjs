import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'al-rehab-super-secret-key-change-in-production-2024'
);

async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  // Check cookie first
  let adminToken = request.cookies.get('admin-token')?.value;
  
  // Fallback to Authorization header
  if (!adminToken) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      adminToken = authHeader.substring(7);
    }
  }
  
  console.log('[Proxy] Checking admin-token:', adminToken ? 'exists' : 'missing');
  
  if (!adminToken) {
    return false;
  }

  try {
    const result = await jwtVerify(adminToken, JWT_SECRET);
    console.log('[Proxy] JWT verified successfully, payload:', result.payload);
    return true;
  } catch (error) {
    console.log('[Proxy] JWT verification failed:', error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    const isAuthenticated = await verifyAdminToken(request);
    
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/admin') {
    const isAuthenticated = await verifyAdminToken(request);
    
    if (isAuthenticated) {
      const dashboardUrl = new URL('/admin/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
