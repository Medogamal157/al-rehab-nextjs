"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Certificate {
  id: string;
  name: string;
  fullName?: string;
  description?: string;
  image?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

// Fallback certificate images from public folder
const defaultCertImages: Record<string, string> = {
  'eu-organic': '/cert/WhatsApp Image 2025-11-15 at 23.38.56_2a321686.jpg',
  'usda-organic': '/cert/WhatsApp Image 2025-11-15 at 23.39.09_6aad7abc.jpg',
  'fssc-22000': '/cert/WhatsApp Image 2025-11-15 at 23.39.25_a97d4320.jpg',
};

// Map certificate names to icons
const certIcons: Record<string, typeof Shield> = {
  'eu organic': Shield,
  'usda organic': Award,
  'fssc 22000': Shield,
  'haccp': CheckCircle,
  'fda registered': FileCheck,
  'iso 9001': Award,
  'iso 22000': Shield,
  'kosher': CheckCircle,
  'halal': Award,
};

const getIconForCert = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(certIcons)) {
    if (lowerName.includes(key)) return icon;
  }
  return Shield;
};

const getDefaultImage = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('eu organic')) return defaultCertImages['eu-organic'];
  if (lowerName.includes('usda')) return defaultCertImages['usda-organic'];
  if (lowerName.includes('fssc')) return defaultCertImages['fssc-22000'];
  return null;
};

export function TrustSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yReverse = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/certificates?featured=true&activeOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Take up to 4 featured certificates
          setCertificates(data.data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { number: `${certificates.length > 0 ? '9+' : '9+'}`, label: 'International Certifications' },
    { number: '100%', label: 'Quality Assured' },
    { number: '24/7', label: 'Customer Support' }
  ];

  // Show loading skeleton or fallback
  const displayCertificates = certificates.length > 0 ? certificates : [
    { id: '1', name: 'EU Organic', fullName: 'European Standards', image: defaultCertImages['eu-organic'], isFeatured: true, isActive: true, displayOrder: 1 },
    { id: '2', name: 'USDA Organic', fullName: 'Organic Certification', image: defaultCertImages['usda-organic'], isFeatured: true, isActive: true, displayOrder: 2 },
    { id: '3', name: 'FSSC 22000', fullName: 'Food Safety Management', image: defaultCertImages['fssc-22000'], isFeatured: true, isActive: true, displayOrder: 3 },
    { id: '4', name: 'HACCP', fullName: 'Quality Control', image: null, isFeatured: true, isActive: true, displayOrder: 4 },
  ];

  return (
    <section ref={ref} className="py-20 bg-linear-to-br from-[#213D35] via-[#2d7a3e] to-[#213D35] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-[#c4a24c]/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: yReverse }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-white/10 to-transparent rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#c4a24c]/20 backdrop-blur-sm border border-[#c4a24c]/30 rounded-full px-5 py-2 mb-6"
          >
            <Shield className="w-5 h-5 text-[#c4a24c]" />
            <span className="text-[#c4a24c] text-sm uppercase tracking-wider">Certified Excellence</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Trusted by Businesses <span className="text-[#c4a24c]">Worldwide</span>
          </h2>
          <p className="text-white/70 text-lg">
            International certifications that guarantee quality, safety, and reliability
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="text-4xl md:text-5xl text-[#c4a24c] mb-2">{stat.number}</div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Certificates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
          {displayCertificates.map((cert, index) => {
            const Icon = getIconForCert(cert.name);
            const certImage = cert.image || getDefaultImage(cert.name);
            
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.5 + index * 0.1
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 hover:border-[#c4a24c]/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center p-3 shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden">
                  {certImage ? (
                    <Image 
                      src={certImage} 
                      alt={cert.name} 
                      width={80} 
                      height={80} 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <Icon className="w-10 h-10 text-[#2d7a3e]" />
                  )}
                </div>
                <h3 className="text-white text-lg mb-2 group-hover:text-[#c4a24c] transition-colors">
                  {cert.name}
                </h3>
                <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                  {cert.fullName || cert.name}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center"
        >
          <Link
            href="/certificates"
            className="group inline-flex items-center gap-3 bg-white/10 hover:bg-[#c4a24c] backdrop-blur-sm border border-white/20 hover:border-[#c4a24c] rounded-full px-8 py-4 text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#c4a24c]/20"
          >
            <span className="text-base">View All Certifications</span>
            <Award className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Link>
          <p className="text-white/50 text-sm mt-4">
            9 international certifications ensuring premium quality
          </p>
        </motion.div>
      </div>
    </section>
  );
}
