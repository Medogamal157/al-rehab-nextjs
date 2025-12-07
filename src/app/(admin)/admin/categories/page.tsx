import type { Metadata } from 'next';
import { AdminCategories } from '@/components/admin/AdminCategories';
import { verifyAdminAuth } from '@/lib/admin-auth-server';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Categories | Al-Rehab Admin',
  description: 'Manage categories for Al-Rehab Group',
  robots: {
    index: false,
    follow: false,
  },
};

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    // Serialize dates to ISO strings and convert null to undefined
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      icon: category.icon ?? undefined,
      color: category.color ?? undefined,
      image: category.image ?? undefined,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  await verifyAdminAuth();
  const categories = await getCategories();

  return <AdminCategories initialData={categories} />;
}
