'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LuxuryGlassProps {
  children: ReactNode
  className?: string
  intensity?: 'minimal' | 'light' | 'medium' | 'strong' | 'maximum'
  variant?: 'default' | 'cyan' | 'purple' | 'gold' | 'glass-only'
  hover?: boolean
  onClick?: () => void
}

export default function LuxuryGlass({ 
  children, 
  className = '', 
  intensity = 'medium',
  variant = 'default',
  hover = true,
  onClick 
}: LuxuryGlassProps) {
  
  const getGlassStyles = () => {
    const baseStyles = "backdrop-blur border relative overflow-hidden"
    
    switch (intensity) {
      case 'minimal':
        return `${baseStyles} backdrop-blur-sm bg-white/5`
      case 'light':
        return `${baseStyles} backdrop-blur-md bg-white/10`
      case 'medium':
        return `${baseStyles} backdrop-blur-lg bg-white/15`
      case 'strong':
        return `${baseStyles} backdrop-blur-xl bg-white/20`
      case 'maximum':
        return `${baseStyles} backdrop-blur-2xl bg-white/25`
      default:
        return `${baseStyles} backdrop-blur-lg bg-white/15`
    }
  }

  const getBorderStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'border-cyan-400/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]'
      case 'purple':
        return 'border-purple-400/30 shadow-[0_0_30px_rgba(147,51,234,0.1)]'
      case 'gold':
        return 'border-yellow-400/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]'
      case 'glass-only':
        return 'border-white/10'
      default:
        return 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
    }
  }

  const getHoverStyles = () => {
    if (!hover) return ''
    
    switch (variant) {
      case 'cyan':
        return 'hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,255,255,0.2)] hover:bg-white/20'
      case 'purple':
        return 'hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(147,51,234,0.2)] hover:bg-white/20'
      case 'gold':
        return 'hover:border-yellow-400/50 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:bg-white/20'
      default:
        return 'hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-white/20'
    }
  }

  const combinedStyles = `
    ${getGlassStyles()}
    ${getBorderStyles()}
    ${getHoverStyles()}
    transition-all duration-500 ease-out
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `

  return (
    <motion.div
      className={combinedStyles}
      onClick={onClick}
      whileHover={hover ? { 
        scale: 1.02,
        y: -2
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ 
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1]  // Wu Wei natural easing
      }}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      {/* Holographic edge highlight */}
      <div className="absolute inset-0 rounded-[inherit]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Specialized luxury glass components
export function LuxuryCard({ children, className = '', variant = 'default', ...props }: LuxuryGlassProps) {
  return (
    <LuxuryGlass 
      className={`rounded-xl p-6 ${className}`}
      variant={variant}
      {...props}
    >
      {children}
    </LuxuryGlass>
  )
}

export function LuxuryButton({ children, className = '', variant = 'cyan', ...props }: LuxuryGlassProps) {
  return (
    <LuxuryGlass 
      className={`rounded-full px-8 py-3 text-center ${className}`}
      intensity="light"
      variant={variant}
      {...props}
    >
      {children}
    </LuxuryGlass>
  )
}

export function LuxuryNavBar({ children, className = '', ...props }: LuxuryGlassProps) {
  return (
    <LuxuryGlass 
      className={`rounded-none border-b border-white/10 backdrop-blur-xl ${className}`}
      intensity="strong"
      variant="glass-only"
      hover={false}
      {...props}
    >
      {children}
    </LuxuryGlass>
  )
}