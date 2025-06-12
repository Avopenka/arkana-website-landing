'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ArkanaLockScreenSplitProps {
  onAccess: () => void
  onShowAuth: (position?: number, answers?: string[]) => void
}

export default function ArkanaLockScreenSplit({ onAccess, onShowAuth }: ArkanaLockScreenSplitProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const questions = [
    {
      id: 'interaction_style',
      question: "How do you prefer AI interaction?",
      subtitle: "Your communication style shapes our personalization",
      leftTitle: "Conversational Intelligence",
      leftDescription: "Natural, thoughtful dialogue that adapts to your communication patterns and context.",
      rightTitle: "Direct Excellence", 
      rightDescription: "Precise, efficient responses focused on immediate clarity and actionable insights.",
      options: [
        { id: 'conversational', side: 'left', label: 'Natural conversation', description: 'Like talking to a thoughtful friend', icon: '💬' },
        { id: 'exploratory', side: 'left', label: 'Curious exploration', description: 'I like to discover and learn together', icon: '🔍' },
        { id: 'direct', side: 'right', label: 'Clear and direct', description: 'Straight to the point, no fluff', icon: '⚡' },
        { id: 'professional', side: 'right', label: 'Professional focus', description: 'Task-oriented and efficient', icon: '💼' }
      ]
    },
    {
      id: 'primary_goal',
      question: "What draws you to Arkana?",
      subtitle: "Understanding your goals helps us prioritize your experience",
      leftTitle: "Creative Intelligence",
      leftDescription: "AI that understands emotional context, creativity, and the nuances of human experience.",
      rightTitle: "Productivity Excellence",
      rightDescription: "Sophisticated tools designed to enhance efficiency, learning, and professional capabilities.",
      options: [
        { id: 'emotional', side: 'left', label: 'Emotional intelligence', description: 'AI that understands context and emotion', icon: '🧠' },
        { id: 'creativity', side: 'left', label: 'Creative collaboration', description: 'Explore ideas and creative projects', icon: '🎨' },
        { id: 'productivity', side: 'right', label: 'Enhanced productivity', description: 'Get more done with intelligent assistance', icon: '🚀' },
        { id: 'learning', side: 'right', label: 'Learning companion', description: 'Expand knowledge and understanding', icon: '📚' }
      ]
    },
    {
      id: 'experience_level',
      question: "Your AI expertise level?",
      subtitle: "This calibrates the right sophistication for your experience",
      leftTitle: "AI Explorer",
      leftDescription: "New to AI or prefer guided experiences with clear explanations and gentle introductions.",
      rightTitle: "AI Power User",
      rightDescription: "Experienced with AI tools and ready for advanced features, customization, and control.",
      options: [
        { id: 'beginner', side: 'left', label: 'New to AI', description: 'Just getting started', icon: '🌱' },
        { id: 'casual', side: 'left', label: 'Casual user', description: 'Use ChatGPT or similar occasionally', icon: '🌿' },
        { id: 'regular', side: 'right', label: 'Regular user', description: 'AI is part of my daily workflow', icon: '⚡' },
        { id: 'power', side: 'right', label: 'Power user', description: 'I push AI tools to their limits', icon: '🔥' }
      ]
    }
  ]

  const handleAnswer = (answerId: string) => {
    setSelectedOption(answerId)
    
    setTimeout(() => {
      const newAnswers = [...answers, answerId]
      setAnswers(newAnswers)
      setSelectedOption(null)

      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
        }, 800)
      } else {
        // All questions answered, calculate position
        setIsAnalyzing(true)
        setTimeout(() => {
          const position = calculateWaitlistPosition(newAnswers)
          setWaitlistPosition(position)
          setIsAnalyzing(false)
          setShowResult(true)
        }, 2500)
      }
    }, 600)
  }

  const calculateWaitlistPosition = (userAnswers: string[]): number => {
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
    const position = Math.max(1, Math.min(100, Math.floor(101 - (score * 1.5))))
    return position
  }

  const getPositionMessage = (position: number) => {
    if (position <= 10) return "Genesis Inner Circle"
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

  const currentQ = questions[currentQuestion]
  const leftOptions = currentQ?.options.filter(opt => opt.side === 'left') || []
  const rightOptions = currentQ?.options.filter(opt => opt.side === 'right') || []

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Premium background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/30 to-black" />
        
        {/* Dual glow effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
          animate={{
            backgroundColor: ['rgba(22, 255, 225, 0.03)', 'rgba(22, 255, 225, 0.05)', 'rgba(22, 255, 225, 0.03)']
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
          animate={{
            backgroundColor: ['rgba(139, 92, 246, 0.03)', 'rgba(139, 92, 246, 0.05)', 'rgba(139, 92, 246, 0.03)']
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
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

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.div 
          className="text-center pt-12 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image 
              src="/MainLogoENoNameNoBackGround.png" 
              alt="Arkana" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-light mb-2 bg-gradient-to-r from-white via-brand-teal to-purple-400 bg-clip-text text-transparent">
            Welcome to Arkana
          </h1>
          <p className="text-gray-300">
            Experience AI that understands you
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult && !isAnalyzing ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="px-6"
            >
              {/* Progress indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-2">
                  {questions.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        index <= currentQuestion ? 'bg-brand-teal w-8' : 'bg-white/20 w-4'
                      }`}
                      layoutId={`progress-${index}`}
                    />
                  ))}
                </div>
              </div>

              {/* Question header */}
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <motion.h2 
                  className="text-2xl font-light mb-3"
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentQ.question}
                </motion.h2>
                <motion.p 
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentQ.subtitle}
                </motion.p>
              </div>

              {/* Split Screen Options */}
              <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Left Panel */}
                <motion.div
                  className="bg-gradient-to-br from-brand-teal/10 to-transparent border border-brand-teal/20 rounded-2xl p-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-medium mb-3 text-brand-teal">
                      {currentQ.leftTitle}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentQ.leftDescription}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {leftOptions.map((option, index) => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleAnswer(option.id)}
                        className={`w-full p-4 text-left rounded-xl transition-all duration-300 border ${
                          selectedOption === option.id
                            ? 'bg-brand-teal/20 border-brand-teal scale-105'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-brand-teal/30'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-1">{option.icon}</span>
                          <div>
                            <div className="font-medium mb-1">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Right Panel */}
                <motion.div
                  className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-medium mb-3 text-purple-400">
                      {currentQ.rightTitle}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentQ.rightDescription}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {rightOptions.map((option, index) => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleAnswer(option.id)}
                        className={`w-full p-4 text-left rounded-xl transition-all duration-300 border ${
                          selectedOption === option.id
                            ? 'bg-purple-500/20 border-purple-400 scale-105'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-400/30'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-1">{option.icon}</span>
                          <div>
                            <div className="font-medium mb-1">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Skip option */}
              <div className="text-center mt-12">
                <button
                  onClick={() => onShowAuth()}
                  className="text-sm text-gray-400 hover:text-brand-teal transition-colors"
                >
                  Skip assessment and join waitlist directly
                </button>
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 px-6"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-8 border-2 border-brand-teal border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-2xl font-light mb-4">Analyzing your intelligence pattern...</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Our AI is processing your responses to create your personalized Arkana experience and determine your optimal access level.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center px-6 py-12"
            >
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-brand-teal/20 to-purple-500/20 border border-brand-teal/30 rounded-2xl p-8 mb-8">
                  <motion.div
                    className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-brand-teal to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    #{waitlistPosition}
                  </motion.div>
                  
                  <h3 className="text-3xl font-light mb-4">
                    {getPositionMessage(waitlistPosition!)}
                  </h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    {getPositionDescription(waitlistPosition!)}
                  </p>
                  
                  <div className="text-sm text-gray-400 mb-8 p-4 bg-white/5 rounded-xl">
                    Your responses indicate a <strong className="text-brand-teal">
                      {waitlistPosition! <= 25 ? 'high' : 'moderate'} alignment
                    </strong> with Arkana's emotional intelligence capabilities.
                  </div>
                </div>

                <div className="grid gap-4 max-w-md mx-auto">
                  <motion.button
                    onClick={() => onShowAuth(waitlistPosition!, answers)}
                    className="w-full px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-teal/80 text-black font-semibold rounded-xl hover:from-brand-teal/90 hover:to-brand-teal/70 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Secure Your #{waitlistPosition} Position
                  </motion.button>
                  
                  <motion.button
                    onClick={onAccess}
                    className="w-full px-8 py-3 bg-white/5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Arkana First
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}