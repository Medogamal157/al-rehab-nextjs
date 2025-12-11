import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | Al-Rehab Group for Export',
  description: 'Admin panel login for Al-Rehab Group for Export',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <AdminLoginForm />;
}
