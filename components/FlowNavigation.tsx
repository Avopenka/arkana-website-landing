'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface FlowNavigationProps {
  className?: string;
}

export default function FlowNavigation({ className = '' }: FlowNavigationProps) {
  const [isReading, setIsReading] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const readingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Use Framer Motion's scroll hook for smooth progress tracking
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to opacity (invisible when reading, visible when navigating)
  const navOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.95, 1],
    [1, isReading && !isHovered ? 0.1 : 0.8, isReading && !isHovered ? 0.1 : 0.8, 1]
  );

  // Detect reading vs navigating behavior
  useEffect(() => {
    let lastTime = Date.now();
    let lastPosition = window.scrollY;
    
    const detectReadingBehavior = () => {
      const currentTime = Date.now();
      const currentPosition = window.scrollY;
      const timeDelta = currentTime - lastTime;
      const scrollDelta = Math.abs(currentPosition - lastPosition);
      
      // Calculate scroll velocity
      const velocity = scrollDelta / timeDelta;
      
      // Natural reading speed is typically < 0.5px/ms
      // Quick navigation is typically > 2px/ms
      if (velocity < 0.5 && scrollDelta > 0) {
        // User is reading
        clearTimeout(readingTimeoutRef.current);
        setIsReading(true);
        
        // Keep nav faded while reading
        readingTimeoutRef.current = setTimeout(() => {
          setIsReading(false);
        }, 3000); // Reappear after 3s of no scrolling
      } else if (velocity > 2) {
        // User is navigating quickly
        setIsReading(false);
        clearTimeout(readingTimeoutRef.current);
      }
      
      // Update scroll direction
      if (currentPosition > lastPosition + 5) {
        setScrollDirection('down');
      } else if (currentPosition < lastPosition - 5) {
        setScrollDirection('up');
      }
      
      lastTime = currentTime;
      lastPosition = currentPosition;
      setLastScrollY(currentPosition);
    };

    const handleScroll = () => {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(detectReadingBehavior, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeoutRef.current);
      clearTimeout(readingTimeoutRef.current);
    };
  }, []);

  // Natural easing for navigation visibility
  const navVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] // Natural cubic bezier
      }
    },
    reading: {
      opacity: isHovered ? 0.95 : 0.15,
      y: scrollDirection === 'down' ? -10 : 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      style={{ opacity: navOpacity }}
      initial="visible"
      animate={isReading && !isHovered ? "reading" : "visible"}
      variants={navVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`backdrop-blur-xl transition-all duration-700 ${
          lastScrollY > 50 
            ? 'bg-black/60 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between py-4">
            {/* Logo with natural breathing animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <Image 
                    src="/MainLogoENoNameNoBackGround.png" 
                    alt="Arkana" 
                    width={48} 
                    height={48} 
                    className="w-12 h-12 object-contain" 
                    priority
                  />
                </motion.div>
                <span className="text-2xl font-serif text-white/90 group-hover:text-white transition-colors duration-500">
                  Arkana
                </span>
              </Link>
            </motion.div>

            {/* Navigation Links with staggered reveal */}
            <motion.div className="hidden lg:flex items-center space-x-8">
              {['Features', 'Philosophy', 'Pricing', 'About'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <FlowNavLink href={`#${item.toLowerCase()}`}>
                    {item}
                  </FlowNavLink>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA with breathing animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="hidden sm:block"
            >
              <BreathingButton href="#waitlist">
                Begin Journey
              </BreathingButton>
            </motion.div>

            {/* Mobile menu trigger with organic animation */}
            <motion.button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <OrganicMenuIcon isOpen={false} />
            </motion.button>
          </nav>
        </div>
      </motion.div>
    </motion.header>
  );
}

// Natural flowing navigation link
function FlowNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="relative text-white/70 hover:text-white transition-all duration-500 text-sm font-medium group"
    >
      {children}
      <motion.span 
        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-accent-cyber-teal to-accent-vibrant-magenta"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
    </Link>
  );
}

// Button that breathes with natural rhythm
function BreathingButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.button
        className="px-6 py-2.5 bg-gradient-to-r from-accent-cyber-teal to-accent-vibrant-magenta 
                   text-white font-medium rounded-full relative overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(0, 245, 212, 0.3)',
            '0 0 30px rgba(0, 245, 212, 0.5)',
            '0 0 20px rgba(0, 245, 212, 0.3)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 2, opacity: 0.1 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      </motion.button>
    </Link>
  );
}

// Organic hamburger menu icon
function OrganicMenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span 
        className="block h-0.5 w-full bg-white"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
      <motion.span 
        className="block h-0.5 w-full bg-white"
        animate={{
          opacity: isOpen ? 0 : 1
        }}
        transition={{
          duration: 0.2
        }}
      />
      <motion.span 
        className="block h-0.5 w-full bg-white"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
    </div>
  );
}