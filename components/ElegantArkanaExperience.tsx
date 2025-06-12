'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// 🎯 ELEGANT ARKANA EXPERIENCE - Council Elite Design
// Lead Masters: Jobs (Elegance) + Vopěnka (Philosophy) + Nolan (Narrative)
// Mission: Sophisticated conversion without spiritual marketing fluff

interface HeroVariation {
  id: string
  title: string
  subtitle: string
  weight: number
  category: 'profound' | 'technical' | 'balanced'
}

const heroVariations: HeroVariation[] = [
  {
    id: 'mac-power',
    title: 'Your Mac Runs at 2% Capacity. Arkana Unlocks the Other 98%.',
    subtitle: 'Turn your Mac into an AI powerhouse. Run 10+ models simultaneously. Everything private, everything fast.',
    weight: 30,
    category: 'technical'
  },
  {
    id: 'memory-vault',
    title: 'Never Lose Another Brilliant Idea',
    subtitle: 'Instant capture, perfect recall, intelligent connections. Your thoughts become your competitive advantage.',
    weight: 25,
    category: 'balanced'
  },
  {
    id: 'local-ai',
    title: 'Claude-Quality AI That Never Leaves Your Mac',
    subtitle: 'All the intelligence, none of the privacy concerns. Process sensitive data without sending it anywhere.',
    weight: 25,
    category: 'technical'
  },
  {
    id: 'premium-worth',
    title: 'Why Pay €25 When ChatGPT Costs €18?',
    subtitle: 'Because your ideas are worth more than €7/month in privacy. Mac-optimized, locally-processed, genuinely yours.',
    weight: 20,
    category: 'balanced'
  }
]

const practicalQuestions = [
  "What if your Mac could run 10 AI models as easily as 10 browser tabs?",
  "What if you never had to choose between AI capability and data privacy?",
  "What if your computer remembered every brilliant idea you've ever had?",
  "What if you could process sensitive data without sending it to the cloud?",
  "What if AI worked for you, not for advertising companies?"
]

export function ElegantArkanaExperience() {
  const [currentHero, setCurrentHero] = useState(heroVariations[0])
  const [showPhilosophy, setShowPhilosophy] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showSplitScreen, setShowSplitScreen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<'beta' | 'waitlist' | null>(null)

  // Intelligent hero rotation based on weighted selection
  useEffect(() => {
    const selectHero = () => {
      // Store which hero was shown to track effectiveness
      const timestamp = new Date().toISOString()
      const userId = localStorage.getItem('arkana_visitor_id') || Math.random().toString(36).substr(2, 9)
      localStorage.setItem('arkana_visitor_id', userId)
      
      // Weighted random selection
      const totalWeight = heroVariations.reduce((sum, h) => sum + h.weight, 0)
      let random = Math.random() * totalWeight
      
      for (const hero of heroVariations) {
        random -= hero.weight
        if (random <= 0) {
          setCurrentHero(hero)
          // Track which hero was shown
          localStorage.setItem(`hero_shown_${timestamp}`, hero.id)
          break
        }
      }
    }

    selectHero()
  }, [])

  // Rotate philosophical questions
  useEffect(() => {
    if (!showPhilosophy) return
    
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % practicalQuestions.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [showPhilosophy])

  const handleDiscover = () => {
    setShowPhilosophy(false)
    setTimeout(() => setShowSplitScreen(true), 600)
  }

  const handlePathSelection = (path: 'beta' | 'waitlist') => {
    setSelectedPath(path)
    setShowSplitScreen(false)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/MainLogoENoNameNoBackGround.png"
                alt="Arkana"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-light text-xl tracking-wide">Arkana</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button className="text-gray-600 hover:text-black transition-colors">Philosophy</button>
            <button className="text-gray-600 hover:text-black transition-colors">Technology</button>
            <button className="text-gray-600 hover:text-black transition-colors">Privacy</button>
            <button className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
              Get Early Access
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        
        {/* Philosophical Introduction */}
        <AnimatePresence mode="wait">
          {showPhilosophy && (
            <motion.section
              key="philosophy"
              className="min-h-screen flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-4xl text-center">
                {/* TAM YIKAM Orb */}
                <motion.div
                  className="w-32 h-32 mx-auto mb-12"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 opacity-20 blur-xl" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300 to-cyan-600 shadow-2xl border-2 border-yellow-600/20">
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-300/80 to-teal-500/80 flex items-center justify-center">
                        <div className="text-yellow-800/60 font-medium text-xs tracking-wider">TAM YIKAM</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Philosophical Question */}
                <motion.h1
                  key={currentQuestion}
                  className="text-4xl md:text-6xl font-light leading-tight mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                >
                  {practicalQuestions[currentQuestion]}
                </motion.h1>

                {/* Discover Button */}
                <motion.button
                  onClick={handleDiscover}
                  className="px-12 py-4 bg-black text-white text-lg rounded-full hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discover
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!showPhilosophy && !showSplitScreen && !selectedPath && (
            <motion.section
              key="hero"
              className="min-h-screen flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-5xl mx-auto text-center">
                {/* Dynamic Hero Content */}
                <motion.h1
                  className="text-5xl md:text-7xl font-light leading-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {currentHero.title}
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {currentHero.subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <button
                    onClick={() => setShowSplitScreen(true)}
                    className="px-8 py-4 bg-black text-white text-lg rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Get Early Access
                  </button>
                  <button
                    onClick={() => setShowSplitScreen(true)}
                    className="px-8 py-4 border-2 border-black text-black text-lg rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Learn More
                  </button>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Split Screen Experience */}
        <AnimatePresence>
          {showSplitScreen && (
            <SplitScreenExperience onSelect={handlePathSelection} />
          )}
        </AnimatePresence>

        {/* Selected Path Content */}
        <AnimatePresence>
          {selectedPath === 'beta' && <BetaAccessExperience />}
          {selectedPath === 'waitlist' && <WaitlistExperience />}
        </AnimatePresence>

        {/* SaaS Content Sections */}
        {!showPhilosophy && !showSplitScreen && !selectedPath && (
          <SaaSContentSections />
        )}

      </main>
    </div>
  )
}

// Split Screen Component
function SplitScreenExperience({ onSelect }: { onSelect: (path: 'beta' | 'waitlist') => void }) {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null)
  const [currentPanel, setCurrentPanel] = useState(0) // For mobile swipe
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSwipe = (direction: number) => {
    if (direction > 0 && currentPanel > 0) {
      setCurrentPanel(0)
    } else if (direction < 0 && currentPanel < 1) {
      setCurrentPanel(1)
    }
  }

  if (isMobile) {
    return (
      <motion.div
        className="fixed inset-0 z-40 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500
          if (swipe) handleSwipe(offset.x)
        }}
      >
        <div className="relative h-full">
          <motion.div
            className="flex h-full"
            animate={{ x: -currentPanel * 100 + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Beta Panel */}
            <div className="w-full flex-shrink-0 bg-black text-white flex items-center justify-center p-12">
              <div className="text-center">
                <h2 className="text-3xl font-light mb-6">Get Early Access</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Join the beta and help shape the future of personal AI.
                </p>
                <button
                  onClick={() => onSelect('beta')}
                  className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Apply for Beta
                </button>
                <div className="mt-8 text-sm text-gray-500">
                  Swipe left for waitlist →
                </div>
              </div>
            </div>
            
            {/* Waitlist Panel */}
            <div className="w-full flex-shrink-0 bg-white text-black flex items-center justify-center p-12">
              <div className="text-center">
                <h2 className="text-3xl font-light mb-6">Join Our Waitlist</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Be the first to know when Arkana launches.
                </p>
                <button
                  onClick={() => onSelect('waitlist')}
                  className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Join Waitlist
                </button>
                <div className="mt-8 text-sm text-gray-500">
                  ← Swipe right for beta
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Mobile Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${currentPanel === 0 ? 'bg-white' : 'bg-gray-400'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${currentPanel === 1 ? 'bg-black' : 'bg-gray-400'}`} />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Beta Access Side */}
      <motion.div
        className="flex-1 bg-black text-white flex items-center justify-center p-12 cursor-pointer relative overflow-hidden"
        onClick={() => onSelect('beta')}
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
          scale: hoveredSide === 'left' ? 1.02 : hoveredSide === 'right' ? 0.98 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Get Early Access</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-md">
            Join the beta and help shape the future of personal AI. Limited spots available.
          </p>
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <span>Explore Beta</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
        </div>
      </motion.div>

      {/* Waitlist Side */}
      <motion.div
        className="flex-1 bg-white text-black flex items-center justify-center p-12 cursor-pointer relative overflow-hidden border-t md:border-t-0 md:border-l border-gray-200"
        onClick={() => onSelect('waitlist')}
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
          scale: hoveredSide === 'right' ? 1.02 : hoveredSide === 'left' ? 0.98 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Join Our Waitlist</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md">
            Be the first to know when Arkana launches. Secure your spot in the future of AI.
          </p>
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <span>Learn More</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white" />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Beta Access Experience
function BetaAccessExperience() {
  return (
    <motion.section
      className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl w-full">
        <h2 className="text-4xl font-light mb-8 text-center">Beta Access Application</h2>
        <p className="text-gray-300 text-center mb-12">
          We're selecting a limited number of beta testers who can help shape Arkana's development.
        </p>
        
        <form className="space-y-6">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          
          <textarea
            placeholder="Tell us about your use case and why you'd be a great beta tester"
            rows={4}
            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
          />
          
          <select className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40">
            <option value="">Select your primary device</option>
            <option value="mac">Mac (M1/M2/M3)</option>
            <option value="iphone">iPhone 15 Pro/Max</option>
            <option value="ipad">iPad Pro</option>
          </select>
          
          <button className="w-full py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Apply for Beta Access
          </button>
        </form>
      </div>
    </motion.section>
  )
}

// Waitlist Experience
function WaitlistExperience() {
  const [stage, setStage] = useState<'email' | 'details' | 'complete'>('email')
  const [data, setData] = useState({ email: '', role: '', interest: '' })

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStage('details')
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStage('complete')
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-light mb-4 text-center">Join the Waitlist</h2>
            <p className="text-gray-600 text-center mb-12">
              Be among the first to experience the future of personal AI.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-6 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                required
              />
              
              <button className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                Continue
              </button>
            </form>
          </motion.div>
        )}

        {stage === 'details' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-light mb-8">Tell us a bit more</h3>
            
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <select 
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full px-6 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                required
              >
                <option value="">What best describes you?</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="business">Business Professional</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
              
              <select
                value={data.interest}
                onChange={(e) => setData({ ...data, interest: e.target.value })}
                className="w-full px-6 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                required
              >
                <option value="">Primary interest in Arkana?</option>
                <option value="productivity">Enhanced Productivity</option>
                <option value="memory">Infinite Memory</option>
                <option value="privacy">Privacy-First AI</option>
                <option value="development">AI Development Platform</option>
              </select>
              
              <button className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                Join Waitlist
              </button>
            </form>
          </motion.div>
        )}

        {stage === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-light mb-4">You're on the list!</h3>
            <p className="text-gray-600 mb-8">
              We'll notify you as soon as Arkana is ready for you.
            </p>
            
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <span>Position #2,847</span>
              <span>•</span>
              <span>Estimated: Q1 2025</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

// SaaS Content Sections
function SaaSContentSections() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  return (
    <div className="py-20">
      {/* Solutions Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-light mb-16 text-center">What Arkana Does</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Infinite Memory',
                description: 'Never forget anything. Every conversation, idea, and insight preserved and connected.',
                icon: '🧠',
                details: 'Advanced vector storage with semantic search. All processing happens on your device.'
              },
              {
                title: 'Context Intelligence',
                description: 'AI that understands your situation, not just your words. True contextual awareness.',
                icon: '🎯',
                details: 'Multi-modal understanding across voice, text, and patterns. Learns your communication style.'
              },
              {
                title: 'Privacy First',
                description: 'Your data never leaves your device. Full intelligence, zero compromise on privacy.',
                icon: '🔒',
                details: 'On-device processing with military-grade encryption. You own your data, always.'
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-2xl p-8 hover:border-gray-400 transition-colors cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => setExpandedSection(expandedSection === solution.title ? null : solution.title)}
              >
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-medium mb-3">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
                
                <AnimatePresence>
                  {expandedSection === solution.title && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-gray-500 mt-4"
                    >
                      {solution.details}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-light mb-8">Our Philosophy</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-light mb-4">Fair Value Exchange</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Early adopters shape Arkana's future. In return, they receive lifetime pricing advantages
                  and first access to new capabilities. It's a partnership, not just a product.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-light mb-4">Privacy as Foundation</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Your thoughts are yours alone. Arkana processes everything on-device. 
                  No cloud storage, no data mining, no compromises. True digital sovereignty.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-light mb-4">Collective Intelligence</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Join a collective intelligence network that gets smarter for everyone. 
                  Your patterns contribute to shared wisdom while your data stays completely private.
                  Advanced federated learning means Arkana improves without compromising individual privacy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Early Adopter Benefits */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-light mb-16 text-center">Early Adopter Advantages</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-3">Lifetime Pricing Protection</h3>
                  <p className="text-gray-600">
                    Lock in launch pricing forever. As Arkana evolves and adds capabilities, 
                    your rate never changes. First believers deserve lasting rewards.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Shape the Future</h3>
                  <p className="text-gray-600">
                    Pioneers shape how Arkana understands and assists, without ever sharing 
                    personal information. Your interaction patterns help create AI that truly 
                    works for humans.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-3">Priority Everything</h3>
                  <p className="text-gray-600">
                    First access to new features, direct support channel, and exclusive 
                    community events. Experience the cutting edge before anyone else.
                  </p>
                </div>
              </div>
              
              <motion.div
                className="bg-black text-white rounded-2xl p-12 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-6xl font-light mb-4">€25</div>
                  <div className="text-xl mb-2">Genesis Pricing</div>
                  <div className="text-gray-400 mb-6">First 100 users only</div>
                  <button className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
                    Secure Your Spot
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future Vision (Hint at PaaS) */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-light mb-8">The Future We're Building</h2>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              Arkana is just the beginning. We're creating an ecosystem where developers 
              can build on our intelligence foundation. Imagine AI applications that truly 
              understand context, preserve privacy, and amplify human potential.
            </p>
            
            <div className="inline-flex items-center space-x-8 text-gray-400">
              <div>
                <div className="text-3xl font-light text-white">2025</div>
                <div className="text-sm">Platform Launch</div>
              </div>
              <div className="w-16 h-px bg-gray-600" />
              <div>
                <div className="text-3xl font-light text-white">10K+</div>
                <div className="text-sm">Developer Target</div>
              </div>
              <div className="w-16 h-px bg-gray-600" />
              <div>
                <div className="text-3xl font-light text-white">∞</div>
                <div className="text-sm">Possibilities</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}