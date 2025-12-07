"use client";

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-[#2d7a3e] via-[#c4a24c] to-[#2d7a3e] origin-left z-[100]"
        style={{ scaleX }}
      />
      
      {/* Bottom Accent Line */}
      <motion.div
        className="fixed top-1 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#c4a24c]/50 to-transparent origin-left z-[100]"
        style={{ scaleX }}
      />
    </>
  );
}
