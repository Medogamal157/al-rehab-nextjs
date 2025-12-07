import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'al-rehab-super-secret-key-change-in-production-2024'
);

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Verify admin token from cookies server-side
 * Returns admin user if authenticated, redirects to login if not
 */
export async function verifyAdminAuth(): Promise<AdminUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token) {
    redirect('/admin');
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload || typeof payload.id !== 'string') {
      redirect('/admin');
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    redirect('/admin');
  }
}

/**
 * Check if user is authenticated without redirecting
 * Returns admin user or null
 */
export async function getAdminAuth(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload || typeof payload.id !== 'string') {
      return null;
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}
