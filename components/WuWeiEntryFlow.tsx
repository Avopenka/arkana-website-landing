'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Waves, Eye, Heart, Compass, Sparkles, ArrowRight, Wind, Mountain } from 'lucide-react';
import Image from 'next/image';

interface WuWeiEntryFlowProps {
  onNaturalEntry: () => void;
}

// The Four Natural Pathways
const NATURAL_PATHWAYS = {
  EXPLORER: {
    name: 'Explorer',
    description: 'Browse freely, no commitments',
    icon: Compass,
    color: '#16FFE1',
    gradient: 'from-cyan-400 to-blue-500',
    philosophy: 'Curiosity leads the way'
  },
  SEEKER: {
    name: 'Seeker',
    description: 'Gentle connection when ready',
    icon: Eye,
    color: '#8B5CF6',
    gradient: 'from-purple-400 to-violet-500',
    philosophy: 'Awareness unfolds naturally'
  },
  READY: {
    name: 'Ready',
    description: 'Direct access for those prepared',
    icon: ArrowRight,
    color: '#D4AF37',
    gradient: 'from-yellow-400 to-orange-500',
    philosophy: 'Action from clarity'
  },
  MYSTERY: {
    name: 'Mystery',
    description: 'For those who sense something more',
    icon: Sparkles,
    color: '#FF6B6B',
    gradient: 'from-pink-400 to-red-500',
    philosophy: 'Trust in the unknown'
  }
} as const;

// Wu Wei Principles
const WU_WEI_PRINCIPLES = [
  'Let users find their own way',
  'Provide gentle guidance when requested',
  'Respect natural exploration rhythms',
  'Offer value before asking for anything',
  'Adapt to user intent signals',
  'Flow around obstacles like water'
];

// Natural State Detection
interface NaturalState {
  intentSignal: 'exploring' | 'seeking' | 'deciding' | 'flowing';
  engagementLevel: number; // 0-1
  naturalRhythm: 'fast' | 'contemplative' | 'steady' | 'intuitive';
  preferredPath: keyof typeof NATURAL_PATHWAYS | null;
}

export default function WuWeiEntryFlow({ onNaturalEntry }: WuWeiEntryFlowProps) {
  // Natural flow state
  const [naturalState, setNaturalState] = useState<NaturalState>({
    intentSignal: 'exploring',
    engagementLevel: 0,
    naturalRhythm: 'contemplative',
    preferredPath: null
  });

  // UI state
  const [showPathways, setShowPathways] = useState(false);
  const [selectedPath, setSelectedPath] = useState<keyof typeof NATURAL_PATHWAYS | null>(null);
  const [contentRevealed, setContentRevealed] = useState(0); // 0-1 progressive revelation
  const [userChoice, setUserChoice] = useState<string>('');

  // Refs for natural interaction detection
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionLog = useRef<Array<{ type: string; timestamp: number; position?: { x: number; y: number } }>>([]);
  const scrollPattern = useRef<number[]>([]);

  // Scroll-based natural flow detection
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const contentOpacity = useTransform(scrollY, [0, 200, 400], [0, 0.5, 1]);

  // Natural intent detection through interaction patterns
  const detectNaturalIntent = useCallback(() => {
    const recentInteractions = interactionLog.current.filter(
      log => Date.now() - log.timestamp < 10000
    );

    // Analyze scroll patterns for natural rhythm
    if (scrollPattern.current.length > 5) {
      const intervals = scrollPattern.current.slice(-5).map((time, i, arr) => 
        i > 0 ? time - arr[i - 1] : 0
      ).filter(interval => interval > 0);

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      
      let rhythm: NaturalState['naturalRhythm'] = 'contemplative';
      if (avgInterval < 100) rhythm = 'fast';
      else if (avgInterval < 300) rhythm = 'steady';
      else if (avgInterval > 1000) rhythm = 'intuitive';

      setNaturalState(prev => ({ 
        ...prev, 
        naturalRhythm: rhythm,
        engagementLevel: Math.min(1, recentInteractions.length / 10)
      }));
    }

    // Progressive revelation based on engagement
    const engagement = Math.min(1, recentInteractions.length / 8);
    setContentRevealed(engagement);

    // Natural pathway suggestion
    if (engagement > 0.3 && !naturalState.preferredPath) {
      if (naturalState.naturalRhythm === 'fast') setNaturalState(prev => ({ ...prev, preferredPath: 'READY' }));
      else if (naturalState.naturalRhythm === 'contemplative') setNaturalState(prev => ({ ...prev, preferredPath: 'SEEKER' }));
      else if (naturalState.naturalRhythm === 'intuitive') setNaturalState(prev => ({ ...prev, preferredPath: 'MYSTERY' }));
      else setNaturalState(prev => ({ ...prev, preferredPath: 'EXPLORER' }));
    }
  }, [naturalState.preferredPath]);

  // Track natural interactions
  const trackInteraction = useCallback((type: string, event?: React.MouseEvent) => {
    const timestamp = Date.now();
    const interaction = {
      type,
      timestamp,
      position: event ? { x: event.clientX, y: event.clientY } : undefined
    };
    
    interactionLog.current.push(interaction);
    if (interactionLog.current.length > 50) {
      interactionLog.current = interactionLog.current.slice(-25);
    }

    if (type === 'scroll') {
      scrollPattern.current.push(timestamp);
      if (scrollPattern.current.length > 20) {
        scrollPattern.current = scrollPattern.current.slice(-10);
      }
    }

    detectNaturalIntent();
  }, [detectNaturalIntent]);

  // Natural scroll detection
  useEffect(() => {
    const handleScroll = () => trackInteraction('scroll');
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackInteraction]);

  // Auto-reveal pathways when user shows interest
  useEffect(() => {
    if (naturalState.engagementLevel > 0.4 && !showPathways) {
      setShowPathways(true);
    }
  }, [naturalState.engagementLevel, showPathways]);

  // Handle natural path selection
  const handlePathwayChoice = async (pathKey: keyof typeof NATURAL_PATHWAYS) => {
    setSelectedPath(pathKey);
    
    // Save natural preference
    localStorage.setItem('arkana_natural_path', pathKey);
    localStorage.setItem('arkana_natural_state', JSON.stringify(naturalState));
    
    // Different flows for different paths
    switch (pathKey) {
      case 'EXPLORER':
        // Direct to main content, no gates
        setTimeout(() => onNaturalEntry(), 800);
        break;
      case 'SEEKER':
        // Show gentle connection option
        setUserChoice('seeking_connection');
        break;
      case 'READY':
        // Direct access path
        setTimeout(() => onNaturalEntry(), 500);
        break;
      case 'MYSTERY':
        // Mysterious unveiling
        setUserChoice('mystery_path');
        break;
    }
  };

  // Wu Wei connection for seekers
  const handleSeekerConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    // Natural connection without forced validation
    localStorage.setItem('arkana_seeker_connected', 'true');
    setTimeout(() => onNaturalEntry(), 1000);
  };

  // Mystery path revelation
  const handleMysteryReveal = () => {
    localStorage.setItem('arkana_mystery_seeker', 'true');
    setTimeout(() => onNaturalEntry(), 1200);
  };

  const currentPrinciple = WU_WEI_PRINCIPLES[Math.floor(Date.now() / 5000) % WU_WEI_PRINCIPLES.length];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden"
      onMouseMove={(e) => trackInteraction('mouse_move', e)}
      onClick={(e) => trackInteraction('click', e)}
    >
      {/* Natural Flow Background */}
      <div className="fixed inset-0 opacity-30">
        {/* Water-like flowing patterns */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="water-flow" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path 
                d="M0,100 Q50,50 100,100 T200,100" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1" 
                fill="none" 
              />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#water-flow)" />
        </svg>

        {/* Flowing particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6"
        style={{ opacity }}
      >
        {/* Arkana Logo with Natural Breathing */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              filter: [`hue-rotate(${naturalState.engagementLevel * 30}deg)`]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image 
              src="/logos/arkana-logo-primary-light.svg" 
              width={240} 
              height={60} 
              alt="Arkana" 
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Wu Wei Philosophy Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center max-w-2xl mb-8"
        >
          <motion.h1 
            className="text-2xl md:text-3xl font-light text-white mb-4 leading-relaxed"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Welcome to the Natural Flow
          </motion.h1>
          
          <motion.p 
            className="text-white/70 text-lg leading-relaxed mb-6"
            style={{ opacity: contentOpacity }}
          >
            There are no gates here. No barriers to cross. No forms to fill unless you choose to.
            <br />
            Like water, find your own way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: contentRevealed }}
            className="text-cyan-400 text-sm italic"
          >
            "{currentPrinciple}"
          </motion.div>
        </motion.div>

        {/* Natural State Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: naturalState.engagementLevel }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="text-white/60 text-sm">
              Natural rhythm detected: <span className="text-cyan-400">{naturalState.naturalRhythm}</span>
            </span>
          </div>
        </motion.div>

        {/* Progressive Content Revelation */}
        <AnimatePresence>
          {contentRevealed > 0.2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-3xl mb-12"
            >
              <motion.div
                className="grid md:grid-cols-2 gap-6 text-left"
                style={{ opacity: contentRevealed }}
              >
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <Compass className="w-8 h-8 text-cyan-400 mb-3" />
                  <h3 className="text-white font-medium mb-2">No Registration Required</h3>
                  <p className="text-white/60 text-sm">
                    Explore freely. Browse our features, philosophy, and community without any commitments.
                  </p>
                </div>
                
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <Heart className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-white font-medium mb-2">Connect When Ready</h3>
                  <p className="text-white/60 text-sm">
                    When you feel the resonance, gentle pathways open for deeper connection.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Natural Pathways - Appear Based on Engagement */}
        <AnimatePresence>
          {showPathways && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-4xl"
            >
              <motion.h2 
                className="text-center text-xl text-white mb-8 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Choose Your Natural Path
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(NATURAL_PATHWAYS).map(([key, pathway], index) => {
                  const IconComponent = pathway.icon;
                  const isPreferred = naturalState.preferredPath === key;
                  
                  return (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePathwayChoice(key as keyof typeof NATURAL_PATHWAYS)}
                      className={`relative p-6 rounded-xl border transition-all duration-500 group ${
                        isPreferred 
                          ? 'bg-white/10 border-white/30 shadow-lg' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Preferred path glow */}
                      {isPreferred && (
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-50"
                          style={{
                            background: `linear-gradient(135deg, ${pathway.color}20, transparent)`,
                            boxShadow: `0 0 30px ${pathway.color}30`
                          }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      <div className="relative z-10">
                        <motion.div
                          className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${pathway.color}20, ${pathway.color}10)`,
                            border: `1px solid ${pathway.color}30`
                          }}
                          whileHover={{ rotate: 5 }}
                        >
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color: pathway.color }}
                          />
                        </motion.div>

                        <h3 className="text-white font-medium mb-2">{pathway.name}</h3>
                        <p className="text-white/60 text-sm mb-3">{pathway.description}</p>
                        
                        <div className="text-xs italic" style={{ color: pathway.color }}>
                          {pathway.philosophy}
                        </div>

                        {isPreferred && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                          >
                            <Sparkles className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seeker Connection Form */}
        <AnimatePresence>
          {userChoice === 'seeking_connection' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-6"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Eye className="w-8 h-8 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl text-white mb-2">Gentle Connection</h3>
                  <p className="text-white/70 text-sm">
                    Share what feels natural. Nothing is required.
                  </p>
                </div>

                <form onSubmit={handleSeekerConnection} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your energy signature (optional)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-400/50 focus:outline-none transition-all"
                  />
                  
                  <textarea
                    placeholder="What brings you here? (optional)"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-purple-400/50 focus:outline-none transition-all resize-none"
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:scale-105 transition-transform"
                    >
                      Continue Naturally
                    </button>
                    <button
                      type="button"
                      onClick={() => onNaturalEntry()}
                      className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-all"
                    >
                      Just Browse
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mystery Path Revelation */}
        <AnimatePresence>
          {userChoice === 'mystery_path' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-black via-purple-950/50 to-black flex items-center justify-center z-50 p-6"
            >
              <motion.div
                className="text-center max-w-lg"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-6"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity }
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-1">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.h2 
                  className="text-3xl text-white mb-4 font-light"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  The Mystery Unfolds
                </motion.h2>

                <motion.p 
                  className="text-white/80 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  You sense there is more than meets the eye. Trust that intuition.
                  Some doors open only to those who already carry the key within.
                </motion.p>

                <motion.button
                  onClick={handleMysteryReveal}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:scale-105 transition-transform"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ boxShadow: "0 0 30px rgba(255, 105, 180, 0.3)" }}
                >
                  Trust the Mystery
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Natural Direct Entry */}
        {!showPathways && contentRevealed > 0.1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <motion.button
              onClick={() => onNaturalEntry()}
              className="inline-flex items-center gap-2 px-6 py-3 text-cyan-400 hover:text-cyan-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              <span>Enter the Experience</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Wu Wei Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 left-6 text-xs text-white/40 max-w-xs"
        >
          <p className="mb-1">Wu Wei • Natural Action • Effortless Being</p>
          <p>"The way of water: flowing around obstacles, finding the natural path"</p>
        </motion.div>

        {/* Engagement Indicator */}
        <motion.div
          className="absolute bottom-6 right-6 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: naturalState.engagementLevel }}
        >
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4" />
            <span>Natural flow: {Math.round(naturalState.engagementLevel * 100)}%</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}