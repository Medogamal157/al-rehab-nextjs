import { redirect } from 'next/navigation';

// This page just redirects to the dashboard
// Authentication is handled by AdminPageWrapper
export default function AdminPage() {
  redirect('/admin/dashboard');
}
