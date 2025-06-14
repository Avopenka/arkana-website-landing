'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPanel({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('arkana-remember-email', email)
        } else {
          localStorage.removeItem('arkana-remember-email')
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('admin_access')
          .eq('id', data.user.id)
          .single()

        if (profile?.admin_access) {
          // Redirect to admin dashboard
          router.push('/admin')
        } else {
          // Success - trigger callback for regular users
          onSuccess()
          router.refresh()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  // Check for remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('arkana-remember-email')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-light text-white mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-sm opacity-80">Sign in to access your Arkana account</p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-2.5 uppercase tracking-wider opacity-70">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/30 
                       focus:ring-1 focus:ring-cyan-500/20 focus:bg-white/[0.05]
                       transition-all duration-300 font-light tracking-wide
                       hover:bg-white/[0.03] hover:border-white/[0.12]"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider opacity-70">
                Password
              </label>
              <a href="#" className="text-xs text-cyan-500/70 hover:text-cyan-400 transition-colors duration-200">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/30 
                       focus:ring-1 focus:ring-cyan-500/20 focus:bg-white/[0.05]
                       transition-all duration-300 font-light tracking-wide
                       hover:bg-white/[0.03] hover:border-white/[0.12]"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-cyan-500 
                       focus:ring-cyan-500 focus:ring-offset-0"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
              Remember me
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl"
            >
              <p className="text-sm text-red-300 font-light flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-cyan-400
                     text-black font-medium rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 
                     transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </span>
          </button>

          {/* Social Login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3.5 bg-white/[0.02] backdrop-blur-xl
                       border border-white/[0.08] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.12]
                       transition-all duration-200 group"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">Google</span>
            </button>
            
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3.5 bg-white/[0.02] backdrop-blur-xl
                       border border-white/[0.08] rounded-xl hover:bg-white/[0.05] hover:border-white/[0.12]
                       transition-all duration-200 group"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">GitHub</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}