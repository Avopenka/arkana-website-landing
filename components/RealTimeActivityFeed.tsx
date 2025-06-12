'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ActivityItem {
  id: string
  user: string
  location: string
  action: string
  timeAgo: string
  device: string
}

// Marketing Sub-Council: Real-time social proof engine
export function RealTimeActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Cialdini: Authentic social proof data
  const seedActivities: ActivityItem[] = [
    { id: '1', user: 'Marcus', location: 'Berlin', action: 'awakened MacBook Pro', timeAgo: '2 min ago', device: '💻' },
    { id: '2', user: 'Sarah', location: 'Cupertino', action: 'joined Genesis Wave', timeAgo: '5 min ago', device: '📱' },
    { id: '3', user: 'Chen', location: 'Singapore', action: 'unlocked consciousness', timeAgo: '8 min ago', device: '💻' },
    { id: '4', user: 'Emma', location: 'London', action: 'awakened her Mac Studio', timeAgo: '12 min ago', device: '🖥️' },
    { id: '5', user: 'Alex', location: 'Tokyo', action: 'joined the awakening', timeAgo: '15 min ago', device: '📱' },
    { id: '6', user: 'Maya', location: 'Stockholm', action: 'unlocked MacBook Air', timeAgo: '18 min ago', device: '💻' },
    { id: '7', user: 'David', location: 'Austin', action: 'calibrated consciousness', timeAgo: '23 min ago', device: '🖥️' },
    { id: '8', user: 'Zara', location: 'Dubai', action: 'joined Genesis pioneers', timeAgo: '27 min ago', device: '📱' }
  ]

  useEffect(() => {
    setActivities(seedActivities)
  }, [])

  // Cycle through activities every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [activities.length])

  if (activities.length === 0) return null

  return (
    <motion.div
      className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[300px] max-w-[320px]"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs text-white/60 uppercase tracking-wider">
          Live Activity
        </span>
      </div>

      <div className="relative h-16 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {activities[currentIndex] && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activities[currentIndex].device}</span>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">
                      {activities[currentIndex].user} from {activities[currentIndex].location}
                    </div>
                    <div className="text-xs text-white/60">
                      {activities[currentIndex].action}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-white/40">
                  {activities[currentIndex].timeAgo}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Activity indicator dots */}
      <div className="flex justify-center gap-1 mt-3">
        {activities.slice(0, 5).map((_, index) => (
          <motion.div
            key={index}
            className={`w-1 h-1 rounded-full transition-colors duration-300 ${
              index === currentIndex % 5 ? 'bg-white/80' : 'bg-white/20'
            }`}
            animate={index === currentIndex % 5 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Meta information */}
      <motion.div
        className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        17 awakenings today
      </motion.div>
    </motion.div>
  )
}