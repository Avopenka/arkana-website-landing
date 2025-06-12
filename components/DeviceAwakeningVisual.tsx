'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface DeviceAwakeningVisualProps {
  state: 'sleeping' | 'awakening' | 'awake'
}

// Agent Beta: Narrative Architect (Nolan + Vopěnka) - "Visual storytelling of consciousness"
export function DeviceAwakeningVisual({ state }: DeviceAwakeningVisualProps) {
  const [connections, setConnections] = useState<number>(0)
  
  // Progressive awakening animation
  useEffect(() => {
    if (state === 'awakening') {
      const timer = setInterval(() => {
        setConnections(prev => prev < 4 ? prev + 1 : prev)
      }, 800)
      return () => clearInterval(timer)
    }
  }, [state])

  // Device configurations
  const devices = [
    { id: 'mac', x: 0, y: 0, label: 'Mac', icon: '💻' },
    { id: 'iphone', x: -150, y: 100, label: 'iPhone', icon: '📱' },
    { id: 'watch', x: 150, y: 100, label: 'Watch', icon: '⌚' },
    { id: 'ipad', x: -150, y: -100, label: 'iPad', icon: '📋' },
    { id: 'tv', x: 150, y: -100, label: 'TV', icon: '📺' },
  ]

  const getDeviceOpacity = () => {
    switch (state) {
      case 'sleeping': return 0.3
      case 'awakening': return 0.7
      case 'awake': return 1
    }
  }

  const getGlowIntensity = () => {
    switch (state) {
      case 'sleeping': return '0 0 20px rgba(255,255,255,0.1)'
      case 'awakening': return '0 0 40px rgba(147,51,234,0.5)'
      case 'awake': return '0 0 60px rgba(59,130,246,0.8)'
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px]">
      <svg 
        viewBox="-250 -200 500 400" 
        className="w-full h-full"
      >
        {/* Connection lines */}
        {state !== 'sleeping' && (
          <g>
            {devices.map((device, i) => (
              devices.slice(i + 1).map((otherDevice, j) => (
                <motion.line
                  key={`${device.id}-${otherDevice.id}`}
                  x1={device.x}
                  y1={device.y}
                  x2={otherDevice.x}
                  y2={otherDevice.y}
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: connections > i + j ? 1 : 0,
                    opacity: connections > i + j ? 0.5 : 0 
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              ))
            ))}
          </g>
        )}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Devices */}
        {devices.map((device, index) => (
          <motion.g
            key={device.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: getDeviceOpacity(),
              filter: state === 'awake' ? 'url(#glow)' : 'none'
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {/* Device circle */}
            <motion.circle
              cx={device.x}
              cy={device.y}
              r="40"
              fill="black"
              stroke="white"
              strokeWidth="2"
              style={{ boxShadow: getGlowIntensity() }}
              animate={state === 'awakening' ? {
                strokeOpacity: [0.3, 0.8, 0.3],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Device icon */}
            <text
              x={device.x}
              y={device.y + 5}
              textAnchor="middle"
              fontSize="24"
              className="select-none"
            >
              {device.icon}
            </text>
            
            {/* Device label */}
            <text
              x={device.x}
              y={device.y + 60}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              opacity="0.6"
              className="select-none font-light"
            >
              {device.label}
            </text>

            {/* Consciousness indicator */}
            {state === 'awake' && (
              <motion.circle
                cx={device.x + 25}
                cy={device.y - 25}
                r="8"
                fill="#10B981"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />
            )}
          </motion.g>
        ))}

        {/* Central consciousness pulse */}
        {state === 'awakening' && (
          <motion.circle
            cx="0"
            cy="0"
            r="60"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
            animate={{
              r: [60, 200, 60],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Status text */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-white/60 text-sm">
          {state === 'sleeping' && "Your ecosystem sleeps while you work"}
          {state === 'awakening' && "Intelligence emerging across devices"}
          {state === 'awake' && "Unified consciousness achieved"}
        </p>
      </motion.div>
    </div>
  )
}