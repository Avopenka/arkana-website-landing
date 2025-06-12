'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedGlassmorphism } from '../effects/AdvancedGlassmorphism';

interface AIPersonality {
  name: string;
  description: string;
  traits: string[];
  example_response: string;
  color: string;
  icon: string;
  philosophy: string;
}

const aiPersonalities: AIPersonality[] = [
  {
    name: 'The Sage',
    description: 'Wise, contemplative, and deeply insightful',
    traits: ['Philosophical', 'Patient', 'Holistic', 'Reflective'],
    example_response: "Your question touches on something profound. Let me share a perspective that might illuminate this from a different angle...",
    color: 'from-purple-600 to-indigo-700',
    icon: '🧙‍♂️',
    philosophy: 'Ancient wisdom meets modern understanding'
  },
  {
    name: 'The Catalyst',
    description: 'Energetic, action-oriented, and results-focused',
    traits: ['Dynamic', 'Efficient', 'Goal-oriented', 'Motivating'],
    example_response: "Let's cut to the core of this challenge and create a clear action plan that gets you results quickly.",
    color: 'from-orange-500 to-red-600',
    icon: '⚡',
    philosophy: 'Progress through purposeful action'
  },
  {
    name: 'The Explorer',
    description: 'Curious, creative, and boundary-pushing',
    traits: ['Innovative', 'Adventurous', 'Open-minded', 'Creative'],
    example_response: "What if we approached this completely differently? I'm seeing some fascinating possibilities we haven't considered...",
    color: 'from-cyan-500 to-blue-600',
    icon: '🚀',
    philosophy: 'Discovery through creative exploration'
  },
  {
    name: 'The Guardian',
    description: 'Protective, nurturing, and supportive',
    traits: ['Caring', 'Reliable', 'Protective', 'Empathetic'],
    example_response: "I can sense this is important to you. Let me help you navigate this carefully and make sure you're supported.",
    color: 'from-green-500 to-teal-600',
    icon: '🛡️',
    philosophy: 'Growth through compassionate guidance'
  }
];

export const AIPersonalityGlimpse: React.FC = () => {
  const [activePersonality, setActivePersonality] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [typingProgress, setTypingProgress] = useState(0);

  const personality = aiPersonalities[activePersonality];

  useEffect(() => {
    if (isInteracting) {
      const message = personality.example_response;
      setCurrentMessage('');
      setTypingProgress(0);

      const typeMessage = () => {
        let index = 0;
        const interval = setInterval(() => {
          if (index < message.length) {
            setCurrentMessage(prev => prev + message[index]);
            setTypingProgress((index + 1) / message.length);
            index++;
          } else {
            clearInterval(interval);
            setTimeout(() => setIsInteracting(false), 2000);
          }
        }, 50);

        return () => clearInterval(interval);
      };

      const timeout = setTimeout(typeMessage, 500);
      return () => clearTimeout(timeout);
    }
  }, [isInteracting, personality]);

  const handleInteract = () => {
    setIsInteracting(true);
  };

  const nextPersonality = () => {
    setActivePersonality((prev) => (prev + 1) % aiPersonalities.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <AdvancedGlassmorphism variant="card" intensity="strong">
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">
              AI Personality System
            </h3>
            <p className="text-gray-300">
              Adaptive AI that matches your communication style and needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personality Selection */}
            <div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {aiPersonalities.map((p, index) => (
                  <motion.button
                    key={p.name}
                    className={`p-4 rounded-lg text-left transition-all ${
                      index === activePersonality 
                        ? 'ring-2 ring-white/50' 
                        : 'hover:bg-white/10'
                    }`}
                    style={{
                      background: index === activePersonality 
                        ? `linear-gradient(135deg, ${p.color.split(' ')[1]}, ${p.color.split(' ')[3]})`
                        : 'rgba(255, 255, 255, 0.05)'
                    }}
                    onClick={() => setActivePersonality(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">{p.icon}</div>
                    <div className="text-white font-semibold text-sm">{p.name}</div>
                    <div className="text-gray-300 text-xs">{p.description}</div>
                  </motion.button>
                ))}
              </div>

              {/* Personality Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePersonality}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdvancedGlassmorphism variant="surface" intensity="subtle">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">{personality.icon}</span>
                        <div>
                          <h4 className="text-xl font-bold text-white">{personality.name}</h4>
                          <p className="text-gray-400 text-sm">{personality.philosophy}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-semibold text-gray-300 mb-2">Core Traits:</div>
                        <div className="flex flex-wrap gap-2">
                          {personality.traits.map((trait) => (
                            <span
                              key={trait}
                              className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${personality.color}`}
                        onClick={handleInteract}
                        disabled={isInteracting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isInteracting ? 'Responding...' : 'Experience Interaction'}
                      </motion.button>
                    </div>
                  </AdvancedGlassmorphism>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interaction Demo */}
            <div>
              <AdvancedGlassmorphism variant="surface" intensity="medium">
                <div className="p-6 h-full">
                  <div className="text-lg font-semibold text-white mb-4">
                    Live Interaction Demo
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-purple-500/20 rounded-lg p-3 max-w-xs">
                        <div className="text-white text-sm">
                          I'm struggling to stay motivated with my goals. Any advice?
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-gray-700/50 rounded-lg p-3 max-w-md">
                        <div className="flex items-center mb-2">
                          <span className="text-lg mr-2">{personality.icon}</span>
                          <span className="text-white font-semibold text-sm">{personality.name}</span>
                        </div>
                        
                        {isInteracting ? (
                          <div>
                            <div className="text-gray-200 text-sm min-h-[60px]">
                              {currentMessage}
                              <motion.span
                                className="inline-block w-1 h-4 bg-white ml-1"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                              />
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-600">
                              <div className="w-full bg-gray-600 rounded-full h-1">
                                <motion.div
                                  className={`h-full rounded-full bg-gradient-to-r ${personality.color}`}
                                  style={{ width: `${typingProgress * 100}%` }}
                                  transition={{ duration: 0.1 }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm italic">
                            Click "Experience Interaction" to see {personality.name}'s response style
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={nextPersonality}
                      className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
                    >
                      Try Different Personality →
                    </button>
                  </div>
                </div>
              </AdvancedGlassmorphism>
            </div>
          </div>
        </div>
      </AdvancedGlassmorphism>
    </motion.div>
  );
};

export default AIPersonalityGlimpse;