// Sexy Wave System - 72H Protocol V4: Scarcity as Desire
// Making the 8-wave system irresistibly exclusive

'use client'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { WAVES } from '@/lib/wave-management'
import { useRealtimeWaves } from '@/lib/realtime-waves'

export function SexyWaveSystem() {
  const [hoveredWave, setHoveredWave] = useState<number | null>(null)
  const [selectedWave, setSelectedWave] = useState<number | null>(null)
  const { waveData } = useRealtimeWaves()
  const { scrollYProgress } = useScroll()
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200])

  // Find current active wave
  const currentWaveIndex = waveData ? WAVES.findIndex(w => w.tier === waveData.tier) : 0
  const currentWave = WAVES[currentWaveIndex]

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-20">
      
      {/* Parallax background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        {/* Mystical wave patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="waves" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 100 Q 50 50 100 100 T 200 100" stroke="rgba(139, 92, 246, 0.5)" fill="none" strokeWidth="2"/>
              <path d="M0 150 Q 50 100 100 150 T 200 150" stroke="rgba(236, 72, 153, 0.5)" fill="none" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Sexy header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h2 
            className="text-6xl md:text-7xl font-thin text-white mb-6"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #fff, #8b5cf6, #ec4899, #fff)',
              backgroundSize: '200% 100%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            8 Waves. One Journey.
          </motion.h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Each wave is a moment in time. A price locked forever. A community that believes.
            <br />
            <span className="text-white/80">Which wave will claim you?</span>
          </p>
        </motion.div>

        {/* Current wave spotlight */}
        <motion.div
          className="mb-20 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 blur-3xl" />
          
          <div className="relative bg-black/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-12 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.5, 1]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <motion.div 
                className="text-8xl mb-6"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {currentWave?.icon}
              </motion.div>
              
              <h3 className="text-4xl font-light text-white mb-3">
                {currentWave?.name} is calling
              </h3>
              
              <p className="text-2xl text-purple-400 mb-6">
                Only {waveData ? waveData.totalSeats - waveData.currentSeats : '?'} souls remaining
              </p>

              <div className="flex items-center justify-center gap-8 mb-8">
                <div>
                  <div className="text-5xl font-thin text-white">
                    €{currentWave?.priceMonthly}
                  </div>
                  <div className="text-white/60">per month</div>
                </div>
                
                <div className="w-px h-16 bg-white/20" />
                
                <div>
                  <div className="text-3xl font-thin text-purple-400">
                    {currentWave?.lockYears === 3 ? 'Forever' : `${currentWave?.lockYears} years`}
                  </div>
                  <div className="text-white/60">price locked</div>
                </div>
              </div>

              <motion.button
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/signup'}
              >
                Claim Your Seat
              </motion.button>

              {/* Live activity feed */}
              {waveData && waveData.recentSignups && waveData.recentSignups.length > 0 && (
                <motion.div
                  className="mt-8 text-sm text-white/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {waveData.recentSignups[0].firstName || 'Someone'} just joined 
                    {waveData.recentSignups[0].location && ` from ${waveData.recentSignups[0].location}`}
                  </motion.span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sexy wave timeline */}
        <div className="relative mb-20">
          
          {/* Connection line */}
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          
          {/* Wave cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WAVES.slice(0, 8).map((wave, index) => {
              const isActive = index === currentWaveIndex
              const isPast = index < currentWaveIndex
              const isFuture = index > currentWaveIndex
              const isHovered = hoveredWave === index
              
              return (
                <motion.div
                  key={wave.tier}
                  className="relative"
                  onMouseEnter={() => setHoveredWave(index)}
                  onMouseLeave={() => setHoveredWave(null)}
                  onClick={() => setSelectedWave(index)}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Wave card */}
                  <motion.div
                    className={`relative p-6 rounded-2xl border backdrop-blur-sm cursor-pointer overflow-hidden ${
                      isActive ? 'bg-purple-900/20 border-purple-500' :
                      isPast ? 'bg-gray-900/20 border-gray-700' :
                      'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    animate={isActive ? {
                      borderColor: ['rgb(139 92 246)', 'rgb(236 72 153)', 'rgb(139 92 246)']
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {/* Hover glow */}
                    <AnimatePresence>
                      {isHovered && !isPast && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-4xl mb-3">{wave.icon}</div>
                      <h4 className={`text-lg font-medium mb-1 ${
                        isActive ? 'text-purple-400' : 
                        isPast ? 'text-gray-500' : 
                        'text-white'
                      }`}>
                        {wave.name}
                      </h4>
                      <p className="text-sm text-white/60 mb-3">
                        {wave.maxSeats > 1000000 ? '∞' : wave.maxSeats} seats
                      </p>
                      <div className={`text-2xl font-light ${
                        isActive ? 'text-purple-300' : 
                        isPast ? 'text-gray-600' : 
                        'text-white/80'
                      }`}>
                        €{wave.priceMonthly}
                      </div>
                      
                      {/* Status badge */}
                      {isPast && (
                        <motion.div 
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          CLOSED
                        </motion.div>
                      )}
                      
                      {isActive && (
                        <motion.div 
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          LIVE NOW
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Selected wave details */}
        <AnimatePresence>
          {selectedWave !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-light text-white mb-2">
                      {WAVES[selectedWave].name}
                    </h3>
                    <p className="text-white/60">
                      {WAVES[selectedWave].description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedWave(null)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Benefits grid - sexy presentation */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {WAVES[selectedWave].benefits.slice(0, 6).map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="text-purple-400 mt-1">✦</span>
                      <span className="text-white/80">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                {selectedWave >= currentWaveIndex && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={() => window.location.href = '/signup'}
                      className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors"
                    >
                      {selectedWave === currentWaveIndex ? 'Join This Wave' : 'Reserve Your Future Spot'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Philosophy section - make scarcity sexy */}
        <motion.div
          className="mt-32 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-thin text-white mb-8">
            Why waves? Because timing is everything.
          </h3>
          
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
            <p>
              Those who see the future before others are rewarded.
              Not with discounts. With <span className="text-purple-400">permanence</span>.
            </p>
            <p>
              Your wave price isn't just locked. It's carved in digital stone.
              While others pay tomorrow's price, you pay yesterday's.
            </p>
            <p>
              <span className="text-pink-400">Forever.</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}