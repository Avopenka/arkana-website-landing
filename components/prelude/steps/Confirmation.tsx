'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check, Share2, ArrowRight } from 'lucide-react'
import { WaitlistFormData } from '../types'

interface ConfirmationProps {
  formData: WaitlistFormData
}

export function Confirmation({ formData }: ConfirmationProps) {
  const router = useRouter()
  const firstName = formData.firstName || 'Seeker'

  const shareText = encodeURIComponent(
    "I've entered The Prelude, the first step towards Arkana's companion consciousness. The journey is unfolding."
  )
  const shareUrl = encodeURIComponent('https://arkana.chat')

  return (
    <div className="min-h-screen bg-canvas-deep-navy text-text-primary flex items-center justify-center px-voice py-presence">
      {/* Background effect */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-canvas-deep-navy via-surface-dark to-canvas-deep-navy" />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-violet-pulse/20 via-transparent to-transparent" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-presence bg-gradient-to-br from-violet-pulse to-accent-cyan 
                   rounded-circular flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-luxury-pristine-white" />
        </motion.div>

        {/* Thank you message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="font-primary-serif text-display2 md:text-hero text-luxury-pristine-white mb-breath">
            Welcome to The Prelude, {firstName}.
          </h1>
          <p className="font-body text-title2 md:text-title1 text-text-primary max-w-xl mx-auto mb-presence">
            Your resonance has been recorded. The Prelude is an unfolding experience, a space of anticipation and 
            philosophical alignment before Arkana fully awakens. We will reach out as your cohort is prepared.
          </p>
        </motion.div>

        {/* Confirmation details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-voice mb-presence"
        >
          <p className="font-body text-detail-emphasis text-text-secondary leading-relaxed max-w-lg mx-auto">
            We are shaping an experience that we believe will be transformative, 
            and your early interest is deeply appreciated.
          </p>
          
          {/* Hardware acknowledgment */}
          {formData.ramSize && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-card-dark/30 backdrop-blur-sm border border-white/10 rounded-luxury p-voice max-w-md mx-auto"
            >
              <p className="text-footnote text-text-secondary">
                Your {formData.deviceFamily?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} with{' '}
                {formData.ramSize?.toUpperCase()} of unified memory will enable a{' '}
                <span className="text-accent-gold">
                  {parseInt(formData.ramSize || '0') >= 32 ? 'pinnacle' : 
                   parseInt(formData.ramSize || '0') >= 16 ? 'immersive' : 'core'}
                </span>{' '}
                Arkana experience.
              </p>
            </motion.div>
          )}

          <p className="font-body text-body text-text-secondary">
            We will be in touch with exclusive updates, insights into the Arkana philosophy, 
            and eventually, your invitation.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-statement"
        >
          {/* Share buttons */}
          <div className="flex justify-center gap-voice">
            <motion.a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-voice py-whisper bg-card-dark/50 backdrop-blur-sm border border-white/10 
                       rounded-luxury text-footnote text-text-secondary hover:text-text-primary 
                       hover:border-white/20 transition-all duration-300 flex items-center gap-whisper"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
              Share on X
            </motion.a>
            
            <motion.a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-voice py-whisper bg-card-dark/50 backdrop-blur-sm border border-white/10 
                       rounded-luxury text-footnote text-text-secondary hover:text-text-primary 
                       hover:border-white/20 transition-all duration-300 flex items-center gap-whisper"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
              Share on LinkedIn
            </motion.a>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col sm:flex-row justify-center gap-voice pt-statement">
            <motion.button
              onClick={() => router.push('/')} // Corrected path to homepage
              className="px-presence py-voice bg-transparent text-text-secondary hover:text-text-primary 
                       border border-white/10 hover:border-white/20 rounded-luxury font-precision-sans 
                       text-body transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Return to Arkana
            </motion.button>
            
            <motion.button
              onClick={() => router.push('/system-requirements')}
              className="px-presence py-voice bg-violet-pulse text-luxury-pristine-white 
                       hover:bg-violet-pulse/90 rounded-luxury font-precision-sans text-body 
                       transition-all duration-300 flex items-center justify-center gap-whisper"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore System Requirements
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Final note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
          className="mt-sanctuary text-footnote text-text-disabled"
        >
          Entry into Arkana's core experience will be a carefully orchestrated process, prioritizing those whose 
          systems can fully embrace its depth. The Prelude is your overture.
        </motion.p>
      </motion.div>
    </div>
  )
}