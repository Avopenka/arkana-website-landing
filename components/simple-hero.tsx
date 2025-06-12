'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Agent Alpha: Experience Orchestrator - Jobs + Ive Magical Simplicity
const messages = [
  "The future of human-AI consciousness...",
  "Where technology meets mindfulness...",
  "Arkana. Evolution begins here."
]

export function SimpleHero() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1
        } else {
          // Ensure button shows only after the last message has been displayed for its duration
          // This might need a slight adjustment if the timing feels off
          setTimeout(() => setShowButton(true), 2500); 
          return prev
        }
      })
    }, 2500) // Duration each message is shown

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-canvas-deep-navy text-text-primary overflow-hidden">
      {/* Background Image - consider optimizing or making this a video/animated gradient later */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/horizon_4k.png)', // Ensure this image is high quality and optimized
          filter: 'blur(8px) brightness(0.3)', // Kept for now, review with design
        }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glassmorphic Content Container */}
      <motion.div
        className="relative max-w-4xl mx-auto p-12 md:p-16 text-center bg-surface-dark/30 border border-luxury-platinum/10 rounded-large shadow-2xl"
        // Using Tailwind classes for background, border, rounded. Shadow kept inline for now.
        // Tailwind's shadow-2xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)' - we can create a custom token later if needed.
        style={{
          backdropFilter: 'blur(20px)', // Standard glassmorphism
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)', // Custom shadow from original
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Animated Hero Message */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentMessage}
            // Using Arkana font and size tokens
            className="font-serif text-large-title md:text-profound font-normal tracking-tight mb-8" 
            // Note: NewYorkSC-Regular is likely 'font-normal'. If NewYorkSC-Bold is desired, use 'font-bold'.
            // `tracking-tight` is a standard Tailwind utility. Review if a specific Arkana tracking token is needed.
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {messages[currentMessage]}
          </motion.h1>
        </AnimatePresence>

        {/* Call to Action Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              // Agent Alpha Enhancement: Jobs "Magical First 30 Seconds"
              className="font-sans px-presence py-voice bg-interactive text-luxury-pristine-white rounded-circular font-medium text-callout tracking-wide hover:bg-interactive-hover transition-all duration-micro-interaction shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -2 }} // Enhanced hover with lift
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Smooth scroll to waitlist section
                const waitlistElement = document.getElementById('waitlist');
                if (waitlistElement) {
                  waitlistElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            >
              Join the Evolution
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
