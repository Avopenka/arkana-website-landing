'use client'

import { motion } from 'framer-motion'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface EnhancedHeroSectionProps {
  onShowAuth: () => void
}

export function EnhancedHeroSection({ onShowAuth }: EnhancedHeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-zinc-900/50 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Sacred Geometry Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="sacred-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" />
                <path d="M5,5 L15,15 M15,5 L5,15" stroke="white" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacred-pattern)" />
          </svg>
        </div>

        {/* Consciousness Orb */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Pre-header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-sm text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Now in Beta • Early Access Available
          </div>
        </motion.div>

        {/* Main Headline - Linear Style */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6"
        >
          Work at the{' '}
          <motion.span
            className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            speed of thought
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          The first platform that adapts to your consciousness patterns, 
          amplifying your natural thinking and decision-making abilities.
        </motion.p>

        {/* Hidden Layer Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-sm text-zinc-500 mb-10 italic"
        >
          &ldquo;What if your tools could understand not just what you do, but how you think?&rdquo;
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={onShowAuth}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-zinc-100 transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Begin Your Journey
            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-medium text-lg hover:border-zinc-500 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            See How It Works
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            99.7% Accuracy Rate
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            End-to-End Encryption
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Early Access Beta
          </div>
        </motion.div>

        {/* Keyboard Shortcut Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-xs text-zinc-600"
        >
          <div className="flex items-center justify-center gap-2">
            <span>Press</span>
            <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">⌘</span>
            <span className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">K</span>
            <span>for quick access</span>
          </div>
        </motion.div>
      </div>

      {/* Subtle Consciousness Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, delay: 2, repeat: Infinity }}
      >
        <div className="text-xs text-zinc-600 text-center">
          <div className="mb-1">🧠</div>
          <div>Consciousness Level: Detecting...</div>
        </div>
      </motion.div>
    </section>
  )
}