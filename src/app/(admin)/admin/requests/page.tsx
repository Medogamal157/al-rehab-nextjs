import type { Metadata } from 'next';
import { AdminExportRequests } from '@/components/admin/AdminExportRequests';
import { verifyAdminAuth } from '@/lib/admin-auth-server';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Export Requests | Al-Rehab Admin',
  description: 'Manage export requests for Al-Rehab Group for Export',
  robots: {
    index: false,
    follow: false,
  },
};

async function getExportRequests() {
  try {
    const requests = await prisma.exportRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize dates to ISO strings
    return requests.map(request => ({
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      respondedAt: request.respondedAt ? request.respondedAt.toISOString() : null,
    }));
  } catch (error) {
    console.error('Failed to fetch export requests:', error);
    return [];
  }
}

export default async function AdminExportRequestsPage() {
  await verifyAdminAuth();
  const requests = await getExportRequests();

  return <AdminExportRequests initialData={requests} />;
}
