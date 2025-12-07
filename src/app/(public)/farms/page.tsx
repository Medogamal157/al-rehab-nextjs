import type { Metadata } from 'next';
import { FarmsPageClient } from '@/components/pages/FarmsPageClient';

export const metadata: Metadata = {
  title: 'Our Farms - Al-REHAB GROUP | Egyptian Herb & Spice Farms',
  description: 'Explore our farms in Faiyum, Egypt where we grow premium herbs, spices, and seeds. Sustainable farming practices with full traceability.',
  keywords: 'Egyptian farms herbs, Faiyum agriculture, sustainable farming Egypt, organic herb farming, spice cultivation Egypt, traceable herbs',
  openGraph: {
    type: 'article',
    title: 'Our Farms - Al-REHAB GROUP',
    description: 'Premium herbs and spices grown in the fertile lands of Faiyum, Egypt.',
  },
};

export default function FarmsPage() {
  return <FarmsPageClient />;
}
