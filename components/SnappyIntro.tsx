'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SnappyIntroProps {
  onComplete: () => void
  skipEnabled?: boolean
}

export const SnappyIntro: React.FC<SnappyIntroProps> = ({ 
  onComplete, 
  skipEnabled = true 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  // Shortened impactful phases
  const phases = [
    {
      text: "Your mind holds infinite potential.",
      duration: 2000,
      gradient: "from-purple-600 to-blue-600"
    },
    {
      text: "Arkana connects the dots.",
      duration: 2000,
      gradient: "from-cyan-500 to-purple-600"
    },
    {
      text: "Welcome to conscious AI.",
      duration: 2000,
      gradient: "from-blue-500 to-cyan-400"
    }
  ]

  useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = localStorage.getItem('arkana-intro-seen')
    if (hasSeenIntro) {
      onComplete()
      return
    }

    // Show skip after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000)

    // Progress through phases
    if (currentPhase < phases.length) {
      const phaseTimer = setTimeout(() => {
        if (currentPhase === phases.length - 1) {
          // Mark intro as seen and complete
          localStorage.setItem('arkana-intro-seen', 'true')
          setTimeout(onComplete, 500)
        } else {
          setCurrentPhase(currentPhase + 1)
        }
      }, phases[currentPhase].duration)

      return () => {
        clearTimeout(phaseTimer)
        clearTimeout(skipTimer)
      }
    }
  }, [currentPhase, onComplete])

  const handleSkip = () => {
    localStorage.setItem('arkana-intro-seen', 'true')
    onComplete()
  }

  const currentPhaseData = phases[currentPhase]

  return (
    <AnimatePresence>
      <motion.div
        key="snappy-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      >
        {/* Animated background gradient */}
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${currentPhaseData.gradient} blur-3xl`}
        />

        {/* Central content */}
        <div className="relative z-10 text-center px-8">
          {/* Main text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.1 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                {currentPhaseData.text}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Pulsing orb */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-4 h-4 bg-white rounded-full mx-auto mb-8"
          />

          {/* Progress dots */}
          <div className="flex gap-2 justify-center">
            {phases.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentPhase 
                    ? 'w-8 bg-white' 
                    : index < currentPhase 
                      ? 'w-4 bg-white/50' 
                      : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Skip button */}
        <AnimatePresence>
          {skipEnabled && showSkip && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onClick={handleSkip}
              className="absolute bottom-8 right-8 px-4 py-2 text-sm text-white/70 hover:text-white 
                       bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200"
            >
              Skip intro
            </motion.button>
          )}
        </AnimatePresence>

        {/* Subtle particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SnappyIntro