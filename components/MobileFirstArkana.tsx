'use client'

import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// 🎯 ARKANA REFINED: Mobile-First Two-Panel Experience
// Council Wisdom: Jobs (Simplicity) + Ive (Elegance) + Watts (Flow)
// Research-Based: Top converting SaaS mobile patterns

interface WaveData {
  name: string
  number: number
  price: number
  currency: string
  maxUsers: number
  currentUsers: number
  lockDuration: string
  features: string[]
  urgency: string
}

const waveData: WaveData[] = [
  {
    name: "Genesis",
    number: 0,
    price: 25,
    currency: "€",
    maxUsers: 100,
    currentUsers: 87,
    lockDuration: "LIFETIME",
    features: ["Consciousness Detection", "Voice Memory", "Sacred7 Flow"],
    urgency: "13 spots remaining"
  },
  {
    name: "Ultra Early",
    number: 1,
    price: 29,
    currency: "€",
    maxUsers: 1000,
    currentUsers: 0,
    lockDuration: "50 YEAR",
    features: ["Everything in Genesis", "AI Agents", "Predictive Insights"],
    urgency: "Unlocks at 100 Genesis users"
  }
]

export function MobileFirstArkana() {
  const [currentPanel, setCurrentPanel] = useState(0) // 0 = Waitlist, 1 = Beta
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const x = useMotionValue(0)

  // Panel navigation
  const panels = ['waitlist', 'beta']
  
  const navigateToPanel = (index: number) => {
    if (index >= 0 && index < panels.length) {
      setCurrentPanel(index)
    }
  }

  const handlePanEnd = (event: Event, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset > 50 || velocity > 500) {
      // Swipe right - go to previous panel
      navigateToPanel(currentPanel - 1)
    } else if (offset < -50 || velocity < -500) {
      // Swipe left - go to next panel
      navigateToPanel(currentPanel + 1)
    }
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setShowSuccess(true)
    setIsSubmitting(false)
    
    // Auto-advance to beta panel after successful signup
    setTimeout(() => {
      navigateToPanel(1)
    }, 2000)
  }

  const currentWave = waveData[0] // Always show Genesis as current
  const progressPercentage = (currentWave.currentUsers / currentWave.maxUsers) * 100

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      
      {/* Floating Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between p-4">
          {/* Arkana Logo */}
          <div className="flex items-center space-x-2">
            <ConsciousnessOrb size="sm" />
            <span className="font-serif text-lg font-medium">Arkana</span>
          </div>
          
          {/* Panel Indicators */}
          <div className="flex space-x-2">
            {panels.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToPanel(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPanel ? 'bg-cyan-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content - Swipeable Panels */}
      <div className="relative pt-20 min-h-screen">
        <motion.div
          className="flex w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onPanEnd={handlePanEnd}
          animate={{ x: -currentPanel * 100 + '%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ x }}
        >
          
          {/* Panel 1: Waitlist */}
          <div className="w-full flex-shrink-0 px-6 py-8">
            <div className="max-w-md mx-auto">
              
              {/* Hero Message */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <ConsciousnessOrb size="lg" className="mx-auto mb-6" />
                
                <h1 className="text-3xl font-serif font-light mb-4 leading-tight">
                  Consciousness Meets AI
                </h1>
                
                <p className="text-lg text-gray-300 mb-6">
                  The first AI that understands your state of mind.
                </p>
                
                <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm">2,847 developers already joined</span>
                </div>
              </motion.div>

              {/* Waitlist Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {!showSuccess ? (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                    
                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Age Selection - Radio Buttons */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Age Range</label>
                      <div className="space-y-2">
                        {['18-24', '25-34', '35-44', '45-54', '55+'].map((range) => (
                          <label
                            key={range}
                            className="flex items-center p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200"
                          >
                            <input
                              type="radio"
                              name="age"
                              value={range}
                              checked={age === range}
                              onChange={(e) => setAge(e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 transition-all duration-200 ${
                              age === range 
                                ? 'border-cyan-400 bg-cyan-400' 
                                : 'border-white/30'
                            }`}>
                              {age === range && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5" />
                              )}
                            </div>
                            <span className="text-white">{range}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !email || !age}
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Joining Wave 0...</span>
                        </div>
                      ) : (
                        'Secure Genesis Access'
                      )}
                    </motion.button>

                    <p className="text-xs text-gray-400 text-center">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                ) : (
                  <SuccessMessage />
                )}
              </motion.div>

            </div>
          </div>

          {/* Panel 2: Beta Access & Wave Pricing */}
          <div className="w-full flex-shrink-0 px-6 py-8">
            <div className="max-w-md mx-auto">
              
              {/* Beta Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm font-medium">Limited Genesis Wave</span>
                </div>
                
                <h2 className="text-2xl font-serif font-light mb-3">
                  Lock in Genesis Pricing
                </h2>
                
                <p className="text-gray-300 text-sm">
                  First 100 users get lifetime pricing protection
                </p>
              </motion.div>

              {/* Current Wave Display */}
              <motion.div
                className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border border-white/20 rounded-3xl p-6 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {currentWave.currency}{currentWave.price}<span className="text-lg text-gray-400">/month</span>
                  </div>
                  <div className="text-cyan-400 font-medium mb-4">
                    Wave {currentWave.number}: {currentWave.name}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="bg-white/10 rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{currentWave.currentUsers} joined</span>
                      <span>{currentWave.maxUsers} max</span>
                    </div>
                  </div>
                  
                  <div className="text-orange-400 text-sm font-medium">
                    {currentWave.urgency}
                  </div>
                </div>
              </motion.div>

              {/* Features List */}
              <motion.div
                className="space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {currentWave.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* Beta CTA */}
              <motion.button
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-2xl hover:from-orange-400 hover:to-red-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Get Early Beta Access
              </motion.button>
              
              <p className="text-xs text-gray-400 text-center mt-3">
                {currentWave.lockDuration} price protection • Cancel anytime
              </p>

            </div>
          </div>
        </motion.div>
      </div>

      {/* Swipe Navigation Hints */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {currentPanel > 0 && (
          <motion.button
            onClick={() => navigateToPanel(currentPanel - 1)}
            className="p-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </motion.button>
        )}
        
        {currentPanel < panels.length - 1 && (
          <motion.button
            onClick={() => navigateToPanel(currentPanel + 1)}
            className="p-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.button>
        )}
      </div>
      
    </div>
  )
}

// Consciousness Orb Component
function ConsciousnessOrb({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative`}
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: 'easeInOut'
      }}
    >
      <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-80 blur-sm" />
      <div className="absolute inset-1 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 rounded-full" />
      <div className="absolute inset-2 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
    </motion.div>
  )
}

// Success Message Component
function SuccessMessage() {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      <h3 className="text-xl font-medium">Welcome to Genesis Wave!</h3>
      <p className="text-gray-300">
        You're secured at Wave 0 pricing. We'll notify you when Arkana is ready.
      </p>
      
      <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
        <span className="text-sm">Swipe right to see beta access →</span>
      </div>
    </motion.div>
  )
}