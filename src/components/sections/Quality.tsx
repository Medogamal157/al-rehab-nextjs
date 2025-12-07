'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, CheckCircle, Package, Truck, FileCheck, Users } from 'lucide-react';
import { PharaohBorder, PyramidIcon } from './EgyptianDecor';
import { useRef } from 'react';
import Image from 'next/image';

export function Quality() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -360]);

  const process = [
    {
      icon: Truck,
      title: 'Sourcing',
      description: 'Direct from certified Egyptian farms with strict quality control from the source'
    },
    {
      icon: Package,
      title: 'Processing',
      description: 'State-of-the-art facilities ensuring optimal preservation of natural properties'
    },
    {
      icon: FileCheck,
      title: 'Testing',
      description: 'Comprehensive laboratory analysis for purity, safety, and quality standards'
    },
    {
      icon: Shield,
      title: 'Packaging',
      description: 'Export-grade packaging designed to maintain freshness during global shipping'
    },
    {
      icon: Truck,
      title: 'Shipping',
      description: 'Reliable logistics partners ensuring timely delivery to any destination worldwide'
    },
    {
      icon: Users,
      title: 'Support',
      description: 'Dedicated customer service team supporting you throughout the entire process'
    }
  ];

  return (
    <section ref={ref} id="quality" className="py-20 bg-white relative overflow-hidden">
      {/* Parallax Background Decoration */}
      <motion.div 
        style={{ y: yBackground, opacity: useTransform(opacity, [0, 1], [0, 0.05]), rotate }}
        className="absolute bottom-20 right-0"
      >
        <PyramidIcon className="w-96 h-96 text-[#c4a24c]" />
      </motion.div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-[#c4a24c]/10 text-[#c4a24c] rounded-full border border-[#c4a24c]/20">
              Quality Assurance
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
            Our Export Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            From farm to your warehouse, every step is carefully managed to ensure premium quality and safety
          </p>
          
          {/* Decorative Border */}
          <div className="text-[#c4a24c] opacity-30">
            <PharaohBorder className="w-64 mx-auto" />
          </div>
        </motion.div>

        {/* Process Section with Parallax */}
        <motion.div 
          style={{ scale }}
          className="bg-gradient-to-br from-[#2d7a3e] to-[#1d5a2e] rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl text-white mb-4">
              Quality Process Steps
            </h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Every step is carefully managed with international standards to ensure premium quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#c4a24c] rounded-lg flex items-center justify-center">
                      <step.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white text-lg mb-2">{step.title}</h4>
                      <p className="text-white/70 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#c4a24c]/30"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Guarantee with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl p-8 md:p-12 border-2 border-[#2d7a3e]/10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl text-gray-900 mb-4">
                Our Quality Guarantee
              </h3>
              <p className="text-gray-600 mb-6">
                Every shipment comes with complete documentation including certificates of origin, quality analysis reports, and compliance with your country&apos;s import regulations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#2d7a3e] flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">100% natural and authentic Egyptian products</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#2d7a3e] flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Pesticide-free and heavy metal tested</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#2d7a3e] flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Microbiological safety guaranteed</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-[#2d7a3e] flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Full traceability from farm to export</span>
                </li>
              </ul>
            </div>
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
              className="relative"
            >
              <Image
                src="https://images.unsplash.com/photo-1761143551108-d4cb55afd1da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMGN1bHR1cmUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzYxMzQzMTEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Egyptian Quality"
                width={600}
                height={400}
                className="rounded-xl shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#c4a24c]/30 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
