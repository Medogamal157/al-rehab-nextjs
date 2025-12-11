import type { Metadata } from 'next';
import { AdminProducts, Product, Category } from '@/components/admin/AdminProducts';
import { verifyAdminAuth } from '@/lib/admin-auth-server';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Products | Al-Rehab Admin',
  description: 'Manage products for Al-Rehab Group for Export',
  robots: {
    index: false,
    follow: false,
  },
};

// Fetch initial products data server-side
async function getProductsData(): Promise<{ products: Product[]; categories: Category[] }> {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    // Convert dates to strings and properly type specifications
    return {
      products: products.map(p => ({
        ...p,
        specifications: p.specifications as Record<string, string> | null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
          ...p.category,
          createdAt: p.category.createdAt.toISOString(),
          updatedAt: p.category.updatedAt.toISOString(),
        } : null,
        images: p.images.map(img => ({
          ...img,
          createdAt: img.createdAt.toISOString(),
        })),
      })),
      categories: categories.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      products: [],
      categories: [],
    };
  }
}

export default async function AdminProductsPage() {
  // Verify authentication server-side
  await verifyAdminAuth();
  
  // Fetch initial data server-side
  const initialData = await getProductsData();

  return <AdminProducts initialData={initialData} />;
}
