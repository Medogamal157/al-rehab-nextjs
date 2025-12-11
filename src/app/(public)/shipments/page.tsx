import type { Metadata } from 'next';
import { ShipmentsPageClient } from '@/components/pages/ShipmentsPageClient';

export const metadata: Metadata = {
  title: 'Shipments & Logistics - Al-Rehab Group for Export | Global Herb & Spice Shipping',
  description: 'Global shipping and logistics for premium Egyptian herbs and spices from Al-Rehab Group for Export. Secure packaging, container loading, export documentation. Shipping to 50+ countries.',
  keywords: [
    'global shipping herbs egypt',
    'herb export logistics egypt',
    'egyptian spices shipping',
    'container loading egypt',
    'international spice shipping',
    'export documentation herbs',
    'herbs shipping worldwide',
    'egypt herbs delivery',
  ],
  openGraph: {
    type: 'article',
    title: 'Shipments & Logistics - Al-Rehab Group for Export',
    description: 'Reliable global shipping of Egyptian herbs and spices to 50+ countries.',
    url: 'https://al-rehabgroup.com/shipments',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/shipments',
  },
};

export default function ShipmentsPage() {
  return <ShipmentsPageClient />;
}
