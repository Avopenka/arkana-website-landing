'use client';
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Volume1, Volume } from 'lucide-react';
// Sound URLs - in production, these would be hosted on CDN
const SOUND_LIBRARY = {
  // Consciousness Awakening
  awakening: '/sounds/consciousness-awakening.mp3',
  orbPulse: '/sounds/orb-pulse.mp3',
  neuralConnect: '/sounds/neural-connect.mp3',
  // Ambient Backgrounds
  ambientSpace: '/sounds/ambient-space.mp3',
  tibetanBowl: '/sounds/tibetan-bowl.mp3',
  binauralTheta: '/sounds/binaural-theta.mp3',
  // Interactions
  hover: '/sounds/hover-soft.mp3',
  click: '/sounds/click-ethereal.mp3',
  success: '/sounds/success-chime.mp3',
  transition: '/sounds/transition-whoosh.mp3',
  // Emotional Moments
  revelation: '/sounds/revelation.mp3',
  connection: '/sounds/connection-made.mp3',
  transcendence: '/sounds/transcendence.mp3'
};
interface SpatialAudioOptions {
  x?: number;
  y?: number;
  z?: number;
  rolloff?: number;
}
interface SoundContextType {
  playSound: (soundKey: keyof typeof SOUND_LIBRARY, options?: { volume?: number; spatial?: SpatialAudioOptions; loop?: boolean }) => void;
  stopSound: (soundKey: keyof typeof SOUND_LIBRARY) => void;
  setMasterVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  masterVolume: number;
  isLoaded: boolean;
}
const SoundContext = createContext<SoundContextType | null>(null);
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
};
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const activeSourcesRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);
  const listenerRef = useRef<AudioListener | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [isLoaded, setIsLoaded] = useState(false);
  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        // Create master gain node
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.connect(audioContextRef.current.destination);
        masterGainRef.current.gain.value = masterVolume;
        // Create 3D listener for spatial audio
        listenerRef.current = audioContextRef.current.listener;
        // Load critical sounds
        await preloadSounds(['awakening', 'hover', 'click', 'ambientSpace']);
        setIsLoaded(true);
        // Start ambient background after user interaction
        document.addEventListener('click', startAmbientOnFirstInteraction, { once: true });
        document.addEventListener('touchstart', startAmbientOnFirstInteraction, { once: true });
      } catch (error) {
      }
    };
    initAudio();
    // Load saved preferences
    const savedVolume = localStorage.getItem('arkana-sound-volume');
    const savedMute = localStorage.getItem('arkana-sound-mute');
    if (savedVolume) setMasterVolume(parseFloat(savedVolume));
    if (savedMute) setIsMuted(savedMute === 'true');
    return () => {
      // Cleanup
      activeSourcesRef.current.forEach(source => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      });
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);
  // Update master volume
  useEffect(() => {
    if (masterGainRef.current) {
      const targetVolume = isMuted ? 0 : masterVolume;
      masterGainRef.current.gain.exponentialRampToValueAtTime(
        Math.max(0.001, targetVolume),
        audioContextRef.current!.currentTime + 0.1
      );
    }
    // Save preferences
    localStorage.setItem('arkana-sound-volume', masterVolume.toString());
    localStorage.setItem('arkana-sound-mute', isMuted.toString());
  }, [masterVolume, isMuted]);
  const startAmbientOnFirstInteraction = async () => {
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    // Start subtle ambient background
    playSound('ambientSpace', { volume: 0.3 });
  };
  const preloadSounds = async (soundKeys: string[]) => {
    const loadPromises = soundKeys.map(async (key) => {
      const url = SOUND_LIBRARY[key as keyof typeof SOUND_LIBRARY];
      if (!url || soundBuffersRef.current.has(key)) return;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
        soundBuffersRef.current.set(key, audioBuffer);
      } catch (error) {
      }
    });
    await Promise.all(loadPromises);
  };
  const playSound = useCallback(async (
    soundKey: keyof typeof SOUND_LIBRARY,
    options: { volume?: number; spatial?: SpatialAudioOptions; loop?: boolean } = {}
  ) => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    // Stop any existing instance of this sound
    stopSound(soundKey);
    // Load sound if not already loaded
    if (!soundBuffersRef.current.has(soundKey)) {
      await preloadSounds([soundKey]);
    }
    const buffer = soundBuffersRef.current.get(soundKey);
    if (!buffer) return;
    try {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      if (options?.loop) {
        source.loop = true;
      }
      source.loop = options.loop || false;
      // Create gain node for this sound
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = options.volume || 1.0;
      // Setup spatial audio if requested
      if (options.spatial && listenerRef.current) {
        const panner = audioContextRef.current.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'exponential';
        panner.refDistance = 1;
        panner.maxDistance = 100;
        panner.rolloffFactor = options.spatial.rolloff || 1;
        // Set position
        panner.setPosition(
          options.spatial.x || 0,
          options.spatial.y || 0,
          options.spatial.z || 0
        );
        // Connect: source -> panner -> gain -> master
        source.connect(panner);
        panner.connect(gainNode);
      } else {
        // Connect: source -> gain -> master
        source.connect(gainNode);
      }
      gainNode.connect(masterGainRef.current);
      // Store references
      activeSourcesRef.current.set(soundKey, source);
      gainNodesRef.current.set(soundKey, gainNode);
      // Cleanup on end
      source.onended = () => {
        activeSourcesRef.current.delete(soundKey);
        gainNodesRef.current.delete(soundKey);
      };
      // Fade in for smooth start
      gainNode.gain.setValueAtTime(0.001, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        options.volume || 1.0,
        audioContextRef.current.currentTime + 0.1
      );
      source.start();
    } catch (error) {
    }
  }, []);
  const stopSound = useCallback((soundKey: keyof typeof SOUND_LIBRARY) => {
    const source = activeSourcesRef.current.get(soundKey);
    const gainNode = gainNodesRef.current.get(soundKey);
    if (source && gainNode && audioContextRef.current) {
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContextRef.current.currentTime + 0.2
      );
      // Stop after fade
      setTimeout(() => {
        try {
          source.stop();
          source.disconnect();
          gainNode.disconnect();
        } catch (e) {}
        activeSourcesRef.current.delete(soundKey);
        gainNodesRef.current.delete(soundKey);
      }, 200);
    }
  }, []);
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);
  const value: SoundContextType = {
    playSound,
    stopSound,
    setMasterVolume,
    toggleMute,
    isMuted,
    masterVolume,
    isLoaded
  };
  return (
    <SoundContext.Provider value={value}>
      {children}
      <SoundControls />
    </SoundContext.Provider>
  );
};
// Sound Control UI Component
const SoundControls: React.FC = () => {
  const { isMuted, masterVolume, setMasterVolume, toggleMute, isLoaded } = useSound();
  const [isExpanded, setIsExpanded] = useState(false);
  const getVolumeIcon = () => {
    if (isMuted || masterVolume === 0) return VolumeX;
    if (masterVolume < 0.3) return Volume;
    if (masterVolume < 0.7) return Volume1;
    return Volume2;
  };
  const VolumeIcon = getVolumeIcon();
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-0 bg-black/90 backdrop-blur-xl rounded-2xl p-4 w-64 border border-white/10"
          >
            <div className="space-y-4">
              <div className="text-sm text-white/60 font-medium">Sound Settings</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Volume</span>
                  <span>{Math.round(masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-gradient-to-br
                    [&::-webkit-slider-thumb]:from-violet-400
                    [&::-webkit-slider-thumb]:to-cyan-400
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-violet-500/50"
                />
              </div>
              <div className="text-xs text-white/40">
                {isLoaded ? 'Audio system ready' : 'Loading sounds...'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        onDoubleClick={toggleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative group w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl 
          border border-white/10 flex items-center justify-center cursor-pointer
          transition-all duration-300 hover:border-white/20
          ${isMuted ? 'opacity-60' : ''}`}
      >
        <VolumeIcon className="w-6 h-6 text-white/80" />
        {/* Pulse animation when not muted */}
        {!isMuted && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400/20 to-cyan-400/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 px-3 py-1 bg-black/90 rounded-lg 
          text-xs text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 
          transition-opacity duration-200 pointer-events-none">
          {isExpanded ? 'Click to close • Double-click to mute' : 'Sound settings'}
        </div>
      </motion.button>
    </motion.div>
  );
};
// Helper hook for common sound effects
export const useSoundEffects = () => {
  const { playSound } = useSound();
  return {
    playHover: () => playSound('hover', { volume: 0.3 }),
    playClick: () => playSound('click', { volume: 0.5 }),
    playSuccess: () => playSound('success', { volume: 0.6 }),
    playTransition: () => playSound('transition', { volume: 0.4 }),
    playAwakening: () => playSound('awakening', { volume: 0.7 }),
    playRevelation: () => playSound('revelation', { volume: 0.8 }),
  };
};
// Consciousness Orb with spatial audio
export const ConsciousnessOrbWithSound: React.FC<{
  position: { x: number; y: number };
  onPulse?: () => void;
}> = ({ position, onPulse }) => {
  const { playSound } = useSound();
  const [isPulsing, setIsPulsing] = useState(false);
  const handlePulse = () => {
    if (isPulsing) return;
    setIsPulsing(true);
    // Play spatial sound based on orb position
    const spatial = {
      x: (position.x - window.innerWidth / 2) / 100,
      y: (position.y - window.innerHeight / 2) / 100,
      z: -5,
      rolloff: 0.5
    };
    playSound('orbPulse', { volume: 0.6, spatial });
    onPulse?.();
    setTimeout(() => setIsPulsing(false), 1000);
  };
  return (
    <motion.div
      className="absolute w-32 h-32 cursor-pointer"
      style={{ left: position.x - 64, top: position.y - 64 }}
      onClick={handlePulse}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-full h-full rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 backdrop-blur-xl"
        animate={isPulsing ? {
          scale: [1, 1.5, 1],
          opacity: [1, 0.3, 1]
        } : {}}
        transition={{ duration: 1 }}
      />
      {/* Inner glow */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400"
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};
// Binaural Meditation Mode
export const BinauralMeditationMode: React.FC = () => {
  const { playSound, stopSound } = useSound();
  const [isActive, setIsActive] = useState(false);
  const toggleMeditation = () => {
    if (isActive) {
      stopSound('binauralTheta');
      setIsActive(false);
    } else {
      playSound('binauralTheta', { volume: 0.4, loop: true });
      setIsActive(true);
    }
  };
  return (
    <motion.button
      onClick={toggleMeditation}
      className={`px-6 py-3 rounded-full backdrop-blur-xl transition-all duration-500
        ${isActive 
          ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border-white/30' 
          : 'bg-black/20 border-white/10'
        } border`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-white/80 font-medium">
        {isActive ? 'Exit Meditation' : 'Enter Meditation'}
      </span>
    </motion.button>
  );
};