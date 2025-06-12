'use client'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
// 🎨 REFINED ELEGANT EXPERIENCE - Artist & Design Council Enhancement
// Lead Masters: Ive (Design Soul) + Jobs (Perfection) + Vopěnka (Aesthetic Philosophy)
// Mission: Elevate elegant experience to transcendent design excellence
interface HeroVariation {
  id: string
  title: string
  subtitle: string
  weight: number
  category: 'profound' | 'technical' | 'balanced'
  gradient: string
}
const heroVariations: HeroVariation[] = [
  {
    id: 'amplify',
    title: 'Amplify Your Natural Intelligence',
    subtitle: 'AI that understands context, preserves memory, and evolves with you',
    weight: 25,
    category: 'profound',
    gradient: 'from-indigo-600/10 via-purple-600/10 to-pink-600/10'
  },
  {
    id: 'memory',
    title: 'Your Memory, Infinitely Organized',
    subtitle: 'Never lose a thought. Every insight connected. All processing on-device.',
    weight: 20,
    category: 'technical',
    gradient: 'from-cyan-600/10 via-blue-600/10 to-indigo-600/10'
  },
  {
    id: 'companion',
    title: 'An AI Companion That Actually Gets You',
    subtitle: 'Context-aware intelligence that learns your patterns and amplifies your potential',
    weight: 25,
    category: 'balanced',
    gradient: 'from-emerald-600/10 via-teal-600/10 to-cyan-600/10'
  },
  {
    id: 'unlock',
    title: 'Unlock 100x Potential Through AI',
    subtitle: 'Transform how you think, work, and create with consciousness-aware technology',
    weight: 15,
    category: 'profound',
    gradient: 'from-amber-600/10 via-orange-600/10 to-red-600/10'
  },
  {
    id: 'private',
    title: 'Private AI That Runs Entirely On Your Device',
    subtitle: 'No cloud. No tracking. Just pure intelligence at your fingertips.',
    weight: 15,
    category: 'technical',
    gradient: 'from-gray-600/10 via-gray-700/10 to-gray-800/10'
  }
]
const philosophicalQuestions = [
  "What if AI could understand not just your words, but your context?",
  "What becomes possible when your digital memory never forgets?",
  "How might your potential expand with truly intelligent assistance?",
  "What if privacy and intelligence weren't mutually exclusive?",
  "What would you create with 100x your current capacity?"
]
export function RefinedElegantExperience() {
  const [currentHero, setCurrentHero] = useState(heroVariations[0])
  const [showPhilosophy, setShowPhilosophy] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showSplitScreen, setShowSplitScreen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<'beta' | 'waitlist' | null>(null)
  const { scrollY } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  // Parallax effects
  const orbY = useTransform(scrollY, [0, 500], [0, 150])
  const orbScale = useTransform(scrollY, [0, 500], [1, 0.8])
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10])
  // Intelligent hero rotation with analytics
  useEffect(() => {
    const selectHero = async () => {
      const timestamp = new Date().toISOString()
      const userId = localStorage.getItem('arkana_visitor_id') || Math.random().toString(36).substr(2, 9)
      localStorage.setItem('arkana_visitor_id', userId)
      const totalWeight = heroVariations.reduce((sum, h) => sum + h.weight, 0)
      let random = Math.random() * totalWeight
      for (const hero of heroVariations) {
        random -= hero.weight
        if (random <= 0) {
          setCurrentHero(hero)
          localStorage.setItem(`hero_shown_${timestamp}`, hero.id)
          // Track hero view
          try {
            await fetch('/api/analytics/hero-tracking', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                heroId: hero.id,
                visitorId: userId,
                timestamp,
                event: 'view'
              })
            })
          } catch (error) {
          }
          break
        }
      }
    }
    selectHero()
  }, [])
  // Smooth question rotation
  useEffect(() => {
    if (!showPhilosophy) return
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % philosophicalQuestions.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [showPhilosophy])
  const handleDiscover = () => {
    setShowPhilosophy(false)
    setTimeout(() => {
      heroRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
  const handlePathSelection = (path: 'beta' | 'waitlist') => {
    setSelectedPath(path)
    setShowSplitScreen(false)
  }
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Refined Header with Blur Effect */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          backdropFilter: `blur(${headerBlur}px)`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo with refined animation */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="w-10 h-10 relative">
              <Image
                src="/MainLogoENoNameNoBackGround.png"
                alt="Arkana"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-light text-xl tracking-wider">Arkana</span>
          </motion.div>
          {/* Refined Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Philosophy', 'Technology', 'Privacy'].map((item) => (
              <motion.button
                key={item}
                className="text-gray-600 hover:text-gray-900 transition-colors relative"
                whileHover={{ y: -2 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px bg-gray-900"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
            <motion.button 
              className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-light tracking-wide"
              whileHover={{ scale: 1.05, backgroundColor: '#1f2937' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Get Early Access
            </motion.button>
          </nav>
        </div>
      </motion.header>
      {/* Main Content */}
      <main className="pt-20">
        {/* Enhanced Philosophical Introduction */}
        <AnimatePresence mode="wait">
          {showPhilosophy && (
            <motion.section
              key="philosophy"
              className="min-h-screen flex items-center justify-center px-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
              <div className="max-w-4xl text-center relative z-10">
                {/* Enhanced TAM YIKAM Orb with parallax */}
                <motion.div
                  className="w-36 h-36 mx-auto mb-16"
                  style={{ y: orbY, scale: orbScale }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ 
                      duration: 40,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  >
                    {/* Outer glow */}
                    <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-cyan-400/20 via-teal-400/20 to-cyan-500/20 blur-3xl" />
                    {/* Main orb */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300 to-cyan-600 shadow-2xl">
                      <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-cyan-300/90 to-teal-500/90">
                        {/* Inner details */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-200/50 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-yellow-800/40 font-medium text-sm tracking-[0.2em]">TAM YIKAM</div>
                        </div>
                      </div>
                    </div>
                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
                        animate={{
                          x: [0, Math.random() * 40 - 20, 0],
                          y: [0, Math.random() * 40 - 20, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                        style={{
                          left: `${50 + Math.random() * 30 - 15}%`,
                          top: `${50 + Math.random() * 30 - 15}%`
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
                {/* Enhanced Philosophical Question */}
                <motion.h1
                  key={currentQuestion}
                  className="text-4xl md:text-6xl font-extralight leading-tight mb-16 tracking-wide"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 1 }}
                >
                  {philosophicalQuestions[currentQuestion]}
                </motion.h1>
                {/* Enhanced Discover Button */}
                <motion.button
                  onClick={handleDiscover}
                  className="group relative px-14 py-5 overflow-hidden rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full" />
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 text-white text-lg font-light tracking-wider">
                    Discover
                  </span>
                </motion.button>
                {/* Subtle scroll indicator */}
                <motion.div
                  className="absolute bottom-12 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {/* Enhanced Hero Section */}
        <AnimatePresence mode="wait">
          {!showPhilosophy && !showSplitScreen && !selectedPath && (
            <motion.section
              ref={heroRef}
              key="hero"
              className="min-h-screen flex items-center justify-center px-6 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Dynamic gradient background based on hero */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentHero.gradient}`} />
              <div className="max-w-5xl mx-auto text-center relative z-10">
                {/* Hero content with refined typography */}
                <motion.h1
                  className="text-5xl md:text-7xl font-extralight leading-[1.1] mb-8 tracking-tight"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {currentHero.title.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    >
                      {word}{' '}
                    </motion.span>
                  ))}
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto font-light leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {currentHero.subtitle}
                </motion.p>
                {/* Enhanced CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-5 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.button
                    onClick={async () => {
                      // Track hero click
                      try {
                        await fetch('/api/analytics/hero-tracking', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            heroId: currentHero.id,
                            visitorId: localStorage.getItem('arkana_visitor_id') || 'anonymous',
                            timestamp: new Date().toISOString(),
                            event: 'click'
                          })
                        })
                      } catch (error) {
                      }
                      setShowSplitScreen(true)
                    }}
                    className="group relative px-10 py-4 overflow-hidden rounded-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="relative z-10 text-white text-lg font-light tracking-wide">
                      Get Early Access
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={async () => {
                      // Track hero click
                      try {
                        await fetch('/api/analytics/hero-tracking', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            heroId: currentHero.id,
                            visitorId: localStorage.getItem('arkana_visitor_id') || 'anonymous',
                            timestamp: new Date().toISOString(),
                            event: 'click'
                          })
                        })
                      } catch (error) {
                      }
                      setShowSplitScreen(true)
                    }}
                    className="group px-10 py-4 border-2 border-gray-900 text-gray-900 text-lg rounded-full relative overflow-hidden"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gray-900"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 font-light tracking-wide group-hover:text-white transition-colors">
                      Learn More
                    </span>
                  </motion.button>
                </motion.div>
                {/* Trust indicators */}
                <motion.div
                  className="mt-16 flex items-center justify-center space-x-8 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>On-device processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Privacy first</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>No cloud required</span>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {/* Enhanced Split Screen Experience */}
        <AnimatePresence>
          {showSplitScreen && (
            <RefinedSplitScreen onSelect={handlePathSelection} />
          )}
        </AnimatePresence>
        {/* Selected Path Content */}
        <AnimatePresence>
          {selectedPath === 'beta' && <RefinedBetaExperience />}
          {selectedPath === 'waitlist' && <RefinedWaitlistExperience />}
        </AnimatePresence>
        {/* Enhanced SaaS Content - Available in full version */}
      </main>
    </div>
  )
}
// Refined Split Screen Component
function RefinedSplitScreen({ onSelect }: { onSelect: (path: 'beta' | 'waitlist') => void }) {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return (
    <motion.div
      className="fixed inset-0 z-40 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Beta Access Side - Enhanced */}
      <motion.div
        className="flex-1 bg-gray-900 text-white flex items-center justify-center p-12 cursor-pointer relative overflow-hidden"
        onClick={() => onSelect('beta')}
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
          scale: hoveredSide === 'left' ? 1.02 : hoveredSide === 'right' ? 0.98 : 1,
          backgroundColor: hoveredSide === 'left' ? '#1a1a1a' : '#111827'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                left: `${-100 + i * 50}px`,
                top: `${-100 + i * 50}px`
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extralight mb-6 tracking-wide">Get Early Access</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-md font-light leading-relaxed">
            Join the beta and help shape the future of personal AI. Limited spots available for pioneers.
          </p>
          <motion.div
            className="inline-flex items-center space-x-3 text-gray-400"
            animate={{ x: hoveredSide === 'left' ? 10 : 0 }}
          >
            <span className="text-sm tracking-wider">EXPLORE BETA</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
      {/* Waitlist Side - Enhanced */}
      <motion.div
        className="flex-1 bg-white text-gray-900 flex items-center justify-center p-12 cursor-pointer relative overflow-hidden"
        onClick={() => onSelect('waitlist')}
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
          scale: hoveredSide === 'right' ? 1.02 : hoveredSide === 'left' ? 0.98 : 1,
          backgroundColor: hoveredSide === 'right' ? '#fafafa' : '#ffffff'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-gray-200 to-gray-300"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                right: `${-100 + i * 50}px`,
                bottom: `${-100 + i * 50}px`
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -90, 0]
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-8 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extralight mb-6 tracking-wide">Join Our Waitlist</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md font-light leading-relaxed">
            Be the first to know when Arkana launches. Secure your spot in the future of AI.
          </p>
          <motion.div
            className="inline-flex items-center space-x-3 text-gray-500"
            animate={{ x: hoveredSide === 'right' ? 10 : 0 }}
          >
            <span className="text-sm tracking-wider">LEARN MORE</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
// Refined Beta Experience with API Integration
function RefinedBetaExperience() {
  const [formData, setFormData] = useState({ email: '', useCase: '', device: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Hero tracking
      await fetch('/api/analytics/hero-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroId: 'beta-form',
          visitorId: localStorage.getItem('arkana_visitor_id') || 'anonymous',
          timestamp: new Date().toISOString(),
          event: 'convert',
          conversionPath: 'beta'
        })
      })
      // Create consciousness assessment
      const assessment = {
        device_relationship: formData.device || 'mac',
        awareness_depth: 'high',
        mystery_comfort: 'comfortable'
      }
      const consciousnessScore = 15 // High score for beta applicants
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          assessment,
          consciousnessScore,
          firstName: formData.email.split('@')[0],
          deviceData: { useCase: formData.useCase, device: formData.device }
        })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }
      setSuccess(true)
    } catch (err: unknown) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  if (success) {
    return (
      <motion.section
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-2xl w-full text-center">
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h3 className="text-4xl font-extralight mb-4">Beta Application Submitted!</h3>
          <p className="text-gray-300 mb-8 text-lg font-light">
            We'll review your application and contact you within 24 hours if selected.
          </p>
          <motion.div 
            className="inline-flex items-center space-x-3 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-light">Genesis Wave • Beta Access</span>
          </motion.div>
        </div>
      </motion.section>
    )
  }
  return (
    <motion.section
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-extralight mb-8 text-center tracking-wide">Beta Access Application</h2>
          <p className="text-gray-300 text-center mb-12 font-light text-lg">
            We're selecting a limited number of beta testers who can help shape Arkana's development.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors font-light"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <textarea
                placeholder="Tell us about your use case and why you'd be a great beta tester"
                rows={4}
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors font-light resize-none"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <select 
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors font-light"
              >
                <option value="" className="bg-gray-900">Select your primary device</option>
                <option value="mac" className="bg-gray-900">Mac (M1/M2/M3)</option>
                <option value="iphone" className="bg-gray-900">iPhone 15 Pro/Max</option>
                <option value="ipad" className="bg-gray-900">iPad Pro</option>
              </select>
            </motion.div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              disabled={isLoading || !formData.email || !formData.useCase || !formData.device}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-light tracking-wide hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Apply for Beta Access'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  )
}
// Refined Waitlist Experience with API Integration
function RefinedWaitlistExperience() {
  const [stage, setStage] = useState<'email' | 'details' | 'complete'>('email')
  const [data, setData] = useState({ email: '', role: '', interest: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [waitlistPosition, setWaitlistPosition] = useState(0)
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStage('details')
  }
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Hero tracking
      await fetch('/api/analytics/hero-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroId: 'waitlist-form',
          visitorId: localStorage.getItem('arkana_visitor_id') || 'anonymous',
          timestamp: new Date().toISOString(),
          event: 'convert',
          conversionPath: 'waitlist'
        })
      })
      // Submit to waitlist API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.email.split('@')[0] || 'User',
          lastName: 'User',
          email: data.email,
          ageGroup: '25-34',
          profession: data.role,
          arkanaGoal: data.interest,
          systemInfo: {
            device: 'Mac',
            os: 'macOS',
            browser: 'Chrome',
            ram: '16GB',
            cores: '8',
            compatibility: 'excellent',
            recommendedTier: 'Genesis Wave'
          }
        })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to join waitlist')
      }
      setWaitlistPosition(result.position)
      setStage('complete')
    } catch (err: unknown) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <motion.section
      className="min-h-screen bg-white flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-xl w-full">
        {stage === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-extralight mb-6 text-center tracking-wide">Join the Waitlist</h2>
            <p className="text-gray-600 text-center mb-12 text-lg font-light">
              Be among the first to experience the future of personal AI.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors font-light text-lg"
                  required
                />
              </motion.div>
              <motion.button 
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-light tracking-wide"
                whileHover={{ scale: 1.02, backgroundColor: '#1f2937' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                Continue
              </motion.button>
            </form>
          </motion.div>
        )}
        {stage === 'details' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-light mb-8">Tell us a bit more</h3>
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
                >
                  {error}
                </motion.div>
              )}
              <motion.select 
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors font-light"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
                required
              >
                <option value="">What best describes you?</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="business">Business Professional</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </motion.select>
              <motion.select
                value={data.interest}
                onChange={(e) => setData({ ...data, interest: e.target.value })}
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors font-light"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
                required
              >
                <option value="">Primary interest in Arkana?</option>
                <option value="productivity">Enhanced Productivity</option>
                <option value="memory">Infinite Memory</option>
                <option value="privacy">Privacy-First AI</option>
                <option value="development">AI Development Platform</option>
              </motion.select>
              <motion.button 
                disabled={isLoading || !data.role || !data.interest}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                whileHover={{ scale: isLoading ? 1 : 1.02, backgroundColor: isLoading ? '#111827' : '#1f2937' }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
        {stage === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-center"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <h3 className="text-3xl font-extralight mb-4">You're on the list!</h3>
            <p className="text-gray-600 mb-8 text-lg font-light">
              We'll notify you as soon as Arkana is ready for you.
            </p>
            <motion.div 
              className="inline-flex items-center space-x-3 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-light">Position #{waitlistPosition || 2847}</span>
              <span>•</span>
              <span className="font-light">Estimated: Q1 2025</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
