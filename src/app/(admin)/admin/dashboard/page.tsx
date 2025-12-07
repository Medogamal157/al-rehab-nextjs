import type { Metadata } from 'next';
import { AdminOverview } from '@/components/admin/AdminOverview';

export const metadata: Metadata = {
  title: 'Dashboard | Al-Rehab Admin',
  description: 'Admin dashboard for Al-Rehab Group for Export',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
