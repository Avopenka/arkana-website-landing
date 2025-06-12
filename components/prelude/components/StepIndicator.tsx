'use client'

import { motion } from 'framer-motion'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-whisper">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <motion.div
            className={`
              w-10 h-10 rounded-circular flex items-center justify-center
              font-precision-sans text-footnote font-medium
              transition-all duration-300
              ${step === currentStep 
                ? 'bg-violet-pulse text-luxury-pristine-white' 
                : step < currentStep
                  ? 'bg-accent-cyan text-luxury-pristine-white'
                  : 'bg-card-dark/50 text-text-disabled border border-white/10'
              }
            `}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: step * 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            {step < currentStep ? '✓' : step}
          </motion.div>
          
          {step < totalSteps && (
            <motion.div
              className={`
                w-12 h-px mx-whisper
                transition-all duration-500
                ${step < currentStep ? 'bg-accent-cyan' : 'bg-white/10'}
              `}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: step * 0.1 + 0.2 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}