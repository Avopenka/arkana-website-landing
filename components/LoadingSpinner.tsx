'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'consciousness' | 'minimal';
  message?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  message 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const SpinnerVariants = {
    default: () => (
      <div className={`${sizeClasses[size]} relative`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-teal/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-teal"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    ),
    consciousness: () => (
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-teal/30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-accent-gold/40"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner core */}
        <motion.div
          className="absolute inset-3 rounded-full bg-gradient-to-br from-brand-teal to-accent-gold"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    ),
    minimal: () => (
      <motion.div
        className={`${sizeClasses[size]} border-2 border-white/20 border-t-white rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    )
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {SpinnerVariants[variant]()}
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-neutral-gray font-medium"
        >
          {message}
        </motion.p>
      )}
      
      {variant === 'consciousness' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-xs text-brand-teal/70 font-serif italic"
        >
          Calibrating consciousness...
        </motion.div>
      )}
    </div>
  );
}

// Full page loading overlay
export function LoadingOverlay({ 
  message = "Loading...",
  variant = 'consciousness' 
}: Omit<LoadingSpinnerProps, 'size'>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="text-center">
        <LoadingSpinner size="xl" variant={variant} message={message} />
      </div>
    </motion.div>
  );
}

// Inline loading state for components
export function InlineLoader({ 
  message = "Loading...",
  size = 'sm'
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <LoadingSpinner size={size} variant="minimal" />
      <span className="text-sm text-neutral-gray">{message}</span>
    </div>
  );
}