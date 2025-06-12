'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NarrativeLines = [
  "Intelligence. Reimagined.",
  "Private. Powerful. Personal.",
  "Your mind. Amplified."
]

const DataScintillations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            delay: Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

const MinimalEffects = () => {
  return null
}

const VisualElements = () => {
  return (
    <div id="visual-elements" className="absolute inset-0 pointer-events-none">
      <DataScintillations />
    </div>
  )
}

const NarrativeText = () => {
  const [currentLine, setCurrentLine] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev < NarrativeLines.length - 1) {
          return prev + 1
        } else {
          setIsComplete(true)
          return prev
        }
      })
    }, 2500)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div className="text-center max-w-4xl px-8">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentLine}
            className="text-3xl md:text-5xl font-semibold tracking-tight text-white"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
          >
            {NarrativeLines[currentLine]}
          </motion.h1>
        </AnimatePresence>
        
        {isComplete && (
          <motion.div
            className="mt-12 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.button
              className="px-8 py-3 bg-white text-black rounded-full font-medium text-sm tracking-wide hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request Access
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export const AwakeningScene = () => {
  const [glassReady, setGlassReady] = useState(false)
  
  useEffect(() => {
    // Initialize the glass container after a brief moment
    const timer = setTimeout(() => setGlassReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* The Primordial Canvas - horizon.jpg background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/horizon_4k.png)',
          filter: 'blur(8px) saturate(1.2) brightness(0.3) contrast(1.1)',
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* The Obsidian Looking Glass - Prologue Container */}
      <AnimatePresence>
        {glassReady && (
          <motion.div
            id="prologue-container"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div
              className="relative w-full max-w-5xl mx-auto p-16 rounded-2xl"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px) saturate(100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: `
                  0 25px 50px rgba(0, 0, 0, 0.25)
                `,
              }}
            >
              {/* The Phantoms in the Machine - Visual Elements Layer */}
              <VisualElements />
              
              {/* Narrative Text */}
              <NarrativeText />
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
