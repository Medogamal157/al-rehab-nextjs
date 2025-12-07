import { AdminAuthProvider } from '@/components/providers/AdminAuthProvider';

export default function BlankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
