'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Award, Globe, TrendingUp } from 'lucide-react';
import { useRef } from 'react';
import Image from 'next/image';

export function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yFast = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: Leaf,
      title: 'Natural & Organic',
      description: 'Sourced from the finest Egyptian farms using sustainable practices',
      color: 'text-[#213D35]'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Certified to international standards with rigorous quality control',
      color: 'text-[#5E7C6C]'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Exporting to over 50 countries across 5 continents',
      color: 'text-[#213D35]'
    },
    {
      icon: TrendingUp,
      title: 'Expert Team',
      description: 'Skilled professionals dedicated to quality and excellence',
      color: 'text-[#5E7C6C]'
    }
  ];

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1580590562911-89d31480d993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3BpY2VzJTIwZGlzcGxheXxlbnwxfHx8fDE3NjE4NDU3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Premium Spices Display',
      className: 'rounded-lg shadow-lg w-full h-64 object-cover'
    },
    {
      src: 'https://images.unsplash.com/photo-1724632824319-4b43e74e000c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiJTIwcXVhbGl0eSUyMGNvbnRyb2wlMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc2MTg0NTc3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Quality Control Laboratory',
      className: 'rounded-lg shadow-lg w-full h-48 object-cover'
    },
    {
      src: 'https://images.unsplash.com/photo-1558070510-504a0db43997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaGVyYnMlMjBmYXJtaW5nfGVufDF8fHx8MTc2MTg0NTc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Organic Herbs Farming',
      className: 'rounded-lg shadow-lg w-full h-48 object-cover'
    },
    {
      src: 'https://images.unsplash.com/photo-1741521311974-85002911c1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZSUyMGV4cG9ydCUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NjE4NDU3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Export Packaging',
      className: 'rounded-lg shadow-lg w-full h-64 object-cover'
    }
  ];

  return (
    <section ref={ref} id="about" className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: yFast, opacity: useTransform(opacity, [0, 1], [0, 0.05]) }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-[600px] h-[600px] bg-[#F6F8F5] rounded-full blur-3xl" />
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Left - Image with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
                  className="relative h-64 w-full"
                >
                  <Image
                    src={images[0].src}
                    alt={images[0].alt}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
                <motion.div
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
                  className="relative h-48 w-full"
                >
                  <Image
                    src={images[1].src}
                    alt={images[1].alt}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
              </div>
              <div className="space-y-4 pt-8">
                <motion.div
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -40]) }}
                  className="relative h-48 w-full"
                >
                  <Image
                    src={images[2].src}
                    alt={images[2].alt}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
                <motion.div
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }}
                  className="relative h-64 w-full"
                >
                  <Image
                    src={images[3].src}
                    alt={images[3].alt}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
              </div>
            </div>

            {/* Parallax Decorative Elements */}
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-[#D6C7A1]/30 rounded-full blur-2xl"
            />
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#213D35]/20 rounded-full blur-2xl"
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-3 sm:mb-4">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#213D35]/10 text-[#213D35] rounded-full border border-[#213D35]/20 text-xs sm:text-sm md:text-base">
                About Al-Rehab Group for Export
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#333333] mb-4 sm:mb-6">
              Your Trusted Partner in Egyptian Herbs & Spices Export
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#333333]/80 mb-4 sm:mb-6">
              Al-Rehab Group for Export is rooted in the rich heritage of Egyptian agriculture, bringing you the finest herbs and spices from the land where these treasures have been cultivated for millennia. Our commitment to quality and authenticity makes us a trusted partner for businesses worldwide.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-[#333333]/80 mb-4 sm:mb-6">
              From our facilities in Faiyum to your global markets, Al-Rehab Group for Export ensures every product carries the essence of Egyptian excellence, backed by modern quality standards and sustainable farming practices. We provide 24/7 customer service and tailored export solutions for your business needs.
            </p>
            
            {/* Simplified Decorative Border */}
            <div className="mb-6 sm:mb-8">
              <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-[#213D35] to-transparent rounded-full"></div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-3 sm:gap-4"
                >
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#213D35]/10 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base md:text-lg text-[#213D35] mb-1">{feature.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
