import type { Metadata } from 'next';
import { ProductDetailsPageClient } from '@/components/pages/ProductDetailsPageClient';
import { prisma } from '@/lib/prisma';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for each product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found | Al-Rehab Group',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | Al-Rehab Group - Premium Egyptian ${product.category?.name || 'Products'}`,
    description: product.description || `Premium quality ${product.name} from Egypt`,
    keywords: [
      product.name,
      product.englishName || '',
      product.category?.name || '',
      'Egyptian herbs',
      'Egyptian spices',
      'export quality',
      'wholesale',
      ...(product.botanicalName ? [product.botanicalName] : []),
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | Al-Rehab Group`,
      description: product.description || `Premium quality ${product.name} from Egypt`,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <ProductDetailsPageClient slug={slug} />
    </div>
  );
}
