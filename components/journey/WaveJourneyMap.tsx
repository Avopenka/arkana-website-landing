'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';

interface Wave {
  number: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'completed' | 'current' | 'locked';
  users?: number;
  spotsRemaining?: number;
}

const waves: Wave[] = [
  {
    number: 0,
    name: 'Codex Founders',
    description: 'The first 100 visionaries who write the founding code',
    color: '#FFD700',
    icon: '📜',
    status: 'current',
    users: 47,
    spotsRemaining: 53
  },
  {
    number: 1,
    name: 'Sage Advisors',
    description: 'Wise counselors guiding evolution',
    color: '#9B59B6',
    icon: '🔮',
    status: 'locked'
  },
  {
    number: 2,
    name: 'Oracle Prophets',
    description: 'Pattern seers predicting the future',
    color: '#3498DB',
    icon: '👁️',
    status: 'locked'
  },
  {
    number: 3,
    name: 'Guardian Protectors',
    description: 'Privacy guardians and truth protectors',
    color: '#E74C3C',
    icon: '🛡️',
    status: 'locked'
  },
  {
    number: 4,
    name: 'Scholar Researchers',
    description: 'Academic pioneers pushing boundaries',
    color: '#2ECC71',
    icon: '📚',
    status: 'locked'
  },
  {
    number: 5,
    name: 'Apprentice Learners',
    description: 'Journey into AI-enhanced productivity',
    color: '#F39C12',
    icon: '🎓',
    status: 'locked'
  },
  {
    number: 6,
    name: 'Seeker Explorers',
    description: 'Curious minds exploring possibilities',
    color: '#16A085',
    icon: '🧭',
    status: 'locked'
  },
  {
    number: 7,
    name: 'Access Members',
    description: 'Welcome to the Arkana community',
    color: '#95A5A6',
    icon: '🚪',
    status: 'locked'
  }
];

export default function WaveJourneyMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  // Calculate path length for animation
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);
  
  // Transform scroll progress to path drawing
  const pathDrawn = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  
  return (
    <section ref={containerRef} className="relative py-20 lg:py-32 bg-gradient-to-b from-black to-deep-black overflow-hidden">
      {/* Mystical background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(22,255,225,0.1),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-teal-400 to-gold-400 bg-clip-text text-transparent">
              Your Journey Through Consciousness
            </span>
          </h2>
          <p className="text-neutral-gray text-lg md:text-xl max-w-3xl mx-auto">
            Each wave represents a deeper level of understanding and commitment. 
            Your journey begins with the Codex Founders.
          </p>
        </motion.div>
        
        {/* Journey Map */}
        <div className="relative max-w-6xl mx-auto">
          {/* SVG Path */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#16FFE1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#9B59B6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Background path */}
            <path
              d="M 100,400 Q 300,200 500,300 T 900,400 Q 1000,500 1100,400"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              opacity="0.2"
            />
            
            {/* Animated path */}
            <motion.path
              ref={pathRef}
              d="M 100,400 Q 300,200 500,300 T 900,400 Q 1000,500 1100,400"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              style={{
                strokeDashoffset: useTransform(pathDrawn, (value) => pathLength - value * pathLength)
              }}
            />
          </svg>
          
          {/* Wave Nodes */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
            {waves.map((wave, index) => {
              const isActive = wave.status === 'current';
              const isLocked = wave.status === 'locked';
              
              return (
                <motion.div
                  key={wave.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connection line to next wave */}
                  {index < waves.length - 1 && (
                    <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0 hidden md:block" />
                  )}
                  
                  {/* Wave Node */}
                  <div className={`relative group cursor-pointer transition-all duration-300 ${
                    isActive ? 'scale-110' : isLocked ? 'opacity-60' : ''
                  }`}>
                    {/* Glow effect for active wave */}
                    {isActive && (
                      <div className="absolute inset-0 -m-4">
                        <div className="w-full h-full rounded-full animate-pulse"
                          style={{
                            background: `radial-gradient(circle, ${wave.color}40 0%, transparent 70%)`
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Wave Circle */}
                    <div
                      className={`relative w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-white/20 to-white/10 border-2'
                          : isLocked
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20'
                      } ${!isLocked && 'group-hover:scale-110 group-hover:border-2'}`}
                      style={{
                        borderColor: isActive ? wave.color : undefined,
                        boxShadow: isActive ? `0 0 30px ${wave.color}50` : undefined
                      }}
                    >
                      <span className="text-3xl">{wave.icon}</span>
                      
                      {/* Lock icon for locked waves */}
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <svg className="w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Wave Info */}
                    <div className="mt-4 text-center">
                      <h3 className={`font-serif text-lg mb-1 ${
                        isActive ? 'text-white' : 'text-white/80'
                      }`}>
                        {wave.name}
                      </h3>
                      <p className="text-xs text-neutral-gray/70 mb-2">
                        {wave.description}
                      </p>
                      
                      {/* Active wave stats */}
                      {isActive && wave.spotsRemaining !== undefined && (
                        <div className="text-xs space-y-1">
                          <p className="text-teal-400">
                            {wave.users} pioneers joined
                          </p>
                          <p className="text-gold-400 font-semibold">
                            {wave.spotsRemaining} spots remaining
                          </p>
                        </div>
                      )}
                      
                      {/* CTA for active wave */}
                      {isActive && (
                        <Link
                          href="#pricing"
                          className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full text-xs font-semibold text-black hover:shadow-lg transition-all"
                        >
                          Join Now
                        </Link>
                      )}
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-48 ${
                      isLocked ? 'hidden' : ''
                    }`}>
                      <p className="text-xs text-white/80">
                        Wave {wave.number}: {wave.name}
                      </p>
                      {isActive && (
                        <p className="text-xs text-teal-400 mt-1">
                          Currently accepting members
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Journey Progress for returning users (future feature) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-neutral-gray text-sm">
            Your consciousness journey is unique. Each wave unlocks new capabilities and deeper understanding.
          </p>
        </motion.div>
      </div>
    </section>
  );
}