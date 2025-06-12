'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ArkanaLockScreenProps {
  onAccess: () => void
  onShowAuth: (position?: number, answers?: string[]) => void
}

export default function ArkanaLockScreen({ onAccess, onShowAuth }: ArkanaLockScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null)

  const questions = [
    {
      id: 'interaction_style',
      question: "How do you prefer to interact with AI?",
      subtitle: "Understanding your communication style helps us personalize your experience",
      options: [
        { id: 'conversational', label: 'Natural conversation', description: 'Like talking to a thoughtful friend' },
        { id: 'direct', label: 'Clear and direct', description: 'Straight to the point, no fluff' },
        { id: 'exploratory', label: 'Curious exploration', description: 'I like to discover and learn together' },
        { id: 'professional', label: 'Professional focus', description: 'Task-oriented and efficient' }
      ]
    },
    {
      id: 'primary_goal',
      question: "What draws you to Arkana?",
      subtitle: "Your primary interest helps us understand your needs",
      options: [
        { id: 'productivity', label: 'Enhance productivity', description: 'Get more done with intelligent assistance' },
        { id: 'creativity', label: 'Creative collaboration', description: 'Explore ideas and creative projects' },
        { id: 'learning', label: 'Learning companion', description: 'Expand knowledge and understanding' },
        { id: 'emotional', label: 'Emotional intelligence', description: 'AI that understands context and emotion' }
      ]
    },
    {
      id: 'experience_level',
      question: "What's your experience with AI assistants?",
      subtitle: "This helps us calibrate the right level of sophistication",
      options: [
        { id: 'beginner', label: 'New to AI', description: 'Just getting started' },
        { id: 'casual', label: 'Casual user', description: 'Use ChatGPT or similar occasionally' },
        { id: 'regular', label: 'Regular user', description: 'AI is part of my daily workflow' },
        { id: 'power', label: 'Power user', description: 'I push AI tools to their limits' }
      ]
    }
  ]

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...answers, answerId]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 600)
    } else {
      // All questions answered, calculate position
      setIsAnalyzing(true)
      setTimeout(() => {
        const position = calculateWaitlistPosition(newAnswers)
        setWaitlistPosition(position)
        setIsAnalyzing(false)
        setShowResult(true)
      }, 2000)
    }
  }

  const calculateWaitlistPosition = (userAnswers: string[]): number => {
    // Sophisticated algorithm based on answers, not hardware
    let score = 0
    
    // Interaction style scoring
    const interactionStyle = userAnswers[0]
    if (interactionStyle === 'exploratory' || interactionStyle === 'conversational') score += 20
    if (interactionStyle === 'professional') score += 15
    if (interactionStyle === 'direct') score += 10
    
    // Primary goal scoring  
    const primaryGoal = userAnswers[1]
    if (primaryGoal === 'emotional') score += 25 // Perfect fit for Arkana
    if (primaryGoal === 'creativity') score += 20
    if (primaryGoal === 'learning') score += 15
    if (primaryGoal === 'productivity') score += 10
    
    // Experience level scoring
    const experienceLevel = userAnswers[2]
    if (experienceLevel === 'power') score += 20
    if (experienceLevel === 'regular') score += 15
    if (experienceLevel === 'casual') score += 10
    if (experienceLevel === 'beginner') score += 5
    
    // Convert score to position (higher score = better position)
    // Range: 5-65 points maps to positions 1-100
    const position = Math.max(1, Math.min(100, Math.floor(101 - (score * 1.5))))
    return position
  }

  const getPositionMessage = (position: number) => {
    if (position <= 10) return "You're in the Genesis Inner Circle"
    if (position <= 25) return "Priority Access Granted" 
    if (position <= 50) return "Early Access Reserved"
    return "Waitlist Position Secured"
  }

  const getPositionDescription = (position: number) => {
    if (position <= 10) return "Your responses show perfect alignment with Arkana's vision of emotional AI intelligence."
    if (position <= 25) return "You're clearly someone who values thoughtful AI interaction."
    if (position <= 50) return "Your interest in advanced AI capabilities is noted."
    return "Welcome to the journey toward more conscious AI."
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/30 to-black" />
        
        {/* Luxury glow effect */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-3xl"
          animate={{
            backgroundColor: ['rgba(22, 255, 225, 0.02)', 'rgba(139, 92, 246, 0.03)', 'rgba(22, 255, 225, 0.02)']
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Neural network pattern */}
        <div 
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, #16FFE1 0px, transparent 1px, transparent 60px, #16FFE1 61px),
              repeating-linear-gradient(90deg, #8b5cf6 0px, transparent 1px, transparent 60px, #8b5cf6 61px)
            `,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <Image 
                src="/MainLogoENoNameNoBackGround.png" 
                alt="Arkana" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-light mb-4 bg-gradient-to-r from-white via-brand-teal to-purple-400 bg-clip-text text-transparent">
              Welcome to Arkana
            </h1>
            <p className="text-gray-300 text-lg">
              Experience AI that understands you
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showResult && !isAnalyzing ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                {/* Progress indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex gap-2">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          index <= currentQuestion ? 'bg-brand-teal' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light mb-3">
                    {questions[currentQuestion].question}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {questions[currentQuestion].subtitle}
                  </p>
                </div>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-teal/30 rounded-xl transition-all duration-300 group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 rounded-full border-2 border-white/30 group-hover:border-brand-teal mt-1 transition-colors" />
                        <div>
                          <div className="font-medium mb-1">{option.label}</div>
                          <div className="text-sm text-gray-400">{option.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Skip option */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => onShowAuth()}
                    className="text-sm text-gray-400 hover:text-brand-teal transition-colors"
                  >
                    Skip questions and sign up directly
                  </button>
                </div>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 border-2 border-brand-teal border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-xl font-light mb-3">Analyzing your preferences...</h3>
                <p className="text-gray-400">Creating your personalized Arkana experience</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-brand-teal/20 to-purple-500/20 border border-brand-teal/30 rounded-2xl p-8 mb-6">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-brand-teal to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    #{waitlistPosition}
                  </motion.div>
                  
                  <h3 className="text-2xl font-light mb-3">
                    {getPositionMessage(waitlistPosition!)}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {getPositionDescription(waitlistPosition!)}
                  </p>
                  
                  <div className="text-sm text-gray-400 mb-8">
                    Your responses indicate a {waitlistPosition! <= 25 ? 'high' : 'moderate'} alignment with Arkana's emotional intelligence capabilities.
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.button
                    onClick={() => onShowAuth(waitlistPosition!, answers)}
                    className="w-full px-8 py-4 bg-brand-teal text-black font-medium rounded-xl hover:bg-brand-teal/80 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Secure Your Position
                  </motion.button>
                  
                  <motion.button
                    onClick={onAccess}
                    className="w-full px-8 py-3 bg-white/5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore More First
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}