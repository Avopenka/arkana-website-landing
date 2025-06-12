'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show custom cursor on desktop
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    setIsVisible(true);
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseEnter = () => {
      document.body.style.cursor = 'none';
    };
    
    const handleMouseLeave = () => {
      document.body.style.cursor = 'auto';
      setIsVisible(false);
    };
    
    // Track interactive elements for hover effect
    const handleElementMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a');
      
      if (isInteractive) {
        setIsHovering(true);
      }
    };
    
    const handleElementMouseLeave = () => {
      setIsHovering(false);
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementMouseEnter);
    document.addEventListener('mouseout', handleElementMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementMouseEnter);
      document.removeEventListener('mouseout', handleElementMouseLeave);
    };
  }, []);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor */}
          <motion.div
            className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: mousePosition.x - 12,
              y: mousePosition.y - 12,
              scale: isHovering ? 1.5 : 1,
              backgroundColor: isHovering ? '#16FFE1' : '#FFFFFF',
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.5
            }}
          />
          
          {/* Trailing effect */}
          <motion.div
            className="fixed top-0 left-0 w-32 h-32 rounded-full pointer-events-none z-[9998] opacity-10"
            animate={{
              x: mousePosition.x - 64,
              y: mousePosition.y - 64,
              backgroundColor: isHovering ? '#16FFE1' : '#FFFFFF',
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              damping: 40,
              stiffness: 150,
              mass: 1,
              delay: 0.05
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
