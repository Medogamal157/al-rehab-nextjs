"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContactData {
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  emailSales?: string;
  whatsapp?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Quality Control', path: '/quality-control' },
  { name: 'Farms', path: '/farms' },
  { name: 'Shipments', path: '/shipments' },
  { name: 'Contact', path: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms of Service', path: '/terms-of-service' },
  { name: 'Export Terms', path: '/export-terms' },
  { name: 'Site Map', path: '/site-map' },
];

export function Footer() {
  const [contact, setContact] = useState<ContactData>({
    city: 'Faiyum',
    country: 'Egypt',
    email: 'info@al-rehabgroup.com',
    emailSales: 'export@al-rehabgroup.com',
    phone: '+201055558189',
    whatsapp: '+201055558189',
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch contact info
    fetch('/api/contact-info?key=main')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContact(data.data);
        }
      })
      .catch(console.error);

    // Fetch categories
    fetch('/api/categories?activeOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const formatPhone = (phone: string) => {
    // Format phone for display: +20 105 555 8189
    const clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('+20') && clean.length >= 12) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
    }
    return phone;
  };

  const getWhatsAppLink = (number: string) => {
    const clean = number.replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  };

  return (
    <footer className="bg-linear-to-br from-[#1d5a2e] to-[#2d7a3e] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div>
            <Link href="/">
              <Image 
                src="/footer_logo.png" 
                alt="Al-REHAB GROUP for Export" 
                width={200}
                height={112}
                className="h-20 sm:h-24 md:h-28 w-auto mb-3 sm:mb-4" 
              />
            </Link>
            <p className="text-white/70 mb-3 sm:mb-4 text-sm sm:text-base">
              Al-REHAB GROUP - Premium Egyptian herbs and spices exported worldwide with excellence and authenticity.
            </p>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin size={16} />
              <span className="text-xs sm:text-sm">{contact.city}, {contact.country}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4">Our Products</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li className="flex items-start gap-2 text-white/70">
                <Mail size={18} className="shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                      {contact.email}
                    </a>
                  )}
                  {contact.emailSales && (
                    <a href={`mailto:${contact.emailSales}`} className="hover:text-white transition-colors text-xs opacity-75">
                      {contact.emailSales}
                    </a>
                  )}
                </div>
              </li>
              {contact.phone && (
                <li className="flex items-start gap-2 text-white/70">
                  <Phone size={18} className="shrink-0 mt-1" />
                  <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">
                    {formatPhone(contact.phone)}
                  </a>
                </li>
              )}
              {contact.whatsapp && (
                <li className="flex items-start gap-2 text-white/70">
                  <MessageCircle size={18} className="shrink-0 mt-1" />
                  <a 
                    href={getWhatsAppLink(contact.whatsapp)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-white/60 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Al-Rehab Group for Export. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/60">
              {legalLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.path} 
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
