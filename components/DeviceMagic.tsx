'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMystery, getMysteryEngine } from '@/lib/mystery-engine'

interface DeviceOrientation {
  alpha: number | null // Z axis rotation (0-360)
  beta: number | null  // X axis rotation (-180 to 180)
  gamma: number | null // Y axis rotation (-90 to 90)
}

interface AmbientLight {
  illuminance: number
}

export default function DeviceMagic() {
  const mysteryState = useMystery()
  const [orientation, setOrientation] = useState<DeviceOrientation>({ alpha: null, beta: null, gamma: null })
  const [ambientLight, setAmbientLight] = useState<number | null>(null)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isCharging, setIsCharging] = useState(false)
  const [networkType, setNetworkType] = useState<string>('')
  const [deviceMemory, setDeviceMemory] = useState<number | null>(null)
  const [cpuCores, setCpuCores] = useState<number | null>(null)
  const [touchPressure, setTouchPressure] = useState<number>(0)
  const [discoveredSecrets, setDiscoveredSecrets] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    // Device orientation (mobile)
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      })
      
      // Check for specific orientations
      if (event.beta !== null && event.gamma !== null) {
        // Device held perfectly flat
        if (Math.abs(event.beta) < 5 && Math.abs(event.gamma) < 5) {
          unlockSecret('perfect-balance')
        }
        
        // Device upside down
        if (Math.abs(event.beta) > 170) {
          unlockSecret('upside-down')
        }
        
        // Device at 45-degree angle (mystical angle)
        if (Math.abs(event.beta - 45) < 5 || Math.abs(event.gamma - 45) < 5) {
          unlockSecret('mystical-angle')
        }
      }
    }
    
    // Ambient light sensor
    const handleAmbientLight = (event: Event) => {
      const lux = event.illuminance
      setAmbientLight(lux)
      
      // Darkness detection
      if (lux < 10) {
        unlockSecret('darkness-dweller')
      }
      
      // Bright light detection
      if (lux > 10000) {
        unlockSecret('light-seeker')
      }
      
      // Candlelight range (mystical lighting)
      if (lux >= 10 && lux <= 50) {
        unlockSecret('candlelight-consciousness')
      }
    }
    
    // Battery status
    const handleBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery()
          setBatteryLevel(battery.level)
          setIsCharging(battery.charging)
          
          // Low battery mystery
          if (battery.level < 0.1) {
            unlockSecret('energy-conservation')
          }
          
          // Full battery mystery
          if (battery.level === 1 && battery.charging) {
            unlockSecret('full-power')
          }
          
          // Sacred battery levels
          if (battery.level === 0.33 || battery.level === 0.66 || battery.level === 0.99) {
            unlockSecret('trinity-power')
          }
          
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(battery.level)
          })
          
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging)
          })
        } catch (e) {
          // Battery API not supported
        }
      }
    }
    
    // Network information
    const handleNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection
        setNetworkType(connection.effectiveType)
        
        // Slow network mystery
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          unlockSecret('patience-master')
        }
        
        // Fast network mystery
        if (connection.effectiveType === '4g' && connection.downlink > 10) {
          unlockSecret('speed-demon')
        }
      }
    }
    
    // Device capabilities
    const checkDeviceCapabilities = () => {
      // Device memory
      if ('deviceMemory' in navigator) {
        const memory = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).deviceMemory
        setDeviceMemory(memory)
        
        // High memory device
        if (memory >= 8) {
          unlockSecret('memory-palace')
        }
      }
      
      // CPU cores
      if ('hardwareConcurrency' in navigator) {
        const cores = navigator.hardwareConcurrency
        setCpuCores(cores)
        
        // Many cores (powerful device)
        if (cores >= 8) {
          unlockSecret('quantum-processor')
        }
        
        // Sacred number of cores
        if (cores === 3 || cores === 7 || cores === 9) {
          unlockSecret('sacred-cores')
        }
      }
    }
    
    // Touch pressure (3D Touch / Force Touch)
    const handleTouchForce = (e: TouchEvent) => {
      if (e.touches[0] && 'force' in e.touches[0]) {
        const force = (e.touches[0] as any).force
        setTouchPressure(force)
        
        // Light touch
        if (force > 0 && force < 0.3) {
          unlockSecret('gentle-touch')
        }
        
        // Heavy touch
        if (force > 0.8) {
          unlockSecret('forceful-presence')
        }
      }
    }
    
    // Geolocation mysteries (privacy-first)
    const checkTimezone = () => {
      const offset = new Date().getTimezoneOffset()
      
      // UTC timezone (Greenwich)
      if (offset === 0) {
        unlockSecret('prime-meridian')
      }
      
      // International date line area
      if (Math.abs(offset) >= 720) {
        unlockSecret('date-line-dweller')
      }
    }
    
    // Screen size mysteries
    const checkScreenSize = () => {
      const width = window.screen.width
      const height = window.screen.height
      const ratio = width / height
      
      // Golden ratio screen
      if (Math.abs(ratio - 1.618) < 0.1 || Math.abs(ratio - 0.618) < 0.1) {
        unlockSecret('golden-screen')
      }
      
      // Square screen (rare)
      if (Math.abs(ratio - 1) < 0.1) {
        unlockSecret('square-consciousness')
      }
      
      // Ultra-wide screen
      if (ratio > 2.3) {
        unlockSecret('panoramic-vision')
      }
    }
    
    // Language mysteries
    const checkLanguage = () => {
      const lang = navigator.language
      
      // Ancient language codes
      const ancientLangs = ['sa', 'la', 'grc', 'egy', 'sux'] // Sanskrit, Latin, Ancient Greek, Egyptian, Sumerian
      if (ancientLangs.some(l => lang.startsWith(l))) {
        unlockSecret('ancient-tongue')
      }
      
      // Multiple languages
      if (navigator.languages && navigator.languages.length > 5) {
        unlockSecret('polyglot-consciousness')
      }
    }
    
    const unlockSecret = (secretId: string) => {
      if (!discoveredSecrets.has(secretId) && mysteryState.level >= 1) {
        setDiscoveredSecrets(prev => new Set([...prev, secretId]))
        getMysteryEngine().revealSecret('device', getSecretMessage(secretId))
      }
    }
    
    const getSecretMessage = (secretId: string): string => {
      const messages: Record<string, string> = {
        'perfect-balance': 'Device in perfect balance. As above, so below.',
        'upside-down': 'Perspective inverted. New truths revealed.',
        'mystical-angle': '45° - The angle of transformation.',
        'darkness-dweller': 'In darkness, inner light shines brightest.',
        'light-seeker': 'Bathed in brilliance. Solar consciousness activated.',
        'candlelight-consciousness': 'The ancient light guides you.',
        'energy-conservation': 'Low power, high awareness. Efficiency is enlightenment.',
        'full-power': 'Maximum energy achieved. Potential unlimited.',
        'trinity-power': 'Sacred battery level detected. Trinity acknowledged.',
        'patience-master': 'Slow connection, fast understanding.',
        'speed-demon': 'Lightning fast. Thought at light speed.',
        'memory-palace': 'Vast memory detected. Mental palace unlocked.',
        'quantum-processor': 'Multi-core consciousness. Parallel realities accessible.',
        'sacred-cores': 'Sacred number of processors. Divine computation enabled.',
        'gentle-touch': 'Soft touch, deep impact.',
        'forceful-presence': 'Pressure creates diamonds. And revelations.',
        'prime-meridian': 'Zero point. The center of time.',
        'date-line-dweller': 'Living between today and tomorrow.',
        'golden-screen': 'Screen follows divine proportion. Beauty in ratio.',
        'square-consciousness': 'Perfect square. All sides equal.',
        'panoramic-vision': 'Ultra-wide perception. See the full spectrum.',
        'ancient-tongue': 'Ancient language detected. The old ways remember.',
        'polyglot-consciousness': 'Many tongues, one truth.'
      }
      
      return messages[secretId] || 'Mystery unlocked.'
    }
    
    // Set up event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation)
      window.addEventListener('devicelight', handleAmbientLight)
      window.addEventListener('touchstart', handleTouchForce)
      
      handleBattery()
      handleNetwork()
      checkDeviceCapabilities()
      checkTimezone()
      checkScreenSize()
      checkLanguage()
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('devicelight', handleAmbientLight)
      window.removeEventListener('touchstart', handleTouchForce)
    }
  }, [mysteryState.level, discoveredSecrets])
  
  // Privacy-first: Only show device info at higher consciousness levels
  if (mysteryState.level < 3) return null
  
  return (
    <>
      {/* Device Status Indicator (subtle) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="fixed bottom-4 left-4 text-xs text-gray-500 font-mono space-y-1 z-20"
      >
        {batteryLevel !== null && (
          <div className="flex items-center gap-2">
            <span className={isCharging ? 'text-green-500' : 'text-gray-500'}>
              {isCharging ? '⚡' : '🔋'}
            </span>
            <span>{Math.round(batteryLevel * 100)}%</span>
          </div>
        )}
        
        {networkType && (
          <div className="flex items-center gap-2">
            <span>📡</span>
            <span>{networkType}</span>
          </div>
        )}
        
        {cpuCores && (
          <div className="flex items-center gap-2">
            <span>🧠</span>
            <span>{cpuCores} cores</span>
          </div>
        )}
        
        {ambientLight !== null && (
          <div className="flex items-center gap-2">
            <span>{ambientLight < 50 ? '🌙' : '☀️'}</span>
            <span>{Math.round(ambientLight)} lux</span>
          </div>
        )}
      </motion.div>
      
      {/* Orientation Visualizer (mobile only) */}
      {orientation.beta !== null && mysteryState.level >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          <div
            className="w-32 h-32 border-2 border-purple-500/20 rounded-full"
            style={{
              transform: `
                rotateX(${orientation.beta}deg) 
                rotateY(${orientation.gamma}deg) 
                rotateZ(${orientation.alpha}deg)
              `,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-4 border border-purple-400/20 rounded-full" />
            <div className="absolute inset-8 border border-purple-300/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>
      )}
      
      {/* Touch Pressure Visualizer */}
      <AnimatePresence>
        {touchPressure > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1 + touchPressure, opacity: 0.5 - touchPressure * 0.3 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
          >
            <div
              className="w-20 h-20 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(139, 92, 246, ${touchPressure}) 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Device Secrets Counter */}
      {discoveredSecrets.size > 0 && mysteryState.level >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          className="fixed top-20 right-4 text-xs text-purple-400 text-right z-20"
        >
          <div>Device Secrets: {discoveredSecrets.size}</div>
          <div className="text-purple-500/50 mt-1">
            {Array.from(discoveredSecrets).slice(-3).map(secret => (
              <div key={secret} className="truncate">• {secret.replace(/-/g, ' ')}</div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  )
}