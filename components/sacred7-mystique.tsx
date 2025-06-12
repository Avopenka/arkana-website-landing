'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Sacred7 Mystique Principles Implementation
// Following the "presence without intrusion" philosophy

interface Sacred7State {
  presence: number    // User's current presence level
  capture: number     // Information absorption rate
  flow: number        // System flow state
  focus: number       // Attention concentration
  connections: number // Network connectivity strength
  command: number     // Control responsiveness
  reflection: number  // Contemplative depth
}

// Subtle consciousness indicators that appear only when needed
export function ConsciousnessIndicator({ 
  state, 
  type, 
  isActive = false 
}: { 
  state: number
  type: keyof Sacred7State
  isActive?: boolean 
}) {
  const colorMap = {
    presence: 'sacred7-presence',
    capture: 'sacred7-capture', 
    flow: 'sacred7-flow',
    focus: 'sacred7-focus',
    connections: 'sacred7-connections',
    command: 'sacred7-command',
    reflection: 'sacred7-reflection'
  }

  if (!isActive || state < 0.3) return null

  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full bg-${colorMap[type]}`}
      style={{
        boxShadow: `0 0 ${state * 10}px var(--sacred7-${type.toLowerCase()})`
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: state * 0.8,
        scale: [1, 1.2, 1],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Mystique-driven animation system that respects user attention
export function MystiqueContainer({ 
  children, 
  intensity = 0.5,
  respectsMotionPreferences = true 
}: { 
  children: React.ReactNode
  intensity?: number
  respectsMotionPreferences?: boolean
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [userPresence, setUserPresence] = useState(0.5)

  useEffect(() => {
    if (respectsMotionPreferences) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [respectsMotionPreferences])

  // Track user presence through subtle interaction
  useEffect(() => {
    const handleInteraction = () => {
      setUserPresence(1)
      setTimeout(() => setUserPresence(0.7), 2000)
      setTimeout(() => setUserPresence(0.5), 5000)
    }

    const events = ['mousemove', 'scroll', 'click', 'keydown']
    events.forEach(event => 
      window.addEventListener(event, handleInteraction, { passive: true })
    )

    return () => events.forEach(event => 
      window.removeEventListener(event, handleInteraction)
    )
  }, [])

  const effectiveIntensity = prefersReducedMotion ? 0.1 : intensity * userPresence

  return (
    <motion.div
      animate={{
        filter: `brightness(${1 + effectiveIntensity * 0.1}) saturate(${1 + effectiveIntensity * 0.2})`
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

// Sacred7 Color Harmony System
export function Sacred7Harmony({ 
  activeAnchors = ['presence', 'flow', 'connections'],
  intensity = 0.3 
}: {
  activeAnchors?: (keyof Sacred7State)[]
  intensity?: number
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {activeAnchors.map((anchor, index) => (
        <motion.div
          key={anchor}
          className={`absolute w-64 h-64 rounded-full`}
          style={{
            background: `radial-gradient(circle, var(--sacred7-${anchor}) ${intensity * 0.1}, transparent 70%)`,
            left: `${20 + index * 30}%`,
            top: `${30 + index * 15}%`,
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [intensity * 0.3, intensity * 0.5, intensity * 0.3]
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 1.5
          }}
        />
      ))}
    </div>
  )
}

// Breathing rhythm component that syncs with user state
export function BreathingRhythm({ 
  isUserFocused = false,
  breathsPerMinute = 12 
}: {
  isUserFocused?: boolean
  breathsPerMinute?: number
}) {
  const breathCycle = 60000 / breathsPerMinute // milliseconds per breath

  if (!isUserFocused) return null

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{
        duration: breathCycle / 1000,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, var(--sacred7-presence) 0.05, transparent 60%)`,
          filter: 'blur(20px)'
        }}
      />
    </motion.div>
  )
}

// Consciousness-aware micro-interactions
export function ConsciousButton({ 
  children, 
  onClick,
  variant = 'primary',
  isResonating = false
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'subtle'
  isResonating?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [clickResonance, setClickResonance] = useState(0)

  const handleClick = () => {
    setClickResonance(1)
    setTimeout(() => setClickResonance(0), 1000)
    onClick?.()
  }

  const variantStyles = {
    primary: 'bg-sacred7-connections/20 border-sacred7-connections/40 text-sacred7-connections',
    secondary: 'bg-sacred7-flow/20 border-sacred7-flow/40 text-sacred7-flow',
    subtle: 'bg-luxury-platinum/5 border-luxury-platinum/20 text-luxury-platinum'
  }

  return (
    <motion.button
      className={`px-sacred7-presence py-sacred7-capture rounded-sacred border backdrop-blur-sm relative overflow-hidden ${variantStyles[variant]} transition-all duration-micro-interaction`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      animate={{
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered 
          ? `0 8px 32px var(--sacred7-connections, rgba(0, 255, 255, 0.2))`
          : `0 4px 16px var(--sacred7-connections, rgba(0, 255, 255, 0.1))`
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Resonance wave effect */}
      {(isResonating || clickResonance > 0) && (
        <motion.div
          className="absolute inset-0 rounded-sacred border border-sacred7-connections/60"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}

      {/* Material honesty feedback */}
      <motion.div
        className="absolute inset-0 bg-sacred7-connections/10 rounded-sacred"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Depth layers system for glass morphism hierarchy
export function DepthLayer({ 
  depth = 1, 
  children, 
  className = '' 
}: { 
  depth: 1 | 2 | 3 | 4 | 5
  children: React.ReactNode
  className?: string
}) {
  const depthStyles = {
    1: 'bg-luxury-pristine-white/5 border-luxury-platinum/10 backdrop-blur-sm',
    2: 'bg-luxury-pristine-white/8 border-luxury-platinum/15 backdrop-blur-md',
    3: 'bg-luxury-pristine-white/12 border-luxury-platinum/20 backdrop-blur-lg',
    4: 'bg-luxury-pristine-white/16 border-luxury-platinum/25 backdrop-blur-xl',
    5: 'bg-luxury-pristine-white/20 border-luxury-platinum/30 backdrop-blur-2xl'
  }

  const shadowIntensity = {
    1: '0 4px 16px rgba(0, 0, 0, 0.1)',
    2: '0 8px 24px rgba(0, 0, 0, 0.15)',
    3: '0 12px 32px rgba(0, 0, 0, 0.2)',
    4: '0 16px 40px rgba(0, 0, 0, 0.25)',
    5: '0 20px 60px rgba(0, 0, 0, 0.3)'
  }

  return (
    <div 
      className={`border rounded-sacred ${depthStyles[depth]} ${className}`}
      style={{
        boxShadow: `${shadowIntensity[depth]}, inset 0 1px 0 rgba(255, 255, 255, ${depth * 0.02})`
      }}
    >
      {children}
    </div>
  )
}

// Progressive disclosure wrapper
export function ProgressiveDisclosure({ 
  trigger, 
  content, 
  delay = 0 
}: {
  trigger: React.ReactNode
  content: React.ReactNode
  delay?: number
}) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div>
      <div onClick={() => setIsRevealed(true)}>
        {trigger}
      </div>
      
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          height: isRevealed ? 'auto' : 0
        }}
        transition={{ 
          delay: isRevealed ? delay : 0,
          duration: 0.6,
          ease: "easeInOut"
        }}
        style={{ overflow: 'hidden' }}
      >
        {content}
      </motion.div>
    </div>
  )
}