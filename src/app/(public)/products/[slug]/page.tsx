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
      title: 'Product Not Found | Al-Rehab Group for Export',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | Al-Rehab Group for Export - Premium Egyptian ${product.category?.name || 'Products'}`,
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
      title: `${product.name} | Al-Rehab Group for Export`,
      description: product.description || `Premium quality ${product.name} from Egypt`,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
      type: 'website',
    },
  };
}

// Product Structured Data Component
function ProductStructuredData({ product }: { product: {
  name: string;
  slug: string;
  description: string | null;
  englishName: string | null;
  botanicalName: string | null;
  category: { name: string } | null;
  images: { url: string }[];
} }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://al-rehabgroup.com';
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Premium quality ${product.name} from Egypt. Wholesale export available.`,
    image: product.images[0]?.url ? `${baseUrl}${product.images[0].url}` : `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Al-Rehab Group for Export"
    },
    manufacturer: {
      "@type": "Organization",
      name: "Al-Rehab Group for Export",
      url: baseUrl
    },
    category: product.category?.name || "Herbs & Spices",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "USD",
      price: "0",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Al-Rehab Group for Export"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "Worldwide"
        }
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
      bestRating: "5",
      worstRating: "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data for structured data
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      {product && <ProductStructuredData product={product} />}
      <ProductDetailsPageClient slug={slug} />
    </div>
  );
}
