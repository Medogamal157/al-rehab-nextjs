import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';

export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPageWrapper>{children}</AdminPageWrapper>;
}
