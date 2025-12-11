'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { PharaohBorder } from './EgyptianDecor';
import { useRef } from 'react';
import Image from 'next/image';

export function EgyptianShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const features = [
    {
      image: 'https://images.unsplash.com/photo-1675654871683-abf6524f68c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzcGljZSUyMHByb2Nlc3Npbmd8ZW58MXx8fHwxNzYxODQ1NzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'State-of-the-Art Processing',
      description: 'Modern facilities with advanced technology ensuring premium quality and food safety standards',
      gradient: 'from-emerald-500/20 to-green-500/20'
    },
    {
      image: 'https://images.unsplash.com/photo-1599536884823-1bc4fb5f9dea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBqYXJzJTIwYXJyYW5nZWR8ZW58MXx8fHwxNzYxODQ1NzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Premium Selection',
      description: 'Carefully curated herbs and spices meeting the highest international export standards',
      gradient: 'from-amber-500/20 to-yellow-500/20'
    },
    {
      image: 'https://images.unsplash.com/photo-1713859326033-f75e04439c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlwcGluZyUyMGNvbnRhaW5lcnMlMjBleHBvcnR8ZW58MXx8fHwxNzYxODQ1NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Global Export Excellence',
      description: 'Reliable shipping and logistics to deliver your orders anywhere in the world, on time',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-[#2d7a3e] via-[#1d5a2e] to-[#2d7a3e] relative overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-20"
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618224025123-e72fa88fd4af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdGlhbiUyMHB5cmFtaWRzJTIwZ29sZGVufGVufDF8fHx8MTc2MTM0NDMwMnww&ixlib=rb-4.1.0&q=80&w=1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#c4a24c]/20 via-transparent to-[#2d7a3e]/20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Animated Light Rays */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-full bg-gradient-to-b from-transparent via-[#c4a24c]/30 to-transparent"
            style={{ left: `${20 * i}%` }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scaleY: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 4,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Decorative Top Border with Animation */}
          <motion.div
            className="mb-8 text-[#c4a24c]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <PharaohBorder className="w-96 mx-auto" />
          </motion.div>

          {/* Animated Title */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Al-Rehab Group for Export
            </motion.span>
            <br />
            <motion.span
              className="text-[#c4a24c] inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            >
              Excellence in Every Export
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            From the ancient lands of Egypt to your doorstep, we deliver premium herbs and spices 
            with modern professionalism and unwavering dedication to quality.
          </motion.p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.15,
                  type: "spring"
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-md rounded-xl overflow-hidden border-2 border-[#c4a24c]/30 hover:border-[#c4a24c]/60 transition-all duration-300 group cursor-pointer relative`}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#213D35]/80 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#c4a24c]/0 to-[#c4a24c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />

                  <h3 className="text-2xl text-white mb-3 group-hover:text-[#c4a24c] transition-colors relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 group-hover:text-white transition-colors relative z-10">
                    {feature.description}
                  </p>

                  <motion.div
                    className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#c4a24c]/30 rounded-tr-lg"
                    whileHover={{ scale: 1.2, borderColor: 'rgba(196, 162, 76, 0.6)' }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#c4a24c]/30 rounded-bl-lg"
                    whileHover={{ scale: 1.2, borderColor: 'rgba(196, 162, 76, 0.6)' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Border */}
          <motion.div
            className="mt-16 text-[#c4a24c]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
          >
            <PharaohBorder className="w-96 mx-auto" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
