'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginPanel from './LoginPanel'
import QuestionnaireSignup from './QuestionnaireSignup'

export default function DualScreenAuth({ onSuccess }: { onSuccess: () => void }) {
  const [activePanel, setActivePanel] = useState<'login' | 'signup'>('login')
  
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Login */}
        <motion.div 
          className="flex items-center justify-center p-8 bg-black lg:border-r lg:border-gray-800"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-md">
            <LoginPanel onSuccess={onSuccess} />
            
            {/* Mobile toggle */}
            <div className="mt-8 text-center lg:hidden">
              <button
                onClick={() => setActivePanel('signup')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Don't have an account? <span className="text-white font-semibold">Take Assessment</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Right Panel - Questionnaire Signup */}
        <motion.div 
          className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-4xl">
            <QuestionnaireSignup onSuccess={onSuccess} />
          </div>
        </motion.div>
        
        {/* Mobile Signup Panel */}
        <AnimatePresence>
          {activePanel === 'signup' && (
            <motion.div 
              className="fixed inset-0 z-60 flex lg:hidden items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full max-w-lg">
                <QuestionnaireSignup onSuccess={onSuccess} />
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setActivePanel('login')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Already have an account? <span className="text-white font-semibold">Log in</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Arkana Branding */}
        <div className="absolute top-8 left-8 z-70">
          <h1 className="text-2xl font-bold text-white">ARKANA</h1>
          <p className="text-sm text-gray-400">AI-Powered Intelligence</p>
        </div>
      </div>
    </div>
  )
}