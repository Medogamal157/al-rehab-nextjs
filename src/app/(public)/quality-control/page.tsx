import type { Metadata } from 'next';
import { QualityControlPageClient } from '@/components/pages/QualityControlPageClient';

export const metadata: Metadata = {
  title: 'Quality Control - Al-REHAB GROUP | Premium Egyptian Herbs & Spices',
  description: 'Our rigorous quality control processes ensure premium Egyptian herbs and spices. Laboratory analysis, allergen management, metal detection, and pesticide residue testing.',
  keywords: 'quality control herbs, food safety Egypt, pesticide testing, metal detection herbs, laboratory analysis spices, HACCP quality, allergen management',
  openGraph: {
    type: 'article',
    title: 'Quality Control - Al-REHAB GROUP',
    description: 'Our rigorous quality control processes ensure premium products.',
  },
};

export default function QualityControlPage() {
  return <QualityControlPageClient />;
}
