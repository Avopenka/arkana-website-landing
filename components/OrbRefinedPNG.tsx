'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OrbRefinedPNGProps {
  className?: string;
  isActive?: boolean;
  showParticles?: boolean;
  style?: 'mystical' | 'techno' | 'elegant';
}

export function OrbRefinedPNG({ 
  className = '', 
  isActive = true,
  showParticles = true,
  style = 'mystical'
}: OrbRefinedPNGProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Background particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: [null, '-10%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
      
      {/* PNG Orb with organic animations */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={isActive ? {
          scale: [1, 1.02, 1.05, 1.03, 1],
          rotateZ: [0, 5, -3, 2, 0],
        } : {}}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1]
          },
          rotateZ: {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1]
          }
        }}
      >
        <Image
          src="/OrbRefined.png"
          alt="Arkana Orb"
          width={400}
          height={400}
          className="w-full h-full object-contain drop-shadow-2xl relative z-10"
          priority
        />
        
        {/* Multi-layer glow effect for organic feel */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Inner glow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div 
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-3/4 h-3/4 rounded-full blur-2xl
                ${style === 'mystical' ? 'bg-purple-400/30' : ''}
                ${style === 'techno' ? 'bg-cyan-400/30' : ''}
                ${style === 'elegant' ? 'bg-amber-400/20' : ''}
              `}
            />
          </motion.div>
          
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1.1, 1.2, 1.1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div 
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-full h-full rounded-full blur-3xl
                ${style === 'mystical' ? 'bg-purple-500/20' : ''}
                ${style === 'techno' ? 'bg-cyan-500/20' : ''}
                ${style === 'elegant' ? 'bg-amber-500/10' : ''}
              `}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}