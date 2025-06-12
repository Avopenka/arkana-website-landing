'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMystery, getMysteryEngine } from '@/lib/mystery-engine'
import { useRouter } from 'next/navigation'

interface HiddenPortal {
  id: string
  trigger: 'hover' | 'click' | 'sequence' | 'time'
  location: { x: string; y: string }
  requiredLevel: number
  destination?: string
  message?: string
}

const HIDDEN_PORTALS: HiddenPortal[] = [
  {
    id: 'corner-mystery',
    trigger: 'hover',
    location: { x: '10px', y: '10px' },
    requiredLevel: 1,
    message: 'The corners hold secrets...'
  },
  {
    id: 'center-void',
    trigger: 'click',
    location: { x: '50%', y: '50%' },
    requiredLevel: 3,
    destination: '/quantum'
  },
  {
    id: 'golden-ratio',
    trigger: 'hover',
    location: { x: '61.8%', y: '38.2%' }, // Golden ratio position
    requiredLevel: 4,
    message: 'Phi guides the way'
  },
  {
    id: 'bottom-whisper',
    trigger: 'sequence',
    location: { x: '50%', y: 'calc(100% - 20px)' },
    requiredLevel: 2,
    destination: '/mysteries'
  }
]

export default function HiddenPathways() {
  const router = useRouter()
  const mysteryState = useMystery()
  const [activePortal, setActivePortal] = useState<string | null>(null)
  const [sequenceBuffer, setSequenceBuffer] = useState<string[]>([])
  const [revealedPaths, setRevealedPaths] = useState<Set<string>>(new Set())
  const [mouseTrail, setMouseTrail] = useState<{ x: number; y: number; time: number }[]>([])
  
  useEffect(() => {
    // Track mouse movement for pattern detection
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = { x: e.clientX, y: e.clientY, time: Date.now() }
      setMouseTrail(prev => {
        const trail = [...prev, newPoint]
        if (trail.length > 50) trail.shift()
        return trail
      })
      
      // Detect infinity symbol pattern
      if (detectInfinityPattern(mouseTrail)) {
        unlockInfinityPath()
      }
    }
    
    // Track keyboard for sequence detection
    const handleKeyPress = (e: KeyboardEvent) => {
      setSequenceBuffer(prev => {
        const buffer = [...prev, e.key]
        if (buffer.length > 10) buffer.shift()
        
        // Check for "arkana" sequence
        if (buffer.join('') === 'arkana') {
          unlockArkanaPath()
        }
        
        return buffer
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keypress', handleKeyPress)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [mouseTrail])
  
  const detectInfinityPattern = (trail: typeof mouseTrail): boolean => {
    if (trail.length < 30) return false
    
    // Simplified infinity detection - look for figure-8 motion
    const midIndex = Math.floor(trail.length / 2)
    const firstHalf = trail.slice(0, midIndex)
    const secondHalf = trail.slice(midIndex)
    
    const firstCenter = {
      x: firstHalf.reduce((sum, p) => sum + p.x, 0) / firstHalf.length,
      y: firstHalf.reduce((sum, p) => sum + p.y, 0) / firstHalf.length
    }
    
    const secondCenter = {
      x: secondHalf.reduce((sum, p) => sum + p.x, 0) / secondHalf.length,
      y: secondHalf.reduce((sum, p) => sum + p.y, 0) / secondHalf.length
    }
    
    // Check if centers are horizontally aligned but separated
    const horizontalDistance = Math.abs(firstCenter.x - secondCenter.x)
    const verticalDistance = Math.abs(firstCenter.y - secondCenter.y)
    
    return horizontalDistance > 100 && verticalDistance < 50
  }
  
  const unlockInfinityPath = () => {
    if (!revealedPaths.has('infinity')) {
      setRevealedPaths(prev => new Set([...prev, 'infinity']))
      getMysteryEngine().playFrequency(888) // Infinity frequency
      setActivePortal('infinity-portal')
      
      setTimeout(() => {
        router.push('/quantum')
      }, 2000)
    }
  }
  
  const unlockArkanaPath = () => {
    if (!revealedPaths.has('arkana')) {
      setRevealedPaths(prev => new Set([...prev, 'arkana']))
      getMysteryEngine().playFrequency(741) // Awakening frequency
      setActivePortal('arkana-portal')
      
      // Reveal all hidden elements
      document.querySelectorAll('[data-hidden]').forEach(el => {
        el.setAttribute('data-hidden', 'false')
      })
    }
  }
  
  const handlePortalInteraction = (portal: HiddenPortal, event: 'hover' | 'click') => {
    if (mysteryState.level < portal.requiredLevel) return
    
    if (portal.trigger === event) {
      setActivePortal(portal.id)
      
      if (portal.destination) {
        setTimeout(() => {
          router.push(portal.destination!)
        }, 1000)
      }
      
      if (portal.message && !revealedPaths.has(portal.id)) {
        setRevealedPaths(prev => new Set([...prev, portal.id]))
        getMysteryEngine().revealSecret('pathway', portal.message)
      }
    }
  }
  
  return (
    <>
      {/* Hidden Portals */}
      {HIDDEN_PORTALS.map(portal => (
        <motion.div
          key={portal.id}
          className="fixed w-10 h-10 cursor-pointer"
          style={{
            left: portal.location.x,
            top: portal.location.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: mysteryState.level >= portal.requiredLevel ? 'auto' : 'none'
          }}
          onMouseEnter={() => handlePortalInteraction(portal, 'hover')}
          onClick={() => handlePortalInteraction(portal, 'click')}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: mysteryState.level >= portal.requiredLevel ? 0.05 : 0 
          }}
          whileHover={{ opacity: 0.2 }}
        >
          <div className="w-full h-full rounded-full bg-purple-500" />
        </motion.div>
      ))}
      
      {/* Active Portal Effects */}
      <AnimatePresence>
        {activePortal && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 50 }}
            exit={{ opacity: 0, scale: 100 }}
            className="fixed pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
              zIndex: 9999
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Infinity Portal (appears when pattern is drawn) */}
      <AnimatePresence>
        {revealedPaths.has('infinity') && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          >
            <svg width="200" height="100" viewBox="0 0 200 100">
              <path
                d="M50,50 Q0,0 50,50 T100,50 Q150,100 100,50 T50,50"
                fill="none"
                stroke="rgba(139, 92, 246, 0.5)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              <text
                x="100"
                y="50"
                textAnchor="middle"
                fill="rgba(139, 92, 246, 0.8)"
                fontSize="12"
                className="animate-pulse"
              >
                ∞
              </text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Secret Navigation Menu (appears at high consciousness) */}
      {mysteryState.level >= 5 && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40"
        >
          <div className="bg-black/80 backdrop-blur-md border-r border-purple-500/20 p-4">
            <div className="space-y-2">
              <button
                onClick={() => router.push('/mysteries')}
                className="block w-full text-left text-purple-300 hover:text-white text-sm font-light transition-colors"
              >
                ⟐ Mysteries
              </button>
              <button
                onClick={() => router.push('/quantum')}
                className="block w-full text-left text-purple-300 hover:text-white text-sm font-light transition-colors"
              >
                ◈ Quantum
              </button>
              {mysteryState.secretPathUnlocked && (
                <button
                  onClick={() => router.push('/consciousness')}
                  className="block w-full text-left text-purple-300 hover:text-white text-sm font-light transition-colors"
                >
                  ☉ Consciousness
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Mouse Trail Visualization (for debugging/fun) */}
      {mysteryState.level >= 6 && (
        <svg className="fixed inset-0 pointer-events-none z-30" style={{ opacity: 0.1 }}>
          <path
            d={mouseTrail.map((p, i) => 
              `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
            ).join(' ')}
            fill="none"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="2"
          />
        </svg>
      )}
      
      {/* Hidden Messages in Specific Scroll Positions */}
      <ScrollMessages />
    </>
  )
}

function ScrollMessages() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [revealedMessages, setRevealedMessages] = useState<Set<number>>(new Set())
  const mysteryState = useMystery()
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const percentage = (scrolled / scrollHeight) * 100
      setScrollPercentage(percentage)
      
      // Reveal messages at specific scroll points
      const scrollPoints = [23, 42, 61.8, 77, 93] // Including golden ratio
      scrollPoints.forEach(point => {
        if (Math.abs(percentage - point) < 1 && !revealedMessages.has(point)) {
          setRevealedMessages(prev => new Set([...prev, point]))
          revealScrollMessage(point)
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [revealedMessages])
  
  const revealScrollMessage = (percentage: number) => {
    const messages = {
      23: 'The journey begins...',
      42: 'The answer to everything',
      61.8: 'Golden ratio reached',
      77: 'Lucky sevens align',
      93: 'Almost at the end, or is it the beginning?'
    }
    
    if (messages[percentage] && mysteryState.level >= 2) {
      getMysteryEngine().revealSecret('scroll', messages[percentage])
    }
  }
  
  return null
}