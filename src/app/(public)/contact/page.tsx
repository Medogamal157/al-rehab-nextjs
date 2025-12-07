import type { Metadata } from 'next';
import { ContactPageClient } from '@/components/pages/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us - Al-REHAB GROUP | Egyptian Herbs & Spices Export',
  description: 'Get in touch with Al-REHAB GROUP for inquiries, export quotes, or business partnerships. Premium Egyptian herbs and spices for global markets.',
  keywords: 'contact herbs Egypt, export inquiry, B2B herbs quote, Egyptian spices supplier contact, Faiyum herbs export',
  openGraph: {
    type: 'website',
    title: 'Contact Us - Al-REHAB GROUP',
    description: 'Get in touch with us for inquiries, quotes, or partnerships.',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
