'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Compass, Heart, Sparkles, Wind, ChevronDown, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface NaturalNavigationProps {
  naturalPath?: 'EXPLORER' | 'SEEKER' | 'READY' | 'MYSTERY' | null;
  onPathChange?: (path: string) => void;
}

// Adaptive navigation based on user's natural path
const NAVIGATION_STYLES = {
  EXPLORER: {
    style: 'minimal',
    color: '#16FFE1',
    behavior: 'curious',
    showAll: true
  },
  SEEKER: {
    style: 'contemplative',
    color: '#8B5CF6',
    behavior: 'thoughtful',
    showAll: false
  },
  READY: {
    style: 'direct',
    color: '#D4AF37',
    behavior: 'efficient',
    showAll: true
  },
  MYSTERY: {
    style: 'enigmatic',
    color: '#FF6B6B',
    behavior: 'intuitive',
    showAll: false
  }
};

// Natural menu items that adapt to user intent
const NATURAL_MENU_ITEMS = [
  {
    label: 'Experience',
    path: '#experience',
    description: 'See Arkana in action',
    intent: ['exploring', 'deciding'],
    pathRelevance: ['EXPLORER', 'READY'],
    icon: Sparkles
  },
  {
    label: 'Philosophy',
    path: '#philosophy',
    description: 'Our consciousness approach',
    intent: ['seeking', 'contemplating'],
    pathRelevance: ['SEEKER', 'MYSTERY'],
    icon: Heart
  },
  {
    label: 'Community',
    path: '#community',
    description: 'Join fellow seekers',
    intent: ['connecting', 'belonging'],
    pathRelevance: ['SEEKER', 'EXPLORER'],
    icon: Wind
  },
  {
    label: 'Access',
    path: '#access',
    description: 'Natural entry points',
    intent: ['deciding', 'committing'],
    pathRelevance: ['READY', 'MYSTERY'],
    icon: Compass
  }
];

// User intent detection patterns
interface UserIntent {
  pattern: 'exploring' | 'seeking' | 'deciding' | 'connecting' | 'contemplating' | 'committing';
  confidence: number; // 0-1
  timeSpent: number;
  scrollDepth: number;
}

export default function NaturalNavigation({ naturalPath, onPathChange }: NaturalNavigationProps) {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userIntent, setUserIntent] = useState<UserIntent>({
    pattern: 'exploring',
    confidence: 0,
    timeSpent: 0,
    scrollDepth: 0
  });
  const [adaptedMenu, setAdaptedMenu] = useState(NATURAL_MENU_ITEMS);
  const [showAdaptiveHints, setShowAdaptiveHints] = useState(false);

  // Refs for intent detection
  const navRef = useRef<HTMLElement>(null);
  const startTime = useRef(Date.now());
  const interactionLog = useRef<Array<{ action: string; timestamp: number; element?: string }>>([]);
  const lastScrollY = useRef(0);

  // Scroll tracking for intent detection
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 10]);

  // Detect user intent through natural interactions
  const detectUserIntent = useCallback(() => {
    const now = Date.now();
    const timeSpent = (now - startTime.current) / 1000; // seconds
    const scrollDepth = Math.min(1, window.scrollY / (document.body.scrollHeight - window.innerHeight || 1));
    
    // Analyze recent interactions
    const recentInteractions = interactionLog.current.filter(log => now - log.timestamp < 30000);
    
    let pattern: UserIntent['pattern'] = 'exploring';
    let confidence = 0;

    // Pattern detection based on behavior
    if (timeSpent > 60 && scrollDepth > 0.3) {
      pattern = 'contemplating';
      confidence = 0.8;
    } else if (recentInteractions.length > 10 && timeSpent < 30) {
      pattern = 'deciding';
      confidence = 0.7;
    } else if (scrollDepth > 0.7) {
      pattern = 'seeking';
      confidence = 0.6;
    } else if (recentInteractions.filter(i => i.element?.includes('connect')).length > 2) {
      pattern = 'connecting';
      confidence = 0.8;
    } else if (timeSpent > 120) {
      pattern = 'committing';
      confidence = 0.9;
    }

    setUserIntent({ pattern, confidence, timeSpent, scrollDepth });
  }, []);

  // Track natural interactions
  const trackInteraction = useCallback((action: string, element?: string) => {
    interactionLog.current.push({
      action,
      timestamp: Date.now(),
      element
    });

    // Keep only recent interactions
    if (interactionLog.current.length > 100) {
      interactionLog.current = interactionLog.current.slice(-50);
    }

    detectUserIntent();
  }, [detectUserIntent]);

  // Scroll intent detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentScrollY;
      
      trackInteraction('scroll', scrollDirection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackInteraction]);

  // Adapt menu based on natural path and intent
  useEffect(() => {
    if (!naturalPath) return;

    const pathStyle = NAVIGATION_STYLES[naturalPath];
    const relevantItems = NATURAL_MENU_ITEMS.filter(item => {
      // Show items relevant to current path and intent
      const pathRelevant = item.pathRelevance.includes(naturalPath);
      const intentRelevant = item.intent.includes(userIntent.pattern);
      
      return pathStyle.showAll || pathRelevant || intentRelevant;
    });

    setAdaptedMenu(relevantItems);
    
    // Show adaptive hints for seekers and mystery path users
    if ((naturalPath === 'SEEKER' || naturalPath === 'MYSTERY') && userIntent.confidence > 0.5) {
      setShowAdaptiveHints(true);
    }
  }, [naturalPath, userIntent]);

  // Auto-timer for intent updates
  useEffect(() => {
    const interval = setInterval(detectUserIntent, 5000);
    return () => clearInterval(interval);
  }, [detectUserIntent]);

  const currentStyle = naturalPath ? NAVIGATION_STYLES[naturalPath] : NAVIGATION_STYLES.EXPLORER;

  // Handle natural menu item selection
  const handleMenuClick = (item: typeof NATURAL_MENU_ITEMS[0]) => {
    trackInteraction('menu_click', item.label);
    setIsMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(item.path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    onPathChange?.(item.path);
  };

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 p-4"
      style={{ 
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Natural adaptive background */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${currentStyle.color}08, transparent)`,
          border: `1px solid ${currentStyle.color}20`
        }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.01, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative backdrop-blur-xl bg-black/20 rounded-2xl border border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with natural breathing */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              trackInteraction('logo_click');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image 
                src="/logos/arkana-logo-primary-light.svg" 
                width={120} 
                height={30} 
                alt="Arkana" 
                className="cursor-pointer"
              />
            </motion.div>
            
            {/* Natural path indicator */}
            {naturalPath && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentStyle.color }}
                />
                <span className="text-xs text-white/70">{naturalPath.toLowerCase()}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Adaptive menu items for larger screens */}
          <div className="hidden lg:flex items-center gap-6">
            {adaptedMenu.map((item, index) => {
              const IconComponent = item.icon;
              const isRelevant = item.intent.includes(userIntent.pattern);
              
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMenuClick(item)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isRelevant 
                      ? 'text-white bg-white/10' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onMouseEnter={() => trackInteraction('menu_hover', item.label)}
                >
                  <IconComponent 
                    className="w-4 h-4" 
                    style={{ color: isRelevant ? currentStyle.color : undefined }}
                  />
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Intent-based highlighting */}
                  {isRelevant && (
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-20"
                      style={{ backgroundColor: currentStyle.color }}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Adaptive hint display */}
            <AnimatePresence>
              {showAdaptiveHints && userIntent.confidence > 0.6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10"
                >
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-white/60">
                    Sensing {userIntent.pattern} energy
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <motion.button
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              trackInteraction('mobile_menu_toggle');
            }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile natural menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden mt-4 pt-4 border-t border-white/10"
            >
              <div className="space-y-2">
                {adaptedMenu.map((item, index) => {
                  const IconComponent = item.icon;
                  const isRelevant = item.intent.includes(userIntent.pattern);
                  
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        isRelevant 
                          ? 'bg-white/10 text-white' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: isRelevant ? currentStyle.color : undefined }}
                        />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-white/50">{item.description}</div>
                        </div>
                      </div>
                      
                      {isRelevant && (
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentStyle.color }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile intent indicator */}
              {userIntent.confidence > 0.5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white/80">Natural Flow Detected</span>
                  </div>
                  <div className="text-xs text-white/60">
                    You seem to be in {userIntent.pattern} mode. Menu adapted accordingly.
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating intent indicator for desktop */}
      <AnimatePresence>
        {userIntent.confidence > 0.7 && !isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-black/50 backdrop-blur-xl rounded-xl border border-white/20"
          >
            <div className="flex items-center gap-2 text-xs text-white/70">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentStyle.color }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Flow: {userIntent.pattern}</span>
              <span>•</span>
              <span>{Math.round(userIntent.confidence * 100)}% confidence</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}