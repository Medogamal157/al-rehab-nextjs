import type { Metadata } from 'next';
import { AdminCertificates } from '@/components/admin/AdminCertificates';
import { verifyAdminAuth } from '@/lib/admin-auth-server';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Certificates | Al-Rehab Admin',
  description: 'Manage certificates for Al-Rehab Group',
  robots: {
    index: false,
    follow: false,
  },
};

async function getCertificates() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize dates to ISO strings and convert null to undefined
    return certificates.map(cert => ({
      id: cert.id,
      name: cert.name,
      fullName: cert.fullName ?? undefined,
      description: cert.description ?? undefined,
      image: cert.image ?? undefined,
      issuer: cert.issuer ?? undefined,
      issueDate: cert.issueDate?.toISOString().split('T')[0],
      expiryDate: cert.expiryDate?.toISOString().split('T')[0],
      isFeatured: cert.isFeatured ?? undefined,
      isActive: cert.isActive ?? undefined,
      createdAt: cert.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch certificates:', error);
    return [];
  }
}

export default async function AdminCertificatesPage() {
  await verifyAdminAuth();
  const certificates = await getCertificates();

  return <AdminCertificates initialData={certificates} />;
}
