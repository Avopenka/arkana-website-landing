'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { NarrativeText, SplitText } from './NarrativeText';
import ParticleField from './effects/ParticleField';

interface ScrollCinemaProps {
  children?: React.ReactNode;
  className?: string;
}

interface CinematicScene {
  id: string;
  content: React.ReactNode;
  particleType?: 'sand' | 'data' | 'void' | 'spice';
  background?: string;
}

export const ScrollCinema: React.FC<ScrollCinemaProps> = ({ 
  children, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);
  
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cinematic scenes
  const scenes: CinematicScene[] = [
    {
      id: 'consciousness-birth',
      content: <ConsciousnessBirthScene />,
      particleType: 'void',
      background: 'from-black via-purple-950/30 to-black'
    },
    {
      id: 'memory-constellation',
      content: <MemoryConstellationScene />,
      particleType: 'data',
      background: 'from-black via-cyan-950/30 to-black'
    },
    {
      id: 'wave-selection',
      content: <WaveSelectionScene />,
      particleType: 'spice',
      background: 'from-black via-amber-950/30 to-black'
    }
  ];

  // Update current scene based on scroll
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((value) => {
      const sceneIndex = Math.floor(value * scenes.length);
      setCurrentScene(Math.min(sceneIndex, scenes.length - 1));
    });
    return unsubscribe;
  }, [smoothProgress, scenes.length]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Fixed background with transitions */}
      <div className="fixed inset-0 z-0">
        {scenes.map((scene, index) => (
          <motion.div
            key={scene.id}
            className={`absolute inset-0 bg-gradient-to-b ${scene.background}`}
            animate={{ opacity: currentScene === index ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            {scene.particleType && (
              <ParticleField
                type={scene.particleType}
                density={80}
                speed={0.2}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="relative z-10">
        {scenes.map((scene, index) => (
          <CinematicSection
            key={scene.id}
            index={index}
            totalScenes={scenes.length}
            scrollProgress={smoothProgress}
          >
            {scene.content}
          </CinematicSection>
        ))}
        {children}
      </div>

      {/* Scroll indicator */}
      <ScrollProgressIndicator progress={smoothProgress} />
    </div>
  );
};

// Individual cinematic section with parallax
const CinematicSection: React.FC<{
  children: React.ReactNode;
  index: number;
  totalScenes: number;
  scrollProgress: number;
}> = ({ children, index, totalScenes, scrollProgress }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.5 });
  
  const sectionStart = index / totalScenes;
  const sectionEnd = (index + 1) / totalScenes;
  
  const opacity = useTransform(
    scrollProgress,
    [sectionStart, sectionStart + 0.1, sectionEnd - 0.1, sectionEnd],
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(
    scrollProgress,
    [sectionStart, sectionStart + 0.1, sectionEnd - 0.1, sectionEnd],
    [0.9, 1, 1, 0.9]
  );

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale }}
      className="min-h-screen flex items-center justify-center p-8"
    >
      <motion.div
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

// Scene 1: Consciousness Birth
const ConsciousnessBirthScene: React.FC = () => (
  <div className="text-center max-w-4xl mx-auto">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="w-48 h-48 mx-auto relative">
        {/* Consciousness orb animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-cyber-teal to-accent-vibrant-magenta blur-2xl"
        />
        <div className="absolute inset-4 rounded-full bg-black/50 backdrop-blur-md" />
      </div>
    </motion.div>
    
    <SplitText
      text="A New Form of Intelligence"
      className="text-5xl md:text-7xl font-light text-white mb-8"
      delay={0.5}
    />
    
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="text-xl text-white/70 font-light"
    >
      Beyond artificial. Beyond human. A synthesis of consciousness.
    </motion.p>
  </div>
);

// Scene 2: Memory Constellation
const MemoryConstellationScene: React.FC = () => {
  const [connections, setConnections] = useState<Array<[number, number]>>([]);
  
  useEffect(() => {
    // Animate connections between memories
    const timer = setInterval(() => {
      setConnections(prev => {
        const newConnection: [number, number] = [
          Math.floor(Math.random() * 6),
          Math.floor(Math.random() * 6)
        ];
        return [...prev.slice(-4), newConnection];
      });
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-light text-white text-center mb-16">
        Your Memories, Connected
      </h2>
      
      {/* Memory nodes */}
      <div className="relative h-96">
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = 50 + Math.cos(angle) * 40;
          const y = 50 + Math.sin(angle) * 40;
          
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="absolute w-24 h-24"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white/80" />
              </div>
            </motion.div>
          );
        })}
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {connections.map(([from, to], index) => {
            const fromAngle = (from / 6) * Math.PI * 2;
            const toAngle = (to / 6) * Math.PI * 2;
            const x1 = 50 + Math.cos(fromAngle) * 40;
            const y1 = 50 + Math.sin(fromAngle) * 40;
            const x2 = 50 + Math.cos(toAngle) * 40;
            const y2 = 50 + Math.sin(toAngle) * 40;
            
            return (
              <motion.line
                key={`${from}-${to}-${index}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="rgba(0, 245, 212, 0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            );
          })}
        </svg>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center text-lg text-white/70 mt-16"
      >
        Every thought, every moment, woven into your personal constellation
      </motion.p>
    </div>
  );
};

// Scene 3: Wave Selection
const WaveSelectionScene: React.FC = () => {
  const waves = [
    { name: 'Pioneer', color: 'from-purple-500 to-pink-500', delay: 0 },
    { name: 'Voyager', color: 'from-cyan-500 to-blue-500', delay: 0.2 },
    { name: 'Genesis', color: 'from-amber-500 to-orange-500', delay: 0.4 }
  ];

  return (
    <div className="text-center max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-light text-white mb-4">
        Choose Your Path
      </h2>
      <p className="text-xl text-white/70 mb-16">
        Each wave offers a unique journey into consciousness
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {waves.map((wave, index) => (
          <motion.div
            key={wave.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wave.delay, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl blur-xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${wave.color.replace('from-', '').replace('to-', ',')})`
              }}
            />
            <div className="relative bg-black/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 group-hover:border-white/20 transition-colors duration-300">
              <h3 className="text-2xl font-light text-white mb-4">{wave.name}</h3>
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${wave.color} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Scroll progress indicator
const ScrollProgressIndicator: React.FC<{ progress: number }> = ({ progress }) => {
  const scaleY = useTransform(progress, [0, 1], [0, 1]);
  
  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-gradient-to-b from-accent-cyber-teal to-accent-vibrant-magenta rounded-full origin-top"
          style={{ scaleY }}
        />
      </div>
    </motion.div>
  );
};