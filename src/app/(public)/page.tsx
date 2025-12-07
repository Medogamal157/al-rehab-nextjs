import { Hero } from '@/components/sections/Hero';
import { TrustSection } from '@/components/sections/TrustSection';
import { About } from '@/components/sections/About';
import { EgyptianShowcase } from '@/components/sections/EgyptianShowcase';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Products } from '@/components/sections/Products';
import { GlobalReach } from '@/components/sections/GlobalReach';
import { Quality } from '@/components/sections/Quality';
import { Contact } from '@/components/sections/Contact';

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

