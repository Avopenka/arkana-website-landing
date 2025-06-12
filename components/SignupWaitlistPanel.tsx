'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type PanelMode = 'waitlist' | 'signup'

export default function SignupWaitlistPanel({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<PanelMode>('waitlist')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Add to waitlist
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        if (error.code === '23505') {
          setError('This email is already on the waitlist!')
        } else {
          setError(error.message)
        }
        setIsLoading(false)
        return
      }

      // Success
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Also add to waitlist with 'approved' status
        await supabase
          .from('waitlist')
          .insert([
            {
              email,
              status: 'approved',
              created_at: new Date().toISOString()
            }
          ])

        setSuccess(true)
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

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {mode === 'waitlist' ? "You're on the list!" : 'Welcome to Arkana!'}
        </h3>
        <p className="text-gray-400">
          {mode === 'waitlist' 
            ? "We'll notify you when your spot opens up."
            : 'Your account has been created successfully.'}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          {mode === 'waitlist' ? 'Join the Waitlist' : 'Create Account'}
        </h2>
        <p className="text-gray-400 mb-8">
          {mode === 'waitlist' 
            ? 'Be among the first to experience Arkana'
            : 'Start your journey with Arkana today'}
        </p>

        {/* Mode Toggle */}
        <div className="flex bg-gray-900/50 rounded-lg p-1 mb-8">
          <button
            onClick={() => setMode('waitlist')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === 'waitlist'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Join Waitlist
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'waitlist' ? (
            <motion.form
              key="waitlist"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleWaitlistSubmit}
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label htmlFor="waitlist-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 
                           focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-300">Early access to new features</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-300">Exclusive founding member pricing</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-300">Priority support and onboarding</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/20 border border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 
                         text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/25 
                         transform hover:scale-[1.02] transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining waitlist...
                  </span>
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSignupSubmit}
              className="space-y-6"
            >
              {/* Name Input */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 
                           focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 
                           focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 
                           focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                           text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 
                           focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/20 border border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 
                         text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 
                         transform hover:scale-[1.02] transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}