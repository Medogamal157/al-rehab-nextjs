import type { Metadata } from 'next';
import { ContactPageClient } from '@/components/pages/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us - Al-Rehab Group for Export | Egyptian Herbs & Spices Supplier',
  description: 'Contact Al-Rehab Group for Export for premium Egyptian herbs and spices inquiries. Request quotes for chamomile, hibiscus, cumin, fennel. B2B wholesale supplier from Faiyum, Egypt.',
  keywords: [
    'contact herbs egypt',
    'egyptian herbs supplier contact',
    'herbs export inquiry egypt',
    'B2B herbs quote egypt',
    'egyptian spices supplier contact',
    'faiyum herbs export',
    'wholesale herbs inquiry',
    'herbs and spices egypt contact',
  ],
  openGraph: {
    type: 'website',
    title: 'Contact Al-Rehab Group for Export',
    description: 'Get in touch for premium Egyptian herbs and spices export inquiries.',
    url: 'https://al-rehabgroup.com/contact',
  },
  alternates: {
    canonical: 'https://al-rehabgroup.com/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
