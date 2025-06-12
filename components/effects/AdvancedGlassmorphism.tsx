'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong' | 'extreme';
  interactive?: boolean;
  consciousnessAware?: boolean;
  variant?: 'surface' | 'floating' | 'card' | 'overlay';
}

const intensityConfig = {
  subtle: {
    blur: 8,
    opacity: 0.6,
    saturation: 1.1,
    borderOpacity: 0.15,
  },
  medium: {
    blur: 16,
    opacity: 0.7,
    saturation: 1.2,
    borderOpacity: 0.25,
  },
  strong: {
    blur: 24,
    opacity: 0.8,
    saturation: 1.3,
    borderOpacity: 0.35,
  },
  extreme: {
    blur: 32,
    opacity: 0.85,
    saturation: 1.4,
    borderOpacity: 0.45,
  },
};

export const AdvancedGlassmorphism: React.FC<GlassmorphismProps> = ({
  children,
  className = '',
  intensity = 'medium',
  interactive = true,
  consciousnessAware = false,
  variant = 'surface',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.5);

  const config = intensityConfig[intensity];

  // Dynamic blur based on consciousness level
  const dynamicBlur = useTransform(
    mouseX,
    [0, 1],
    [config.blur, config.blur * 1.5]
  );

  // Interactive tilt effect
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['2deg', '-2deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-2deg', '2deg']);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, interactive]);

  // Consciousness-aware effect
  useEffect(() => {
    if (!consciousnessAware) return;

    const interval = setInterval(() => {
      // Simulate consciousness level changes
      setConsciousnessLevel(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(0, Math.min(1, prev + change));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [consciousnessAware]);

  const variantStyles = {
    surface: 'rounded-2xl',
    floating: 'rounded-3xl shadow-2xl',
    card: 'rounded-xl',
    overlay: 'rounded-3xl',
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${variantStyles[variant]} ${className}`}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={interactive ? { scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Multi-layer glass effect */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${config.blur}px) saturate(${config.saturation})`,
          WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturation})`,
        }}
      />
      
      {/* Gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, ${config.opacity * 0.3}) 0%, 
            rgba(255, 255, 255, 0) 50%, 
            rgba(255, 255, 255, ${config.opacity * 0.1}) 100%)`,
        }}
        animate={{
          opacity: isHovered ? 0.15 : 0.1,
        }}
      />
      
      {/* Consciousness-aware shimmer */}
      {consciousnessAware && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(147, 51, 234, ${consciousnessLevel * 0.2}) 0%, 
              transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {/* Border gradient */}
      <div
        className="absolute inset-0 rounded-inherit"
        style={{
          padding: '1px',
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, ${config.borderOpacity}) 0%, 
            rgba(255, 255, 255, ${config.borderOpacity * 0.5}) 50%, 
            rgba(255, 255, 255, ${config.borderOpacity}) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      
      {/* Interactive light reflection */}
      {interactive && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.4) 0%, transparent 40%)',
            '--mouse-x': `${(mouseX.get() + 0.5) * 100}%`,
            '--mouse-y': `${(mouseY.get() + 0.5) * 100}%`,
          } as React.CSSProperties}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Preset components for common use cases
export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <AdvancedGlassmorphism variant="card" intensity="medium" className={`p-6 ${className}`}>
    {children}
  </AdvancedGlassmorphism>
);

export const GlassButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({ 
  children, 
  onClick, 
  className 
}) => (
  <AdvancedGlassmorphism 
    variant="surface" 
    intensity="strong" 
    className={`px-6 py-3 cursor-pointer transition-all ${className}`}
  >
    <button onClick={onClick} className="w-full h-full">
      {children}
    </button>
  </AdvancedGlassmorphism>
);

export const GlassOverlay: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <AdvancedGlassmorphism 
    variant="overlay" 
    intensity="extreme" 
    consciousnessAware 
    className={`p-8 ${className}`}
  >
    {children}
  </AdvancedGlassmorphism>
);