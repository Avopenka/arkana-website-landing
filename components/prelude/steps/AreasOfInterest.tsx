'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { WaitlistFormData } from '../types'

interface AreasOfInterestProps {
  formData: WaitlistFormData
  updateFormData: (data: Partial<WaitlistFormData>) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

const INTEREST_OPTIONS = [
  { 
    value: 'enhanced-focus', 
    label: 'Cultivating Deep Work and Undistracted Focus',
    icon: '🎯',
    color: 'sacred7-focus'
  },
  { 
    value: 'creative-flow', 
    label: 'Unlocking Creative Potential and Idea Synthesis',
    icon: '💡',
    color: 'sacred7-flow'
  },
  { 
    value: 'ai-insights', 
    label: 'Accelerated Learning and AI-Powered Discovery',
    icon: '🧠',
    color: 'sacred7-capture'
  },
  { 
    value: 'productivity', 
    label: 'Hyper-Personalized Productivity and Intelligent Automation',
    icon: '⚡',
    color: 'sacred7-command'
  },
  { 
    value: 'philosophy', 
    label: 'Technology in Harmony with Human Values',
    icon: '🌟',
    color: 'sacred7-presence'
  },
  { 
    value: 'privacy-ai', 
    label: 'Sovereign On-Device Intelligence & Uncompromising Privacy',
    icon: '🔒',
    color: 'sacred7-connections'
  },
  { 
    value: 'multi-device', 
    label: 'Fluid Continuity Across Your Apple Ecosystem',
    icon: '🔗',
    color: 'sacred7-reflection'
  }
]

export function AreasOfInterest({ formData, updateFormData, onSubmit, onBack, isSubmitting }: AreasOfInterestProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(formData.interests || [])
  const [otherInterest, setOtherInterest] = useState(formData.otherInterest || '')

  const toggleInterest = (value: string) => {
    setSelectedInterests(prev => 
      prev.includes(value) 
        ? prev.filter(i => i !== value)
        : [...prev, value]
    )
  }

  const handleSubmit = () => {
    updateFormData({
      interests: selectedInterests,
      otherInterest
    })
    onSubmit()
  }

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
          Areas of Interest
        </h2>
        <p className="font-body text-body text-text-secondary max-w-lg mx-auto">
          What aspects of Arkana are you most excited to explore?
        </p>
        <p className="text-footnote text-text-disabled mt-whisper">
          Select all that apply
        </p>
      </div>

      {/* Interest options */}
      <div className="grid gap-whisper">
        {INTEREST_OPTIONS.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => toggleInterest(option.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              p-voice rounded-luxury text-left transition-all duration-300 group
              ${selectedInterests.includes(option.value)
                ? 'bg-violet-pulse/20 border-violet-pulse/50'
                : 'bg-card-dark/30 border-white/10 hover:border-white/20'
              }
              border backdrop-blur-sm
            `}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-voice">
              {/* Checkbox */}
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                transition-all duration-300
                ${selectedInterests.includes(option.value)
                  ? 'border-violet-pulse bg-violet-pulse'
                  : 'border-white/30 group-hover:border-white/50'
                }
              `}>
                {selectedInterests.includes(option.value) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-luxury-pristine-white rounded-sm"
                  />
                )}
              </div>

              {/* Icon */}
              <span className="text-title2">{option.icon}</span>

              {/* Label */}
              <span className={`
                font-precision-sans text-body flex-1
                ${selectedInterests.includes(option.value)
                  ? 'text-luxury-pristine-white'
                  : 'text-text-secondary group-hover:text-text-primary'
                }
              `}>
                {option.label}
              </span>

              {/* Sacred7 color hint */}
              <div className={`
                w-2 h-2 rounded-circular opacity-50
                bg-${option.color}
              `} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Other interest text area */}
      <label className="block">
        <span className="font-precision-sans text-subheadline text-text-secondary mb-whisper block">
          What unique challenge or aspiration do you envision Arkana addressing for you?
        </span>
        <textarea
          value={otherInterest}
          onChange={(e) => setOtherInterest(e.target.value)}
          placeholder="Describe a specific scenario or need..."
          rows={3}
          className="w-full px-voice py-statement bg-card-dark/50 backdrop-blur-sm border border-white/10 
                   rounded-luxury text-body text-text-primary placeholder:text-text-disabled
                   focus:outline-none focus:border-violet-pulse/50 focus:ring-1 focus:ring-violet-pulse/20
                   transition-all duration-300"
        />
      </label>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-presence">
        <motion.button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-presence py-voice rounded-luxury font-precision-sans text-body font-medium
                   bg-transparent text-text-secondary hover:text-text-primary border border-white/10
                   hover:border-white/20 transition-all duration-300 flex items-center gap-whisper
                   disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`
            px-presence py-voice rounded-luxury font-precision-sans text-body font-medium
            transition-all duration-300 flex items-center gap-whisper
            ${!isSubmitting
              ? 'bg-gradient-to-r from-violet-pulse to-accent-cyan text-luxury-pristine-white hover:opacity-90'
              : 'bg-card-dark/50 text-text-disabled cursor-not-allowed'
            }
          `}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-text-disabled border-t-transparent rounded-circular"
              />
              Joining the Prelude...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Complete Your Journey
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}