'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { WaitlistFormData } from '../types'

interface ContactInformationProps {
  formData: WaitlistFormData
  updateFormData: (data: Partial<WaitlistFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function ContactInformation({ formData, updateFormData, onNext, onBack }: ContactInformationProps) {
  const [email, setEmail] = useState(formData.email || '')
  const [firstName, setFirstName] = useState(formData.firstName || '')
  const [lastName, setLastName] = useState(formData.lastName || '')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (emailError && validateEmail(value)) {
      setEmailError('')
    }
  }

  const handleNext = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    updateFormData({
      email,
      firstName,
      lastName
    })
    onNext()
  }

  const canProceed = email && validateEmail(email)

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
          Contact Information
        </h2>
        <p className="font-body text-body text-text-secondary">
          To keep you informed about Arkana’s evolution and your place in it.
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-statement">
        {/* Email field - Required */}
        <div>
          <label className="block">
            <span className="font-precision-sans text-subheadline text-text-secondary mb-whisper block">
              Email Address <span className="text-accent-gold">*</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="your@email.com"
              className={`
                w-full px-voice py-statement bg-card-dark/50 backdrop-blur-sm border rounded-luxury
                text-body text-text-primary placeholder:text-text-disabled
                focus:outline-none focus:ring-1 transition-all duration-300
                ${emailError 
                  ? 'border-danger-red/50 focus:border-danger-red focus:ring-danger-red/20' 
                  : 'border-white/10 focus:border-violet-pulse/50 focus:ring-violet-pulse/20'
                }
              `}
            />
            {emailError && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-caption1 text-danger-red mt-whisper block"
              >
                {emailError}
              </motion.span>
            )}
          </label>
        </div>

        {/* Name fields - Optional */}
        <div className="grid md:grid-cols-2 gap-statement">
          <label className="block">
            <span className="font-precision-sans text-subheadline text-text-secondary mb-whisper block">
              First Name <span className="text-text-disabled text-footnote">(Optional)</span>
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-voice py-statement bg-card-dark/50 backdrop-blur-sm border border-white/10 
                       rounded-luxury text-body text-text-primary placeholder:text-text-disabled
                       focus:outline-none focus:border-violet-pulse/50 focus:ring-1 focus:ring-violet-pulse/20
                       transition-all duration-300"
            />
          </label>

          <label className="block">
            <span className="font-precision-sans text-subheadline text-text-secondary mb-whisper block">
              Last Name <span className="text-text-disabled text-footnote">(Optional)</span>
            </span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              className="w-full px-voice py-statement bg-card-dark/50 backdrop-blur-sm border border-white/10 
                       rounded-luxury text-body text-text-primary placeholder:text-text-disabled
                       focus:outline-none focus:border-violet-pulse/50 focus:ring-1 focus:ring-violet-pulse/20
                       transition-all duration-300"
            />
          </label>
        </div>

        {/* Privacy note */}
        <div className="bg-card-dark/30 backdrop-blur-sm border border-white/5 rounded-luxury p-voice">
          <p className="text-footnote text-text-secondary leading-relaxed">
            Your personal information is sacred to us. We use it solely to communicate about your 
            Arkana journey and will never share it with third parties.
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-presence">
        <motion.button
          onClick={onBack}
          className="px-presence py-voice rounded-luxury font-precision-sans text-body font-medium
                   bg-transparent text-text-secondary hover:text-text-primary border border-white/10
                   hover:border-white/20 transition-all duration-300 flex items-center gap-whisper"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </motion.button>

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