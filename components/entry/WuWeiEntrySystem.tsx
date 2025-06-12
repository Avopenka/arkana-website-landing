'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NaturalPathways } from './NaturalPathways';
import { ProgressiveReveal } from './ProgressiveReveal';
interface ConsciousnessSignals {
  scrollDepth: number;
  timeOnPage: number;
  mouseMovement: number;
  clickPatterns: string[];
  focusAreas: string[];
  hesitationPoints: number[];
}
export function WuWeiEntrySystem() {
  const [signals, setSignals] = useState<ConsciousnessSignals>({
    scrollDepth: 0,
    timeOnPage: 0,
    mouseMovement: 0,
    clickPatterns: [],
    focusAreas: [],
    hesitationPoints: []
  });
  const [userIntent, setUserIntent] = useState<'exploring' | 'seeking' | 'ready' | 'mystery'>('exploring');
  const [revealDepth, setRevealDepth] = useState(0);
  // Natural behavior detection without intrusion
  useEffect(() => {
    let startTime = Date.now();
    let mouseDistance = 0;
    let lastX = 0, lastY = 0;
    const handleScroll = () => {
      const depth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setSignals(prev => ({ ...prev, scrollDepth: Math.max(prev.scrollDepth, depth) }));
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (lastX && lastY) {
        mouseDistance += Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
      }
      lastX = e.clientX;
      lastY = e.clientY;
      setSignals(prev => ({ ...prev, mouseMovement: mouseDistance }));
    };
    const updateTime = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setSignals(prev => ({ ...prev, timeOnPage: elapsed }));
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    const timer = setInterval(updateTime, 1000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);
  // Gentle intent detection based on natural signals
  useEffect(() => {
    const { scrollDepth, timeOnPage, mouseMovement } = signals;
    // Natural thresholds - not gates, just awareness
    if (scrollDepth > 80 && timeOnPage > 30) {
      setUserIntent('seeking');
      setRevealDepth(2);
    } else if (mouseMovement > 5000 && timeOnPage > 20) {
      setUserIntent('ready');
      setRevealDepth(3);
    } else if (scrollDepth < 20 && timeOnPage > 60) {
      setUserIntent('mystery');
      setRevealDepth(1);
    }
  }, [signals]);
  return (
    <div className="min-h-screen relative">
      {/* Ambient consciousness layer */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-consciousness-10/5 via-transparent to-primary-10/5" />
        {/* Subtle flow indicators */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-consciousness-500/20 to-transparent"
          animate={{
            x: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      {/* Natural pathways that appear organically */}
      <AnimatePresence mode="wait">
        <motion.div
          key={userIntent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <NaturalPathways 
            userIntent={userIntent}
            signals={signals}
            onPathChosen={(path) => {
              // No forced navigation, just gentle acknowledgment
            }}
          />
        </motion.div>
      </AnimatePresence>
      {/* Progressive content revelation */}
      <ProgressiveReveal 
        revealDepth={revealDepth}
        signals={signals}
      />
      {/* Floating invitation - appears only when natural */}
      <AnimatePresence>
        {userIntent === 'seeking' && signals.timeOnPage > 45 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-consciousness-500/10 backdrop-blur-xl rounded-2xl p-6 max-w-sm">
              <p className="text-consciousness-600 text-sm mb-3">
                Your journey with Arkana can begin whenever feels right
              </p>
              <div className="flex gap-3">
                <button className="text-xs text-neutral-500 hover:text-neutral-700">
                  Continue exploring
                </button>
                <button className="text-xs text-consciousness-600 hover:text-consciousness-700">
                  Join when ready
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hidden discoveries for the curious */}
      <div className="hidden" data-mystery="true">
        {/* Easter eggs and hidden pathways */}
        <div data-discovery="consciousness-whisper">
          The path reveals itself to those who seek without grasping
        </div>
      </div>
    </div>
  );
}