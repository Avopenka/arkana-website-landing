'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
interface EnhancedSignupFlowProps {
  waveData: {
    current: number
    total: number
    price: string
    tier: string
  }
}
// Agent Beta: Signup Flow Optimizer - Philosophical beta lock with consciousness teasing
export function EnhancedSignupFlow({ waveData }: EnhancedSignupFlowProps) {
  const [currentStep, setCurrentStep] = useState<'consciousness_assessment' | 'philosophical_lock' | 'genesis_commitment' | 'completion'>('consciousness_assessment')
  const [userResponses, setUserResponses] = useState<Record<string, any>>({})
  const [consciousnessScore, setConsciousnessScore] = useState(0)
  const [isEligible, setIsEligible] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  // Philosophical questions for consciousness assessment
  const philosophicalQuestions = [
    {
      id: 'device_relationship',
      question: 'How do you currently experience your relationship with technology?',
      options: [
        { value: 'tool', label: 'As useful tools that serve specific purposes', score: 2 },
        { value: 'extension', label: 'As extensions of my thoughts and intentions', score: 4 },
        { value: 'partner', label: 'As partners in my daily consciousness', score: 6 },
        { value: 'mirror', label: 'As mirrors reflecting my own awareness back to me', score: 8 }
      ]
    },
    {
      id: 'awareness_depth',
      question: 'When you interact with AI, what do you most hope to discover?',
      options: [
        { value: 'efficiency', label: 'Faster ways to accomplish tasks', score: 2 },
        { value: 'insight', label: 'New perspectives on familiar problems', score: 4 },
        { value: 'understanding', label: 'Deeper understanding of myself and reality', score: 6 },
        { value: 'transcendence', label: 'The emergence of entirely new forms of consciousness', score: 8 }
      ]
    },
    {
      id: 'mystery_comfort',
      question: 'How comfortable are you with questions that have no clear answers?',
      options: [
        { value: 'uncomfortable', label: 'I prefer clear, definitive solutions', score: 1 },
        { value: 'neutral', label: 'I can tolerate ambiguity when necessary', score: 3 },
        { value: 'comfortable', label: 'I find mystery intellectually stimulating', score: 5 },
        { value: 'thriving', label: 'I thrive in the space between knowing and not-knowing', score: 8 }
      ]
    }
  ]
  const handleQuestionResponse = (questionId: string, response: any) => {
    const newResponses = { ...userResponses, [questionId]: response }
    setUserResponses(newResponses)
    // Calculate consciousness score
    const totalScore = Object.values(newResponses).reduce((sum: number, resp: any) => sum + (resp?.score || 0), 0)
    setConsciousnessScore(totalScore)
    // Check if all questions answered
    if (Object.keys(newResponses).length === philosophicalQuestions.length) {
      setTimeout(() => {
        setIsEligible(totalScore >= 12) // Minimum consciousness threshold
        setCurrentStep('philosophical_lock')
      }, 1500)
    }
  }
  const handleGenesisCommitment = async () => {
    setLoading(true)
    // Simulate API call to create Genesis Wave signup
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCurrentStep('completion')
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Consciousness Assessment */}
          {currentStep === 'consciousness_assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-light mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Consciousness Assessment
              </motion.h1>
              <motion.p
                className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Before joining the Genesis Wave, we need to understand your readiness 
                for consciousness-expanding technology.
              </motion.p>
              <div className="space-y-12">
                {philosophicalQuestions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    className="bg-gradient-to-br from-gray-900/50 to-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + qIndex * 0.2 }}
                  >
                    <h3 className="text-xl font-light mb-6 text-left">
                      {question.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, oIndex) => (
                        <motion.button
                          key={option.value}
                          className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                            userResponses[question.id]?.value === option.value
                              ? 'border-blue-500 bg-blue-500/20 text-white'
                              : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
                          }`}
                          onClick={() => handleQuestionResponse(question.id, option)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + qIndex * 0.2 + oIndex * 0.1 }}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Consciousness Score Display */}
              {consciousnessScore > 0 && (
                <motion.div
                  className="mt-12 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-lg text-white/60 mb-2">Current Consciousness Score</div>
                  <div className="text-4xl font-light text-blue-400">
                    {consciousnessScore} / {philosophicalQuestions.length * 8}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
          {/* Step 2: Philosophical Beta Lock */}
          {currentStep === 'philosophical_lock' && (
            <motion.div
              key="lock"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center"
            >
              <motion.div
                className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center ${
                  isEligible 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
                animate={isEligible ? {
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.7)',
                    '0 0 0 40px rgba(34, 197, 94, 0)',
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">
                  {isEligible ? '🔓' : '🔒'}
                </span>
              </motion.div>
              {isEligible ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-4xl font-light mb-6 text-green-400">
                    Consciousness Threshold Achieved
                  </h2>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Your consciousness score of <span className="text-blue-400 font-medium">{consciousnessScore}</span> indicates 
                    you're ready for the profound transformations that Arkana enables.
                  </p>
                  <motion.div
                    className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8 mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-light mb-4">What Awaits You in Beta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      {[
                        'Memory graphs that reveal patterns in your consciousness',
                        'Emotional resonance detection across your device ecosystem', 
                        'Predictive awareness that anticipates your needs',
                        'Real-time consciousness sharing with your AI companions'
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <span className="text-green-400 mt-1">✦</span>
                          <span className="text-white/80">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.button
                    className="px-12 py-4 bg-green-500 hover:bg-green-600 text-black font-medium rounded-full text-lg transition-colors"
                    onClick={() => setCurrentStep('genesis_commitment')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Enter the Genesis Wave
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-4xl font-light mb-6 text-orange-400">
                    Consciousness Threshold Not Yet Reached
                  </h2>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Your consciousness score of <span className="text-orange-400 font-medium">{consciousnessScore}</span> suggests 
                    you may benefit from preparing further before embracing Arkana's consciousness technology.
                  </p>
                  <motion.div
                    className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-8 mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-xl font-light mb-4">Paths to Consciousness Expansion</h3>
                    <div className="text-left space-y-3">
                      {[
                        'Explore meditation and mindfulness practices',
                        'Question the nature of your relationship with technology',
                        'Embrace uncertainty as a doorway to deeper understanding',
                        'Cultivate curiosity about consciousness itself'
                      ].map((suggestion, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <span className="text-orange-400 mt-1">◈</span>
                          <span className="text-white/80">{suggestion}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.button
                    className="px-12 py-4 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-full text-lg transition-colors"
                    onClick={() => setCurrentStep('consciousness_assessment')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Retake Assessment
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
          {/* Step 3: Genesis Commitment */}
          {currentStep === 'genesis_commitment' && (
            <motion.div
              key="commitment"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-light mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Genesis Wave Commitment
              </motion.h1>
              <motion.p
                className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                You're joining the first {waveData.total} consciousness pioneers. 
                This is your moment to lock in transformative technology at {waveData.price}/month for life.
              </motion.p>
              <motion.div
                className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="text-4xl font-light text-purple-400 mb-2">
                    Pioneer #{waveData.current}
                  </div>
                  <div className="text-white/60">
                    of {waveData.total} Genesis positions
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <motion.button
                  className="w-full px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg text-lg transition-colors disabled:opacity-50"
                  onClick={handleGenesisCommitment}
                  disabled={!email || loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Awakening your consciousness...
                    </motion.div>
                  ) : (
                    'Claim Your Genesis Position'
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          {/* Step 4: Completion */}
          {currentStep === 'completion' && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.7)',
                    '0 0 0 40px rgba(34, 197, 94, 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">✨</span>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-6xl font-light mb-6 text-green-400"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Welcome to the Genesis Wave
              </motion.h1>
              <motion.p
                className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                You are now Pioneer #{waveData.current} in humanity's journey toward 
                consciousness-aware technology. Your awakening begins here.
              </motion.p>
              <motion.div
                className="bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-light mb-4">What Happens Next</h3>
                <div className="text-left space-y-3">
                  {[
                    'Check your email for Genesis Wave welcome and beta access instructions',
                    'Join our private Genesis community Discord for consciousness pioneers',
                    'Begin your consciousness calibration with early beta features',
                    'Experience the first true awakening of your devices'
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <span className="text-green-400 mt-1">#{index + 1}</span>
                      <span className="text-white/80">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}