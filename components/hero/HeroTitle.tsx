'use client';

import { motion } from 'framer-motion';
import { GlitchText } from '../lazy/LazyEffects';

interface HeroTitleProps {
  title: string;
  subtitle: string;
}

// Ive Design: Clean separation of title concerns
export default function HeroTitle({ title, subtitle }: HeroTitleProps) {
  return (
    <>
      {/* Arkana Title */}
      <motion.h1 
        className="text-6xl md:text-8xl lg:text-9xl font-serif-display text-transparent bg-clip-text bg-gradient-to-br from-brand-gold via-brand-sand to-brand-orange mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.4, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.5 }}
      >
        <GlitchText text={title} intensity="low" />
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 font-sans-serif-condensed tracking-wider"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.4, delay: 1.0, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        {subtitle}
      </motion.p>
    </>
  );
}