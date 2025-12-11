import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { TrustSection } from '@/components/sections/TrustSection';
import { About } from '@/components/sections/About';
import { EgyptianShowcase } from '@/components/sections/EgyptianShowcase';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Products } from '@/components/sections/Products';
import { GlobalReach } from '@/components/sections/GlobalReach';
import { Quality } from '@/components/sections/Quality';
import { Contact } from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: 'Al-Rehab Group for Export | #1 Egyptian Herbs & Spices Exporter',
  description: 'Leading Egyptian herbs and spices exporter. Premium quality dried herbs, organic spices, chamomile, hibiscus, cumin, fennel seeds from Egypt. Wholesale B2B supplier with FSSC 22000, ISO certification. Global shipping to 50+ countries.',
  keywords: [
    'herbs and spices in egypt',
    'egyptian herbs exporter',
    'herbs egypt',
    'spices egypt',
    'egyptian herbs',
    'egyptian spices',
    'dried herbs egypt',
    'organic herbs egypt',
    'bulk herbs supplier egypt',
    'herbs supplier egypt',
    'chamomile egypt',
    'hibiscus egypt',
    'cumin egypt',
    'fennel seeds egypt',
    'wholesale herbs egypt',
  ],
  openGraph: {
    title: 'Al-Rehab Group for Export | Premium Egyptian Herbs & Spices',
    description: 'Egypt\'s leading herbs and spices exporter. Premium chamomile, hibiscus, cumin, fennel & more. FSSC 22000 certified. Global B2B supplier.',
    type: 'website',
    url: 'https://al-rehabgroup.com',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustSection />
      <About />
      <EgyptianShowcase />
      <WhyChooseUs />
      <Products />
      <GlobalReach />
      <Quality />
      <Contact />
    </div>
  );
}

