'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NarrativeTextProps {
  lines: string[];
  className?: string;
  delay?: number;
  typeSpeed?: number;
  onComplete?: () => void;
}

export const NarrativeText: React.FC<NarrativeTextProps> = ({
  lines,
  className = '',
  delay = 0,
  typeSpeed = 50,
  onComplete
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Initial delay before starting
    const startTimer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping || currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;

    const typeTimer = setInterval(() => {
      if (charIndex <= currentLine.length) {
        setCurrentText(currentLine.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeTimer);
        
        // Wait before moving to next line
        setTimeout(() => {
          if (currentLineIndex < lines.length - 1) {
            setCurrentLineIndex(currentLineIndex + 1);
            setCurrentText('');
          } else if (onComplete) {
            onComplete();
          }
        }, 2500); // Enhanced: Longer pause between quotes for impact
      }
    }, typeSpeed);

    return () => clearInterval(typeTimer);
  }, [isTyping, currentLineIndex, lines, typeSpeed, onComplete]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLineIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <span className="inline-block">
            {currentText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block w-[2px] h-[1em] bg-accent-cyber-teal ml-1 align-middle"
            />
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Additional component for split text animations
export const SplitText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}> = ({ text, className = '', delay = 0, stagger = 0.05 }) => {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + (wordIndex * words.length + charIndex) * stagger,
                ease: [0.19, 1, 0.22, 1]
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
};