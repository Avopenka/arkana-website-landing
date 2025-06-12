'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GenesisScarcityIndicatorProps {
  current: number
  total: number
  recentJoiner?: string
  timeAgo?: string
}

// Agent Epsilon: Conversion Optimizer (Thiel + Einstein) - "Scarcity creates desire"
export function GenesisScarcityIndicator({ 
  current, 
  total, 
  recentJoiner,
  timeAgo 
}: GenesisScarcityIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showPulse, setShowPulse] = useState(false)
  
  const percentage = ((total - current) / total) * 100
  const isUrgent = current <= 20 // Last 20 spots trigger urgency
  
  // Pulse animation when urgent
  useEffect(() => {
    if (isUrgent) {
      const pulseInterval = setInterval(() => {
        setShowPulse(true)
        setTimeout(() => setShowPulse(false), 1000)
      }, 3000)
      return () => clearInterval(pulseInterval)
    }
  }, [isUrgent])

  return (
    <motion.div
      className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[280px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Urgent pulse effect */}
      {showPulse && isUrgent && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header with live indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-white/60 uppercase tracking-wider">
              Genesis Wave
            </span>
          </div>
          
          {isUrgent && (
            <motion.span
              className="text-xs text-red-400 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ALMOST FULL
            </motion.span>
          )}
        </div>

        {/* Main counter */}
        <div className="mb-3">
          <motion.div 
            className="text-3xl font-light text-white"
            key={current}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {current} <span className="text-white/40">of {total}</span>
          </motion.div>
          <div className="text-sm text-white/60 mt-1">
            spots remaining
          </div>
        </div>

        {/* Progress bar - Einstein: "Make it as simple as possible" */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div
            className={`h-full ${isUrgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Recent activity - Thiel: "Social proof drives action" */}
        {recentJoiner && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-white/50"
            >
              <span className="text-white/70">{recentJoiner}</span> joined {timeAgo}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Price lock reminder */}
        <motion.div
          className="mt-3 pt-3 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-white/60">
            €25/month locked for <span className="text-white/80 font-medium">100 years</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}