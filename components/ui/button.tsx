import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'luxury' | 'outline' | 'ghost' | 'link' | 'genesis' | 'premium'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'statement'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'luxury', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base luxury button foundation - Chanel-level sophistication
          'group relative inline-flex items-center justify-center font-medium transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 overflow-hidden',
          // Luxury border radius with optical adjustments
          'rounded-xl border border-white/10',
          // Premium focus states
          'focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          {
            // Genesis Wave - Ultimate luxury experience
            'genesis': [
              'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
              'text-black font-semibold',
              'shadow-[0_8px_32px_rgba(245,158,11,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]',
              'hover:shadow-[0_16px_48px_rgba(245,158,11,0.18),0_0_80px_rgba(245,158,11,0.1)]',
              'hover:scale-[1.02] hover:-translate-y-0.5',
              'active:scale-[0.98] active:translate-y-0',
              'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500',
              'hover:before:opacity-100'
            ].join(' '),
            
            // Premium - High-end luxury 
            'premium': [
              'bg-gradient-to-135 from-[#FFD700] via-[#4169E1] to-[#20B2AA]',
              'text-black font-semibold',
              'shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]',
              'hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]',
              'hover:scale-[1.02] hover:-translate-y-0.5',
              'active:scale-[0.98] active:translate-y-0'
            ].join(' '),
            
            // Luxury - Default sophistication
            'luxury': [
              'bg-gradient-to-r from-cyan-500 to-cyan-600',
              'text-black font-medium',
              'shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]',
              'hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]',
              'hover:scale-[1.015] hover:-translate-y-px',
              'active:scale-[0.985]'
            ].join(' '),
            
            // Outline - Refined minimalism
            'outline': [
              'border-white/20 bg-white/5 backdrop-blur-sm',
              'text-white font-medium',
              'hover:bg-white/10 hover:border-white/30',
              'hover:scale-[1.01]',
              'active:scale-[0.99]'
            ].join(' '),
            
            // Ghost - Subtle luxury
            'ghost': [
              'bg-transparent text-white/80 font-medium',
              'hover:bg-white/5 hover:text-white',
              'hover:scale-[1.01]'
            ].join(' '),
            
            // Link - Typography focused
            'link': [
              'text-amber-400 font-medium underline-offset-4',
              'hover:underline hover:text-amber-300',
              'transition-colors duration-200'
            ].join(' ')
          }[variant],
          {
            // Statement - Hero CTAs
            'statement': 'h-14 px-12 py-4 text-lg',
            // Large - Premium actions
            'lg': 'h-12 px-10 py-3',
            // Default - Standard luxury
            'default': 'h-11 px-8 py-2.5',
            // Small - Compact luxury
            'sm': 'h-9 px-6 py-2 text-sm',
            // Icon - Perfect square
            'icon': 'h-10 w-10 p-0'
          }[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }