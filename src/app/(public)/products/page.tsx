import { Suspense } from 'react';
import { ProductsPageClient } from '@/components/pages/ProductsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Al-Rehab Group for Export | Egyptian Herbs, Spices & Seeds Wholesale',
  description: "Premium Egyptian herbs and spices from Al-Rehab Group for Export. Chamomile, hibiscus, basil, cumin, coriander, fennel seeds. Organic & conventional. B2B wholesale supplier. Year-round availability.",
  keywords: [
    'egyptian herbs export',
    'herbs and spices egypt',
    'premium spices egypt',
    'organic herbs egypt',
    'chamomile egypt',
    'hibiscus egypt',
    'basil herbs egypt',
    'cumin seeds egypt',
    'coriander seeds egypt',
    'fennel seeds egypt',
    'sesame seeds egypt',
    'aromatic seeds export',
    'B2B herbs supplier egypt',
    'wholesale herbs egypt',
    'dried herbs egypt',
  ],
  openGraph: {
    type: 'website',
    title: 'Products - Al-Rehab Group for Export | Egyptian Herbs & Spices',
    description: "Premium Egyptian herbs, spices, and aromatic seeds for B2B export.",
    url: 'https://al-rehabgroup.com/products',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/products',
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsPageClient />
    </Suspense>
  );
}
