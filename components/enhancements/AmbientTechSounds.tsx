'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
interface AmbientTechSoundsProps {
  autoStart?: boolean
  volume?: number
  className?: string
}
export default function AmbientTechSounds({ 
  autoStart = false, 
  volume: initialVolume = 0.3,
  className = ''
}: AmbientTechSoundsProps) {
  const [isActive, setIsActive] = useState(autoStart)
  const [volume, setVolume] = useState(initialVolume)
  const [showControls, setShowControls] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainNodesRef = useRef<GainNode[]>([])
  const masterGainRef = useRef<GainNode | null>(null)
  const initializeAudio = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        masterGainRef.current = audioContextRef.current.createGain()
        masterGainRef.current.connect(audioContextRef.current.destination)
        masterGainRef.current.gain.value = volume
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      return true
    } catch (error) {
      return false
    }
  }, [volume])
  const createTechDrone = useCallback((frequency: number, gainValue: number = 0.02) => {
    if (!audioContextRef.current || !masterGainRef.current) return null
    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gainNode.gain.value = 0
      gainNode.gain.setTargetAtTime(gainValue, audioContextRef.current.currentTime, 2)
      oscillator.connect(gainNode)
      gainNode.connect(masterGainRef.current)
      oscillator.start()
      oscillatorsRef.current.push(oscillator)
      gainNodesRef.current.push(gainNode)
      return { oscillator, gainNode }
    } catch (error) {
      return null
    }
  }, [])
  const startAmbientSounds = useCallback(async () => {
    const initialized = await initializeAudio()
    if (!initialized) return
    // Tesla-inspired frequencies
    createTechDrone(111, 0.015) // Consciousness
    createTechDrone(174, 0.012) // Foundation
    createTechDrone(285, 0.010) // Quantum
    createTechDrone(55, 0.008)  // Sub-bass
  }, [initializeAudio, createTechDrone])
  const stopAmbientSounds = useCallback(() => {
    oscillatorsRef.current.forEach((osc, index) => {
      if (gainNodesRef.current[index]) {
        gainNodesRef.current[index].gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.5)
      }
      setTimeout(() => {
        try {
          osc.stop()
        } catch (e) {
          // Already stopped
        }
      }, 500)
    })
    oscillatorsRef.current = []
    gainNodesRef.current = []
  }, [])
  const toggleSound = useCallback(async () => {
    if (isActive) {
      stopAmbientSounds()
      setIsActive(false)
    } else {
      await startAmbientSounds()
      setIsActive(true)
    }
  }, [isActive, startAmbientSounds, stopAmbientSounds])
  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(newVolume, audioContextRef.current?.currentTime || 0, 0.1)
    }
  }, [])
  useEffect(() => {
    return () => {
      stopAmbientSounds()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stopAmbientSounds])
  return (
    <div className={`ambient-tech-sounds ${className}`}>
      <motion.button
        onClick={toggleSound}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 p-3 bg-black/80 backdrop-blur border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 rounded-full"
      >
        {isActive ? (
          <Volume2 className="w-5 h-5 text-cyan-400" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-6 z-50 p-4 bg-black/90 backdrop-blur border border-cyan-400/30 rounded-lg min-w-[200px]"
          >
            <div className="text-xs text-cyan-400 mb-3 font-mono">AMBIENT TECH</div>
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">VOLUME</div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => updateVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00f5d4 0%, #00f5d4 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                }}
              />
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-500">
                STATUS: <span className={isActive ? 'text-cyan-400' : 'text-gray-400'}>
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}