'use client';

import { motion } from 'framer-motion';
import { MapPin, Sprout, Leaf, CheckCircle } from 'lucide-react';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import Image from 'next/image';

export function FarmsPageClient() {
  const features = [
    {
      icon: MapPin,
      title: 'Location & Climate',
      description: 'Our herbs and spices are grown in selected Egyptian farms known for rich soil and an ideal climate that naturally enhances the quality and aroma of each crop.',
      gradient: 'from-amber-400 to-orange-600'
    },
    {
      icon: Sprout,
      title: 'Sustainable Farming',
      description: 'We follow strict, sustainable farming practices to ensure clean, pesticide-free crops with full traceability from field to final product.',
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: CheckCircle,
      title: 'Traceability & Harvesting',
      description: 'Our expert farmers harvest each crop at peak freshness, delivering consistent quality and exceptional aroma in every shipment with complete traceability.',
      gradient: 'from-blue-400 to-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-emerald-50/40 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%232d7a3e\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-full border border-[#2d7a3e]/20">
                Our Source
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-6">
              Our Farms
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              Our herbs and spices are grown in selected Egyptian farms known for rich soil and an ideal climate.
              We follow strict, sustainable farming practices to ensure clean, pesticide-free crops with full traceability from field to final product.
              Our expert farmers harvest each crop at peak freshness, delivering consistent quality and exceptional aroma in every shipment.
            </p>

            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl p-8 border-2 border-[#2d7a3e]/10 hover:border-[#2d7a3e]/30 transition-all duration-300 hover:shadow-xl text-center"
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="text-white" size={32} />
                </motion.div>
                <h3 className="text-2xl text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
              From Field to Export
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Modern technology meets traditional Egyptian farming expertise to deliver premium quality herbs and spices
            </p>
            <PharaohBorder className="w-48 mx-auto mt-6 text-[#c4a24c] opacity-30" />
          </motion.div>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Modern Harvesting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/farm/IMG-20251116-WA0021.jpg"
                  alt="Modern harvesting equipment in Egyptian farms"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d7a3e]/90 via-[#2d7a3e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Modern Equipment</h3>
                <p className="text-sm text-white/90">
                  State-of-the-art harvesting machinery ensures efficient collection while maintaining crop quality
                </p>
              </div>
            </motion.div>

            {/* Organized Cultivation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/farm/IMG-20251116-WA0023.jpg"
                  alt="Well-organized cultivation fields with irrigation systems"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d7a3e]/90 via-[#2d7a3e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Precision Farming</h3>
                <p className="text-sm text-white/90">
                  Organized rows and advanced irrigation systems optimize growth and ensure consistent quality
                </p>
              </div>
            </motion.div>

            {/* Traditional Egyptian Farming */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/farm/IMG-20251116-WA0024.jpg"
                  alt="Egyptian farmers hand-harvesting flowers in Faiyum"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d7a3e]/90 via-[#2d7a3e]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Expert Care</h3>
                <p className="text-sm text-white/90">
                  Skilled Egyptian farmers carefully hand-harvest delicate flowers and herbs at peak freshness
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl text-gray-900 mb-4">
                  Commitment to Quality from the Ground Up
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Every product we export begins with careful selection of farming locations and methods. Our partnerships with experienced Egyptian farmers ensure that only the best practices are applied throughout the growing season.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  From soil preparation to harvest timing, every decision is made with quality and sustainability in mind. This dedication to excellence at the farm level translates directly into the superior products we deliver to our global partners.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
