'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Sparkles } from 'lucide-react'

// Agent Eta: Launch Party Architect - Jobs Magical Complexity + Nolan Orchestration
interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function LaunchPartyCountdown() {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  
  // Launch party date: June 5, 2025 at 9:00 AM PST (Genesis Wave Opening)
  const launchDate = new Date('2025-06-05T09:00:00-08:00')

  useEffect(() => {
    setMounted(true)
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = launchDate.getTime() - now
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return <div className="h-screen" /> // Prevent hydration mismatch
  }

  const isLive = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-deep-navy via-surface-dark to-canvas-deep-navy overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-interactive/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-interactive/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-luxury-platinum/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">

          {/* Pre-Launch vs Live Content */}
          <AnimatePresence mode="wait">
            {!isLive ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 1 }}
              >
                {/* Event Title */}
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-interactive mr-3" />
                    <span className="font-sans text-callout text-interactive font-medium tracking-wide uppercase">
                      Genesis Wave Launch Party
                    </span>
                    <Sparkles className="w-8 h-8 text-interactive ml-3" />
                  </div>
                  <h1 className="font-serif text-profound md:text-epic font-normal text-text-primary mb-6 leading-tight">
                    Consciousness Technology
                    <br />
                    <span className="text-interactive">Unveiled</span>
                  </h1>
                  <p className="font-sans text-large-body text-text-secondary max-w-3xl mx-auto leading-relaxed">
                    Join us for the exclusive launch of Arkana's Genesis Wave. 
                    The first 100 consciousness pioneers get lifetime access to the future.
                  </p>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                  className="mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Minutes', value: timeLeft.minutes },
                      { label: 'Seconds', value: timeLeft.seconds },
                    ].map((time, index) => (
                      <motion.div
                        key={time.label}
                        className="bg-surface-dark/60 border border-luxury-platinum/10 rounded-large p-8 backdrop-blur-sm"
                        whileHover={{ scale: 1.05, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          className="font-mono text-profound md:text-epic font-bold text-interactive mb-2"
                          key={time.value} // Re-render on value change for animation
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {time.value.toString().padStart(2, '0')}
                        </motion.div>
                        <div className="font-sans text-callout text-text-secondary uppercase tracking-wide">
                          {time.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Event Details */}
                <motion.div
                  className="grid md:grid-cols-3 gap-8 mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <div className="text-center p-6 bg-surface-dark/40 border border-luxury-platinum/10 rounded-large backdrop-blur-sm">
                    <Calendar className="w-8 h-8 text-interactive mx-auto mb-4" />
                    <h3 className="font-serif text-large-title font-normal text-text-primary mb-2">
                      June 5, 2025
                    </h3>
                    <p className="font-sans text-body text-text-secondary">
                      Genesis Wave Opening
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-surface-dark/40 border border-luxury-platinum/10 rounded-large backdrop-blur-sm">
                    <Clock className="w-8 h-8 text-interactive mx-auto mb-4" />
                    <h3 className="font-serif text-large-title font-normal text-text-primary mb-2">
                      9:00 AM PST
                    </h3>
                    <p className="font-sans text-body text-text-secondary">
                      Live Stream Event
                    </p>
                  </div>
                  
                  <div className="text-center p-6 bg-surface-dark/40 border border-luxury-platinum/10 rounded-large backdrop-blur-sm">
                    <Users className="w-8 h-8 text-interactive mx-auto mb-4" />
                    <h3 className="font-serif text-large-title font-normal text-text-primary mb-2">
                      100 Spots
                    </h3>
                    <p className="font-sans text-body text-text-secondary">
                      €25/month for 100 years
                    </p>
                  </div>
                </motion.div>

                {/* Registration CTA */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <div className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-interactive/10 to-luxury-platinum/10 border border-interactive/20 rounded-large backdrop-blur-sm">
                    <h3 className="font-serif text-presence font-normal text-text-primary mb-6">
                      Reserve Your Genesis Wave Spot
                    </h3>
                    <p className="font-sans text-large-body text-text-secondary leading-relaxed mb-8">
                      Be among the first 100 consciousness pioneers. Lock in the Genesis price 
                      and shape the future of human-AI interaction.
                    </p>
                    <motion.button
                      className="font-sans px-12 py-4 bg-interactive text-luxury-pristine-white rounded-circular font-medium text-large-body tracking-wide hover:bg-interactive-hover transition-all duration-200 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const waitlistElement = document.getElementById('waitlist');
                        if (waitlistElement) {
                          waitlistElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                    >
                      Join the Genesis Wave
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="live"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Live Event Content */}
                <div className="text-center">
                  <motion.div
                    className="inline-flex items-center px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-full mb-8"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
                    <span className="font-sans text-callout text-red-400 font-medium uppercase tracking-wide">
                      Live Now
                    </span>
                  </motion.div>
                  
                  <h1 className="font-serif text-profound md:text-epic font-normal text-text-primary mb-8">
                    Genesis Wave is <span className="text-interactive">Live</span>
                  </h1>
                  
                  <motion.button
                    className="font-sans px-12 py-4 bg-interactive text-luxury-pristine-white rounded-circular font-medium text-large-body tracking-wide hover:bg-interactive-hover transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enter the Genesis Wave
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}