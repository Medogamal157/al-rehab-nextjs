import type { Metadata } from 'next';
import { CertificatesPageClient } from '@/components/pages/CertificatesPageClient';

export const metadata: Metadata = {
  title: 'Certifications - Al-Rehab Group for Export | EU Organic, USDA, FSSC 22000, HACCP Certified',
  description: 'Al-Rehab Group for Export holds EU Organic, USDA Organic, FSSC 22000, HACCP, ISO 9001, ISO 22000, Kosher, and Halal certifications. Certified Egyptian herbs and spices exporter.',
  keywords: [
    'EU Organic certification egypt',
    'USDA Organic herbs egypt',
    'FSSC 22000 certified egypt',
    'HACCP certification herbs',
    'FDA registered facility egypt',
    'ISO 9001 herbs egypt',
    'ISO 22000 food safety',
    'Kosher certified herbs egypt',
    'Halal certified spices egypt',
    'certified herbs exporter egypt',
  ],
  openGraph: {
    type: 'article',
    title: 'Certifications - Al-Rehab Group for Export',
    description: 'International certifications guaranteeing quality, safety, and reliability of Egyptian herbs.',
    url: 'https://al-rehabgroup.com/certificates',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/certificates',
  },
};

export default function CertificatesPage() {
  return <CertificatesPageClient />;
}
