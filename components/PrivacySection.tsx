'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function PrivacySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <section 
      ref={sectionRef}
      className="section bg-deep-black relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/horizon.png')] bg-cover bg-center opacity-5"></div>
      
      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div 
            className="w-20 h-20 mx-auto mb-8 relative"
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-full bg-brand-teal/10 animate-pulse-custom"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#16FFE1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="#16FFE1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="#16FFE1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-gradient font-serif mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            PRIVACY BY DESIGN
          </motion.h2>
          
          <motion.p
            className="text-white/90 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            Your data never leaves your device. Arkana processes everything locally, ensuring complete privacy and security.
          </motion.p>
          
          <motion.button
            className="btn btn-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More About Our Technology
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
