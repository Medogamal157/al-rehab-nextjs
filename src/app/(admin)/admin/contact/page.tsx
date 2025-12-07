import type { Metadata } from 'next';
import { AdminContactInfo } from '@/components/admin/AdminContactInfo';
import { verifyAdminAuth } from '@/lib/admin-auth-server';

export const metadata: Metadata = {
  title: 'Contact Info | Al-Rehab Admin',
  description: 'Manage contact information for Al-Rehab Group',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminContactInfoPage() {
  await verifyAdminAuth();

  // The AdminContactInfo component handles fetching data itself
  return <AdminContactInfo />;
}
