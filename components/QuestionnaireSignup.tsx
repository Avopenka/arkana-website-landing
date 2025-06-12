'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  question: string
  leftTitle: string
  rightTitle: string
  leftDescription: string
  rightDescription: string
  leftEmoji: string
  rightEmoji: string
  options: {
    left: { value: string; label: string; score: number }[]
    right: { value: string; label: string; score: number }[]
  }
}

interface UserData {
  email: string
  password: string
  name: string
  answers: Record<string, string>
  position: number
}

export default function QuestionnaireSignup({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<'questions' | 'signup' | 'success'>('questions')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [userData, setUserData] = useState<Partial<UserData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  const questions: Question[] = [
    {
      id: 'interaction_style',
      question: "How do you prefer AI interaction?",
      leftTitle: "Conversational Flow",
      rightTitle: "Direct Efficiency", 
      leftDescription: "Natural dialogue, context-aware responses",
      rightDescription: "Quick commands, precise results",
      leftEmoji: "💭",
      rightEmoji: "⚡",
      options: {
        left: [
          { value: "conversational_deep", label: "Deep conversations", score: 15 },
          { value: "conversational_context", label: "Context-aware chat", score: 12 },
          { value: "conversational_natural", label: "Natural dialogue", score: 10 }
        ],
        right: [
          { value: "direct_commands", label: "Quick commands", score: 8 },
          { value: "direct_structured", label: "Structured queries", score: 10 },
          { value: "direct_precise", label: "Precise instructions", score: 12 }
        ]
      }
    },
    {
      id: 'work_goals',
      question: "What's your primary goal with AI?",
      leftTitle: "Creative Enhancement",
      rightTitle: "Productivity Boost",
      leftDescription: "Brainstorming, ideation, creative projects",
      rightDescription: "Task automation, data analysis, efficiency",
      leftEmoji: "🎨",
      rightEmoji: "📊",
      options: {
        left: [
          { value: "creative_brainstorm", label: "Brainstorming partner", score: 15 },
          { value: "creative_content", label: "Content creation", score: 12 },
          { value: "creative_design", label: "Design assistance", score: 10 }
        ],
        right: [
          { value: "productive_automate", label: "Task automation", score: 8 },
          { value: "productive_analyze", label: "Data analysis", score: 10 },
          { value: "productive_organize", label: "Information management", score: 12 }
        ]
      }
    },
    {
      id: 'ai_experience',
      question: "Your experience with AI tools?",
      leftTitle: "AI Explorer",
      rightTitle: "AI Power User",
      leftDescription: "Curious about AI potential, learning",
      rightDescription: "Daily AI user, advanced workflows",
      leftEmoji: "🔍",
      rightEmoji: "🚀",
      options: {
        left: [
          { value: "explorer_new", label: "New to AI tools", score: 8 },
          { value: "explorer_occasional", label: "Occasional user", score: 10 },
          { value: "explorer_learning", label: "Actively learning", score: 12 }
        ],
        right: [
          { value: "power_daily", label: "Daily AI workflows", score: 15 },
          { value: "power_advanced", label: "Advanced integrations", score: 18 },
          { value: "power_expert", label: "AI development experience", score: 20 }
        ]
      }
    }
  ]

  const calculatePosition = (userAnswers: Record<string, string>) => {
    let totalScore = 0
    const baseTimeScore = Math.min(30, Date.now() % 30) // Random time-based component
    
    Object.entries(userAnswers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId)
      if (question) {
        // Find the score for the selected answer
        const leftOption = question.options.left.find(opt => opt.value === answer)
        const rightOption = question.options.right.find(opt => opt.value === answer)
        const score = leftOption?.score || rightOption?.score || 0
        totalScore += score
      }
    })

    // Calculate position (lower is better)
    const maxPossibleScore = questions.reduce((sum, q) => {
      const maxLeft = Math.max(...q.options.left.map(opt => opt.score))
      const maxRight = Math.max(...q.options.right.map(opt => opt.score))
      return sum + Math.max(maxLeft, maxRight)
    }, 0)

    const scorePercentage = totalScore / maxPossibleScore
    const finalPosition = Math.max(1, Math.round((1 - scorePercentage) * 500 + baseTimeScore))
    
    return Math.min(finalPosition, 999) // Cap at position 999
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 500)
    } else {
      // All questions answered, calculate position and go to signup
      const position = calculatePosition(newAnswers)
      setUserData({ answers: newAnswers, position })
      setTimeout(() => {
        setStep('signup')
      }, 500)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('name') as string
    
    // Split name into first and last name
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    try {
      // Create account with Supabase Auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            questionnaire_completed: true,
            waitlist_position: userData.position
          }
        }
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (authData.user) {
        // Call waitlist API with correct data structure
        const waitlistPayload = {
          firstName,
          lastName,
          email,
          ageGroup: '25-44', // Default for now
          profession: 'Not specified', // Default for now
          arkanaGoal: 'Personalized AI assistance',
          waitlistPosition: userData.position,
          questionAnswers: Object.values(userData.answers || {})
        }

        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(waitlistPayload)
        })

        if (!response.ok) {
          console.warn('Waitlist API call failed, but account was created')
        }

        setStep('success')
        setTimeout(() => {
          onSuccess()
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Welcome to Arkana!</h3>
        <p className="text-gray-400 mb-4">Your account has been created successfully.</p>
        <div className="bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-300">
            Your waitlist position: <span className="font-bold text-purple-400">#{userData.position}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Based on your preferences, you'll receive personalized onboarding
          </p>
        </div>
      </motion.div>
    )
  }

  if (step === 'signup') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-white mb-2 tracking-tight">Almost There!</h2>
          <p className="text-gray-400 text-sm opacity-80">Create your account to secure your spot</p>
          <div className="mt-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4">
            <p className="text-sm text-gray-300">
              Your calculated position: <span className="font-semibold text-cyan-400">#{userData.position}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSignupSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wider opacity-70">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-5 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/30 
                       focus:ring-1 focus:ring-purple-500/20 focus:bg-white/[0.05]
                       transition-all duration-300 font-light tracking-wide
                       hover:bg-white/[0.03] hover:border-white/[0.12]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wider opacity-70">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-5 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/30 
                       focus:ring-1 focus:ring-purple-500/20 focus:bg-white/[0.05]
                       transition-all duration-300 font-light tracking-wide
                       hover:bg-white/[0.03] hover:border-white/[0.12]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wider opacity-70">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full px-5 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/30 
                       focus:ring-1 focus:ring-purple-500/20 focus:bg-white/[0.05]
                       transition-all duration-300 font-light tracking-wide
                       hover:bg-white/[0.03] hover:border-white/[0.12]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/20 border border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-purple-400 
                     text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 
                     transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">
              {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Secure My Spot'
            )}
            </span>
          </button>
        </form>
      </motion.div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-gray-400">{Math.round(((currentQuestion) / questions.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {currentQ.question}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Option */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{currentQ.leftEmoji}</div>
                <h3 className="text-xl font-bold text-white">{currentQ.leftTitle}</h3>
                <p className="text-gray-400 text-sm">{currentQ.leftDescription}</p>
              </div>
              
              <div className="space-y-3">
                {currentQ.options.left.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswerSelect(currentQ.id, option.value)}
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg 
                             text-left hover:border-purple-500 hover:bg-gray-800 
                             transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-white group-hover:text-purple-200 transition-colors">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right Option */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{currentQ.rightEmoji}</div>
                <h3 className="text-xl font-bold text-white">{currentQ.rightTitle}</h3>
                <p className="text-gray-400 text-sm">{currentQ.rightDescription}</p>
              </div>
              
              <div className="space-y-3">
                {currentQ.options.right.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswerSelect(currentQ.id, option.value)}
                    className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg 
                             text-left hover:border-blue-500 hover:bg-gray-800 
                             transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-white group-hover:text-blue-200 transition-colors">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}