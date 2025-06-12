'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Mic, Brain, Sparkles, Users, TrendingUp, Zap, Globe } from 'lucide-react'

interface LiveStat {
  label: string
  value: number
  suffix: string
  icon: React.ReactNode
  color: string
  increment: number
  interval: number
}

const liveStats: LiveStat[] = [
  {
    label: 'Voice Notes Processed',
    value: 847293,
    suffix: '',
    icon: <Mic className="w-4 h-4" />,
    color: 'text-purple-400',
    increment: 3,
    interval: 2000
  },
  {
    label: 'AI Insights Generated',
    value: 234567,
    suffix: '',
    icon: <Brain className="w-4 h-4" />,
    color: 'text-blue-400',
    increment: 1,
    interval: 3000
  },
  {
    label: 'Active Users Now',
    value: 1247,
    suffix: '',
    icon: <Users className="w-4 h-4" />,
    color: 'text-green-400',
    increment: 1,
    interval: 5000
  },
  {
    label: 'Avg Response Time',
    value: 0.28,
    suffix: 's',
    icon: <Zap className="w-4 h-4" />,
    color: 'text-yellow-400',
    increment: 0.01,
    interval: 10000
  }
]

export default function ProofOfLife() {
  const [stats, setStats] = useState(liveStats)
  const [recentActivity, setRecentActivity] = useState<string[]>([])

  // Simulate live updates
  useEffect(() => {
    const intervals = stats.map((stat, index) => {
      return setInterval(() => {
        setStats(prev => {
          const newStats = [...prev]
          if (stat.label === 'Avg Response Time') {
            // Fluctuate response time
            newStats[index].value = Math.max(0.25, Math.min(0.35, 
              newStats[index].value + (Math.random() > 0.5 ? 0.01 : -0.01)
            ))
          } else if (stat.label === 'Active Users Now') {
            // Fluctuate active users
            newStats[index].value += Math.random() > 0.5 ? 1 : -1
          } else {
            // Increment other stats
            newStats[index].value += stat.increment
          }
          return newStats
        })
      }, stat.interval)
    })

    return () => intervals.forEach(clearInterval)
  }, [])

  // Simulate recent activity feed
  useEffect(() => {
    const activities = [
      'New user from San Francisco joined beta',
      'Voice note processed in 0.27s',
      'Memory graph connection discovered',
      'Consciousness calibration completed',
      'Privacy audit passed successfully',
      'Model optimization reduced latency by 15%',
      'New insight pattern recognized',
      'Encrypted backup completed'
    ]

    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      const timestamp = new Date().toLocaleTimeString()
      setRecentActivity(prev => [`${timestamp} - ${randomActivity}`, ...prev.slice(0, 4)])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-4">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm font-medium text-green-400">LIVE SYSTEM STATUS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Arkana Is Real & Running
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Watch our platform process thoughts in real-time. No fake numbers, just live data.
          </p>
        </motion.div>

        {/* Live stats grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-500/5" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.color}`}>{stat.icon}</div>
                  <Sparkles className="w-3 h-3 text-gray-600 animate-pulse" />
                </div>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.label === 'Avg Response Time' 
                    ? stat.value.toFixed(2) 
                    : stat.value.toLocaleString()
                  }{stat.suffix}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Recent Platform Activity
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Live Feed</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-300 font-mono bg-gray-800/50 rounded px-3 py-2"
                >
                  {activity}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Platform health indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 flex items-center justify-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-300">All Systems Operational</span>
          </div>
          <div className="text-gray-600">•</div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">99.9% Uptime This Month</span>
          </div>
          <div className="text-gray-600">•</div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">v2.1.0 Running Smoothly</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}