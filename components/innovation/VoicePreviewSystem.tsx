'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedGlassmorphism } from '../effects/AdvancedGlassmorphism';

interface VoicePreviewProps {
  className?: string;
}

const sampleConversations = [
  {
    id: 1,
    user: "Help me plan a productive morning routine",
    ai: "I'd be happy to help you create a morning routine that aligns with your energy and goals. Based on consciousness research, the first 90 minutes after waking are crucial for setting your mental state. What time do you usually wake up?",
    consciousness_level: 0.8
  },
  {
    id: 2,
    user: "I'm feeling overwhelmed with my projects",
    ai: "I can sense the tension in your voice. Let's take a step back and create some clarity. When we feel overwhelmed, it's often because we're seeing everything as equally urgent. Can you tell me about the three most important outcomes you want this week?",
    consciousness_level: 0.9
  },
  {
    id: 3,
    user: "What's the best way to learn something new?",
    ai: "Great question! The most effective learning happens when we align with our natural attention cycles. I've noticed you tend to focus best in the late morning. Would you like me to design a learning approach that works with your cognitive patterns?",
    consciousness_level: 0.7
  }
];

export const VoicePreviewSystem: React.FC<VoicePreviewProps> = ({ className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Generate random waveform for demo
    const generateWaveform = () => {
      const newWaveform = Array.from({ length: 50 }, () => Math.random() * 100);
      setWaveform(newWaveform);
    };

    if (isRecording || isPlaying) {
      const interval = setInterval(generateWaveform, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording, isPlaying]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handlePlayResponse();
    }, 3000);
  };

  const handlePlayResponse = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 5000);
  };

  const nextConversation = () => {
    setCurrentConversation((prev) => (prev + 1) % sampleConversations.length);
  };

  const conversation = sampleConversations[currentConversation];

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <AdvancedGlassmorphism variant="card" intensity="strong">
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Voice-Powered AI Assistant
              </h3>
              <p className="text-gray-300">
                Experience natural conversation with consciousness-aware responses
              </p>
            </div>

            {/* Voice Interface */}
            <div className="relative mb-8">
              <div className="flex justify-center mb-6">
                <motion.button
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl ${
                    isRecording 
                      ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartRecording}
                  disabled={isRecording || isPlaying}
                  animate={isRecording ? { 
                    boxShadow: [
                      '0 0 20px rgba(239, 68, 68, 0.5)',
                      '0 0 40px rgba(239, 68, 68, 0.8)',
                      '0 0 20px rgba(239, 68, 68, 0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isRecording ? '🔴' : isPlaying ? '🎵' : '🎤'}
                </motion.button>
              </div>

              {/* Waveform Visualization */}
              {(isRecording || isPlaying) && (
                <motion.div
                  className="flex justify-center items-end space-x-1 h-16 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {waveform.map((height, index) => (
                    <motion.div
                      key={index}
                      className={`w-1 bg-gradient-to-t ${
                        isRecording 
                          ? 'from-red-500 to-red-300' 
                          : 'from-purple-500 to-purple-300'
                      } rounded-full`}
                      style={{ height: `${height}%` }}
                      animate={{
                        height: [`${height}%`, `${Math.random() * 100}%`, `${height}%`]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              )}

              <div className="text-center">
                <div className="text-white font-semibold mb-1">
                  {isRecording ? 'Listening...' : isPlaying ? 'Responding...' : 'Tap to speak'}
                </div>
                <div className="text-gray-400 text-sm">
                  Natural voice interaction powered by consciousness AI
                </div>
              </div>
            </div>

            {/* Sample Conversation */}
            <AdvancedGlassmorphism variant="surface" intensity="subtle">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">Sample Conversation</h4>
                  <button
                    onClick={nextConversation}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Next Example →
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-purple-500/20 rounded-lg p-3 max-w-xs">
                      <div className="text-white text-sm">{conversation.user}</div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-gray-700/50 rounded-lg p-3 max-w-md">
                      <div className="text-gray-200 text-sm">{conversation.ai}</div>
                      <div className="flex items-center mt-2 pt-2 border-t border-gray-600">
                        <span className="text-xs text-gray-400 mr-2">Consciousness:</span>
                        <div className="flex-1 bg-gray-600 rounded-full h-1">
                          <div 
                            className="h-full bg-purple-400 rounded-full" 
                            style={{ width: `${conversation.consciousness_level * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-purple-300 ml-2">
                          {(conversation.consciousness_level * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AdvancedGlassmorphism>

            {/* Features List */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-purple-400 text-2xl mb-2">🧠</div>
                <div className="text-white font-semibold text-sm">Consciousness-Aware</div>
                <div className="text-gray-400 text-xs">Adapts to your mental state</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 text-2xl mb-2">🎯</div>
                <div className="text-white font-semibold text-sm">Context-Intelligent</div>
                <div className="text-gray-400 text-xs">Remembers your patterns</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold text-sm">Instant Response</div>
                <div className="text-gray-400 text-xs">Sub-second processing</div>
              </div>
            </div>
          </div>
        </AdvancedGlassmorphism>
      </motion.div>
    </div>
  );
};

export default VoicePreviewSystem;