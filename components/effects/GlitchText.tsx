'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: 'hover' | 'interval' | 'always';
}

export default function GlitchText({ 
  text, 
  className = '',
  intensity = 'medium',
  trigger = 'interval'
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(trigger === 'always');

  useEffect(() => {
    if (trigger === 'interval') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }, 3000 + Math.random() * 2000);

      return () => clearInterval(interval);
    }
  }, [trigger]);

  const glitchIntensity = {
    low: { offset: 2, duration: 100 },
    medium: { offset: 4, duration: 200 },
    high: { offset: 8, duration: 300 }
  };

  const config = glitchIntensity[intensity];

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsGlitching(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsGlitching(false);
  };

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-text={text}
    >
      {/* Main text */}
      <span className="relative z-10">
        {text}
      </span>

      {/* Glitch layer 1 - Cyan */}
      <motion.span
        className="absolute inset-0 text-cyan-400"
        animate={{
          x: isGlitching ? [-config.offset, config.offset, -config.offset, 0] : 0,
          opacity: isGlitching ? [0, 1, 1, 0] : 0
        }}
        transition={{
          duration: config.duration / 1000,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          mixBlendMode: 'screen'
        }}
      >
        {text}
      </motion.span>

      {/* Glitch layer 2 - Pink */}
      <motion.span
        className="absolute inset-0 text-pink-500"
        animate={{
          x: isGlitching ? [config.offset, -config.offset, config.offset, 0] : 0,
          opacity: isGlitching ? [0, 1, 1, 0] : 0
        }}
        transition={{
          duration: config.duration / 1000,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.02
        }}
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          mixBlendMode: 'screen'
        }}
      >
        {text}
      </motion.span>

      {/* Random character replacement */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.1 }}
        >
          {text.split('').map((char, index) => (
            <span key={index}>
              {Math.random() > 0.7 ? 
                String.fromCharCode(33 + Math.floor(Math.random() * 94)) : 
                char
              }
            </span>
          ))}
        </motion.span>
      )}

      {/* Digital artifacts */}
      {isGlitching && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            animate={{
              x: [-100, 100],
              scaleY: [1, 1.5, 1]
            }}
            transition={{
              duration: 0.2,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              mixBlendMode: 'overlay'
            }}
            animate={{
              y: [0, -4, 0]
            }}
            transition={{
              duration: 0.1,
              repeat: 2
            }}
          />
        </>
      )}
    </span>
  );
}