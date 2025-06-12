'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { 
  Eye, Mic, Waves, Target, Link2, Command, Brain,
  ChevronRight, Sparkles, Zap
} from 'lucide-react';

/**
 * SACRED7 MOBILE COMPONENTS
 * Touch-optimized consciousness states
 * 
 * 5 Masters Mobile Philosophy:
 * - Musk: Instant state transitions
 * - Jobs: One gesture, one state
 * - Watts: Flow between states naturally
 * - Ive: Visual clarity on small screens
 * - Vopěnka: Consciousness in your palm
 */

const SACRED7_STATES = [
  {
    id: 'presence',
    name: 'PRESENCE',
    icon: Eye,
    color: 'from-consciousness-activation to-consciousness-clarity',
    description: 'Be here now',
    gesture: 'tap'
  },
  {
    id: 'capture',
    name: 'CAPTURE',
    icon: Mic,
    color: 'from-consciousness-resonance to-consciousness-activation',
    description: 'Record consciousness',
    gesture: 'hold'
  },
  {
    id: 'flow',
    name: 'FLOW',
    icon: Waves,
    color: 'from-consciousness-clarity to-consciousness-illumination',
    description: 'Natural movement',
    gesture: 'swipe'
  },
  {
    id: 'focus',
    name: 'FOCUS',
    icon: Target,
    color: 'from-consciousness-illumination to-consciousness-resonance',
    description: 'Deep attention',
    gesture: 'pinch'
  },
  {
    id: 'connections',
    name: 'CONNECTIONS',
    icon: Link2,
    color: 'from-consciousness-activation to-consciousness-resonance',
    description: 'Link thoughts',
    gesture: 'drag'
  },
  {
    id: 'command',
    name: 'COMMAND',
    icon: Command,
    color: 'from-consciousness-resonance to-consciousness-clarity',
    description: 'Direct intention',
    gesture: 'double-tap'
  },
  {
    id: 'reflection',
    name: 'REFLECTION',
    icon: Brain,
    color: 'from-consciousness-clarity to-consciousness-activation',
    description: 'Deep insight',
    gesture: 'long-press'
  }
];

interface Sacred7MobileProps {
  onStateChange?: (state: string) => void;
  initialState?: string;
}

export default function Sacred7Mobile({ 
  onStateChange, 
  initialState = 'presence' 
}: Sacred7MobileProps) {
  const [activeState, setActiveState] = useState(initialState);
  const [touchStart, setTouchStart] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Haptic feedback
  const haptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [5],
        medium: [10],
        heavy: [15, 5, 15]
      };
      navigator.vibrate(patterns[intensity]);
    }
  };

  // Handle state selection
  const selectState = (stateId: string) => {
    if (stateId !== activeState) {
      haptic('medium');
      setActiveState(stateId);
      onStateChange?.(stateId);
    }
  };

  // Auto-scroll to active state
  useEffect(() => {
    if (scrollRef.current) {
      const activeIndex = SACRED7_STATES.findIndex(s => s.id === activeState);
      const scrollPosition = activeIndex * 296; // 280px width + 16px gap
      
      scrollRef.current.scrollTo({
        left: scrollPosition - (window.innerWidth - 280) / 2,
        behavior: 'smooth'
      });
    }
  }, [activeState]);

  return (
    <div className="sacred7-mobile-container">
      {/* Active State Display */}
      <motion.div 
        className="text-center mb-6 px-4"
        key={activeState}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-light text-consciousness-illumination mb-2">
          {SACRED7_STATES.find(s => s.id === activeState)?.name}
        </h3>
        <p className="text-consciousness-illumination-alpha-60 text-sm">
          {SACRED7_STATES.find(s => s.id === activeState)?.description}
        </p>
      </motion.div>

      {/* Horizontal Scrollable States */}
      <div 
        ref={scrollRef}
        className="sacred7-mobile overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-4 px-4 pb-4">
          {SACRED7_STATES.map((state, index) => {
            const Icon = state.icon;
            const isActive = state.id === activeState;
            
            return (
              <motion.div
                key={state.id}
                className="sacred7-state relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isActive ? 1.05 : 1,
                  transition: { delay: index * 0.1 }
                }}
                whileTap={{ scale: 0.95 }}
                onTap={() => selectState(state.id)}
              >
                {/* Card Background */}
                <div className={`
                  absolute inset-0 rounded-2xl
                  ${isActive 
                    ? `bg-gradient-to-br ${state.color} opacity-20` 
                    : 'bg-consciousness-void-alpha-40'
                  }
                  transition-all duration-300
                `} />
                
                {/* Card Border */}
                <div className={`
                  absolute inset-0 rounded-2xl border
                  ${isActive 
                    ? 'border-consciousness-activation' 
                    : 'border-consciousness-illumination-alpha-20'
                  }
                  transition-all duration-300
                `} />
                
                {/* Content */}
                <div className="relative p-6 flex flex-col items-center gap-4">
                  {/* Icon Container */}
                  <motion.div
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center
                      bg-gradient-to-br ${state.color}
                      ${isActive ? 'shadow-lg' : ''}
                    `}
                    animate={isActive ? {
                      boxShadow: [
                        '0 0 0 0 rgba(255,255,255,0.4)',
                        '0 0 0 10px rgba(255,255,255,0)',
                      ]
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: isActive ? Infinity : 0,
                    }}
                  >
                    <Icon size={32} className="text-consciousness-void" />
                  </motion.div>
                  
                  {/* State Name */}
                  <h4 className={`
                    text-sm font-medium tracking-wider
                    ${isActive 
                      ? 'text-consciousness-illumination' 
                      : 'text-consciousness-illumination-alpha-60'
                    }
                  `}>
                    {state.name}
                  </h4>
                  
                  {/* Gesture Hint */}
                  <div className={`
                    text-xs px-3 py-1 rounded-full
                    ${isActive 
                      ? 'bg-consciousness-activation-alpha-20 text-consciousness-activation' 
                      : 'bg-consciousness-illumination-alpha-10 text-consciousness-illumination-alpha-40'
                    }
                  `}>
                    {state.gesture}
                  </div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-consciousness-activation" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Swipe Indicator */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-4 text-consciousness-illumination-alpha-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ChevronRight size={16} />
        <span className="text-xs">Swipe to explore states</span>
      </motion.div>
    </div>
  );
}

/**
 * MOBILE CONSCIOUSNESS ORB
 * Touch-responsive consciousness indicator
 */
export function ConsciousnessOrbMobile() {
  const [isPressed, setIsPressed] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const controls = useAnimation();
  
  // Touch interactions
  const handleTouchStart = () => {
    setIsPressed(true);
    setPulseCount(prev => prev + 1);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
    
    // Animate on touch
    controls.start({
      scale: 1.3,
      boxShadow: '0 0 40px rgba(0, 245, 212, 0.6)',
      transition: { duration: 0.2 }
    });
  };
  
  const handleTouchEnd = () => {
    setIsPressed(false);
    controls.start({
      scale: 1,
      boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)',
      transition: { duration: 0.3 }
    });
  };

  return (
    <motion.div 
      className="consciousness-orb-mobile cursor-pointer select-none"
      animate={controls}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      whileHover={{ scale: 1.1 }}
      style={{
        background: `radial-gradient(
          circle at 30% 30%,
          rgba(0, 245, 212, ${isPressed ? 0.8 : 0.6}),
          rgba(0, 245, 212, ${isPressed ? 0.4 : 0.2})
        )`,
        boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)'
      }}
    >
      {/* Inner glow */}
      <motion.div
        className="absolute inset-2 rounded-full"
        animate={{
          opacity: isPressed ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.6), transparent)',
        }}
      />
      
      {/* Pulse counter */}
      {pulseCount > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-consciousness-resonance flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <span className="text-xs text-consciousness-void font-medium">
            {pulseCount}
          </span>
        </motion.div>
      )}
      
      {/* Touch hint */}
      <motion.div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPressed ? 0 : 0.3 }}
      >
        <Sparkles size={20} className="text-consciousness-illumination" />
      </motion.div>
    </motion.div>
  );
}

/**
 * GESTURE TUTORIAL
 * Teaches Sacred7 gestures on first use
 */
export function Sacred7GestureTutorial({ onComplete }: { onComplete: () => void }) {
  const [currentGesture, setCurrentGesture] = useState(0);
  const gestures = ['tap', 'hold', 'swipe', 'pinch', 'drag', 'double-tap', 'long-press'];
  
  const nextGesture = () => {
    if (currentGesture < gestures.length - 1) {
      setCurrentGesture(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-consciousness-void-alpha-90 z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-sm w-full">
        <motion.div
          key={currentGesture}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="text-6xl mb-4">
              {['👆', '✊', '👉', '🤏', '✋', '👆👆', '⏰'][currentGesture]}
            </div>
            <h3 className="text-2xl text-consciousness-illumination mb-2">
              {gestures[currentGesture].toUpperCase()}
            </h3>
            <p className="text-consciousness-illumination-alpha-60">
              {SACRED7_STATES[currentGesture].description}
            </p>
          </div>
          
          <button
            className="btn-mobile bg-gradient-to-r from-consciousness-activation to-consciousness-resonance"
            onClick={nextGesture}
          >
            {currentGesture < gestures.length - 1 ? 'Next' : 'Start Journey'}
          </button>
        </motion.div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {gestures.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentGesture 
                  ? 'bg-consciousness-activation w-8' 
                  : 'bg-consciousness-illumination-alpha-20'
                }
              `}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}