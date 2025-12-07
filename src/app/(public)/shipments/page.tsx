import type { Metadata } from 'next';
import { ShipmentsPageClient } from '@/components/pages/ShipmentsPageClient';

export const metadata: Metadata = {
  title: 'Shipments & Logistics - Al-REHAB GROUP | Global Herb Export',
  description: 'Global shipping and logistics for premium Egyptian herbs and spices. Secure packaging, on-time delivery, and professional container loading.',
  keywords: 'global shipping herbs, herb export logistics, container loading Egypt, international spice shipping, export documentation herbs',
  openGraph: {
    type: 'article',
    title: 'Shipments & Logistics - Al-REHAB GROUP',
    description: 'Reliable global shipping to over 50 countries worldwide.',
  },
};

export default function ShipmentsPage() {
  return <ShipmentsPageClient />;
}
