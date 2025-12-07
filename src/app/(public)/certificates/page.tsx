import type { Metadata } from 'next';
import { CertificatesPageClient } from '@/components/pages/CertificatesPageClient';

export const metadata: Metadata = {
  title: 'Certifications - Al-REHAB GROUP | EU Organic, USDA, FSSC 22000, HACCP Certified',
  description: 'Al-REHAB GROUP holds prestigious international certifications including EU Organic, USDA Organic, FSSC 22000, HACCP, ISO 9001, ISO 22000, Kosher, and Halal.',
  keywords: 'EU Organic certification Egypt, USDA Organic herbs, FSSC 22000 certified, HACCP certification, FDA registered facility Egypt, ISO 9001 quality management, ISO 22000 food safety, Kosher certified herbs, Halal certified spices',
  openGraph: {
    type: 'article',
    title: 'Certifications - Al-REHAB GROUP',
    description: 'International certifications guaranteeing quality, safety, and reliability.',
  },
};

export default function CertificatesPage() {
  return <CertificatesPageClient />;
}
