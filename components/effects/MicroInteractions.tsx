'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

// Hover Effects
export const HoverScale: React.FC<{ children: React.ReactNode; scale?: number }> = ({ 
  children, 
  scale = 1.05 
}) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: scale - 0.05 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    {children}
  </motion.div>
);

export const HoverGlow: React.FC<{ children: React.ReactNode; color?: string }> = ({ 
  children, 
  color = 'rgba(147, 51, 234, 0.5)' 
}) => (
  <motion.div
    className="relative"
    whileHover={{ 
      boxShadow: `0 0 20px ${color}`,
      transition: { duration: 0.3 }
    }}
  >
    {children}
  </motion.div>
);

export const HoverTilt: React.FC<{ children: React.ReactNode; maxTilt?: number }> = ({ 
  children, 
  maxTilt = 10 
}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPosition({ x: x - 0.5, y: y - 0.5 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{
        rotateY: position.x * maxTilt,
        rotateX: -position.y * maxTilt,
      }}
      style={{ transformStyle: 'preserve-3d' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

// Click Effects
export const ClickRipple: React.FC<{ children: React.ReactNode; color?: string }> = ({ 
  children, 
  color = 'rgba(147, 51, 234, 0.3)' 
}) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
  };

  return (
    <div ref={ref} className="relative overflow-hidden" onClick={handleClick}>
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            background: color,
            borderRadius: '50%',
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0 }}
          animate={{ width: 200, height: 200, x: -100, y: -100 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

export const ClickPulse: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    {children}
  </motion.div>
);

// Loading States
export const SkeletonPulse: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
  width = '100%', 
  height = '20px',
  className = ''
}) => (
  <motion.div
    className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    style={{ width, height }}
    animate={{
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

export const LoadingDots: React.FC<{ color?: string }> = ({ color = '#9333ea' }) => (
  <div className="flex space-x-1">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          y: ['0%', '-50%', '0%'],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// Scroll Reveals
const scrollRevealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={scrollRevealVariants}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const ScrollScale: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const ScrollRotate: React.FC<{ children: React.ReactNode; degrees?: number }> = ({ 
  children, 
  degrees = 90 
}) => (
  <motion.div
    initial={{ rotate: degrees, opacity: 0 }}
    whileInView={{ rotate: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, type: 'spring' }}
  >
    {children}
  </motion.div>
);

// Text Effects
export const TextReveal: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const words = text.split(' ');
  
  return (
    <motion.div className="flex flex-wrap">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.1 }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const TypeWriter: React.FC<{ text: string; speed?: number }> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  
  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return <span>{displayedText}</span>;
};

// Focus Effects
export const FocusGlow: React.FC<{ children: React.ReactNode; color?: string }> = ({ 
  children, 
  color = '#9333ea' 
}) => (
  <motion.div
    whileFocus={{
      boxShadow: `0 0 0 3px ${color}40`,
      transition: { duration: 0.2 },
    }}
  >
    {children}
  </motion.div>
);

// Tooltip
export const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ 
  children, 
  text 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </div>
  );
};

// Export all as a collection
export const MicroInteractions = {
  HoverScale,
  HoverGlow,
  HoverTilt,
  ClickRipple,
  ClickPulse,
  SkeletonPulse,
  LoadingDots,
  ScrollReveal,
  ScrollScale,
  ScrollRotate,
  TextReveal,
  TypeWriter,
  FocusGlow,
  Tooltip,
};