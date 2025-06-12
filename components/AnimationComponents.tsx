'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// Custom hook for smooth scrolling
export function useSmoothScroll() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
}

// Custom hook for parallax scrolling effects
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return offset * speed;
}

// Custom hook for cursor effects
export function useCursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  return { position, isHovering, handleMouseEnter, handleMouseLeave };
}

// Custom component for animated text reveal
export function AnimatedText({ text, className = '', delay = 0 }: { text: string, className?: string, delay?: number }) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

// Custom component for animated gradient text
export function GradientText({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-accent-gold ${className}`}>
      {children}
    </span>
  );
}

// Custom component for animated button
export function AnimatedButton({ 
  children, 
  className = '', 
  onClick,
  type = 'button'
}: { 
  children: React.ReactNode, 
  className?: string, 
  onClick?: () => void,
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <motion.button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.button>
  );
}

// Custom component for animated card
export function AnimatedCard({ 
  children, 
  className = '',
  delay = 0
}: { 
  children: React.ReactNode, 
  className?: string,
  delay?: number
}) {
  return (
    <motion.div
      className={`card ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.div>
  );
}

// Custom component for animated image
export function AnimatedImage({
  src,
  alt,
  width,
  height,
  className = '',
  delay = 0
}: {
  src: string,
  alt: string,
  width: number,
  height: number,
  className?: string,
  delay?: number
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-teal/10 to-accent-gold/10 z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.2, delay: delay + 0.2 }}
      />
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="relative z-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}

// Custom component for scroll indicator
export function ScrollIndicator() {
  return (
    <motion.div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="w-[30px] h-[50px] border-2 border-white/20 rounded-full flex justify-center">
        <motion.div 
          className="w-1 h-3 bg-brand-teal rounded-full mt-2"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>
    </motion.div>
  );
}

// Custom component for animated section
export function AnimatedSection({
  children,
  className = '',
  id,
  delay = 0
}: {
  children: React.ReactNode,
  className?: string,
  id?: string,
  delay?: number
}) {
  return (
    <motion.section
      id={id}
      className={`section ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.section>
  );
}

// Custom component for animated heading
export function AnimatedHeading({
  children,
  className = '',
  delay = 0,
  level = 2
}: {
  children: React.ReactNode,
  className?: string,
  delay?: number,
  level?: 1 | 2 | 3 | 4 | 5 | 6
}) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {React.createElement(HeadingTag, { className }, children)}
    </motion.div>
  );
}

// Custom component for animated paragraph
export function AnimatedParagraph({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode,
  className?: string,
  delay?: number
}) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.p>
  );
}

// Custom component for animated icon
export function AnimatedIcon({
  children,
  className = '',
  delay = 0,
  pulse = false
}: {
  children: React.ReactNode,
  className?: string,
  delay?: number,
  pulse?: boolean
}) {
  return (
    <motion.div
      className={`${className} ${pulse ? 'animate-pulse-custom' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ scale: 1.1 }}
    >
      {children}
    </motion.div>
  );
}

// Custom component for page transition
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
