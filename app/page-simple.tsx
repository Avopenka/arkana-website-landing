'use client'

import { useState } from 'react'
import DualScreenAuth from '../components/DualScreenAuth'

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Arkana</h1>
        
        <button
          onClick={() => setShowAuth(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-transform"
        >
          Sign In / Sign Up
        </button>
        
        {showAuth && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative max-w-6xl w-full">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <DualScreenAuth onSuccess={() => setShowAuth(false)} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
