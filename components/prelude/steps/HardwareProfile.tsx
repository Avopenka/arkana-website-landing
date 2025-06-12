'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Cpu, HardDrive } from 'lucide-react'
import { WaitlistFormData } from '../types'

interface HardwareProfileProps {
  formData: WaitlistFormData
  updateFormData: (data: Partial<WaitlistFormData>) => void
  onNext: () => void
  onBack: () => void
}

const DEVICE_FAMILIES = [
  { value: 'macbook-pro', label: 'MacBook Pro' },
  { value: 'mac-studio', label: 'Mac Studio' },
  { value: 'mac-pro', label: 'Mac Pro' },
  { value: 'imac', label: 'iMac' },
  { value: 'mac-mini', label: 'Mac mini' },
  { value: 'ipad-pro', label: 'iPad Pro (M-series)' }
]

const CHIP_GENERATIONS = {
  'macbook-pro': [
    { value: 'm1-base', label: 'M1' },
    { value: 'm1-pro', label: 'M1 Pro' },
    { value: 'm1-max', label: 'M1 Max' },
    { value: 'm2-base', label: 'M2' },
    { value: 'm2-pro', label: 'M2 Pro' },
    { value: 'm2-max', label: 'M2 Max' },
    { value: 'm3-base', label: 'M3' },
    { value: 'm3-pro', label: 'M3 Pro' },
    { value: 'm3-max', label: 'M3 Max' },
    { value: 'm4-pro', label: 'M4 Pro (Late 2024)' },
    { value: 'm4-max', label: 'M4 Max (Late 2024)' }
  ],
  'mac-studio': [
    { value: 'm1-max', label: 'M1 Max' },
    { value: 'm1-ultra', label: 'M1 Ultra' },
    { value: 'm2-max', label: 'M2 Max' },
    { value: 'm2-ultra', label: 'M2 Ultra' },
    { value: 'm3-ultra', label: 'M3 Ultra' }
  ],
  'mac-pro': [
    { value: 'm2-ultra', label: 'M2 Ultra' },
    { value: 'm3-ultra', label: 'M3 Ultra' }
  ],
  'imac': [
    { value: 'm1-base', label: 'M1' },
    { value: 'm3-base', label: 'M3' },
    { value: 'm4-base', label: 'M4 (Expected 2025)' }
  ],
  'mac-mini': [
    { value: 'm1-base', label: 'M1' },
    { value: 'm2-base', label: 'M2' },
    { value: 'm2-pro', label: 'M2 Pro' },
    { value: 'm4-base', label: 'M4 (Expected 2025)' },
    { value: 'm4-pro', label: 'M4 Pro (Expected 2025)' }
  ],
  'ipad-pro': [
    { value: 'm1-base', label: 'M1' },
    { value: 'm2-base', label: 'M2' },
    { value: 'm4-base', label: 'M4' }
  ]
}

const RAM_OPTIONS = [
  { value: '8gb', label: '8GB', note: 'iPad Pro only' },
  { value: '16gb', label: '16GB' },
  { value: '24gb', label: '24GB' },
  { value: '32gb', label: '32GB' },
  { value: '36gb', label: '36GB', note: 'M3 Pro' },
  { value: '48gb', label: '48GB', note: 'M3 Max' },
  { value: '64gb', label: '64GB' },
  { value: '96gb', label: '96GB' },
  { value: '128gb', label: '128GB' },
  { value: '192gb', label: '192GB', note: 'Mac Pro' }
]

export function HardwareProfile({ formData, updateFormData, onNext, onBack }: HardwareProfileProps) {
  const [deviceFamily, setDeviceFamily] = useState(formData.deviceFamily || '')
  const [chipGeneration, setChipGeneration] = useState(formData.chipGeneration || '')
  const [ramSize, setRamSize] = useState(formData.ramSize || '')
  const [plannedUpgrade, setPlannedUpgrade] = useState(formData.plannedUpgrade || false)

  const handleNext = () => {
    updateFormData({
      deviceFamily,
      chipGeneration,
      ramSize,
      plannedUpgrade
    })
    onNext()
  }

  const canProceed = deviceFamily && chipGeneration && ramSize

  const availableChips = deviceFamily ? CHIP_GENERATIONS[deviceFamily as keyof typeof CHIP_GENERATIONS] || [] : []

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
          Hardware Profile
        </h2>
        <p className="font-body text-body text-text-secondary max-w-lg mx-auto">
          Arkana harnesses the full potential of modern Apple hardware. Help us understand 
          how to best serve you.
        </p>
      </div>

      {/* Hardware form */}
      <div className="space-y-statement">
        {/* Device Family */}
        <div>
          <label className="font-precision-sans text-subheadline text-text-secondary mb-voice block">
            Primary Apple Device <span className="text-accent-gold">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-whisper">
            {DEVICE_FAMILIES.map((device) => (
              <motion.button
                key={device.value}
                onClick={() => {
                  setDeviceFamily(device.value)
                  setChipGeneration('') // Reset chip when device changes
                }}
                className={`
                  p-voice rounded-luxury text-footnote font-precision-sans transition-all duration-300
                  ${deviceFamily === device.value
                    ? 'bg-violet-pulse/20 border-violet-pulse/50 text-luxury-pristine-white'
                    : 'bg-card-dark/30 border-white/10 text-text-secondary hover:border-white/20'
                  }
                  border backdrop-blur-sm
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {device.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chip Generation */}
        {deviceFamily && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="font-precision-sans text-subheadline text-text-secondary mb-voice block flex items-center gap-whisper">
              <Cpu className="w-4 h-4" />
              Chip Generation <span className="text-accent-gold">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-whisper">
              {availableChips.map((chip) => (
                <motion.button
                  key={chip.value}
                  onClick={() => setChipGeneration(chip.value)}
                  className={`
                    p-voice rounded-luxury text-footnote font-precision-sans transition-all duration-300
                    ${chipGeneration === chip.value
                      ? 'bg-violet-pulse/20 border-violet-pulse/50 text-luxury-pristine-white'
                      : 'bg-card-dark/30 border-white/10 text-text-secondary hover:border-white/20'
                    }
                    border backdrop-blur-sm
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RAM Size */}
        <div>
          <label className="font-precision-sans text-subheadline text-text-secondary mb-voice block flex items-center gap-whisper">
            <HardDrive className="w-4 h-4" />
            Unified Memory (RAM) <span className="text-accent-gold">*</span>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-whisper">
            {RAM_OPTIONS.map((ram) => (
              <motion.button
                key={ram.value}
                onClick={() => setRamSize(ram.value)}
                className={`
                  p-voice rounded-luxury text-footnote font-precision-sans transition-all duration-300
                  ${ramSize === ram.value
                    ? 'bg-violet-pulse/20 border-violet-pulse/50 text-luxury-pristine-white'
                    : 'bg-card-dark/30 border-white/10 text-text-secondary hover:border-white/20'
                  }
                  border backdrop-blur-sm relative
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {ram.label}
                {ram.note && (
                  <span className="absolute -top-1 -right-1 text-whisper bg-accent-cyan/20 
                                 text-accent-cyan px-1 rounded">
                    {ram.note}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Upgrade Intent */}
        <div className="bg-card-dark/30 backdrop-blur-sm border border-white/5 rounded-luxury p-voice">
          <label className="flex items-start gap-voice cursor-pointer">
            <input
              type="checkbox"
              checked={plannedUpgrade}
              onChange={(e) => setPlannedUpgrade(e.target.checked)}
              className="mt-1 w-5 h-5 rounded bg-card-dark border border-white/20 
                       checked:bg-violet-pulse checked:border-violet-pulse
                       focus:outline-none focus:ring-2 focus:ring-violet-pulse/20"
            />
            <div>
              <p className="font-precision-sans text-body text-text-primary">
                I'm planning to upgrade to an M4-series (or newer) Mac in late 2024/2025
              </p>
              <p className="text-footnote text-text-secondary mt-breath">
                This helps us prepare Arkana for your future hardware
              </p>
            </div>
          </label>
        </div>

        {/* RAM importance note */}
        <div className="bg-sacred7-capture/10 backdrop-blur-sm border border-sacred7-capture/20 rounded-luxury p-voice">
          <p className="text-footnote text-text-secondary leading-relaxed">
            <strong className="text-sacred7-capture">Why RAM matters:</strong> Arkana's on-device AI 
            capabilities scale with available memory. More RAM enables larger context windows, 
            richer interactions, and more sophisticated local models.
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