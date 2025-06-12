'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HolographicLayerProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export default function HolographicLayer({ 
  children, 
  intensity = 'medium',
  animated = true,
  className = '' 
}: HolographicLayerProps) {
  const intensityMap = {
    low: { blur: 40, opacity: 0.03, scale: 1.01 },
    medium: { blur: 60, opacity: 0.05, scale: 1.02 },
    high: { blur: 80, opacity: 0.08, scale: 1.03 }
  };

  const config = intensityMap[intensity];

  return (
    <div className={`relative ${className}`}>
      {/* Base content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Holographic layers */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: animated ? [0, config.opacity, 0] : config.opacity,
          scale: animated ? [1, config.scale, 1] : config.scale
        }}
        transition={{
          duration: 4,
          repeat: animated ? Infinity : 0,
          ease: "easeInOut"
        }}
        style={{
          filter: `blur(${config.blur}px) hue-rotate(180deg)`,
          background: 'linear-gradient(45deg, #00FFFF, #FF006E, #00FFFF)',
          backgroundSize: '200% 200%',
          mixBlendMode: 'screen'
        }}
      >
        {children}
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: animated ? [0, config.opacity * 0.5, 0] : config.opacity * 0.5,
          scale: animated ? [1, config.scale * 1.01, 1] : config.scale * 1.01
        }}
        transition={{
          duration: 3,
          repeat: animated ? Infinity : 0,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{
          filter: `blur(${config.blur * 1.5}px) hue-rotate(90deg)`,
          background: 'linear-gradient(-45deg, #FF006E, #00FFFF, #FF006E)',
          backgroundSize: '200% 200%',
          mixBlendMode: 'screen'
        }}
      >
        {children}
      </motion.div>

      {/* Scan lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.1) 2px,
            rgba(0, 255, 255, 0.1) 4px
          )`,
          animation: animated ? 'scan-lines 8s linear infinite' : 'none'
        }}
      />

    </div>
  );
}