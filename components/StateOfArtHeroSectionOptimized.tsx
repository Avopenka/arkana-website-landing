'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import HeroTitle from './hero/HeroTitle';
import HeroOrb from './hero/HeroOrb';
import PhilosophyQuotes from './hero/PhilosophyQuotes';
import HeroBackground from './hero/HeroBackground';
import NeuralConnections from './hero/NeuralConnections';
import { LoadingFallback } from './lazy/LazyEffects';

interface StateOfArtHeroSectionOptimizedProps {
  onShowAuth?: () => void;
}

// Council of 11 Masters Performance-Optimized Hero Section
// Musk: <3 second loads, Ive: Clean composability, Einstein: Elegant simplicity
export default function StateOfArtHeroSectionOptimized({ onShowAuth }: StateOfArtHeroSectionOptimizedProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-dune-black">
      {/* Background effects loaded asynchronously */}
      <Suspense fallback={null}>
        <HeroBackground />
      </Suspense>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        
        {/* Title Section - Loads first for immediate impact */}
        <HeroTitle title="ARKANA" subtitle="Where Memory Meets Magic" />

        {/* Central Orb - Lazy loaded to avoid blocking render */}
        <Suspense fallback={<LoadingFallback className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]" />}>
          <HeroOrb />
        </Suspense>

        {/* "CONSCIOUSNESS INFRASTRUCTURE" Text */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="font-mono text-[0.6rem] md:text-xs text-brand-teal/60 tracking-[0.25em] uppercase">
            A MIRROR FOR YOUR MIND
          </p>
        </motion.div>

        {/* Philosophy Quotes - Independent animation cycle */}
        <PhilosophyQuotes />

        {/* Call to Action Button - Enhanced with Luxury Glass */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.4, type: "spring", stiffness: 60, damping: 15 }}
          className="mt-12"
        >
          <button
            onClick={onShowAuth}
            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-full shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:shadow-[0_0_60px_rgba(0,255,255,0.5)] transform hover:scale-105 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-4 focus:ring-cyan-500/50 overflow-hidden"
          >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Holographic edge highlight */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            </div>
            
            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
              Begin Your Journey
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </span>
          </button>
        </motion.div>

        {/* Subtle interactive elements */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-40 h-40 opacity-5"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        >
          <Image src="/images/geometric-shape-1.svg" alt="deco" fill priority={false} />
        </motion.div>
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 opacity-5"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
        >
          <Image src="/images/geometric-shape-2.svg" alt="deco" fill priority={false} />
        </motion.div>
        
        {/* Neural connections - Loaded last for enhancement */}
        <Suspense fallback={null}>
          <NeuralConnections />
        </Suspense>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/70"
            aria-label="Scroll down indicator"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}