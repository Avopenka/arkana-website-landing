'use client'

import { motion } from 'framer-motion'
import { CommandPalette } from '../command-palette/CommandPalette'
import { Brain, Zap, Shield, Sparkles } from 'lucide-react'

export function EnhancedHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            Work at the
            <br />
            Speed of Thought
          </h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            AI that understands you, evolves with you, and amplifies your consciousness
          </motion.p>

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12"
          >
            <CommandPalette />
          </motion.div>

          {/* Feature highlights */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[
              { icon: Brain, label: "Consciousness AI", desc: "Understands your mental state" },
              { icon: Zap, label: "Instant Sync", desc: "Real-time across all devices" },
              { icon: Shield, label: "Privacy First", desc: "Your data, your control" },
              { icon: Sparkles, label: "Evolving UI", desc: "Adapts to your workflow" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-sm mb-1">{feature.label}</h3>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
