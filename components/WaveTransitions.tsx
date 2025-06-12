'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface WaveTransitionProps {
  children: React.ReactNode;
  fromColor?: string;
  toColor?: string;
  waveIntensity?: number;
  className?: string;
}

export const WaveTransition: React.FC<WaveTransitionProps> = ({
  children,
  fromColor = 'from-black',
  toColor = 'to-purple-950/20',
  waveIntensity = 0.5,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform values for parallax effects
  const y = useTransform(smoothProgress, [0, 1], [100, -100]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Background gradient wave */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-b ${fromColor} ${toColor}`}
        style={{ y }}
      />

      {/* Wave overlay */}
      <WaveOverlay progress={smoothProgress} intensity={waveIntensity} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Cinematic wave overlay with SVG paths
const WaveOverlay: React.FC<{
  progress: MotionValue<number>;
  intensity: number;
}> = ({ progress, intensity }) => {
  const path1Y = useTransform(progress, [0, 1], [0, 100 * intensity]);
  const path2Y = useTransform(progress, [0, 1], [0, -80 * intensity]);
  const path3Y = useTransform(progress, [0, 1], [0, 60 * intensity]);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
      viewBox="0 0 1440 600"
    >
      <defs>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 245, 212, 0.1)" />
          <stop offset="50%" stopColor="rgba(255, 0, 128, 0.1)" />
          <stop offset="100%" stopColor="rgba(212, 175, 55, 0.1)" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(123, 44, 191, 0.05)" />
          <stop offset="100%" stopColor="rgba(0, 245, 212, 0.05)" />
        </linearGradient>
      </defs>

      <motion.path
        d="M0,300 C240,250 480,350 720,300 C960,250 1200,350 1440,300 L1440,600 L0,600 Z"
        fill="url(#waveGradient1)"
        style={{ y: path1Y }}
      />
      <motion.path
        d="M0,400 C360,300 720,500 1080,400 C1260,350 1380,450 1440,400 L1440,600 L0,600 Z"
        fill="url(#waveGradient2)"
        style={{ y: path2Y }}
      />
      <motion.path
        d="M0,500 C180,450 360,550 540,500 C720,450 900,550 1080,500 C1260,450 1380,550 1440,500 L1440,600 L0,600 Z"
        fill="rgba(255, 255, 255, 0.02)"
        style={{ y: path3Y }}
      />
    </svg>
  );
};

// Page transition component for smooth navigation
export const PageWaveTransition: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, direction = 'up' }) => {
  const directionVariants = {
    up: { initial: { y: 100 }, exit: { y: -100 } },
    down: { initial: { y: -100 }, exit: { y: 100 } },
    left: { initial: { x: 100 }, exit: { x: -100 } },
    right: { initial: { x: -100 }, exit: { x: 100 } }
  };

  const variant = directionVariants[direction];

  return (
    <motion.div
      initial={{ ...variant.initial, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ ...variant.exit, opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1]
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Section transition with reveal effect
export const RevealTransition: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 20%"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className={className}
      initial={{ opacity: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

// Morph transition between states
export const MorphTransition: React.FC<{
  from: React.ReactNode;
  to: React.ReactNode;
  progress: MotionValue<number>;
  className?: string;
}> = ({ from, to, progress, className = '' }) => {
  const fromOpacity = useTransform(progress, [0, 0.5, 1], [1, 0, 0]);
  const toOpacity = useTransform(progress, [0, 0.5, 1], [0, 0, 1]);
  const blur = useTransform(progress, [0, 0.5, 1], [0, 10, 0]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        style={{ 
          opacity: fromOpacity,
          filter: useTransform(blur, (b) => `blur(${b}px)`)
        }}
        className="absolute inset-0"
      >
        {from}
      </motion.div>
      <motion.div
        style={{ 
          opacity: toOpacity,
          filter: useTransform(blur, (b) => `blur(${b}px)`)
        }}
      >
        {to}
      </motion.div>
    </div>
  );
};