'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

// Glass morphism floating elements for techno club aesthetic
const FloatingGlassCard = ({ delay = 0, x = 0, y = 0, size = 'md', children }: {
  delay?: number
  x?: number
  y?: number
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}) => {
  const sizeClasses = {
    sm: 'w-32 h-20',
    md: 'w-48 h-32', 
    lg: 'w-64 h-40'
  }

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        boxShadow: `
          0 8px 32px rgba(0, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.05)
        `
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ 
        opacity: [0.6, 0.8, 0.6], 
        scale: [0.98, 1.02, 0.98],
        rotate: [-2, 2, -2],
        y: [-5, 5, -5]
      }}
      transition={{ 
        delay,
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20" />
      <div className="relative p-4 h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  )
}

// Neon line elements
const NeonLine = ({ direction = 'horizontal', color = 'cyan', delay = 0 }: {
  direction?: 'horizontal' | 'vertical' | 'diagonal'
  color?: 'cyan' | 'purple' | 'gold'
  delay?: number
}) => {
  const colorClasses = {
    cyan: 'from-cyan-400/60 to-cyan-600/60',
    purple: 'from-purple-400/60 to-purple-600/60', 
    gold: 'from-yellow-400/60 to-yellow-600/60'
  }

  const directionClasses = {
    horizontal: 'w-32 h-0.5',
    vertical: 'w-0.5 h-32',
    diagonal: 'w-32 h-0.5 rotate-45'
  }

  return (
    <motion.div
      className={`absolute ${directionClasses[direction]} bg-gradient-to-r ${colorClasses[color]} rounded-full`}
      style={{
        boxShadow: `0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)`
      }}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scaleX: [0.8, 1.2, 0.8]
      }}
      transition={{ 
        delay,
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Data stream particles
const DataStream = ({ particles = 20 }: { particles?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: particles }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 4px rgba(0, 255, 255, 0.6)'
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-10vh',
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// Consciousness questions from design narrative
const consciousnessQuestions = [
  "Beyond the noise...",
  "Where does your consciousness resonate?", 
  "What if technology breathed with you?",
  "Are you ready to transcend the ordinary?",
  "Arkana awaits your signature..."
]

export function TechnoClubHero() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showInterface, setShowInterface] = useState(false)
  const [pulseIntensity, setPulseIntensity] = useState(0.5)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cycle through consciousness questions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuestion((prev) => {
        if (prev < consciousnessQuestions.length - 1) {
          return prev + 1
        } else {
          setTimeout(() => setShowInterface(true), 1500)
          return prev
        }
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // Audio-reactive pulse simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIntensity(Math.random() * 0.4 + 0.3)
    }, 150)

    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-canvas-deep-navy overflow-hidden"
    >
      {/* Background: Techno club environment */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        
        {/* Moving grid lines */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Ambient lighting effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(0, 255, 255, ${pulseIntensity * 0.3}) 0%, transparent 70%)`
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(147, 51, 234, ${pulseIntensity * 0.25}) 0%, transparent 70%)`
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Data streams */}
      <DataStream particles={15} />

      {/* Floating glass morphism cards */}
      <FloatingGlassCard delay={0} x={10} y={20} size="sm">
        <div className="text-xs text-cyan-300 font-mono">NEURAL_LINK</div>
      </FloatingGlassCard>
      
      <FloatingGlassCard delay={1} x={85} y={15} size="md">
        <div className="text-sm text-purple-300 font-mono">CONSCIOUSNESS.EXE</div>
      </FloatingGlassCard>
      
      <FloatingGlassCard delay={2} x={15} y={75} size="lg">
        <div className="text-base text-gold-primary font-mono">ARKANA_PROTOCOL</div>
      </FloatingGlassCard>

      <FloatingGlassCard delay={3} x={80} y={70} size="sm">
        <div className="text-xs text-cyan-300 font-mono">SYNC_READY</div>
      </FloatingGlassCard>

      {/* Decorative neon lines */}
      <div className="absolute top-32 left-1/4">
        <NeonLine direction="horizontal" color="cyan" delay={0.5} />
      </div>
      <div className="absolute bottom-40 right-1/4">
        <NeonLine direction="diagonal" color="purple" delay={1.5} />
      </div>
      <div className="absolute top-1/2 left-20">
        <NeonLine direction="vertical" color="gold" delay={2.5} />
      </div>

      {/* Main consciousness interface */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Primary glass morphism container */}
        <motion.div
          className="relative p-12 md:p-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl"
          style={{
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              0 0 40px rgba(0, 255, 255, 0.1)
            `
          }}
          animate={{
            boxShadow: [
              `0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 40px rgba(0, 255, 255, ${pulseIntensity * 0.15})`,
              `0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 40px rgba(0, 255, 255, ${pulseIntensity * 0.25})`
            ]
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
          
          {/* Consciousness question display */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentQuestion}
                className="font-serif text-large-title md:text-profound font-normal tracking-tight mb-sacred7-flow text-luxury-pristine-white"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1)'
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.05 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {consciousnessQuestions[currentQuestion]}
              </motion.h1>
            </AnimatePresence>

            {/* Interface elements */}
            {showInterface && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="space-y-8"
              >
                {/* Primary CTA */}
                <motion.button
                  className="px-sacred7-presence py-sacred7-capture bg-gradient-to-r from-sacred7-connections/80 to-sacred7-reflection/80 text-luxury-pristine-white rounded-sacred border border-luxury-platinum/20 backdrop-blur-sm relative overflow-hidden group font-medium text-callout tracking-wide"
                  style={{
                    boxShadow: '0 8px 24px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 12px 32px rgba(0, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Enter the Consciousness Grid</span>
                </motion.button>

                {/* Secondary info */}
                <motion.p
                  className="text-luxury-platinum/70 text-body font-light max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  Technology that adapts to your neural patterns. 
                  <span className="text-sacred7-connections"> Consciousness-first computing.</span>
                </motion.p>

                {/* Status indicators */}
                <motion.div
                  className="flex justify-center items-center space-x-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sacred7-capture font-mono">NEURAL_SYNC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <span className="text-sacred7-connections font-mono">CONSCIOUSNESS_READY</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <span className="text-sacred7-reflection font-mono">ARKANA_ONLINE</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Corner UI elements */}
      <div className="absolute top-8 left-8 text-cyan-300/60 font-mono text-sm">
        <div>ARKANA.CONSCIOUSNESS.PROTOCOL</div>
        <div className="mt-1">v2.1.{Math.floor(Date.now() / 1000) % 100}</div>
      </div>

      <div className="absolute bottom-8 right-8 text-purple-300/60 font-mono text-sm text-right">
        <div>NEURAL_LINK_ESTABLISHED</div>
        <div className="mt-1">SYNC_RATE: {Math.floor(pulseIntensity * 100)}%</div>
      </div>
    </div>
  )
}