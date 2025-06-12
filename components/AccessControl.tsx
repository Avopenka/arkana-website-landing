'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AccessControlProps {
  onAuthenticated: () => void
}

export function AccessControl({ onAuthenticated }: AccessControlProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Only accept the specific code
    if (code.trim() === 'iBelieveinyou') {
      // Store authentication
      localStorage.setItem('arkana_access_granted', 'true')
      onAuthenticated()
    } else {
      setError('Access denied')
      setCode('')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-white text-lg font-light tracking-wide">
              Access Required
            </h1>
          </div>

          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter access code"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}