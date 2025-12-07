"use client";

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('201055558189');

  useEffect(() => {
    fetch('/api/contact-info?key=main')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.whatsapp) {
          // Remove + and spaces from the number
          const cleanNumber = data.data.whatsapp.replace(/[^0-9]/g, '');
          setWhatsappNumber(cleanNumber);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-5 bottom-5 sm:right-6 sm:bottom-6 z-50 group"
      aria-label="Message us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Tooltip */}
      <motion.span
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg pointer-events-none"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        Message us
      </motion.span>

      {/* Button */}
      <motion.div
        className="w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl"
        animate={{
          boxShadow: [
            "0 4px 20px rgba(37, 211, 102, 0.4)",
            "0 4px 30px rgba(37, 211, 102, 0.6)",
            "0 4px 20px rgba(37, 211, 102, 0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircle className="text-white" size={28} />
      </motion.div>

      {/* Ping Animation */}
      <motion.div
        className="absolute inset-0 bg-[#25D366] rounded-full opacity-75"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.75, 0, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.a>
  );
}
