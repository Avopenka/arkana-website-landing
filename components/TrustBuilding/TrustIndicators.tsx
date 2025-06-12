'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Star, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react'

interface TrustIndicatorProps {
  variant?: 'compact' | 'full'
  className?: string
}

export default function TrustIndicators({ variant = 'compact', className = '' }: TrustIndicatorProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`flex flex-wrap items-center justify-center gap-6 text-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">100% Local Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">10K+ Beta Users</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">4.9/5 Rating</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">0.3s Response Time</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        Why Users Trust Arkana
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">100%</p>
          <p className="text-xs text-gray-400">Local Processing</p>
        </div>
        <div className="text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">10K+</p>
          <p className="text-xs text-gray-400">Active Users</p>
        </div>
        <div className="text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">4.9/5</p>
          <p className="text-xs text-gray-400">Average Rating</p>
        </div>
        <div className="text-center">
          <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">0.3s</p>
          <p className="text-xs text-gray-400">Response Time</p>
        </div>
        <div className="text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">GDPR+</p>
          <p className="text-xs text-gray-400">Compliant</p>
        </div>
        <div className="text-center">
          <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">73%</p>
          <p className="text-xs text-gray-400">Productivity Gain</p>
        </div>
      </div>
    </motion.div>
  )
}

// Floating trust badge that can be placed anywhere
export function FloatingTrustBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-gray-800/90 backdrop-blur-md rounded-full px-4 py-2 border border-gray-700 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium text-white">Privacy First</span>
        </div>
        <div className="w-px h-4 bg-gray-600" />
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">4.9</span>
        </div>
        <div className="w-px h-4 bg-gray-600" />
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">10K+</span>
        </div>
      </div>
    </motion.div>
  )
}