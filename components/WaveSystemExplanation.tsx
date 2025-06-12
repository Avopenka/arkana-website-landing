// Wave System Explanation - UX Council Emergency Fix
// Clear visualization of Arkana's 8-wave launch system

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { WAVES } from '@/lib/wave-management'
import { useRealtimeWaves } from '@/lib/realtime-waves'

export function WaveSystemExplanation() {
  const [selectedWave, setSelectedWave] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const { waveData } = useRealtimeWaves()

  // Find current active wave
  const currentWaveIndex = waveData ? WAVES.findIndex(w => w.tier === waveData.tier) : 0

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-20">
      
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
      
      {/* Consciousness grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-thin text-white mb-6 tracking-wide">
            The 8-Wave Launch System
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Arkana launches in 8 progressive waves, each with limited seats and lifetime pricing. 
            Early believers get the best prices, locked forever.
          </p>
        </motion.div>

        {/* Wave Timeline Visualization */}
        <div className="relative mb-20">
          
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent transform -translate-y-1/2" />
          
          {/* Wave Nodes */}
          <div className="relative grid grid-cols-4 md:grid-cols-8 gap-4">
            {WAVES.map((wave, index) => {
              const isActive = index === currentWaveIndex
              const isPast = index < currentWaveIndex
              const isFuture = index > currentWaveIndex
              
              return (
                <motion.div
                  key={wave.tier}
                  className="relative cursor-pointer"
                  onClick={() => {
                    setSelectedWave(index)
                    setShowDetails(true)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Wave Node */}
                  <motion.div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl relative ${
                      isActive ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl shadow-purple-500/50' :
                      isPast ? 'bg-gray-800 opacity-50' :
                      'bg-gradient-to-br from-gray-800 to-gray-700 hover:from-purple-900 hover:to-purple-800'
                    }`}
                    animate={isActive ? {
                      boxShadow: [
                        '0 0 20px rgba(147, 51, 234, 0.5)',
                        '0 0 40px rgba(147, 51, 234, 0.8)',
                        '0 0 20px rgba(147, 51, 234, 0.5)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {wave.icon}
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-purple-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    
                    {/* Sold Out Badge */}
                    {isPast && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        FULL
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Wave Details */}
                  <div className="text-center mt-3">
                    <h4 className={`text-sm font-medium ${
                      isActive ? 'text-purple-400' : 
                      isPast ? 'text-gray-600' : 
                      'text-white/60'
                    }`}>
                      {wave.name}
                    </h4>
                    <p className={`text-xs mt-1 ${
                      isActive ? 'text-white' : 'text-white/40'
                    }`}>
                      {wave.maxSeats > 1000000 ? '∞' : wave.maxSeats} seats
                    </p>
                    <p className={`text-xs font-medium ${
                      isActive ? 'text-purple-400' : 
                      isPast ? 'text-gray-600' : 
                      'text-white/60'
                    }`}>
                      ${wave.priceMonthly}/mo
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Current Wave Highlight */}
        {waveData && (
          <motion.div
            className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <h3 className="text-2xl font-light text-white mb-2">
                  Current Wave: {WAVES[currentWaveIndex]?.name || 'Genesis'}
                </h3>
                <p className="text-white/60">
                  {waveData.currentSeats} of {waveData.totalSeats} seats filled
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-light text-purple-400">
                  ${WAVES[currentWaveIndex]?.priceMonthly || 25}/month
                </div>
                <div className="text-sm text-white/60">
                  Locked for {WAVES[currentWaveIndex]?.lockYears || 100} years
                </div>
              </div>
              
              <motion.button
                className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/signup'}
              >
                Join {WAVES[currentWaveIndex]?.name || 'Genesis'} Wave
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Detailed Wave Information */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{WAVES[selectedWave].icon}</div>
                    <div>
                      <h3 className="text-2xl font-light text-white">
                        {WAVES[selectedWave].name}
                      </h3>
                      <p className="text-white/60 mt-1">
                        {WAVES[selectedWave].description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Pricing & Details */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Wave Details</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Monthly Price</span>
                        <span className="text-white font-medium">
                          ${WAVES[selectedWave].priceMonthly}/month
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Annual Price</span>
                        <span className="text-white font-medium">
                          ${WAVES[selectedWave].priceAnnual}/year
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Price Lock</span>
                        <span className="text-purple-400 font-medium">
                          {WAVES[selectedWave].lockYears} years guaranteed
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/60">Total Seats</span>
                        <span className="text-white font-medium">
                          {WAVES[selectedWave].maxSeats > 1000000 ? 'Unlimited' : WAVES[selectedWave].maxSeats}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Benefits</h4>
                    
                    <ul className="space-y-2">
                      {WAVES[selectedWave].benefits.map((benefit, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start gap-3 text-white/80"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-purple-400 mt-1">✦</span>
                          <span className="text-sm">{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Wave-specific message */}
                <motion.div
                  className="mt-8 p-6 bg-purple-500/10 rounded-xl border border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-white/80 text-center">
                    {selectedWave === 0 ? 
                      "The Codex is for true believers who see the future before it arrives." :
                    selectedWave === 7 ?
                      "General Access ensures everyone can experience consciousness technology." :
                    `Join ${WAVES[selectedWave].name} and lock in your price for ${WAVES[selectedWave].lockYears} years.`
                    }
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Why Waves Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-3xl font-light text-white mb-8">Why the Wave System?</h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: '💎',
                title: 'Reward Early Believers',
                description: 'Those who believe first get the best prices, locked forever.'
              },
              {
                icon: '🔒',
                title: 'Price Protection',
                description: 'Your wave price is guaranteed for years, no matter how we grow.'
              },
              {
                icon: '🚀',
                title: 'Quality Community',
                description: 'Limited seats per wave ensure a high-quality, engaged community.'
              }
            ].map((reason, index) => (
              <motion.div
                key={reason.title}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                <div className="text-3xl mb-4">{reason.icon}</div>
                <h4 className="text-lg font-medium text-white mb-2">{reason.title}</h4>
                <p className="text-white/60 text-sm">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}