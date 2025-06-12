'use client'

// PACA v12 Simplified Hero Section - Consolidated from StateOfArtHeroSectionOptimized
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeroSectionProps {
  onShowAuth?: () => void
}

export default function HeroSection({ onShowAuth }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo/Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="mb-12"
        >
          <Image
            src="/orb/OrbRefined.png"
            alt="Arkana Consciousness Orb"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight"
        >
          Your AI. Your Data.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
            Your Wealth.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Transform your Mac into a private AI companion. 
          <br />
          <span className="text-amber-400">Genesis Wave: €25/month locked for 100 years.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button
            onClick={onShowAuth || (() => {})}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-lg"
          >
            Join Genesis Wave
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all text-lg"
          >
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  )
}