'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Eye, Heart, Compass, Sparkles, Wind, Mountain, Waves, Sun } from 'lucide-react';

interface ProgressiveRevelationProps {
  children: React.ReactNode;
  revealTrigger?: 'scroll' | 'time' | 'interaction' | 'natural';
  naturalPath?: 'EXPLORER' | 'SEEKER' | 'READY' | 'MYSTERY' | null;
  threshold?: number; // 0-1, how much engagement needed to reveal
  delay?: number; // seconds
  className?: string;
}

// Content layers that reveal progressively
interface RevelationLayer {
  id: string;
  threshold: number; // 0-1 engagement level needed
  content: React.ReactNode;
  trigger: 'engagement' | 'time' | 'scroll' | 'interaction';
  pathRelevance?: string[]; // Which natural paths find this relevant
}

// Engagement detection patterns
interface EngagementMetrics {
  timeSpent: number; // seconds
  scrollDepth: number; // 0-1
  interactions: number;
  mouseMovement: number; // relative activity
  intentSignal: 'casual' | 'interested' | 'engaged' | 'committed';
  confidenceLevel: number; // 0-1
}

export default function ProgressiveRevelation({ 
  children, 
  revealTrigger = 'natural',
  naturalPath,
  threshold = 0.3,
  delay = 0,
  className = ''
}: ProgressiveRevelationProps) {
  // State management
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics>({
    timeSpent: 0,
    scrollDepth: 0,
    interactions: 0,
    mouseMovement: 0,
    intentSignal: 'casual',
    confidenceLevel: 0
  });

  const [revealedLayers, setRevealedLayers] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [naturalContent, setNaturalContent] = useState<React.ReactNode>(null);

  // Refs for tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());
  const mousePositions = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);
  const interactionLog = useRef<Array<{ type: string; timestamp: number }>>([]);
  const isInView = useInView(containerRef, { margin: "-100px" });

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Progressive revelation based on natural engagement
  const calculateEngagement = useCallback(() => {
    const now = Date.now();
    const timeSpent = (now - startTime.current) / 1000;
    
    // Calculate scroll depth relative to viewport
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDepth = Math.max(0, Math.min(1, 
      (windowHeight - rect.top) / (rect.height + windowHeight)
    ));

    // Analyze mouse movement patterns
    const recentMouse = mousePositions.current.filter(pos => now - pos.timestamp < 5000);
    const mouseActivity = recentMouse.length > 0 ? 
      recentMouse.reduce((total, pos, i, arr) => {
        if (i === 0) return 0;
        const prev = arr[i - 1];
        const distance = Math.sqrt(Math.pow(pos.x - prev.x, 2) + Math.pow(pos.y - prev.y, 2));
        return total + distance;
      }, 0) / 1000 : 0; // Normalize mouse movement

    // Count recent interactions
    const recentInteractions = interactionLog.current.filter(log => now - log.timestamp < 10000);

    // Determine intent signal
    let intentSignal: EngagementMetrics['intentSignal'] = 'casual';
    let confidenceLevel = 0;

    if (timeSpent > 30 && scrollDepth > 0.5) {
      intentSignal = 'interested';
      confidenceLevel = 0.4;
    }
    if (timeSpent > 60 && recentInteractions.length > 5) {
      intentSignal = 'engaged';
      confidenceLevel = 0.7;
    }
    if (timeSpent > 120 && scrollDepth > 0.8 && mouseActivity > 50) {
      intentSignal = 'committed';
      confidenceLevel = 0.9;
    }

    const newMetrics: EngagementMetrics = {
      timeSpent,
      scrollDepth,
      interactions: recentInteractions.length,
      mouseMovement: mouseActivity,
      intentSignal,
      confidenceLevel
    };

    setEngagementMetrics(newMetrics);
    return newMetrics;
  }, []);

  // Track mouse movement for engagement detection
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isInView) return;
    
    const now = Date.now();
    mousePositions.current.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: now
    });

    // Keep only recent positions
    if (mousePositions.current.length > 50) {
      mousePositions.current = mousePositions.current.slice(-25);
    }

    calculateEngagement();
  }, [isInView, calculateEngagement]);

  // Track interactions
  const trackInteraction = useCallback((type: string) => {
    interactionLog.current.push({
      type,
      timestamp: Date.now()
    });

    if (interactionLog.current.length > 100) {
      interactionLog.current = interactionLog.current.slice(-50);
    }

    calculateEngagement();
  }, [calculateEngagement]);

  // Mouse movement tracking
  useEffect(() => {
    if (isInView) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isInView, handleMouseMove]);

  // Engagement calculation timer
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(calculateEngagement, 1000);
      return () => clearInterval(interval);
    }
  }, [isInView, calculateEngagement]);

  // Natural revelation logic
  useEffect(() => {
    if (!isInView) return;

    const metrics = engagementMetrics;
    
    // Different revelation patterns based on natural path
    let shouldReveal = false;
    let revealThreshold = threshold;

    switch (naturalPath) {
      case 'EXPLORER':
        // Explorers get content revealed quickly as they browse
        shouldReveal = metrics.scrollDepth > 0.2 || metrics.timeSpent > 5;
        revealThreshold = 0.2;
        break;
      
      case 'SEEKER':
        // Seekers need more contemplative engagement
        shouldReveal = metrics.timeSpent > 15 && metrics.intentSignal !== 'casual';
        revealThreshold = 0.4;
        break;
      
      case 'READY':
        // Ready users get immediate access
        shouldReveal = metrics.scrollDepth > 0.1;
        revealThreshold = 0.1;
        break;
      
      case 'MYSTERY':
        // Mystery path users get intuitive reveals
        shouldReveal = metrics.mouseMovement > 20 || metrics.confidenceLevel > 0.6;
        revealThreshold = 0.3;
        break;
      
      default:
        // Natural path detection
        shouldReveal = metrics.confidenceLevel > threshold;
    }

    // Apply delay if specified
    if (shouldReveal && metrics.timeSpent >= delay) {
      setIsVisible(true);
    }
  }, [engagementMetrics, isInView, naturalPath, threshold, delay]);

  // Generate natural content based on engagement patterns
  useEffect(() => {
    if (!isVisible) return;

    const metrics = engagementMetrics;
    
    // Adapt content tone based on natural path and engagement
    const getContentTone = () => {
      switch (naturalPath) {
        case 'EXPLORER':
          return metrics.intentSignal === 'engaged' ? 'detailed' : 'overview';
        case 'SEEKER':
          return metrics.intentSignal === 'committed' ? 'deep' : 'contemplative';
        case 'READY':
          return 'direct';
        case 'MYSTERY':
          return 'enigmatic';
        default:
          return metrics.confidenceLevel > 0.7 ? 'engaging' : 'gentle';
      }
    };

    const tone = getContentTone();
    
    // Create adaptive content wrapper
    const adaptiveContent = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: tone === 'direct' ? 0.3 : 0.8,
          ease: tone === 'enigmatic' ? "easeInOut" : "easeOut"
        }}
        className={`natural-content-${tone} ${className}`}
        onMouseEnter={() => trackInteraction('content_hover')}
        onClick={() => trackInteraction('content_click')}
      >
        {children}
        
        {/* Engagement-based enhancements */}
        {metrics.intentSignal === 'committed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white/80">Deep Engagement Detected</span>
            </div>
            <p className="text-xs text-white/60">
              Your level of attention suggests a genuine interest. Additional insights available.
            </p>
          </motion.div>
        )}
      </motion.div>
    );

    setNaturalContent(adaptiveContent);
  }, [isVisible, engagementMetrics, naturalPath, children, className, trackInteraction]);

  // Progressive enhancement layers
  const enhancementLayers = [
    {
      threshold: 0.3,
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full"
        >
          <Eye className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-white/60">Observed</span>
        </motion.div>
      )
    },
    {
      threshold: 0.6,
      content: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
        />
      )
    },
    {
      threshold: 0.8,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-0 right-0 text-center"
        >
          <span className="text-xs text-white/40 italic">
            "When ready, the path reveals itself"
          </span>
        </motion.div>
      )
    }
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Base content container */}
      <AnimatePresence mode="wait">
        {isVisible ? (
          naturalContent
        ) : (
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="opacity-60"
          >
            {/* Placeholder or teaser content */}
            <div className="relative">
              {children}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progressive enhancement layers */}
      <AnimatePresence>
        {enhancementLayers.map((layer, index) => 
          engagementMetrics.confidenceLevel >= layer.threshold && (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {layer.content}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Natural engagement indicator */}
      {isInView && engagementMetrics.confidenceLevel > 0.2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-6 -right-6 w-12 h-12 pointer-events-none"
        >
          <motion.div
            className="w-full h-full rounded-full border border-cyan-400/30"
            style={{
              background: `conic-gradient(from 0deg, transparent ${engagementMetrics.confidenceLevel * 360}deg, rgba(34, 211, 238, 0.3) 0deg)`
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {engagementMetrics.intentSignal === 'casual' && <Wind className="w-4 h-4 text-cyan-400/60" />}
            {engagementMetrics.intentSignal === 'interested' && <Eye className="w-4 h-4 text-cyan-400/80" />}
            {engagementMetrics.intentSignal === 'engaged' && <Heart className="w-4 h-4 text-purple-400" />}
            {engagementMetrics.intentSignal === 'committed' && <Sparkles className="w-4 h-4 text-yellow-400" />}
          </div>
        </motion.div>
      )}

      {/* Development helper - show engagement metrics */}
      {process.env.NODE_ENV === 'development' && isInView && (
        <div className="absolute -bottom-16 left-0 text-xs text-white/40 space-y-1">
          <div>Time: {Math.round(engagementMetrics.timeSpent)}s</div>
          <div>Scroll: {Math.round(engagementMetrics.scrollDepth * 100)}%</div>
          <div>Intent: {engagementMetrics.intentSignal}</div>
          <div>Confidence: {Math.round(engagementMetrics.confidenceLevel * 100)}%</div>
        </div>
      )}
    </div>
  );
}