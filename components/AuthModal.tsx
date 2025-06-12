'use client'

// PACA v12 Simplified Auth Modal - Consolidated from ArkanaAuthV11  
import React, { useState } from 'react'

interface AuthModalProps {
  onAuthenticated: () => void
}

export default function AuthModal({ onAuthenticated }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate auth process
    setTimeout(() => {
      setIsLoading(false)
      onAuthenticated()
    }, 1000)
  }

  return (
    <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light text-white mb-2">Join Genesis Wave</h2>
        <p className="text-gray-400">
          Secure your spot among the first 100 users
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join Genesis Wave'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          €25/month • 100-year price lock • Only 93 spots left
        </p>
      </div>
    </div>
  )
}