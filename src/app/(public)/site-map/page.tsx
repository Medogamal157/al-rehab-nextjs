import type { Metadata } from 'next';
import { SitemapPageClient } from '@/components/pages/SitemapPageClient';

export const metadata: Metadata = {
  title: 'Sitemap | Al-Rehab Group for Export - Site Navigation',
  description: 'Browse all pages and products available on Al-Rehab Group for Export website. Complete site navigation for Egyptian herbs, spices, and medicinal plants.',
  keywords: [
    'sitemap',
    'site navigation',
    'Al-Rehab Group for Export pages',
    'product list',
    'Egyptian herbs',
    'website map',
  ],
};

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <SitemapPageClient />
    </div>
  );
}
