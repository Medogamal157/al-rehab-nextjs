'use client';

import { motion } from 'framer-motion';
import { Shield, Leaf, Microscope, FlaskConical, TestTube, Users, Warehouse, FileCheck } from 'lucide-react';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import Image from 'next/image';

export function QualityControlPageClient() {
  const qualityFeatures = [
    {
      icon: Shield,
      title: 'Allergen Management',
      description: 'Careful monitoring and handling procedures to prevent cross-contamination with potential allergens and to ensure product safety for all customers.',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: Leaf,
      title: 'Separation of Organic & Non-Organic Products',
      description: 'Dedicated storage, processing lines, and handling protocols to maintain full integrity and traceability of certified organic products.',
      gradient: 'from-green-400 to-green-600'
    },
    {
      icon: Microscope,
      title: 'Metal Detection',
      description: 'Advanced metal detection systems are used in the final processing stages to ensure all products are free from metal contaminants before packing and shipment.',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      icon: FlaskConical,
      title: 'Pyrrolizidine Alkaloids (PA) Testing',
      description: 'Regular laboratory analysis to monitor PA content and ensure compliance with international safety standards.',
      gradient: 'from-cyan-400 to-cyan-600'
    },
    {
      icon: TestTube,
      title: 'Pesticide Residue Analysis',
      description: 'Comprehensive testing for a wide range of pesticide residues, including newly regulated substances such as Glyphosate, to guarantee safe and clean products.',
      gradient: 'from-red-400 to-red-600'
    },
    {
      icon: FileCheck,
      title: 'Quality Statement & Commitment',
      description: 'A strict company-wide commitment to quality, supported by documented procedures and continuous improvement across all production stages.',
      gradient: 'from-amber-400 to-amber-600'
    },
    {
      icon: Users,
      title: 'Farming Expertise',
      description: 'Our products originate from farms managed by experienced agricultural specialists who apply sustainable practices to ensure purity and high yield.',
      gradient: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: Warehouse,
      title: 'Controlled Processing',
      description: 'Each step — from drying and cleaning to sorting and packing — is performed under controlled conditions to maintain freshness and consistency.',
      gradient: 'from-indigo-400 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#c4a24c]/10 text-[#c4a24c] rounded-full border border-[#c4a24c]/20">
                Quality Assurance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-6">
              Quality Control
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              At Al Rehab Group for Export, our quality control system is designed to ensure the highest levels of purity, safety, and consistency across all products. Every batch of herbs, spices, and seeds undergoes a strict and fully documented quality assurance process.
            </p>

            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* Quality Features Grid */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-amber-50 to-emerald-50 p-6 rounded-xl border-2 border-[#2d7a3e]/10 hover:border-[#2d7a3e]/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-14 h-14 mb-4 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-md`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Laboratory Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl text-white"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <Microscope size={32} className="text-[#c4a24c]" />
                <h3 className="text-2xl sm:text-3xl">Laboratory Analysis</h3>
              </div>
              <p className="text-white/80 text-lg">
                Independent accredited laboratories conduct microbiological, chemical, and physical testing to verify product compliance with international specifications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quality Process Visual Showcase */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
              Our Quality Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From traditional drying methods to modern processing facilities, every step ensures premium quality
            </p>
            <PharaohBorder className="w-48 mx-auto mt-6 text-[#c4a24c] opacity-30" />
          </motion.div>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Traditional Drying */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/quality_control/IMG-20251116-WA0024.jpg"
                  alt="Traditional drying process"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d5a2e]/90 via-[#1d5a2e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Traditional Drying</h3>
                <p className="text-sm text-white/90">
                  Sun-drying herbs in traditional woven baskets preserves natural flavors and essential oils
                </p>
              </div>
            </motion.div>

            {/* Modern Processing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/quality_control/IMG-20251116-WA0035.jpg"
                  alt="Quality control processing"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d5a2e]/90 via-[#1d5a2e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Quality Inspection</h3>
                <p className="text-sm text-white/90">
                  Expert teams carefully inspect and sort products to ensure consistent quality and purity
                </p>
              </div>
            </motion.div>

            {/* Premium Products */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/quality_control/IMG-20251116-WA0023.jpg"
                  alt="Premium Egyptian herbs and spices"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d5a2e]/90 via-[#1d5a2e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Premium Products</h3>
                <p className="text-sm text-white/90">
                  The final result: premium Egyptian herbs and spices ready for global export
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
