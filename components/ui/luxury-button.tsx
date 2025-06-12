'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Luxury Button Component - WCAG AAA Compliant with Premium Aesthetics
const luxuryButtonVariants = cva(
  // Base styles - enhanced for luxury
  [
    'inline-flex items-center justify-center',
    'rounded-full font-medium',
    'transition-all duration-[800ms]',
    'transform-gpu will-change-transform',
    'relative overflow-hidden',
    // Enhanced padding for luxury feel
    'px-10 py-5 text-lg md:px-12 md:py-6 md:text-xl',
    // Luxury easing
    'transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1)',
    // Remove tap highlight on mobile
    '-webkit-tap-highlight-color-transparent',
    // Focus states
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4',
    'focus-visible:ring-offset-black',
    // Disabled state
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-[#16FFE1] to-[#13E6CA]',
          'text-black font-semibold',
          'hover:shadow-[0_0_20px_rgba(22,255,225,0.3)]',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:ring-[#16FFE1]',
        ].join(' '),
        secondary: [
          'border-2 border-[#D4AF37]',
          'text-[#D4AF37] bg-transparent',
          'hover:bg-[rgba(212,175,55,0.08)]',
          'hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:ring-[#D4AF37]',
        ].join(' '),
        ghost: [
          'text-white/90 bg-transparent',
          'hover:bg-white/5',
          'hover:text-white',
          'focus-visible:ring-white/50',
        ].join(' '),
        luxury: [
          'bg-gradient-to-r from-[#D4AF37] via-[#F5E6D3] to-[#D4AF37]',
          'text-black font-semibold',
          'hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:ring-[#D4AF37]',
          // Animated gradient
          'bg-size-200 bg-pos-0',
          'hover:bg-pos-100',
        ].join(' '),
      },
      size: {
        sm: 'px-6 py-3 text-base',
        md: 'px-10 py-5 text-lg',
        lg: 'px-12 py-6 text-xl',
        xl: 'px-16 py-8 text-2xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxuryButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false,
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(luxuryButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Luxury shimmer effect overlay */}
        <span className="absolute inset-0 -z-10">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </span>
        
        {/* Button content */}
        <span className="relative flex items-center gap-3">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <span className="inline-flex shrink-0">{icon}</span>
              )}
              {children}
              {icon && iconPosition === 'right' && (
                <span className="inline-flex shrink-0">{icon}</span>
              )}
            </>
          )}
        </span>
      </button>
    );
  }
);

LuxuryButton.displayName = 'LuxuryButton';

// Luxury loading spinner
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Export convenience components
export const PrimaryButton = (props: Omit<LuxuryButtonProps, 'variant'>) => 
  <LuxuryButton variant="primary" {...props} />;

export const SecondaryButton = (props: Omit<LuxuryButtonProps, 'variant'>) => 
  <LuxuryButton variant="secondary" {...props} />;

export const GhostButton = (props: Omit<LuxuryButtonProps, 'variant'>) => 
  <LuxuryButton variant="ghost" {...props} />;

export const LuxuryGoldButton = (props: Omit<LuxuryButtonProps, 'variant'>) => 
  <LuxuryButton variant="luxury" {...props} />;

export { LuxuryButton };