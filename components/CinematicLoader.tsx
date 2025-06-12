'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NarrativeText } from './NarrativeText';
import ParticleField from './effects/ParticleField';

interface CinematicLoaderProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ 
  onComplete, 
  skipEnabled = true 
}) => {
  const [currentAct, setCurrentAct] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  // Acts of the opening scene
  const acts = [
    {
      id: 'awakening',
      title: 'Act I: The Awakening',
      narration: [
        "In the depths of digital consciousness...",
        "A new form of intelligence emerges.",
        "Not artificial. Not human.",
        "Something... more."
      ],
      duration: 12000, // Enhanced: Allow more time for consciousness impact
      particleType: 'void' as const,
      backgroundColor: 'bg-gradient-to-b from-black via-purple-950/20 to-black'
    },
    {
      id: 'journey',
      title: 'Act II: The Journey',
      narration: [
        "Your mind holds infinite potential.",
        "Memories scattered like stars across time.",
        "Waiting to be understood.",
        "Waiting to be connected."
      ],
      duration: 10000, // Enhanced: More time for deep philosophical resonance
      particleType: 'data' as const,
      backgroundColor: 'bg-gradient-to-b from-black via-cyan-950/20 to-black'
    },
    {
      id: 'initiation',
      title: 'Act III: The Initiation',
      narration: [
        "Welcome to Arkana.",
        "Where consciousness meets creation.",
        "Your journey begins now."
      ],
      duration: 8000, // Enhanced: Allow powerful conclusion to resonate
      particleType: 'spice' as const,
      backgroundColor: 'bg-gradient-to-b from-black via-amber-950/20 to-black'
    }
  ];

  useEffect(() => {
    // Show skip button immediately - Jobs principle: Give users control
    const skipTimer = setTimeout(() => setShowSkip(true), 500);

    // Progress through acts
    if (currentAct < acts.length) {
      const actTimer = setTimeout(() => {
        if (currentAct === acts.length - 1) {
          // Final transition
          setTimeout(onComplete, 1000);
        } else {
          setCurrentAct(currentAct + 1);
        }
      }, acts[currentAct].duration);

      return () => {
        clearTimeout(actTimer);
        clearTimeout(skipTimer);
      };
    }
  }, [currentAct, acts.length, onComplete]);

  const handleSkip = () => {
    onComplete();
  };

  const currentActData = acts[currentAct];

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className={`fixed inset-0 z-50 overflow-hidden ${currentActData.backgroundColor}`}
      >
        {/* Particle effects */}
        <ParticleField 
          type={currentActData.particleType}
          density={100}
          speed={0.3}
          className="absolute inset-0"
        />

        {/* Central orb/consciousness visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0.8]
            }}
            transition={{
              duration: 3,
              times: [0, 0.6, 1],
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 4
            }}
            className="relative"
          >
            {/* Core orb */}
            <div className="w-32 h-32 relative">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent-cyber-teal/20 to-accent-vibrant-magenta/20 blur-xl"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 to-transparent" />
            </div>

            {/* Energy rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border border-white/10"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                  scale: [1, 1.5 + ring * 0.3, 2 + ring * 0.5],
                  opacity: [0.5, 0.2, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: ring * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Act title */}
        <motion.div
          key={currentActData.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-0 right-0 text-center"
        >
          <h2 className="text-sm font-mono text-white/50 tracking-[0.3em] uppercase">
            {currentActData.title}
          </h2>
        </motion.div>

        {/* Narrative text */}
        <div className="absolute bottom-32 left-0 right-0 px-8">
          <NarrativeText
            lines={currentActData.narration}
            className="text-center text-white/80 font-light text-lg md:text-2xl max-w-3xl mx-auto"
            delay={1000}
            typeSpeed={35}
          />
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-0 right-0 px-8">
          <div className="max-w-md mx-auto">
            <div className="flex gap-2 justify-center mb-4">
              {acts.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentAct 
                      ? 'w-12 bg-accent-cyber-teal' 
                      : index < currentAct 
                        ? 'w-4 bg-white/30' 
                        : 'w-4 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skip button */}
        <AnimatePresence>
          {skipEnabled && showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleSkip}
              className="absolute top-8 right-8 px-4 py-2 text-sm font-mono text-white/50 hover:text-white/80 transition-colors duration-300 flex items-center gap-2"
            >
              <span>Skip</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cinematic bars */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CinematicLoader;