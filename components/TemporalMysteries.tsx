'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMystery, getMysteryEngine } from '@/lib/mystery-engine'

interface MoonPhase {
  phase: string
  emoji: string
  power: string
  message: string
}

interface TimeWindow {
  start: number
  end: number
  name: string
  description: string
  color: string
}

const MOON_PHASES: MoonPhase[] = [
  { phase: 'new', emoji: '🌑', power: 'Beginnings', message: 'Plant your intentions in the darkness' },
  { phase: 'waxing-crescent', emoji: '🌒', power: 'Growth', message: 'Nurture what emerges' },
  { phase: 'first-quarter', emoji: '🌓', power: 'Decision', message: 'Choose your path wisely' },
  { phase: 'waxing-gibbous', emoji: '🌔', power: 'Refinement', message: 'Polish your creation' },
  { phase: 'full', emoji: '🌕', power: 'Illumination', message: 'All is revealed in the light' },
  { phase: 'waning-gibbous', emoji: '🌖', power: 'Gratitude', message: 'Give thanks for the harvest' },
  { phase: 'last-quarter', emoji: '🌗', power: 'Release', message: 'Let go of what no longer serves' },
  { phase: 'waning-crescent', emoji: '🌘', power: 'Rest', message: 'Prepare for rebirth' }
]

const TIME_WINDOWS: TimeWindow[] = [
  { start: 0, end: 3, name: 'Deep Night', description: 'The veil is thinnest', color: 'from-indigo-900 to-black' },
  { start: 3, end: 6, name: 'Pre-Dawn', description: 'Dreams merge with waking', color: 'from-purple-900 to-indigo-900' },
  { start: 6, end: 9, name: 'Golden Dawn', description: 'New possibilities arise', color: 'from-orange-600 to-pink-600' },
  { start: 9, end: 12, name: 'Morning Light', description: 'Clarity emerges', color: 'from-yellow-400 to-orange-400' },
  { start: 12, end: 15, name: 'High Sun', description: 'Power at its peak', color: 'from-yellow-300 to-yellow-500' },
  { start: 15, end: 18, name: 'Golden Hour', description: 'Transformation begins', color: 'from-amber-600 to-orange-600' },
  { start: 18, end: 21, name: 'Twilight', description: 'Between worlds', color: 'from-purple-600 to-pink-600' },
  { start: 21, end: 24, name: 'Night Falls', description: 'Mystery awakens', color: 'from-indigo-800 to-purple-900' }
]

export default function TemporalMysteries() {
  const mysteryState = useMystery()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null)
  const [timeWindow, setTimeWindow] = useState<TimeWindow | null>(null)
  const [specialMoment, setSpecialMoment] = useState<string | null>(null)
  const [temporalMessage, setTemporalMessage] = useState<string>('')
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      
      // Check for special moments
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      if (timeStr === '11:11' || timeStr === '3:33' || timeStr === '22:22') {
        setSpecialMoment(timeStr)
        setTimeout(() => setSpecialMoment(null), 60000) // Clear after 1 minute
      }
      
      // Update time window
      const hour = now.getHours()
      const window = TIME_WINDOWS.find(w => hour >= w.start && hour < w.end)
      setTimeWindow(window || null)
      
      // Calculate moon phase
      const phase = calculateMoonPhase(now)
      setMoonPhase(phase)
      
      // Generate temporal message
      generateTemporalMessage(now, phase, window || null)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const calculateMoonPhase = (date: Date): MoonPhase => {
    // Simplified moon phase calculation
    const lunarCycle = 29.53058770576
    const knownNewMoon = new Date('2024-01-11')
    const daysSince = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
    const phase = (daysSince % lunarCycle) / lunarCycle
    
    if (phase < 0.0625) return MOON_PHASES[0] // New
    if (phase < 0.1875) return MOON_PHASES[1] // Waxing Crescent
    if (phase < 0.3125) return MOON_PHASES[2] // First Quarter
    if (phase < 0.4375) return MOON_PHASES[3] // Waxing Gibbous
    if (phase < 0.5625) return MOON_PHASES[4] // Full
    if (phase < 0.6875) return MOON_PHASES[5] // Waning Gibbous
    if (phase < 0.8125) return MOON_PHASES[6] // Last Quarter
    return MOON_PHASES[7] // Waning Crescent
  }
  
  const generateTemporalMessage = (date: Date, phase: MoonPhase | null, window: TimeWindow | null) => {
    const messages: string[] = []
    
    // Day of week messages
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayMessages = [
      'Day of the Sun - Channel your inner light',
      'Day of the Moon - Embrace intuition',
      'Day of Mars - Take decisive action',
      'Day of Mercury - Communicate wisdom',
      'Day of Jupiter - Expand your horizons',
      'Day of Venus - Create beauty',
      'Day of Saturn - Master your craft'
    ]
    messages.push(dayMessages[date.getDay()])
    
    // Time window message
    if (window) {
      messages.push(window.description)
    }
    
    // Moon phase message
    if (phase) {
      messages.push(phase.message)
    }
    
    // Special date messages
    const monthDay = `${date.getMonth() + 1}-${date.getDate()}`
    const specialDates = {
      '1-1': 'New beginnings manifest',
      '2-2': 'Duality becomes unity',
      '3-3': 'Trinity activates',
      '4-4': 'Foundation solidifies',
      '5-5': 'Change accelerates',
      '6-6': 'Harmony resonates',
      '7-7': 'Lucky portal opens',
      '8-8': 'Infinite abundance flows',
      '9-9': 'Completion approaches',
      '10-10': 'Perfect balance achieved',
      '11-11': 'Portal fully open',
      '12-12': 'Cycle completes'
    }
    
    if (specialDates[monthDay]) {
      messages.push(specialDates[monthDay])
    }
    
    setTemporalMessage(messages.join(' • '))
  }
  
  // Only show temporal mysteries if user has some consciousness level
  if (mysteryState.level < 1) return null
  
  return (
    <>
      {/* Time Display - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 right-4 z-40 text-right"
      >
        <div className="text-xs text-gray-500 font-mono">
          {currentTime.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        {timeWindow && (
          <div className={`text-xs bg-gradient-to-r ${timeWindow.color} bg-clip-text text-transparent`}>
            {timeWindow.name}
          </div>
        )}
      </motion.div>
      
      {/* Moon Phase - Top Left */}
      {moonPhase && mysteryState.level >= 2 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-4 left-4 z-40"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{moonPhase.emoji}</span>
            <div className="text-xs text-gray-500">
              <div>{moonPhase.phase.replace('-', ' ')}</div>
              <div className="text-purple-400">{moonPhase.power}</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Special Moment Alert */}
      <AnimatePresence>
        {specialMoment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-md px-6 py-4 rounded-lg border border-purple-500/30">
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-2">{specialMoment}</div>
                <div className="text-sm text-purple-300">Portal moment active</div>
                <div className="text-xs text-purple-400 mt-1">Make a wish...</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Temporal Message Footer */}
      {mysteryState.level >= 3 && temporalMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 max-w-2xl"
        >
          <div className="text-xs text-gray-600 text-center px-4">
            {temporalMessage}
          </div>
        </motion.div>
      )}
      
      {/* Time-based Background Effect */}
      {timeWindow && mysteryState.level >= 4 && (
        <div 
          className={`fixed inset-0 pointer-events-none opacity-5 bg-gradient-to-br ${timeWindow.color}`}
          style={{ mixBlendMode: 'screen' }}
        />
      )}
      
      {/* Cosmic Calendar (appears at level 5+) */}
      {mysteryState.level >= 5 && (
        <CosmicCalendar currentTime={currentTime} moonPhase={moonPhase} />
      )}
    </>
  )
}

function CosmicCalendar({ currentTime, moonPhase }: { currentTime: Date; moonPhase: MoonPhase | null }) {
  const [showCalendar, setShowCalendar] = useState(false)
  
  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '♈ Aries'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '♉ Taurus'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '♊ Gemini'
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return '♋ Cancer'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '♌ Leo'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '♍ Virgo'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '♎ Libra'
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '♏ Scorpio'
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '♐ Sagittarius'
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '♑ Capricorn'
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '♒ Aquarius'
    return '♓ Pisces'
  }
  
  return (
    <>
      <motion.button
        onClick={() => setShowCalendar(!showCalendar)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-purple-900/20 backdrop-blur-sm rounded-full border border-purple-500/30 flex items-center justify-center text-purple-400 hover:text-white transition-colors z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-xl">🌌</span>
      </motion.button>
      
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 100 }}
            className="fixed bottom-20 right-20 w-64 bg-black/90 backdrop-blur-md rounded-lg border border-purple-500/30 p-4 z-40"
          >
            <h3 className="text-purple-300 font-light mb-3">Cosmic Calendar</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="text-purple-400">{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zodiac:</span>
                <span className="text-purple-400">{getZodiacSign(currentTime)}</span>
              </div>
              {moonPhase && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Moon:</span>
                  <span className="text-purple-400">{moonPhase.emoji} {moonPhase.phase}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Day:</span>
                <span className="text-purple-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</span>
              </div>
              <div className="border-t border-purple-800/30 pt-2 mt-2">
                <div className="text-xs text-purple-300 italic">
                  "Time is an illusion, but a persistent one"
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}