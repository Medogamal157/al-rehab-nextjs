import type { Metadata } from 'next';
import { QualityControlPageClient } from '@/components/pages/QualityControlPageClient';

export const metadata: Metadata = {
  title: 'Quality Control - Al-Rehab Group for Export | Premium Egyptian Herbs Quality Assurance',
  description: 'Rigorous quality control for Egyptian herbs and spices at Al-Rehab Group for Export. Laboratory analysis, pesticide testing, metal detection, allergen management. HACCP & ISO certified.',
  keywords: [
    'quality control herbs egypt',
    'food safety egypt',
    'pesticide testing herbs',
    'metal detection herbs',
    'laboratory analysis spices egypt',
    'HACCP quality herbs',
    'allergen management herbs',
    'egyptian herbs quality',
    'spices quality assurance',
  ],
  openGraph: {
    type: 'article',
    title: 'Quality Control - Al-Rehab Group for Export',
    description: 'Rigorous quality control ensuring premium Egyptian herbs and spices.',
    url: 'https://al-rehabgroup.com/quality-control',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/quality-control',
  },
};

export default function QualityControlPage() {
  return <QualityControlPageClient />;
}
