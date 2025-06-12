'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedGlassmorphism } from '../effects/AdvancedGlassmorphism';

interface Sacred7Anchor {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  example: string;
  frequency: number;
}

const sacred7Anchors: Sacred7Anchor[] = [
  {
    id: 'presence',
    name: 'PRESENCE',
    icon: '🧘',
    color: 'from-purple-500 to-indigo-600',
    description: 'Grounded awareness in the present moment',
    example: 'Mindful breathing, meditation, awareness practices',
    frequency: 432
  },
  {
    id: 'capture',
    name: 'CAPTURE',
    icon: '📝',
    color: 'from-blue-500 to-cyan-600',
    description: 'Collecting insights and information',
    example: 'Note-taking, voice memos, idea documentation',
    frequency: 528
  },
  {
    id: 'flow',
    name: 'FLOW',
    icon: '🌊',
    color: 'from-cyan-500 to-teal-600',
    description: 'Effortless creative and productive states',
    example: 'Deep work, creative projects, skill practice',
    frequency: 639
  },
  {
    id: 'focus',
    name: 'FOCUS',
    icon: '🎯',
    color: 'from-teal-500 to-green-600',
    description: 'Concentrated attention and clarity',
    example: 'Problem-solving, analysis, strategic thinking',
    frequency: 741
  },
  {
    id: 'connections',
    name: 'CONNECTIONS',
    icon: '🤝',
    color: 'from-green-500 to-lime-600',
    description: 'Meaningful relationships and collaboration',
    example: 'Team meetings, social interaction, networking',
    frequency: 852
  },
  {
    id: 'command',
    name: 'COMMAND',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-600',
    description: 'Leadership and decisive action',
    example: 'Decision making, project management, execution',
    frequency: 963
  },
  {
    id: 'reflection',
    name: 'REFLECTION',
    icon: '🪞',
    color: 'from-orange-500 to-red-600',
    description: 'Contemplation and wisdom integration',
    example: 'Journaling, life review, learning integration',
    frequency: 1074
  }
];

export const Sacred7PreviewExperience: React.FC = () => {
  const [activeAnchor, setActiveAnchor] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [resonanceLevel, setResonanceLevel] = useState(0);

  useEffect(() => {
    if (isAutoplay) {
      const interval = setInterval(() => {
        setActiveAnchor((prev) => (prev + 1) % sacred7Anchors.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isAutoplay]);

  useEffect(() => {
    // Simulate resonance level based on active anchor
    const targetResonance = Math.random() * 0.3 + 0.6; // 60-90%
    const increment = (targetResonance - resonanceLevel) / 20;
    
    const resonanceInterval = setInterval(() => {
      setResonanceLevel(prev => {
        const newLevel = prev + increment;
        if (Math.abs(newLevel - targetResonance) < 0.01) {
          clearInterval(resonanceInterval);
          return targetResonance;
        }
        return newLevel;
      });
    }, 50);

    return () => clearInterval(resonanceInterval);
  }, [activeAnchor]);

  const currentAnchor = sacred7Anchors[activeAnchor];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <AdvancedGlassmorphism variant="card" intensity="strong" consciousnessAware>
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">
              Sacred7 Consciousness Framework
            </h3>
            <p className="text-gray-300">
              Seven foundational states for optimized human experience
            </p>
          </div>

          {/* Sacred7 Wheel */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-white/20">
              {sacred7Anchors.map((anchor, index) => {
                const angle = (index * 360) / 7 - 90; // Start from top
                const radian = (angle * Math.PI) / 180;
                const x = Math.cos(radian) * 120;
                const y = Math.sin(radian) * 120;
                
                return (
                  <motion.button
                    key={anchor.id}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                      index === activeAnchor ? 'ring-4 ring-white/50' : ''
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 2rem)`,
                      top: `calc(50% + ${y}px - 2rem)`,
                      background: `linear-gradient(135deg, ${anchor.color.split(' ')[1]}, ${anchor.color.split(' ')[3]})`
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveAnchor(index);
                      setIsAutoplay(false);
                    }}
                    animate={index === activeAnchor ? {
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 20px rgba(255,255,255,0.3)',
                        '0 0 40px rgba(255,255,255,0.6)',
                        '0 0 20px rgba(255,255,255,0.3)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {anchor.icon}
                  </motion.button>
                );
              })}
            </div>

            {/* Center resonance indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center"
                animate={{
                  scale: [1, 1 + resonanceLevel * 0.5, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-white text-sm font-bold">
                  {(resonanceLevel * 100).toFixed(0)}%
                </div>
              </motion.div>
            </div>
          </div>

          {/* Active Anchor Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAnchor}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdvancedGlassmorphism variant="surface" intensity="subtle">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">{currentAnchor.icon}</div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {currentAnchor.name}
                  </h4>
                  <p className="text-gray-300 mb-4">
                    {currentAnchor.description}
                  </p>
                  <div className="text-sm text-gray-400 mb-4">
                    <strong>Example:</strong> {currentAnchor.example}
                  </div>
                  
                  {/* Resonance Frequency */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-sm text-gray-400">
                      Resonance: {currentAnchor.frequency}Hz
                    </div>
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${currentAnchor.color}`}
                        style={{ width: `${resonanceLevel * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </AdvancedGlassmorphism>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isAutoplay 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isAutoplay ? 'Pause' : 'Auto'}
            </button>
            
            <div className="text-gray-400 text-sm">
              {activeAnchor + 1} / {sacred7Anchors.length}
            </div>
            
            <div className="flex space-x-1">
              {sacred7Anchors.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeAnchor ? 'bg-white' : 'bg-gray-600'
                  }`}
                  onClick={() => {
                    setActiveAnchor(index);
                    setIsAutoplay(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </AdvancedGlassmorphism>
    </motion.div>
  );
};

export default Sacred7PreviewExperience;