'use client';

import { motion } from 'framer-motion';

// Thiel Innovation: Zero-to-one neural visualization
export default function NeuralConnections() {
  return (
    <motion.div 
      className="absolute inset-0 opacity-20"
      style={{ perspective: '1000px' }}
    >
      <svg width="100%" height="100%" className="overflow-visible">
        {[...Array(20)].map((_, i) => (
          <motion.line
            key={i}
            x1={Math.random() * 1000}
            y1={Math.random() * 1000}
            x2={Math.random() * 1000}
            y2={Math.random() * 1000}
            stroke="url(#neural-gradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          />
        ))}
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00FFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#00FFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}