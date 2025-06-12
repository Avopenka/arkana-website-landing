'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Mic, Home, Search, User, Plus } from 'lucide-react';

/**
 * THUMB ZONE NAVIGATION
 * 
 * 5 Masters Philosophy:
 * - Musk: Maximum efficiency, minimum movement
 * - Jobs: One-handed perfection
 * - Watts: Natural thumb flow
 * - Ive: Essential actions only
 * - Vopěnka: Consciousness at your thumb
 */

interface ThumbZoneProps {
  onVoiceActivate?: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export default function MobileThumbZone({ 
  onVoiceActivate, 
  onNavigate,
  currentPath = '/'
}: ThumbZoneProps) {
  const [activeItem, setActiveItem] = useState<string>('home');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Haptic feedback (when available)
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[style]);
    }
  };

  // Voice activation with haptic feedback
  const handleVoicePress = () => {
    triggerHaptic('medium');
    setIsVoiceActive(true);
    onVoiceActivate?.();
    
    // Auto-release after 5 seconds
    setTimeout(() => {
      setIsVoiceActive(false);
      triggerHaptic('light');
    }, 5000);
  };

  // Navigation with haptic feedback
  const handleNavigation = (path: string, id: string) => {
    triggerHaptic('light');
    setActiveItem(id);
    onNavigate?.(path);
  };

  // Dynamic positioning based on thumb reach
  useEffect(() => {
    const updatePosition = () => {
      const vh = window.innerHeight;
      const thumbReach = vh * 0.6; // 60% of screen height
      
      if (containerRef.current) {
        const safeBottom = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--safe-area-bottom') || '0');
        
        containerRef.current.style.bottom = `${Math.max(safeBottom, 20)}px`;
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const navItems = [
    { id: 'home', icon: Home, path: '/', label: 'Home' },
    { id: 'search', icon: Search, path: '/search', label: 'Search' },
    { id: 'voice', icon: Mic, path: '#voice', label: 'Voice', special: true },
    { id: 'create', icon: Plus, path: '/create', label: 'Create' },
    { id: 'profile', icon: User, path: '/profile', label: 'Profile' }
  ];

  return (
    <>
      {/* Voice feedback overlay */}
      <motion.div
        className={`voice-feedback ${isVoiceActive ? 'active' : ''}`}
        initial={false}
        animate={{
          opacity: isVoiceActive ? 1 : 0,
          pointerEvents: isVoiceActive ? 'all' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-consciousness-activation to-consciousness-resonance"
            animate={{
              scale: isVoiceActive ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isVoiceActive ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          <p className="text-consciousness-illumination text-lg">
            Listening to your consciousness...
          </p>
        </div>
      </motion.div>

      {/* Thumb zone navigation */}
      <motion.div
        ref={containerRef}
        className="thumb-zone"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 20, 
          stiffness: 300 
        }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            const isVoice = item.id === 'voice';
            
            return (
              <motion.button
                key={item.id}
                className={`
                  touch-target flex flex-col items-center gap-1
                  ${isVoice ? 'relative -mt-6' : ''}
                `}
                whileTap={{ scale: 0.9 }}
                onTap={() => {
                  if (isVoice) {
                    handleVoicePress();
                  } else {
                    handleNavigation(item.path, item.id);
                  }
                }}
              >
                {/* Voice button special styling */}
                {isVoice ? (
                  <motion.div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      bg-gradient-to-br from-consciousness-activation to-consciousness-resonance
                      shadow-lg
                    `}
                    animate={{
                      boxShadow: isVoiceActive
                        ? [
                            '0 0 0 0 rgba(var(--consciousness-activation-rgb), 0.4)',
                            '0 0 0 20px rgba(var(--consciousness-activation-rgb), 0)',
                          ]
                        : '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isVoiceActive ? Infinity : 0,
                    }}
                  >
                    <Icon 
                      size={24} 
                      className="text-consciousness-void"
                    />
                  </motion.div>
                ) : (
                  <div className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'text-consciousness-activation' 
                      : 'text-consciousness-illumination-alpha-60'
                    }
                  `}>
                    <Icon size={22} />
                  </div>
                )}
                
                {/* Label */}
                {!isVoice && (
                  <span className={`
                    text-xs transition-colors duration-200
                    ${isActive 
                      ? 'text-consciousness-activation' 
                      : 'text-consciousness-illumination-alpha-60'
                    }
                  `}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Gesture hint */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <div className="w-8 h-1 bg-consciousness-illumination-alpha-30 rounded-full" />
        </motion.div>
      </motion.div>
    </>
  );
}

/**
 * THUMB REACH HEATMAP
 * Visualizes comfortable thumb zones for development
 */
export function ThumbReachHeatmap({ show = false }: { show?: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Easy reach zone */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-green-500 opacity-10"
        style={{ height: '60vh' }}
      />
      
      {/* Medium reach zone */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-yellow-500 opacity-10"
        style={{ height: '75vh' }}
      />
      
      {/* Hard reach zone */}
      <div 
        className="absolute top-0 left-0 right-0 bg-red-500 opacity-10"
        style={{ height: '25vh' }}
      />
      
      {/* Labels */}
      <div className="absolute bottom-10 left-4 text-green-600 text-xs font-bold">
        EASY
      </div>
      <div className="absolute bottom-1/2 left-4 text-yellow-600 text-xs font-bold">
        MEDIUM
      </div>
      <div className="absolute top-10 left-4 text-red-600 text-xs font-bold">
        HARD
      </div>
    </div>
  );
}