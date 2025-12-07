'use client';

import { motion } from 'framer-motion';
import { Package, FileCheck, Shield, Truck, Clock, Globe } from 'lucide-react';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import Image from 'next/image';

export function ShipmentsPageClient() {
  const shippingSteps = [
    {
      icon: FileCheck,
      title: 'Order Confirmation',
      description: 'Your order is confirmed with all specifications verified and documented.'
    },
    {
      icon: Package,
      title: 'Careful Packing',
      description: 'Products are packed with strict quality checks and proper protection materials.'
    },
    {
      icon: Shield,
      title: 'Quality Check',
      description: 'Final quality inspection ensures product meets all standards and specifications.'
    },
    {
      icon: Truck,
      title: 'Container Loading',
      description: 'All containers are packed under supervision with careful arrangement and safety protocols.'
    },
    {
      icon: FileCheck,
      title: 'Documentation',
      description: 'Complete export documentation prepared including all required certificates.'
    },
    {
      icon: Globe,
      title: 'Dispatch',
      description: 'Shipment dispatched with trusted logistics partners for safe, timely delivery.'
    }
  ];

  const features = [
    {
      icon: Globe,
      title: 'Global Shipping',
      description: 'We deliver to clients worldwide with reliable international shipping solutions.',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: Package,
      title: 'Secure Packaging',
      description: 'Export-grade packaging ensures products remain fresh and protected throughout transit.',
      gradient: 'from-emerald-400 to-green-600'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'We work with trusted logistics partners to ensure your shipment arrives as promised.',
      gradient: 'from-amber-400 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-b from-blue-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20">
                Logistics & Delivery
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-6">
              Shipments & Logistics
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-4 leading-relaxed">
              We ship our products to our clients worldwide safely and efficiently.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 leading-relaxed">
              Every order is processed with careful packing, accurate documentation, and strict quality checks. All containers are packed under supervision to ensure clean handling, proper arrangement, and maximum safety.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              Our team follows strict loading standards so your products arrive fresh, protected, and exactly as promised, and we work only with trusted logistics partners to ensure your shipment arrives on time and in perfect condition.
            </p>

            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* Shipping Process Timeline */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
              Our Shipping Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From order to delivery, every step is carefully managed to ensure your products arrive safely
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shippingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border-2 border-blue-200/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg text-sm">
                  {index + 1}
                </div>

                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="w-14 h-14 mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="text-white" size={28} />
                  </motion.div>
                  <h3 className="text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl p-8 border-2 border-gray-100 hover:border-[#2d7a3e]/30 transition-all duration-300 hover:shadow-xl text-center"
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="text-white" size={32} />
                </motion.div>
                <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
              Professional Container Loading
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every container is carefully loaded with proper arrangement and safety protocols to ensure products arrive in perfect condition
            </p>
            <PharaohBorder className="w-48 mx-auto mt-6 text-[#c4a24c] opacity-30" />
          </motion.div>

          {/* Image Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Container 1 - Grey Bags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/shipments/IMG-20251116-WA0029.jpg"
                  alt="Container loaded with premium herbs in secure packaging"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Secure Packaging</h3>
                <p className="text-sm text-white/90">
                  Premium quality packaging with reinforced strapping ensures products remain protected during transit
                </p>
              </div>
            </motion.div>

            {/* Container 2 - Green Bags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/shipments/IMG-20251116-WA0030.jpg"
                  alt="Full container ready for international export"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Maximum Efficiency</h3>
                <p className="text-sm text-white/90">
                  Expert loading techniques maximize container capacity while maintaining product safety and integrity
                </p>
              </div>
            </motion.div>

            {/* Container 3 - Yellow Bags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/shipments/IMG-20251116-WA0031.jpg"
                  alt="Carefully organized shipment with proper documentation"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl mb-2">Quality Assurance</h3>
                <p className="text-sm text-white/90">
                  Each bag is properly labeled and documented for complete traceability throughout the shipping process
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
