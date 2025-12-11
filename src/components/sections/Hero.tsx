"use client";

import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EgyptianPattern } from './EgyptianDecor';
import { FloatingParticles, AnimatedGradientOrb, SpiceParticle } from './AnimatedBackground';
import { Sparkles } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

// Pre-computed positions for spice particles to avoid hydration mismatch
const spiceParticlePositions = [
  5.5, 15.2, 25.8, 36.3, 45.1, 55.7, 65.4, 75.9, 85.2, 92.6, 8.3, 48.7
];

export function Hero() {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-br from-[#F6F8F5] via-white to-[#E8EBE7] pt-20 sm:pt-24">
      {/* Animated Gradient Orbs */}
      <AnimatedGradientOrb className="w-96 h-96 bg-linear-to-br from-[#D6C7A1]/30 to-transparent top-20 -left-20" delay={0} />
      <AnimatedGradientOrb className="w-[500px] h-[500px] bg-linear-to-br from-[#213D35]/20 to-transparent -bottom-40 -right-40" delay={3} />
      <AnimatedGradientOrb className="w-64 h-64 bg-linear-to-br from-[#5E7C6C]/15 to-transparent top-1/2 right-1/4" delay={5} />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Spice Particles - Only render after mount to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {spiceParticlePositions.map((leftPos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${leftPos}%`,
                bottom: 0,
              }}
            >
              <SpiceParticle delay={i * 0.8} seed={i} />
            </div>
          ))}
        </div>
      )}
      
      {/* Egyptian Pattern Overlay */}
      <EgyptianPattern />
      
      {/* Decorative Top Border with Animation */}
      <motion.div
        className="absolute top-0 left-0 right-0 text-[#213D35]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="h-1 bg-[#213D35] w-full"></div>
      </motion.div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-0">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Animated Badge */}
            <motion.div
              className="inline-block mb-3 sm:mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#213D35]/10 text-[#213D35] rounded-full border border-[#213D35]/20 inline-flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm md:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(33, 61, 53, 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#D6C7A1]" />
                Al-Rehab Group for Export - Premium Egyptian Herbs & Spices Exporter
              </motion.span>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                From the Heart of{' '}
              </motion.span>
              <span className="text-[#213D35] relative inline-block">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                  className="relative z-10"
                >
                  Egypt
                </motion.span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 200 12"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                >
                  <motion.path
                    d="M2 10C50 5 150 5 198 10"
                    stroke="#D6C7A1"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                to Your Global Market
              </motion.span>
            </motion.h1>
            
            {/* Animated Description */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-[#333333]/70 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Al Rehab Group for Export is one of Egypt&apos;s leading suppliers of premium organic dried herbs, spices, and seeds. Located in Al Fayoum, Egypt, we have been working as growers, producers, and exporters of bulk herbs for many years.
            </motion.p>

            {/* Animated Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={() => scrollToSection('products')}
                  size="lg"
                  className="bg-[#213D35] hover:bg-[#5E7C6C] text-white px-6 sm:px-8 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
                >
                  Explore Our Products
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={() => scrollToSection('contact')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#213D35] text-[#213D35] hover:bg-[#213D35] hover:text-white px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
                >
                  Request Export Quote
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {[
                { value: '50+', label: 'Countries Served', color: 'text-[#213D35]', icon: '🌍' },
                { value: '100%', label: 'Organic Options', color: 'text-[#5E7C6C]', icon: '🌿' },
                { value: 'A+', label: 'Expert Team', color: 'text-[#213D35]', icon: '⭐' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center lg:text-left group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.div
                    className={`text-xl sm:text-2xl md:text-3xl ${stat.color} mb-0.5 sm:mb-1 flex items-center justify-center lg:justify-start gap-1 sm:gap-2`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <span>{stat.value}</span>
                    <span className="text-sm sm:text-lg md:text-xl">{stat.icon}</span>
                  </motion.div>
                  <div className="text-xs sm:text-sm text-[#333333]/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative">
              {/* Simplified Decorative Frame */}
              <motion.div
                className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-full h-full border-2 border-[#213D35]/20 rounded-lg hidden sm:block"
                animate={{
                  scale: [1, 1.01, 1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Main Image with Glow Effect */}
              <motion.div
                className="relative rounded-lg overflow-hidden max-w-md mx-auto lg:max-w-none"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-tr from-[#213D35]/10 to-transparent mix-blend-overlay"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <Image
                  src="https://images.unsplash.com/photo-1613062007442-5df3601c94e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bCUyMGJvd2xzfGVufDF8fHx8MTc2MTM0MzExMXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Egyptian Spices"
                  width={1080}
                  height={720}
                  className="relative rounded-lg shadow-2xl w-full h-auto"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden sm:block"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <motion.span
            className="text-xs uppercase tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2 bg-white/50 backdrop-blur-sm shadow-lg"
          >
            <motion.div
              className="w-1 h-2 bg-linear-to-b from-[#213D35] to-[#5E7C6C] rounded-full"
              animate={{
                height: [8, 12, 8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
