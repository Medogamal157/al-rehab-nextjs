import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/pages/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us - Al-Rehab Group for Export | Leading Egyptian Herbs & Spices Exporter',
  description: "Learn about Al-Rehab Group for Export, Egypt's leading exporter of premium herbs and spices from Faiyum. Quality chamomile, hibiscus, cumin, basil. B2B wholesale supplier with international certifications.",
  keywords: [
    'about al-rehab group for export',
    'egyptian herbs exporter',
    'spices company egypt faiyum',
    'organic herbs egypt',
    'quality herbs supplier egypt',
    'B2B herbs export egypt',
    'herbs and spices manufacturer egypt',
    'egyptian food export company',
    'herbs egypt company',
  ],
  openGraph: {
    type: 'article',
    title: 'About Us - Al-Rehab Group for Export',
    description: "Egypt's leading exporter of premium herbs and spices from Faiyum.",
    url: 'https://al-rehabgroup.com/about',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
