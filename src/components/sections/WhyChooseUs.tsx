'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Truck, HeadphonesIcon, Package, Clock, BadgeCheck } from 'lucide-react';
import { LotusIcon, PharaohBorder } from './EgyptianDecor';
import { useRef } from 'react';
import Link from 'next/link';

export function WhyChooseUs() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yBackgroundFast = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  const reasons = [
    {
      icon: Shield,
      title: 'Uncompromising Quality',
      description: 'Every batch undergoes rigorous testing and quality control to meet international standards. We never compromise on quality.',
      color: 'from-[#2d7a3e] to-[#1d5a2e]'
    },
    {
      icon: Truck,
      title: 'Reliable Logistics',
      description: 'Seamless export operations with trusted shipping partners. We handle all documentation and ensure timely delivery worldwide.',
      color: 'from-[#c4a24c] to-[#a48a3c]'
    },
    {
      icon: Package,
      title: 'Flexible Solutions',
      description: 'Custom packaging, private labeling, and tailored solutions to meet your specific business requirements.',
      color: 'from-[#2d7a3e] to-[#1d5a2e]'
    },
    {
      icon: Clock,
      title: 'Efficient Processing',
      description: 'Fast order processing and fulfillment. Our streamlined operations ensure you get your products when you need them.',
      color: 'from-[#c4a24c] to-[#a48a3c]'
    },
    {
      icon: HeadphonesIcon,
      title: 'Dedicated Support',
      description: '24/7 customer service in multiple languages. Our export specialists guide you through every step of the process.',
      color: 'from-[#2d7a3e] to-[#1d5a2e]'
    },
    {
      icon: BadgeCheck,
      title: 'Authentic Egyptian',
      description: 'Genuine products from the land of ancient spice routes. Experience the authentic taste of Egyptian herbs and spices.',
      color: 'from-[#c4a24c] to-[#a48a3c]'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y: yBackgroundFast, opacity: useTransform(opacity, [0, 1], [0, 0.05]) }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#c4a24c]/10 to-transparent rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: yBackground, opacity: useTransform(opacity, [0, 1], [0, 0.05]) }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#2d7a3e]/10 to-transparent rounded-full blur-3xl"
      />
      
      {/* Decorative Lotus with Parallax */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
        className="absolute top-20 right-20 opacity-5"
      >
        <LotusIcon className="w-64 h-64 text-[#c4a24c]" />
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
            <span className="px-4 py-2 bg-[#2d7a3e]/10 text-[#2d7a3e] rounded-full border border-[#2d7a3e]/20">
              Why Partner With Al-REHAB GROUP
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
            Excellence in Every Aspect of Export
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Al-REHAB GROUP combines Egyptian heritage with modern professionalism to deliver exceptional herbs and spices export services to businesses worldwide
          </p>
          
          {/* Decorative Border */}
          <div className="mt-8 text-[#c4a24c] opacity-30">
            <PharaohBorder className="w-64 mx-auto" />
          </div>
        </motion.div>

        {/* Reasons Grid with Parallax */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -15 * ((index % 3) + 1)])
              }}
              className="relative group"
            >
              <motion.div 
                style={{ scale }}
                className="h-full bg-gradient-to-br from-amber-50 to-emerald-50 rounded-2xl p-8 border-2 border-transparent hover:border-[#2d7a3e]/30 transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon */}
                <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${reason.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className="text-white" size={32} />
                </div>

                {/* Content */}
                <h3 className="text-xl text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#c4a24c]/20 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#2d7a3e]/20 rounded-bl-lg"></div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -20])
          }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <LotusIcon className="w-12 h-12 text-[#c4a24c]" />
              <div className="text-left">
                <h3 className="text-2xl text-white mb-1">Ready to Experience the Difference?</h3>
                <p className="text-white/80">Join hundreds of satisfied clients worldwide</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="mt-4 inline-block px-8 py-3 bg-[#c4a24c] hover:bg-[#a48a3c] text-white rounded-lg transition-colors"
            >
              Start Your Partnership Today
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
