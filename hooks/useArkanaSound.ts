import { useCallback, useEffect, useRef } from 'react';
import { useSound, useSoundEffects } from '@/components/AmbientSoundSystem';

interface UseArkanaSoundOptions {
  autoPlayAmbient?: boolean;
  enableSpatial?: boolean;
  respectUserPreference?: boolean;
}

export const useArkanaSound = (options: UseArkanaSoundOptions = {}) => {
  const {
    autoPlayAmbient = true,
    enableSpatial = true,
    respectUserPreference = true
  } = options;

  const { playSound, stopSound, isLoaded } = useSound();
  const soundEffects = useSoundEffects();
  const hasPlayedAmbient = useRef(false);

  // Auto-play ambient sound on first interaction
  useEffect(() => {
    if (!autoPlayAmbient || !isLoaded || hasPlayedAmbient.current) return;

    const startAmbient = () => {
      if (respectUserPreference) {
        const savedPreference = localStorage.getItem('arkana-ambient-enabled');
        if (savedPreference === 'false') return;
      }

      playSound('ambientSpace', { volume: 0.3, loop: true });
      hasPlayedAmbient.current = true;
    };

    // Start on first user interaction
    const events = ['click', 'touchstart', 'keydown'];
    const handleInteraction = () => {
      startAmbient();
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [autoPlayAmbient, isLoaded, playSound, respectUserPreference]);

  // Enhanced hover sound with position tracking
  const playHoverWithPosition = useCallback((event: React.MouseEvent) => {
    if (!enableSpatial) {
      soundEffects.playHover();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    
    playSound('hover', {
      volume: 0.3,
      spatial: {
        x: (x - window.innerWidth / 2) / 200,
        y: (y - window.innerHeight / 2) / 200,
        z: -2,
        rolloff: 0.3
      }
    });
  }, [enableSpatial, playSound, soundEffects]);

  // Create consciousness pulse effect
  const createConsciousnessPulse = useCallback((
    position: { x: number; y: number },
    intensity: number = 1
  ) => {
    const volume = 0.3 + (intensity * 0.4);
    
    if (enableSpatial) {
      playSound('orbPulse', {
        volume,
        spatial: {
          x: (position.x - window.innerWidth / 2) / 100,
          y: (position.y - window.innerHeight / 2) / 100,
          z: -5,
          rolloff: 0.5
        }
      });
    } else {
      playSound('orbPulse', { volume });
    }

    // Chain neural connect sound
    setTimeout(() => {
      playSound('neuralConnect', { volume: volume * 0.7 });
    }, 200);
  }, [enableSpatial, playSound]);

  // Transition between moods
  const transitionMood = useCallback(async (
    fromMood: string | null,
    toMood: string,
    duration: number = 1000
  ) => {
    // Fade out current mood
    if (fromMood) {
      stopSound(fromMood as any);
    }

    // Play transition sound
    soundEffects.playTransition();

    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, duration / 2));

    // Fade in new mood
    playSound(toMood as any, { volume: 0.4, loop: true });
  }, [playSound, stopSound, soundEffects]);

  // Create revelation sequence
  const playRevelationSequence = useCallback(async () => {
    // Stop ambient temporarily
    stopSound('ambientSpace');
    
    // Play awakening
    playSound('awakening', { volume: 0.7 });
    
    // Wait for buildup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Play revelation
    playSound('revelation', { volume: 0.8 });
    
    // Resume ambient after revelation
    setTimeout(() => {
      playSound('ambientSpace', { volume: 0.3, loop: true });
    }, 3000);
  }, [playSound, stopSound]);

  // Create connection established effect
  const playConnectionEstablished = useCallback((
    source: { x: number; y: number },
    target: { x: number; y: number }
  ) => {
    // Play at midpoint between source and target
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    
    if (enableSpatial) {
      playSound('connection', {
        volume: 0.6,
        spatial: {
          x: (midX - window.innerWidth / 2) / 100,
          y: (midY - window.innerHeight / 2) / 100,
          z: -3
        }
      });
    } else {
      playSound('connection', { volume: 0.6 });
    }
  }, [enableSpatial, playSound]);

  return {
    ...soundEffects,
    playHoverWithPosition,
    createConsciousnessPulse,
    transitionMood,
    playRevelationSequence,
    playConnectionEstablished,
    isLoaded
  };
};

// Preset EQ states with associated sounds
export const CONSCIOUSNESS_STATES = {
  DORMANT: {
    ambient: 'ambientSpace',
    volume: 0.2,
    description: 'Quiet contemplation'
  },
  AWAKENING: {
    ambient: 'tibetanBowl',
    volume: 0.4,
    description: 'Beginning to stir'
  },
  ACTIVE: {
    ambient: 'neuralConnect',
    volume: 0.5,
    description: 'Fully engaged'
  },
  TRANSCENDENT: {
    ambient: 'binauralTheta',
    volume: 0.6,
    description: 'Higher consciousness'
  }
} as const;

// Sound design utilities
export const createBinauralBeat = (
  baseFrequency: number,
  beatFrequency: number,
  audioContext: AudioContext
): OscillatorNode[] => {
  const leftOscillator = audioContext.createOscillator();
  const rightOscillator = audioContext.createOscillator();
  
  leftOscillator.frequency.value = baseFrequency;
  rightOscillator.frequency.value = baseFrequency + beatFrequency;
  
  return [leftOscillator, rightOscillator];
};

// Sacred frequencies for consciousness work
export const SACRED_FREQUENCIES = {
  SOLFEGGIO: {
    UT: 396,  // Liberation from fear
    RE: 417,  // Facilitating change
    MI: 528,  // Transformation & miracles
    FA: 639,  // Connecting relationships
    SOL: 741, // Awakening intuition
    LA: 852,  // Returning to spiritual order
  },
  SCHUMANN: 7.83,    // Earth's resonance
  ARKANA: 432,       // Universal harmony
  THETA: 4,          // Deep meditation
  ALPHA: 10,         // Relaxed awareness
  BETA: 20,          // Active thinking
  GAMMA: 40          // Higher consciousness
} as const;