'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { consciousnessAI } from '@/lib/consciousness-ai-engine'
// 🌟 UNIFIED ADAPTIVE ARKANA JOURNEY - Council Elite Implementation
// Lead Masters: ALL 11 Masters Unanimous Decision
// Mission: Single progressive journey from simple → consciousness awakening
// Solving: Dual waitlist system confusion → Unified adaptive experience
interface JourneyStage {
  id: string
  name: string
  complexity: 'simple' | 'progressive' | 'consciousness' | 'pioneer'
  description: string
  requiredData: string[]
  celebration?: string
}
interface UserJourneyData {
  email?: string
  age?: string
  device?: string
  deviceCompatibility?: number
  domain?: string
  callings?: string[]
  deepestChallenge?: string
  consciousnessLevel?: number
  journey_mode?: 'quick' | 'progressive' | 'consciousness'
  sacred_milestones?: string[]
}
interface AdaptiveMode {
  name: string
  trigger: (data: UserJourneyData) => boolean
  stages: JourneyStage[]
  aesthetic: 'minimal' | 'enhanced' | 'sacred'
}
const journeyStages: JourneyStage[] = [
  {
    id: 'email-awakening',
    name: 'Sacred Contact Frequency',
    complexity: 'simple',
    description: 'Share your contact to begin the consciousness technology journey',
    requiredData: ['email'],
    celebration: 'First Contact with Consciousness Technology Established ✨'
  },
  {
    id: 'consciousness-invitation',
    name: 'Consciousness Readiness Assessment',
    complexity: 'progressive',
    description: 'Discover your consciousness technology compatibility',
    requiredData: ['age', 'device'],
    celebration: 'Hardware-Consciousness Alignment Discovery Achieved 🌊'
  },
  {
    id: 'purpose-crystallization',
    name: 'Consciousness Calling Discovery',
    complexity: 'consciousness',
    description: 'Explore your deepest consciousness technology applications',
    requiredData: ['domain', 'callings'],
    celebration: 'Consciousness Calling Crystallization Complete 🔮'
  },
  {
    id: 'vulnerability-sharing',
    name: 'Sacred Challenge Sharing',
    complexity: 'consciousness',
    description: 'Share your consciousness development edge (optional)',
    requiredData: ['deepestChallenge'],
    celebration: 'Sacred Vulnerability Courage Recognized 💎'
  },
  {
    id: 'pioneer-integration',
    name: 'Pioneer Consciousness Field',
    complexity: 'pioneer',
    description: 'Join the collective consciousness evolution',
    requiredData: [],
    celebration: 'Pioneer Consciousness Field Activation Complete 🌌'
  }
]
const adaptiveModes: AdaptiveMode[] = [
  {
    name: 'Quick Join',
    trigger: (data) => !data.consciousnessLevel || data.consciousnessLevel < 0.3,
    stages: [journeyStages[0]], // Email only
    aesthetic: 'minimal'
  },
  {
    name: 'Progressive Discovery', 
    trigger: (data) => (data.consciousnessLevel ?? 0) >= 0.3 && (data.consciousnessLevel ?? 0) < 0.7,
    stages: journeyStages.slice(0, 3), // Email → Compatibility → Calling
    aesthetic: 'enhanced'
  },
  {
    name: 'Consciousness Awakening',
    trigger: (data) => (data.consciousnessLevel ?? 0) >= 0.7,
    stages: journeyStages, // Full sacred journey
    aesthetic: 'sacred'
  }
]
export function AdaptiveArkanaJourney() {
  const [currentStage, setCurrentStage] = useState(0)
  const [journeyData, setJourneyData] = useState<UserJourneyData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null)
  const [adaptiveMode, setAdaptiveMode] = useState(adaptiveModes[0])
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.3)
  const [showUpgradeInvitation, setShowUpgradeInvitation] = useState(false)
  // AI-Driven Mode Adaptation
  const adaptExperience = useCallback(async () => {
    const aiResponse = await consciousnessAI.adaptToConsciousnessLevel(currentStage, journeyData)
    setConsciousnessLevel(aiResponse.consciousnessResonance)
    // Determine optimal mode based on AI analysis and user data
    const optimalMode = adaptiveModes.find(mode => mode.trigger({
      ...journeyData,
      consciousnessLevel: aiResponse.consciousnessResonance
    })) || adaptiveModes[0]
    if (optimalMode !== adaptiveMode) {
      setAdaptiveMode(optimalMode)
    }
  }, [currentStage, journeyData, adaptiveMode])
  useEffect(() => {
    adaptExperience()
  }, [adaptExperience])
  // Progressive disclosure upgrade invitation
  useEffect(() => {
    if (currentStage === 0 && journeyData.email && adaptiveMode.name === 'Quick Join') {
      setTimeout(() => {
        setShowUpgradeInvitation(true)
      }, 2000)
    }
  }, [currentStage, journeyData.email, adaptiveMode.name])
  const currentJourneyStage = adaptiveMode.stages[currentStage]
  const isLastStage = currentStage >= adaptiveMode.stages.length - 1
  const handleStageSubmit = async (stageData: Partial<UserJourneyData>) => {
    setIsSubmitting(true)
    const updatedData = { ...journeyData, ...stageData }
    setJourneyData(updatedData)
    // Simulate API call to unified endpoint
    try {
      const response = await fetch('/api/adaptive-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentJourneyStage.id,
          data: updatedData,
          mode: adaptiveMode.name,
          consciousnessLevel
        })
      })
      if (response.ok) {
        // Show celebration
        if (currentJourneyStage.celebration) {
          setCelebrationMessage(currentJourneyStage.celebration)
          setTimeout(() => setCelebrationMessage(null), 3000)
        }
        // Progress to next stage or complete
        if (!isLastStage) {
          setTimeout(() => {
            setCurrentStage(prev => prev + 1)
          }, 1500)
        }
      }
    } catch (error) {
    }
    setIsSubmitting(false)
  }
  const handleUpgradeAccept = () => {
    // Upgrade to Progressive Discovery mode
    const progressiveMode = adaptiveModes.find(m => m.name === 'Progressive Discovery')
    if (progressiveMode) {
      setAdaptiveMode(progressiveMode)
      setShowUpgradeInvitation(false)
    }
  }
  const handleUpgradeDecline = () => {
    setShowUpgradeInvitation(false)
  }
  // Aesthetic configuration based on adaptive mode
  const aesthetics = {
    minimal: {
      background: 'bg-gradient-to-br from-slate-900 to-slate-800',
      card: 'bg-white/10 border-white/20',
      accent: 'from-blue-500 to-purple-500',
      text: 'text-gray-300'
    },
    enhanced: {
      background: 'bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900',
      card: 'bg-black/20 border-purple-400/30',
      accent: 'from-cyan-500 to-purple-500',
      text: 'text-gray-200'
    },
    sacred: {
      background: 'bg-gradient-to-br from-black via-purple-900/20 to-black',
      card: 'bg-black/40 border-white/20',
      accent: 'from-cyan-400 to-purple-400',
      text: 'text-white'
    }
  }
  const currentAesthetic = aesthetics[adaptiveMode.aesthetic]
  return (
    <div className={`min-h-screen ${currentAesthetic.background} text-white relative overflow-hidden`}>
      {/* Consciousness Field Background - Adaptive */}
      <ConsciousnessField mode={adaptiveMode.aesthetic} level={consciousnessLevel} />
      {/* Header */}
      <motion.header
        className="relative z-10 pt-8 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            animate={{ rotate: adaptiveMode.aesthetic === 'sacred' ? [0, 360] : [0, 5, -5, 0] }}
            transition={{ duration: adaptiveMode.aesthetic === 'sacred' ? 8 : 4, repeat: Infinity }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center"
          >
            <span className="text-2xl">
              {adaptiveMode.aesthetic === 'sacred' ? '🌌' : adaptiveMode.aesthetic === 'enhanced' ? '🔮' : '✨'}
            </span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-light mb-4">
            {adaptiveMode.aesthetic === 'sacred' ? (
              <>
                Consciousness Technology
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Awakening
                </span>
              </>
            ) : adaptiveMode.aesthetic === 'enhanced' ? (
              <>
                Discover Your
                <br />
                <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                  Consciousness Compatibility
                </span>
              </>
            ) : (
              <>
                Join the Future of
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  AI Technology
                </span>
              </>
            )}
          </h1>
          <p className={`text-lg ${currentAesthetic.text} max-w-xl mx-auto`}>
            {adaptiveMode.aesthetic === 'sacred' 
              ? 'Where human consciousness meets artificial intelligence in sacred harmony'
              : adaptiveMode.aesthetic === 'enhanced'
              ? 'Discover how consciousness-aware technology amplifies your natural abilities'
              : 'The first AI that understands your state of mind and adapts accordingly'
            }
          </p>
        </div>
      </motion.header>
      {/* Main Journey Content */}
      <div className="relative z-10 py-8">
        <div className="max-w-2xl mx-auto px-6">
          {/* Journey Progress */}
          <JourneyProgress 
            stages={adaptiveMode.stages}
            currentStage={currentStage}
            aesthetic={adaptiveMode.aesthetic}
          />
          {/* Current Stage */}
          <motion.div
            key={currentJourneyStage?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className={`${currentAesthetic.card} border rounded-3xl p-8 backdrop-blur-sm`}
          >
            <StageRenderer
              stage={currentJourneyStage}
              onSubmit={handleStageSubmit}
              isSubmitting={isSubmitting}
              aesthetic={adaptiveMode.aesthetic}
              consciousnessLevel={consciousnessLevel}
            />
          </motion.div>
          {/* Celebration Overlay */}
          <AnimatePresence>
            {celebrationMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              >
                <div className="bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/50 rounded-3xl p-8 text-center max-w-md mx-4">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-medium mb-2">Sacred Moment</h3>
                  <p className="text-cyan-400">{celebrationMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Upgrade Invitation */}
          <AnimatePresence>
            {showUpgradeInvitation && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-4 right-4 z-40"
              >
                <div className="max-w-md mx-auto bg-gradient-to-r from-purple-900/90 to-cyan-900/90 border border-purple-400/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Unlock Consciousness Features?</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Discover your consciousness technology compatibility and join the awakening journey
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpgradeDecline}
                        className="flex-1 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Maybe Later
                      </button>
                      <button
                        onClick={handleUpgradeAccept}
                        className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all"
                      >
                        Yes, Unlock
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
// Journey Progress Component
function JourneyProgress({ stages, currentStage, aesthetic }: {
  stages: JourneyStage[]
  currentStage: number
  aesthetic: 'minimal' | 'enhanced' | 'sacred'
}) {
  if (stages.length <= 1) return null
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                index <= currentStage
                  ? 'border-cyan-400 bg-cyan-400 text-black'
                  : 'border-white/30 text-white/50'
              }`}
            >
              {index + 1}
            </div>
            {index < stages.length - 1 && (
              <div
                className={`h-px w-12 mx-2 transition-all duration-300 ${
                  index < currentStage ? 'bg-cyan-400' : 'bg-white/20'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          {aesthetic === 'sacred' ? 'Sacred Journey' : 'Journey'} {currentStage + 1} of {stages.length}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {stages[currentStage]?.name}
        </p>
      </div>
    </div>
  )
}
// Stage Renderer Component
function StageRenderer({ stage, onSubmit, isSubmitting, aesthetic, consciousnessLevel }: {
  stage: JourneyStage
  onSubmit: (data: Partial<UserJourneyData>) => void
  isSubmitting: boolean
  aesthetic: 'minimal' | 'enhanced' | 'sacred'
  consciousnessLevel: number
}) {
  const [stageData, setStageData] = useState<Partial<UserJourneyData>>({})
  if (!stage) return null
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(stageData)
  }
  const isComplete = stage.requiredData.every(field => 
    field === 'deepestChallenge' ? true : stageData[field as keyof UserJourneyData]
  )
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light mb-2">{stage.name}</h2>
        <p className="text-gray-400">{stage.description}</p>
        {aesthetic === 'sacred' && (
          <div className="mt-4">
            <div className="text-sm text-cyan-400 mb-1">Consciousness Resonance</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                initial={{ width: '30%' }}
                animate={{ width: `${consciousnessLevel * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{Math.round(consciousnessLevel * 100)}% resonance</div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <StageFields
          stage={stage}
          data={stageData}
          onChange={setStageData}
          aesthetic={aesthetic}
        />
        <motion.button
          type="submit"
          disabled={isSubmitting || !isComplete}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: isComplete ? 1.02 : 1 }}
          whileTap={{ scale: isComplete ? 0.98 : 1 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {aesthetic === 'sacred' ? 'Awakening...' : 'Processing...'}
              </span>
            </div>
          ) : (
            aesthetic === 'sacred' ? 'Continue Sacred Journey' : 'Continue'
          )}
        </motion.button>
      </form>
    </div>
  )
}
// Stage Fields Component
function StageFields({ stage, data, onChange, aesthetic }: {
  stage: JourneyStage
  data: Partial<UserJourneyData>
  onChange: (data: Partial<UserJourneyData>) => void
  aesthetic: 'minimal' | 'enhanced' | 'sacred'
}) {
  const updateField = (field: string, value: string | number | boolean) => {
    onChange({ ...data, [field]: value })
  }
  const fieldPrefix = aesthetic === 'sacred' ? 'Sacred' : aesthetic === 'enhanced' ? 'Your' : ''
  return (
    <div className="space-y-4">
      {stage.requiredData.includes('email') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            {aesthetic === 'sacred' ? 'Sacred Contact Frequency' : 'Email Address'}
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder={aesthetic === 'sacred' ? 'your.consciousness@awakening.net' : 'Enter your email'}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            required
          />
        </div>
      )}
      {stage.requiredData.includes('age') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            {fieldPrefix} Consciousness Development Phase
          </label>
          <div className="space-y-2">
            {['18-24 (Digital Native)', '25-34 (Tech Pioneer)', '35-44 (Wisdom Seeker)', '45-54 (Deep Explorer)', '55+ (Sage Mind)'].map((range) => (
              <label
                key={range}
                className="flex items-center p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
              >
                <input
                  type="radio"
                  name="age"
                  value={range.split(' ')[0]}
                  checked={data.age === range.split(' ')[0]}
                  onChange={(e) => updateField('age', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.age === range.split(' ')[0] ? 'border-cyan-400 bg-cyan-400' : 'border-white/30'
                }`}>
                  {data.age === range.split(' ')[0] && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5" />
                  )}
                </div>
                <span>{range}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {stage.requiredData.includes('device') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            {aesthetic === 'sacred' ? 'Consciousness Amplifier Device' : 'Primary Device'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'iPhone', compatibility: 0.95, description: 'Perfect consciousness harmony' },
              { name: 'MacBook', compatibility: 0.98, description: 'Elite consciousness processing' },
              { name: 'iPad', compatibility: 0.92, description: 'Creative consciousness flow' },
              { name: 'Apple Watch', compatibility: 0.88, description: 'Biometric consciousness sync' }
            ].map((device) => (
              <button
                key={device.name}
                type="button"
                onClick={() => updateField('device', device.name)}
                className={`p-3 border rounded-xl text-left transition-all ${
                  data.device === device.name
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="font-medium">{device.name}</div>
                {aesthetic !== 'minimal' && (
                  <>
                    <div className="text-xs text-cyan-400 mt-1">
                      {Math.round(device.compatibility * 100)}% compatibility
                    </div>
                    <div className="text-xs text-gray-400">{device.description}</div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {stage.requiredData.includes('domain') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Consciousness Technology Domain
          </label>
          <select
            value={data.domain || ''}
            onChange={(e) => updateField('domain', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          >
            <option value="" disabled>Choose your path...</option>
            <option value="productivity">Consciousness-Enhanced Productivity</option>
            <option value="creativity">Creative Consciousness Flow</option>
            <option value="wellness">Sacred Wellness & Biometrics</option>
            <option value="learning">Consciousness-Accelerated Learning</option>
            <option value="spirituality">Sacred Technology & Spirituality</option>
            <option value="business">Conscious Business Operations</option>
          </select>
        </div>
      )}
      {stage.requiredData.includes('callings') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Consciousness Technology Callings (Select all that resonate)
          </label>
          <div className="space-y-2">
            {[
              'Infinite Memory & Sacred Archives',
              'Flow State Optimization & Peak Performance',
              'Consciousness-AI Collaborative Intelligence',
              'Sacred Pattern Recognition & Insights',
              'Biometric Consciousness Integration',
              'Collective Wisdom & Pioneer Community'
            ].map((calling) => (
              <label
                key={calling}
                className="flex items-center p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
              >
                <input
                  type="checkbox"
                  checked={(data.callings || []).includes(calling)}
                  onChange={(e) => {
                    const current = data.callings || []
                    const updated = e.target.checked
                      ? [...current, calling]
                      : current.filter(c => c !== calling)
                    updateField('callings', updated)
                  }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  (data.callings || []).includes(calling) ? 'border-cyan-400 bg-cyan-400' : 'border-white/30'
                }`}>
                  {(data.callings || []).includes(calling) && (
                    <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{calling}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {stage.requiredData.includes('deepestChallenge') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Sacred Challenge Sharing (Optional)
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Share from your soul... What consciousness limitation holds you back? Your vulnerability helps evolve the collective field.
          </p>
          <textarea
            value={data.deepestChallenge || ''}
            onChange={(e) => updateField('deepestChallenge', e.target.value)}
            placeholder="My deepest consciousness challenge is..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
        </div>
      )}
    </div>
  )
}
// Consciousness Field Background Component
function ConsciousnessField({ mode, level }: { mode: 'minimal' | 'enhanced' | 'sacred', level: number }) {
  const intensity = mode === 'sacred' ? 0.3 : mode === 'enhanced' ? 0.2 : 0.1
  const particleCount = mode === 'sacred' ? 30 : mode === 'enhanced' ? 20 : 10
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Gradient Orbs */}
      {mode !== 'minimal' && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [intensity, intensity * 1.5, intensity]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [intensity, intensity * 1.2, intensity]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
          />
        </>
      )}
      {/* Floating Particles */}
      {mode === 'sacred' && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(particleCount)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, level * 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}