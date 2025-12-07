import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/pages/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us - Al-REHAB GROUP | Premium Egyptian Herbs & Spices Exporter',
  description: "Learn about Al-REHAB GROUP, Egypt's leading exporter of premium herbs and spices from Faiyum. Discover our story, values, and commitment to quality and excellence in the B2B herbs export market.",
  keywords: 'about Al-REHAB GROUP, Egyptian herbs exporter, spices company Egypt Faiyum, organic herbs Egypt, quality herbs supplier, B2B herbs export, herbs and spices manufacturer Egypt, Egyptian food export company',
  openGraph: {
    type: 'article',
    title: 'About Us - Al-REHAB GROUP',
    description: "Egypt's leading exporter of premium herbs and spices from Faiyum.",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
