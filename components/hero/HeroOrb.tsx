'use client';

import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { ClientOrb } from '../lazy/LazyThreeJS';
import { LoadingFallback } from '../lazy/LazyEffects';

// Musk Performance: Orb loads independently without blocking
export default function HeroOrb() {
  return (
    <motion.div
      className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 3.0, delay: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <Suspense fallback={<LoadingFallback className="w-full h-full" />}>
        <ClientOrb className="w-full h-full" style="mystical" showParticles={true} />
      </Suspense>

      {/* "Arkana Orb" Text */}
      <motion.div
        className="absolute top-[-40px] md:top-[-50px] text-center w-full pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        <h2 className="text-xs md:text-sm font-mono text-white/60 tracking-wider uppercase border border-white/20 rounded-md px-2 py-0.5 inline-block bg-black/20 backdrop-blur-xs">
          Arkana Orb
        </h2>
      </motion.div>
    </motion.div>
  );
}