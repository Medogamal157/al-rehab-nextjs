"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Seeded random number generator for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Pre-defined particle configurations to avoid hydration mismatch
const particleConfigs = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: seededRandom(i * 100) * 8 + 4,
  x: seededRandom(i * 200) * 100,
  y: seededRandom(i * 300) * 100,
  duration: seededRandom(i * 400) * 20 + 15,
  delay: seededRandom(i * 500) * 5,
  xOffset: seededRandom(i * 600) * 50 - 25
}));

export function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render animations until client-side to avoid hydration mismatch
  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleConfigs.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-linear-to-br from-[#c4a24c]/30 to-[#2d7a3e]/20 blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function AnimatedGradientOrb({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export function SpiceParticle({ delay = 0, seed = 0 }: { delay?: number; seed?: number }) {
  const [mounted, setMounted] = useState(false);
  
  // Use seeded random for consistent x offset
  const xOffset = seededRandom(seed * 700) * 100 - 50;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute w-2 h-2" />;
  }

  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -200],
        x: [0, xOffset],
        rotate: [0, 360]
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    >
      <div className="w-2 h-2 bg-linear-to-br from-[#c4a24c] to-[#2d7a3e] rounded-full shadow-lg" />
    </motion.div>
  );
}
