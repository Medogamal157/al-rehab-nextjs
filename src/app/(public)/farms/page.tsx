import type { Metadata } from 'next';
import { FarmsPageClient } from '@/components/pages/FarmsPageClient';

export const metadata: Metadata = {
  title: 'Our Farms - Al-Rehab Group for Export | Egyptian Herb & Spice Farms in Faiyum',
  description: 'Explore Al-Rehab Group for Export farms in Faiyum, Egypt. Premium herbs and spices grown with sustainable practices. Organic chamomile, hibiscus, basil farms with full traceability.',
  keywords: [
    'egyptian farms herbs',
    'faiyum agriculture',
    'herbs farms egypt',
    'sustainable farming egypt',
    'organic herb farming egypt',
    'spice cultivation egypt',
    'traceable herbs egypt',
    'chamomile farms egypt',
    'hibiscus cultivation egypt',
  ],
  openGraph: {
    type: 'article',
    title: 'Our Farms - Al-Rehab Group for Export',
    description: 'Premium herbs and spices grown in the fertile lands of Faiyum, Egypt.',
    url: 'https://al-rehabgroup.com/farms',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/farms',
  },
};

export default function FarmsPage() {
  return <FarmsPageClient />;
}
