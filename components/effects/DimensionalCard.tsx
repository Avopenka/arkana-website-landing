'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DimensionalCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  depth?: number;
  interactive?: boolean;
}

export default function DimensionalCard({
  children,
  className = '',
  glowColor = '#00FFFF',
  depth = 20,
  interactive = true
}: DimensionalCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        scale: { duration: 0.2 }
      }}
      className={`relative ${className}`}
    >
      {/* Background layers for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 rounded-lg"
        style={{
          transform: 'translateZ(-10px)',
          boxShadow: `0 0 ${isHovered ? 40 : 20}px ${glowColor}40`
        }}
      />
      
      {/* Main card */}
      <div 
        className="relative bg-black/70 backdrop-blur-2xl border border-white/20 rounded-lg overflow-hidden"
        style={{
          transform: 'translateZ(0px)',
          boxShadow: `
            0 0 ${isHovered ? 40 : 20}px ${glowColor}40,
            inset 0 0 30px rgba(255,255,255,0.05),
            0 8px 32px rgba(0,0,0,0.3)
          `,
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%),
            rgba(0,0,0,0.7)
          `
        }}
      >
        {/* Holographic shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
          style={{
            background: `linear-gradient(
              105deg,
              transparent 40%,
              ${glowColor}40 45%,
              ${glowColor}80 50%,
              ${glowColor}40 55%,
              transparent 60%
            )`,
            backgroundSize: '200% 200%',
          }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              backgroundPosition: isHovered ? ['0% 0%', '200% 200%'] : '0% 0%',
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: 'linear'
            }}
            style={{
              background: 'inherit',
              backgroundSize: 'inherit',
            }}
          />
        </motion.div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, ${glowColor}20 0px, transparent 1px, transparent 20px, ${glowColor}20 21px),
              repeating-linear-gradient(90deg, ${glowColor}20 0px, transparent 1px, transparent 20px, ${glowColor}20 21px)
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path 
              d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z" 
              fill={`${glowColor}20`}
            />
            <path 
              d="M0,0 L40,0 L40,10 L10,10 L10,40 L0,40 Z" 
              fill={`${glowColor}40`}
            />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 rotate-180">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path 
              d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z" 
              fill={`${glowColor}20`}
            />
            <path 
              d="M0,0 L40,0 L40,10 L10,10 L10,40 L0,40 Z" 
              fill={`${glowColor}40`}
            />
          </svg>
        </div>
      </div>

      {/* Foreground highlight */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          transform: 'translateZ(10px)',
          background: `radial-gradient(
            circle at ${isHovered ? '50% 50%' : '50% -100%'},
            ${glowColor}10 0%,
            transparent 70%
          )`,
        }}
      />
    </motion.div>
  );
}