'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgressIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const handleScroll = () => {
      // Show progress indicator after scrolling down a bit
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={handleScrollToTop}
        className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white group-hover:text-brand-teal transition-colors"
        >
          <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 36 36" 
          className="absolute inset-0"
        >
          <circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            stroke="rgba(22, 255, 225, 0.2)" 
            strokeWidth="2"
          />
          <motion.circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            stroke="#16FFE1" 
            strokeWidth="2"
            strokeDasharray="100"
            style={{ 
              pathLength: scrollYProgress,
              rotate: -90
            }}
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}
