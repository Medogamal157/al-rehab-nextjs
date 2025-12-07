import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { AdminAuthProvider } from '@/components/providers/AdminAuthProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ScrollProgress />
      <main>{children}</main>
    </AdminAuthProvider>
  );
}
