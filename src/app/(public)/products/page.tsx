import { Suspense } from 'react';
import { ProductsPageClient } from '@/components/pages/ProductsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Al-REHAB GROUP | Egyptian Herbs, Spices & Aromatic Seeds Export',
  description: "Explore Al-REHAB GROUP's premium selection of Egyptian herbs (parsley, dill, basil, chamomile), authentic spices (cumin, coriander, caraway), and aromatic seeds (fennel, sesame). Certified organic, available year-round for B2B export.",
  keywords: 'Egyptian herbs export, premium spices Egypt, organic herbs, parsley Egypt, dill tips, basil herbs, cumin seeds, coriander seeds, fennel seeds Egypt, sesame seeds, chamomile flowers Egypt, hibiscus flowers, aromatic seeds export, B2B herbs supplier',
  openGraph: {
    type: 'website',
    title: 'Products - Al-REHAB GROUP | Egyptian Herbs, Spices & Aromatic Seeds Export',
    description: "Explore Al-REHAB GROUP's premium selection of Egyptian herbs, spices, and aromatic seeds.",
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsPageClient />
    </Suspense>
  );
}
