'use client';

import { motion } from 'framer-motion';
import { Award, Users, Target, Sparkles, Globe, Shield, TrendingUp, Heart } from 'lucide-react';
import { PharaohBorder } from '@/components/sections/EgyptianDecor';
import Image from 'next/image';

export function AboutPageClient() {
  const values = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'International standards with rigorous quality control',
      color: 'text-[#c4a24c]'
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Focusing on customer satisfaction and loyalty',
      color: 'text-[#2d7a3e]'
    },
    {
      icon: Target,
      title: 'Market Leadership',
      description: 'Leading the market with innovative solutions',
      color: 'text-[#c4a24c]'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Constantly improving and innovating our products',
      color: 'text-[#2d7a3e]'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Exporting to over 50 countries worldwide',
      color: 'text-[#2d7a3e]'
    },
    {
      icon: Shield,
      title: 'Trusted Partner',
      description: 'Reliable service and consistent excellence',
      color: 'text-[#c4a24c]'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Continuously expanding our market presence',
      color: 'text-[#2d7a3e]'
    },
    {
      icon: Heart,
      title: 'Community Impact',
      description: 'Supporting local communities and sustainable practices',
      color: 'text-[#c4a24c]'
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
                About Al-REHAB GROUP
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-6">
              Cultivating Excellence Since Ancient Times
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
              Rooted in Egypt&apos;s rich agricultural heritage, we bring you the finest herbs and spices 
              from the land where these treasures have been cultivated for millennia.
            </p>

            <PharaohBorder className="w-48 mx-auto text-[#c4a24c] opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative rounded-lg shadow-lg w-full h-64 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1738680981649-3f81bdfe225d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBtYXJrZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjEzMjE4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Egyptian Spices"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-lg shadow-lg w-full h-48 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1654998127177-be22ab3e3c89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJicyUyMGdhcmRlbiUyMHZpYnJhbnR8ZW58MXx8fHwxNzYxMzQ3MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Fresh Herbs"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative rounded-lg shadow-lg w-full h-48 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1701637341943-3fb677d95bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGhlcmJzJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjEzNTAxNTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Organic Herbs"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-lg shadow-lg w-full h-64 overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1664227819745-72b8c776e23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkcyUyMGdyYWlucyUyMHZhcmlldHl8ZW58MXx8fHwxNzYxMzUwMTU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Seeds and Grains"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 leading-relaxed">
                Born from a deep passion for Egypt&apos;s rich agricultural heritage, Herbs Egypt brings 
                the finest herbs and spices to global markets. We partner with carefully selected 
                farms across Egypt, ensuring every product meets the highest international standards.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                From the fertile lands of Faiyum to your global markets, we ensure every product 
                carries the essence of Egyptian excellence, backed by modern quality standards and 
                sustainable farming practices.
              </p>

              <div className="mb-6">
                <PharaohBorder className="w-32 text-[#c4a24c] opacity-30" />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Countries', value: '50+' },
                  { label: 'Products', value: '100+' },
                  { label: 'Quality', value: '99%' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-amber-50 to-emerald-50 p-4 rounded-xl text-center border border-[#2d7a3e]/10"
                  >
                    <div className="text-2xl sm:text-3xl text-[#2d7a3e] mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-amber-50/30 to-emerald-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-[#2d7a3e]/10 to-[#c4a24c]/10 flex items-center justify-center mb-4 ${value.color}`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Join hundreds of satisfied clients worldwide who trust us for premium Egyptian herbs and spices
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
