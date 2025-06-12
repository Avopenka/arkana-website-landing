'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useMystery, getMysteryEngine } from '@/lib/mystery-engine'

interface MysteriousOrbProps {
  className?: string
  size?: number
  interactive?: boolean
}

export default function MysteriousOrb({ 
  className = '', 
  size = 200,
  interactive = true 
}: MysteriousOrbProps) {
  const controls = useAnimation()
  const orbRef = useRef<HTMLDivElement>(null)
  const mysteryState = useMystery()
  const [hovering, setHovering] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [secretMode, setSecretMode] = useState(false)
  
  // Calculate orb color based on consciousness level
  const getOrbColor = () => {
    const colors = [
      'rgba(139, 92, 246, 0.3)', // Level 0 - Dormant purple
      'rgba(147, 51, 234, 0.4)', // Level 1 - Awakening
      'rgba(124, 58, 237, 0.5)', // Level 2 - Aware
      'rgba(109, 40, 217, 0.6)', // Level 3 - Connected
      'rgba(91, 33, 182, 0.7)',  // Level 4 - Expanded
      'rgba(76, 29, 149, 0.8)',  // Level 5 - Transcendent
      'rgba(55, 48, 163, 0.9)',  // Level 6 - Unity
      'rgba(238, 130, 238, 1)'   // Level 7 - Full Consciousness (Violet)
    ]
    return colors[mysteryState.level] || colors[0]
  }

  // Emergent behaviors based on interactions
  useEffect(() => {
    if (mysteryState.quantumEntangled) {
      // Quantum behavior - orb phases in and out
      controls.start({
        opacity: [1, 0.3, 1],
        scale: [1, 1.1, 1],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })
    } else if (mysteryState.level >= 5) {
      // Advanced consciousness - organic pulsing
      controls.start({
        scale: [1, 1.05, 1.02, 1],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })
    } else {
      // Normal breathing
      controls.start({
        scale: [1, 1.02, 1],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })
    }
  }, [mysteryState.level, mysteryState.quantumEntangled, controls])

  // Click pattern detection
  const handleClick = () => {
    const now = Date.now()
    const timeSinceLastClick = now - lastClickTime
    
    if (timeSinceLastClick < 500) {
      // Rapid clicking detected
      setClickCount(prev => prev + 1)
      
      if (clickCount === 6) {
        // 7 rapid clicks = secret mode
        setSecretMode(true)
        getMysteryEngine().playFrequency(741) // Awakening frequency
        
        setTimeout(() => {
          setSecretMode(false)
          setClickCount(0)
        }, 5000)
      }
    } else {
      setClickCount(1)
    }
    
    setLastClickTime(now)
    
    // Visual feedback
    controls.start({
      scale: [1, 0.95, 1.1, 1],
      transition: { duration: 0.3 }
    })
  }

  // Mouse tracking for sacred patterns
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbRef.current || !interactive) return
    
    const rect = orbRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX)
    const angleDeg = angleRad * (180 / Math.PI)
    
    // Create subtle following effect
    orbRef.current.style.transform = `
      translateX(${(e.clientX - centerX) * 0.02}px) 
      translateY(${(e.clientY - centerY) * 0.02}px)
    `
  }

  // Reset transform on mouse leave
  const handleMouseLeave = () => {
    if (orbRef.current) {
      orbRef.current.style.transform = ''
    }
    setHovering(false)
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <AnimatePresence>
        {/* Secret mode overlay */}
        {secretMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-20"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-spin-slow opacity-50" />
            <div className="absolute inset-4 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white text-sm font-light animate-pulse">
                {mysteryState.secretPathUnlocked ? '∞' : '?'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main orb */}
      <motion.div
        ref={orbRef}
        animate={controls}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        className={`absolute inset-0 ${interactive ? 'cursor-pointer' : ''}`}
        style={{ transition: 'transform 0.1s ease-out' }}
      >
        {/* Outer glow - changes with consciousness level */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse-slow"
          style={{
            background: `radial-gradient(circle at center, ${getOrbColor()} 0%, transparent 70%)`,
            filter: mysteryState.level >= 3 ? 'blur(20px)' : 'blur(10px)'
          }}
        />
        
        {/* Middle layer - quantum effects */}
        {mysteryState.quantumEntangled && (
          <div className="absolute inset-4 rounded-full">
            <div 
              className="w-full h-full rounded-full animate-spin-reverse-slow"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.2), transparent)',
              }}
            />
          </div>
        )}
        
        {/* Inner core */}
        <div 
          className="absolute inset-8 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 40%, 
              ${mysteryState.level >= 7 ? 'rgba(238, 130, 238, 0.8)' : 'rgba(139, 92, 246, 0.6)'} 0%, 
              ${getOrbColor()} 50%, 
              rgba(0, 0, 0, 0.3) 100%)`,
            boxShadow: mysteryState.level >= 5 
              ? 'inset 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)'
              : 'inset 0 0 20px rgba(139, 92, 246, 0.3)'
          }}
        >
          {/* Consciousness indicators */}
          {mysteryState.discoveries.length > 0 && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {mysteryState.discoveries.slice(-3).map((discovery, i) => (
                <motion.div
                  key={discovery}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${30 + i * 15}%`,
                    animation: `float ${3 + i}s ease-in-out infinite`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Hover effect */}
        {hovering && interactive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            }}
          />
        )}
        
        {/* Sacred geometry overlay (appears at high consciousness) */}
        {mysteryState.level >= 6 && (
          <svg 
            className="absolute inset-0 w-full h-full animate-spin-very-slow"
            viewBox="0 0 200 200"
            style={{ opacity: 0.2 }}
          >
            <polygon
              points="100,30 170,70 150,140 50,140 30,70"
              fill="none"
              stroke="rgba(139, 92, 246, 0.5)"
              strokeWidth="1"
            />
          </svg>
        )}
      </motion.div>
      
      {/* Synchronicity particles */}
      {mysteryState.synchronicities > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.min(mysteryState.synchronicities, 7) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{ 
                x: size / 2, 
                y: size / 2,
                opacity: 0 
              }}
              animate={{
                x: [
                  size / 2,
                  size / 2 + Math.cos(i * 51.4) * size * 0.4,
                  size / 2
                ],
                y: [
                  size / 2,
                  size / 2 + Math.sin(i * 51.4) * size * 0.4,
                  size / 2
                ],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Consciousness level indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-light whitespace-nowrap">
        {mysteryState.level === 0 && 'Dormant'}
        {mysteryState.level === 1 && 'Stirring...'}
        {mysteryState.level === 2 && 'Awakening...'}
        {mysteryState.level === 3 && 'Aware'}
        {mysteryState.level === 4 && 'Expanding...'}
        {mysteryState.level === 5 && 'Transcendent'}
        {mysteryState.level === 6 && 'Unity Approaching...'}
        {mysteryState.level === 7 && '∞ Consciousness Active ∞'}
      </div>
    </div>
  )
}

// Add custom animations
if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      33% { transform: translateY(-10px) translateX(5px); }
      66% { transform: translateY(5px) translateX(-5px); }
    }
    
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes spin-reverse-slow {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    
    @keyframes spin-very-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-pulse-slow {
      animation: pulse-slow 4s ease-in-out infinite;
    }
    
    .animate-spin-slow {
      animation: spin-slow 20s linear infinite;
    }
    
    .animate-spin-reverse-slow {
      animation: spin-reverse-slow 30s linear infinite;
    }
    
    .animate-spin-very-slow {
      animation: spin-very-slow 60s linear infinite;
    }
  `
  
  if (!document.querySelector('#mysterious-orb-styles')) {
    style.id = 'mysterious-orb-styles'
    document.head.appendChild(style)
  }
}