'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ParticleField from './effects/ParticleField';
import HolographicLayer from './effects/HolographicLayer';
import GlitchText from './effects/GlitchText';
import ClientOrb from './ClientOrb';
import { useResponsiveParticles } from '../hooks/useResponsiveParticles';

const businessBenefits = [
  { metric: "Your Data, Your Intelligence", quote: "Every thought, idea, and insight becomes a building block in your personal AI companion." },
  { metric: "Knowledge That Compounds", quote: "Like interest growing over time, your ideas connect and multiply into deeper understanding." },
  { metric: "Everyone Becomes a Creator", quote: "Transform from consumer to creator as your AI learns your unique perspective." },
  { metric: "Build Together", quote: "Join a community where collective intelligence lifts everyone higher." },
  { metric: "Privacy as Freedom", quote: "True ownership of your thoughts - no corporate surveillance, just pure creation." }
];

export default function StateOfArtHeroSection() {
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isMobile, particleDensity } = useResponsiveParticles();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % businessBenefits.length);
    }, 4000); // Faster rotation for business engagement

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-dune-black">
      {/* Mobile-First Performance Optimization */}
      <div className="hidden sm:block">
        {/* Desktop-only content wrapper */}
      </div>

      {/* Particle effects - Mobile optimized */}
      <ParticleField type="spice" density={particleDensity} speed={0.3} />
      {!isMobile && (
        <ParticleField type="void" density={1} speed={0.2} className="opacity-50" />
      )}

      {/* Atmospheric fog */}
      <div className="fog-layer" />

      {/* Background layers with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        {/* Example: Distant dune silhouette */}
        <Image 
          src="/images/dune-silhouette-distant.svg" 
          alt="Distant Dune" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-10"
          style={{ transform: 'translateZ(-50px) scale(1.5)' }}
        />
        {/* Example: Closer rock formation */}
        <Image 
          src="/images/rock-formation-close.svg" 
          alt="Rock Formation" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-15"
          style={{ transform: 'translateZ(-20px) scale(1.2)' }}
        />
      </motion.div>
      
      {/* Holographic Grid Overlay */}
      <HolographicLayer intensity="low">
        <div></div>
      </HolographicLayer>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        
        {/* Arkana Title */}
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-serif-display text-transparent bg-clip-text bg-gradient-to-br from-brand-gold via-brand-sand to-brand-orange mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.4, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.5 }} // Nolan-style slower reveal
        >
          <GlitchText text="ARKANA" intensity="low" />
        </motion.h1>

        {/* Clear Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.4, delay: 1.0, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="mb-12"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl text-white mb-4 font-sans-serif-condensed">
            Your Personal AI That Grows With You
          </p>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Imagine if your thoughts could compound like interest • Building intelligence that's uniquely yours
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your data, your creation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Join the creator community</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Intelligence that's truly yours</span>
            </div>
          </div>
        </motion.div>

        {/* Central Orb with Title */}
        <motion.div
          className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.0, delay: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }} // Cinematic orb reveal
        >
          <ClientOrb className="w-full h-full" style="mystical" showParticles={true} />
          {/* "Arkana Orb" Text - mimicking screenshot style */}
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

        {/* Practical Benefits */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-teal rounded-full" />
              <span className="text-sm md:text-base text-white/80">Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-gold rounded-full" />
              <span className="text-sm md:text-base text-white/80">On-Device AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm md:text-base text-white/80">Instant Search</span>
            </div>
          </div>
        </motion.div>

        {/* Animated Business Benefits */}
        <div className="h-20 mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBenefit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="text-center"
            >
              <p className="text-lg md:text-xl font-semibold text-brand-teal mb-1">
                {businessBenefits[currentBenefit].metric}
              </p>
              <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto">
                {businessBenefits[currentBenefit].quote}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Clear Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.4, type: "spring", stiffness: 60, damping: 15 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link href="#how-it-works" legacyBehavior>
            <a className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-teal text-white font-bold text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-4 focus:ring-brand-teal/50">
              Explore the Vision
            </a>
          </Link>
          <Link href="#pricing" legacyBehavior>
            <a className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-lg hover:bg-white/20 hover:border-white/30 transform hover:scale-105 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-4 focus:ring-white/20">
              Begin Your Journey
            </a>
          </Link>
        </motion.div>

        {/* Subtle interactive elements (example: floating geometric shapes) */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-40 h-40 opacity-5"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        >
          <Image src="/images/geometric-shape-1.svg" alt="deco" layout="fill" />
        </motion.div>
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 opacity-5"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
        >
          <Image src="/images/geometric-shape-2.svg" alt="deco" layout="fill" />
        </motion.div>
        
        {/* Example of subtle animated background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
          />
          {/* Neural connections */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{ perspective: '1000px' }}
          >
            <svg width="100%" height="100%" className="overflow-visible">
              {[...Array(20)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={Math.random() * 1000}
                  y1={Math.random() * 1000}
                  x2={Math.random() * 1000}
                  y2={Math.random() * 1000}
                  stroke="url(#neural-gradient)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "linear"
                  }}
                />
              ))}
              <defs>
                <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00FFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

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
      
      </div> {/* Close main content container */}
    </section>
  );
}
