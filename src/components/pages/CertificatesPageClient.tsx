'use client';

import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck, Loader2 } from 'lucide-react';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Certificate {
  id: string;
  name: string;
  fullName?: string;
  slug: string;
  description?: string;
  image?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

// Map certificate names to icons
const certIcons: Record<string, typeof Shield> = {
  'eu organic': Shield,
  'usda organic': Award,
  'fssc 22000': Shield,
  'haccp': CheckCircle,
  'fda registered': FileCheck,
  'fda': FileCheck,
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

export function CertificatesPageClient() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/certificates?activeOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCertificates(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-full border border-[#2d7a3e]/20">
                International Standards
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-6">
              Our Certifications
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              Certified excellence in every step. Our international certifications guarantee quality, 
              safety, and compliance with global standards.
            </p>

            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#2d7a3e]" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No certificates available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:gap-12 max-w-7xl mx-auto">
              {certificates.map((cert, index) => {
                const Icon = getIconForCert(cert.name);
                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#2d7a3e]/30 transition-all duration-500 shadow-lg hover:shadow-2xl">
                      <div className="grid lg:grid-cols-5 gap-0">
                        {/* Certificate Image/Icon Section */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-[#2d7a3e]/5 to-[#c4a24c]/5 p-8 sm:p-12 flex items-center justify-center relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `radial-gradient(circle at 2px 2px, #2d7a3e 1px, transparent 0)`,
                              backgroundSize: '32px 32px'
                            }}></div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e] rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
                          >
                            {cert.image ? (
                              <Image 
                                src={cert.image} 
                                alt={cert.name} 
                                width={160} 
                                height={160} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <Icon className="text-white" size={64} strokeWidth={1.5} />
                            )}
                          </motion.div>

                          {/* Badge for Featured Certifications */}
                          {cert.isFeatured && (
                            <div className="absolute top-4 left-4 z-20">
                              <span className="px-3 py-1 bg-[#c4a24c] text-white text-xs rounded-full shadow-lg">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                          <div className="mb-4">
                            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-2 group-hover:text-[#2d7a3e] transition-colors duration-300">
                              {cert.name}
                            </h2>
                            {cert.fullName && (
                              <p className="text-sm sm:text-base text-gray-500">
                                {cert.fullName}
                              </p>
                            )}
                          </div>

                          <div className="w-16 h-1 bg-gradient-to-r from-[#2d7a3e] to-[#c4a24c] rounded-full mb-6"></div>

                          {cert.description && (
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
                              {cert.description}
                            </div>
                          )}

                          {/* Certificate Details */}
                          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                            <p className="text-sm text-gray-500">
                              <span className="text-[#2d7a3e]">Certification Status:</span> Active & Verified
                            </p>
                            {cert.issuer && (
                              <p className="text-sm text-gray-500">
                                <span className="text-[#2d7a3e]">Issuer:</span> {cert.issuer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Certified Quality You Can Trust
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Our comprehensive certifications ensure that every product meets the highest international 
              standards for safety, quality, and authenticity. From organic farming to export packaging, 
              we maintain excellence at every step.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
                <div className="text-3xl text-[#c4a24c] mb-1">{certificates.length > 0 ? `${certificates.length}+` : '9+'}</div>
                <div className="text-white/90 text-sm">Certifications</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
                <div className="text-3xl text-[#c4a24c] mb-1">100%</div>
                <div className="text-white/90 text-sm">Compliance</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
                <div className="text-3xl text-[#c4a24c] mb-1">50+</div>
                <div className="text-white/90 text-sm">Countries Served</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
