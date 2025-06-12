'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { WaitlistFormData } from '../types'

interface PhilosophicalResonanceProps {
  formData: WaitlistFormData
  updateFormData: (data: Partial<WaitlistFormData>) => void
  onNext: () => void
}

export function PhilosophicalResonance({ formData, updateFormData, onNext }: PhilosophicalResonanceProps) {
  const [textResponse, setTextResponse] = useState(formData.philosophicalResponse || '')
  const [selectedResonance, setSelectedResonance] = useState(formData.resonanceType || '')
  // State for the 'Other' text input
  const [otherResonanceText, setOtherResonanceText] = useState((formData as any).philosophicalResonanceOtherText || '')

  const handleNext = () => {
    updateFormData({
      philosophicalResponse: textResponse,
      resonanceType: selectedResonance as any,
      // Add the 'other' text if 'other' is selected
      philosophicalResonanceOtherText: selectedResonance === 'other' ? otherResonanceText : undefined
    })
    onNext()
  }

  // Updated canProceed logic for 'Other' option
  const canProceed = textResponse.trim().length > 0 || 
                     (selectedResonance && 
                      (selectedResonance !== 'other' || 
                       (selectedResonance === 'other' && otherResonanceText.trim().length > 0)));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-statement"
    >
      {/* Section title */}
      <div className="text-center mb-presence">
        <h2 className="font-primary-serif text-title1 md:text-statement text-luxury-pristine-white mb-whisper">
          Philosophical Resonance
        </h2>
        <p className="font-body text-body text-text-secondary">
          To begin, we'd like to understand what draws you to Arkana
        </p>
      </div>

      {/* Open-ended question */}
      <div className="space-y-voice">
        <label className="block">
          <span className="font-precision-sans text-subheadline text-text-secondary mb-whisper block">
            What does "effortless technology" truly mean to you?
          </span>
          <textarea
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-voice py-statement bg-card-dark/50 backdrop-blur-sm border border-white/10 
                     rounded-luxury text-body text-text-primary placeholder:text-text-disabled
                     focus:outline-none focus:border-violet-pulse/50 focus:ring-1 focus:ring-violet-pulse/20
                     transition-all duration-300 min-h-[120px] resize-none"
          />
          <span className="text-caption1 text-text-disabled mt-whisper block">
            Optional - 250 characters max
          </span>
        </label>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-voice my-presence">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-footnote text-text-disabled font-body">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Multiple choice question */}
      <div className="space-y-voice">
        <p className="font-precision-sans text-subheadline text-text-secondary">
          Which principle resonates most with your ideal tech experience?
        </p>
        
        <div className="space-y-whisper">
          {[
            {
              value: 'seamless-flow',
              label: 'Seamless Flow',
              description: 'An interface that anticipates and adapts, feeling like a natural extension of my thought.',
            },
            {
              value: 'deep-focus',
              label: 'Deep Focus',
              description: 'A digital environment that shields from distraction and cultivates profound concentration.',
            },
            {
              value: 'intuitive-understanding',
              label: 'Intuitive Understanding',
              description: 'AI that grasps not just commands, but context and intent, fostering true partnership.',
            },
            {
              value: 'other',
              label: 'Other (please specify)',
              description: 'Something else draws you to Arkana, or a unique combination of aspects.',
            },
          ].map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setSelectedResonance(option.value)}
              className={`
                w-full p-statement rounded-luxury text-left transition-all duration-300
                ${selectedResonance === option.value
                  ? 'bg-violet-pulse/20 border-violet-pulse/50'
                  : 'bg-card-dark/30 border-white/10 hover:border-white/20'
                }
                border backdrop-blur-sm
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-voice">
                <div className={`
                  w-5 h-5 rounded-circular border-2 mt-1 flex items-center justify-center
                  transition-all duration-300
                  ${selectedResonance === option.value
                    ? 'border-violet-pulse bg-violet-pulse'
                    : 'border-white/30'
                  }
                `}>
                  {selectedResonance === option.value && (
                    <div className="w-2 h-2 bg-luxury-pristine-white rounded-circular" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-precision-sans text-body font-medium text-luxury-pristine-white mb-breath">
                    {option.label}
                  </h3>
                  <p className="font-body text-footnote text-text-secondary">
                    {option.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        {/* Conditional textarea for 'Other' option */}
        {selectedResonance === 'other' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 'var(--spacing-voice)' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="w-full"
          >
            <textarea
              value={otherResonanceText}
              onChange={(e) => setOtherResonanceText(e.target.value)}
              placeholder="Please specify what resonates with you..."
              rows={4}
              className="w-full px-voice py-statement bg-card-dark/50 backdrop-blur-sm border border-white/20 rounded-subtle focus:border-violet-pulse focus:ring-1 focus:ring-violet-pulse transition-all text-luxury-pristine-white placeholder-text-disabled"
            />
          </motion.div>
        )}
      </div>

      {/* Continue button */}
      <div className="flex justify-end pt-presence">
        <motion.button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            px-presence py-voice rounded-luxury font-precision-sans text-body font-medium
            transition-all duration-300 flex items-center gap-whisper
            ${canProceed
              ? 'bg-violet-pulse text-luxury-pristine-white hover:bg-violet-pulse/90'
              : 'bg-card-dark/50 text-text-disabled cursor-not-allowed'
            }
          `}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}