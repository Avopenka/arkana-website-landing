'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ArkanaAuthV11 from '../components/ArkanaAuthV11'
import { CinematicLoader } from '../components/CinematicLoader'
import ArkanaLockScreen from '../components/ArkanaLockScreen'

// Import all the sections for authenticated users
import LuxuryNavigation from '../components/LuxuryNavigation'
import StateOfArtHeroSection from '../components/StateOfArtHeroSection'
import LuxuryFeatureSection from '../components/LuxuryFeatureSection'
import ProblemSolutionSection from '../components/ProblemSolutionSection'
import HowItWorksSection from '../components/HowItWorksSection'
import PrivacySection from '../components/PrivacySection'
import ScreensCarouselSection from '../components/ScreensCarouselSection'
import ThreeStepIntro from '../components/ThreeStepIntro'
import Official8WavesPricingSection from '../components/Official8WavesPricingSection'
import FounderSection from '../components/FounderSection'
import { TestimonialsAuthentic } from '../components/TrustBuilding'
import WaitlistSection from '../components/WaitlistSection'
import Footer from '../components/Footer'
import { ScrollCinema } from '../components/ScrollCinema'
import TemporalMysteries from '../components/TemporalMysteries'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showCinematic, setShowCinematic] = useState(false)
  const [showLockScreen, setShowLockScreen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authData, setAuthData] = useState<{position?: number, answers?: string[]}>({})

  // Sophisticated loading sequence: Logo → Cinematic → Lock Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowCinematic(true)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleCinematicComplete = () => {
    setShowCinematic(false)
    setShowLockScreen(true)
  }

  const handleShowAuth = () => {
    setShowAuth(true)
  }

  const handleAuthenticated = () => {
    setShowAuth(false)
    setShowLockScreen(false)
    setIsAuthenticated(true)
  }

  const handleLockScreenAccess = () => {
    setShowLockScreen(false)
    setIsAuthenticated(true)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loader"
            className="fixed inset-0 z-[9997] flex items-center justify-center bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32"
            >
              <Image 
                src="/MainLogoENoNameNoBackGround.png" 
                alt="Arkana" 
                fill
                className="object-contain animate-pulse"
                priority
              />
            </motion.div>
          </motion.div>
        ) : showCinematic ? (
          <CinematicLoader 
            onComplete={handleCinematicComplete} 
            skipEnabled={true}
          />
        ) : showLockScreen ? (
          <ArkanaLockScreen 
            onAccess={handleLockScreenAccess}
            onShowAuth={(position, answers) => {
              setAuthData({ position, answers })
              setShowAuth(true)
            }}
          />
        ) : isAuthenticated ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Global luxury background */}
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black" />
              
              {/* Premium glow effect */}
              <motion.div 
                className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-3xl"
                animate={{
                  backgroundColor: 'rgba(0, 255, 255, 0.03)'
                }}
                transition={{ duration: 3 }}
              />
              
              {/* Neural grid overlay */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, #00ffff 0px, transparent 1px, transparent 50px, #00ffff 51px),
                    repeating-linear-gradient(90deg, #ffb000 0px, transparent 1px, transparent 50px, #ffb000 51px)
                  `,
                }}
              />
            </div>

            {/* Main Content - Public Access */}
            <div className="relative z-10">
              <LuxuryNavigation onShowAuth={handleShowAuth} />
              <StateOfArtHeroSection />
              
              {/* Cinematic scroll experience */}
              <ScrollCinema className="min-h-[300vh]">
                <ThreeStepIntro />
                <ProblemSolutionSection />
                <LuxuryFeatureSection />
              </ScrollCinema>
              <HowItWorksSection />
              <PrivacySection />
              <ScreensCarouselSection />
              <Official8WavesPricingSection onShowAuth={handleShowAuth} />
              <TestimonialsAuthentic />
              <FounderSection />
              <WaitlistSection onShowAuth={handleShowAuth} />
              <Footer />
            </div>
            
            {/* Temporal Mysteries Overlay */}
            <TemporalMysteries />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Authentication Modal - Only when user wants to sign up or purchase */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              className="relative max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAuth(false)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ArkanaAuthV11 
                onAuthenticated={handleAuthenticated} 
                initialData={authData}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}