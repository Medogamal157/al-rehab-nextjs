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
  const PAGE_SIZE = 20;
  try {
    const [requests, total, statusGroups] = await Promise.all([
      prisma.exportRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: PAGE_SIZE,
      }),
      prisma.exportRequest.count(),
      prisma.exportRequest.groupBy({ by: ['status'], _count: true }),
    ]);

    const statusCounts = statusGroups.reduce<Record<string, number>>((acc, g) => {
      acc[g.status] = g._count;
      return acc;
    }, {});

    return {
      // Serialize dates to ISO strings
      data: requests.map(request => ({
        ...request,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
        respondedAt: request.respondedAt ? request.respondedAt.toISOString() : null,
      })),
      statusCounts,
      pagination: {
        total,
        page: 1,
        limit: PAGE_SIZE,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      },
    };
  } catch (error) {
    console.error('Failed to fetch export requests:', error);
    return {
      data: [],
      statusCounts: {},
      pagination: { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 },
    };
  }
}

export default async function AdminExportRequestsPage() {
  await verifyAdminAuth();
  const initial = await getExportRequests();

  return (
    <AdminExportRequests
      initialData={initial.data}
      initialPagination={initial.pagination}
      initialStatusCounts={initial.statusCounts}
    />
  );
}
