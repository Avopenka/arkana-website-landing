'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

// Mobile-First Touch Optimization Hook
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [touchPoints, setTouchPoints] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return { isMobile, orientation, touchPoints };
};

// Thumb Zone Optimization Component
export const ThumbZoneOptimizer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isMobile } = useMobileOptimization();
  
  if (!isMobile) return <>{children}</>;

  return (
    <div className={`${className} relative`}>
      {/* Thumb zone overlay for debugging */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-500/10 rounded-t-3xl" />
        <div className="absolute bottom-24 left-0 right-16 h-16 bg-yellow-500/10 rounded-tr-3xl" />
        <div className="absolute bottom-24 right-0 w-16 h-32 bg-red-500/10 rounded-tl-3xl" />
      </div>
      {children}
    </div>
  );
};

// Swipe Gesture Handler
export const SwipeHandler: React.FC<{
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  children: React.ReactNode;
  threshold?: number;
}> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown, 
  children, 
  threshold = 50 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (offset.y > threshold && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < -threshold && onSwipeUp) {
        onSwipeUp();
      }
    }

    // Reset position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
};

// Mobile Navigation Drawer
export const MobileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
}> = ({ isOpen, onClose, children, position = 'left' }) => {
  const { isMobile } = useMobileOptimization();
  
  if (!isMobile) return null;

  const variants = {
    left: {
      closed: { x: '-100%' },
      open: { x: 0 }
    },
    right: {
      closed: { x: '100%' },
      open: { x: 0 }
    },
    bottom: {
      closed: { y: '100%' },
      open: { y: 0 }
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        className={`fixed z-50 bg-gray-900 ${
          position === 'bottom' 
            ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-96' 
            : 'top-0 h-full w-80'
        } ${position === 'left' ? 'left-0' : position === 'right' ? 'right-0' : ''}`}
        variants={variants[position]}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-white"
          >
            ×
          </button>
          {children}
        </div>
      </motion.div>
    </>
  );
};

// Pull to Refresh Component
export const PullToRefresh: React.FC<{
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}> = ({ onRefresh, children, threshold = 80 }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(info.offset.y, threshold * 1.5));
    }
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }
    } else {
      setPullDistance(0);
      y.set(0);
    }
  };

  return (
    <div className="relative">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center py-4 bg-gray-800/90"
        style={{ 
          opacity,
          scale,
          y: pullDistance > 0 ? pullDistance - threshold : 0
        }}
      >
        <div className="flex items-center space-x-2 text-white">
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            {isRefreshing ? '🔄' : '⬇️'}
          </motion.div>
          <span>{isRefreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
        </div>
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Haptic Feedback Hook
export const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const lightImpact = () => vibrate(10);
  const mediumImpact = () => vibrate(20);
  const heavyImpact = () => vibrate([30, 10, 30]);
  const success = () => vibrate([100, 30, 100]);
  const error = () => vibrate([200, 100, 200]);

  return {
    vibrate,
    lightImpact,
    mediumImpact,
    heavyImpact,
    success,
    error
  };
};

// Mobile-Optimized Button
export const MobileButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  haptic?: boolean;
  className?: string;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  haptic = true,
  className = '' 
}) => {
  const { lightImpact } = useHapticFeedback();
  const { isMobile } = useMobileOptimization();

  const handleClick = () => {
    if (haptic && isMobile) {
      lightImpact();
    }
    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-10',
    md: 'px-6 py-3 text-base min-h-12',
    lg: 'px-8 py-4 text-lg min-h-14'
  };

  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-white/20'
  };

  return (
    <motion.button
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg font-semibold touch-manipulation select-none ${className}`}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {children}
    </motion.button>
  );
};

export default {
  ThumbZoneOptimizer,
  SwipeHandler,
  MobileDrawer,
  PullToRefresh,
  MobileButton,
  useMobileOptimization,
  useHapticFeedback
};