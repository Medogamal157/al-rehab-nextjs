import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'al-rehab-super-secret-key-change-in-production-2024'
);

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminUser | null> {
  try {
    // First, try to get token from cookie
    const adminToken = request.cookies.get('admin-token')?.value;
    
    // If not in cookie, try Authorization header
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    
    const token = adminToken || bearerToken;
    
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error('Admin token verification error:', error);
    return null;
  }
}
