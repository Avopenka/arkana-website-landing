'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NaturalEntryFlowProps {
  children: React.ReactNode;
  className?: string;
}

export default function NaturalEntryFlow({ children, className = '' }: NaturalEntryFlowProps) {
  const [userIntent, setUserIntent] = useState<'exploring' | 'returning' | 'decisive'>('exploring');
  const mouseVelocity = useMotionValue(0);
  const [scrollPattern, setScrollPattern] = useState<'smooth' | 'searching' | 'reading'>('smooth');
  const [timeOnPage, setTimeOnPage] = useState(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const scrollHistory = useRef<number[]>([]);
  const entryTime = useRef(Date.now());
  
  const router = useRouter();

  // Adaptive opacity based on user behavior
  const adaptiveOpacity = useTransform(
    mouseVelocity,
    [0, 100, 500],
    [1, 0.95, 0.85]
  );

  // Detect user intent from behavior patterns
  useEffect(() => {
    const detectIntent = () => {
      const currentTime = Date.now();
      const sessionDuration = (currentTime - entryTime.current) / 1000; // in seconds
      
      // Returning user (came back quickly)
      if (sessionStorage.getItem('arkana-visited') && sessionDuration < 2) {
        setUserIntent('returning');
        return;
      }
      
      // Decisive user (quick scroll to specific section)
      if (scrollHistory.current.length > 3) {
        const avgScrollSpeed = scrollHistory.current.reduce((a, b) => a + b, 0) / scrollHistory.current.length;
        if (avgScrollSpeed > 100) {
          setUserIntent('decisive');
          return;
        }
      }
      
      // Default: exploring
      setUserIntent('exploring');
    };

    const interval = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
      detectIntent();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track mouse movement patterns
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const timeDelta = currentTime - lastMousePos.current.time;
      
      if (timeDelta > 0) {
        const distance = Math.sqrt(
          Math.pow(e.clientX - lastMousePos.current.x, 2) + 
          Math.pow(e.clientY - lastMousePos.current.y, 2)
        );
        const velocity = distance / timeDelta * 100;
        
        mouseVelocity.set(velocity);
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        
        lastMousePos.current = {
          x: e.clientX,
          y: e.clientY,
          time: currentTime
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Track scroll patterns
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      const timeDelta = currentTime - lastScrollTime;
      
      if (timeDelta > 0) {
        const scrollSpeed = scrollDelta / timeDelta * 1000;
        scrollHistory.current.push(scrollSpeed);
        
        // Keep only last 10 scroll events
        if (scrollHistory.current.length > 10) {
          scrollHistory.current.shift();
        }
        
        // Determine scroll pattern
        if (scrollSpeed < 50) {
          setScrollPattern('reading');
        } else if (scrollSpeed > 200) {
          setScrollPattern('searching');
        } else {
          setScrollPattern('smooth');
        }
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mark session as visited
  useEffect(() => {
    sessionStorage.setItem('arkana-visited', 'true');
  }, []);

  // Adaptive content presentation based on intent
  const getContentVariant = () => {
    switch (userIntent) {
      case 'returning':
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        };
      case 'decisive':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2 }
        };
      default: // exploring
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
        };
    }
  };

  // Adaptive quick actions based on user behavior
  const renderQuickActions = () => {
    if (userIntent === 'returning' && timeOnPage > 2) {
      return (
        <motion.div
          className="fixed bottom-8 right-8 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <QuickActionButton onClick={() => router.push('#waitlist')}>
            Continue Where You Left Off
          </QuickActionButton>
        </motion.div>
      );
    }

    if (userIntent === 'decisive' && scrollPattern === 'searching') {
      return (
        <motion.div
          className="fixed top-24 right-8 z-40"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <QuickNav />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ opacity: adaptiveOpacity }}
    >
      {/* Ambient awareness layer */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(600px at ${mouseX.get()}px ${mouseY.get()}px, rgba(0, 245, 212, 0.03), transparent 40%)`
        }}
      />

      {/* Main content with adaptive presentation */}
      <motion.div
        variants={getContentVariant()}
        initial="initial"
        animate="animate"
      >
        {children}
      </motion.div>

      {/* Behavioral hints layer */}
      <AnimatePresence>
        {scrollPattern === 'reading' && timeOnPage > 30 && (
          <ReadingModeIndicator />
        )}
      </AnimatePresence>

      {/* Adaptive quick actions */}
      {renderQuickActions()}

      {/* Intent indicator (subtle, for debugging - remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 text-xs text-white/30 font-mono">
          Intent: {userIntent} | Pattern: {scrollPattern} | Time: {timeOnPage}s
        </div>
      )}
    </motion.div>
  );
}

// Quick action button with natural interaction
function QuickActionButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      className="px-6 py-3 bg-black/80 backdrop-blur-xl text-white rounded-full 
                 border border-white/10 shadow-lg"
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 245, 212, 0.1)' }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

// Quick navigation for decisive users
function QuickNav() {
  const links = ['Features', 'Pricing', 'About', 'Get Started'];
  
  return (
    <motion.nav className="bg-black/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/10">
      {links.map((link, index) => (
        <motion.a
          key={link}
          href={`#${link.toLowerCase().replace(' ', '-')}`}
          className="block px-4 py-2 text-sm text-white/70 hover:text-white 
                     hover:bg-white/5 rounded-lg transition-all duration-200"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {link}
        </motion.a>
      ))}
    </motion.nav>
  );
}

// Reading mode indicator
function ReadingModeIndicator() {
  return (
    <motion.div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center space-x-2 px-4 py-2 bg-black/60 backdrop-blur-xl 
                      rounded-full text-xs text-white/60">
        <motion.div
          className="w-2 h-2 bg-accent-cyber-teal rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
        <span>Reading Mode Active</span>
      </div>
    </motion.div>
  );
}