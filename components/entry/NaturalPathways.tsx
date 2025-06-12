'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface PathwayProps {
  userIntent: 'exploring' | 'seeking' | 'ready' | 'mystery';
  signals: {
    scrollDepth: number;
    timeOnPage: number;
    mouseMovement: number;
  };
  onPathChosen: (path: string) => void;
}

export function NaturalPathways({ userIntent, signals, onPathChosen }: PathwayProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const pathways = [
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Wander freely through Arkana\'s landscape',
      icon: '🌊',
      color: 'from-blue-400/20 to-cyan-400/20',
      available: true,
      action: '/explore',
      subtitle: 'No commitment, just curiosity'
    },
    {
      id: 'seeker',
      title: 'Seeker',
      description: 'Ready to shape the future of consciousness',
      icon: '✨',
      color: 'from-consciousness-400/20 to-consciousness-500/20',
      available: signals.scrollDepth > 50 || signals.timeOnPage > 30,
      action: '/waitlist',
      subtitle: 'Join when the moment feels right'
    },
    {
      id: 'ready',
      title: 'Ready',
      description: 'You have been invited to begin',
      icon: '🔑',
      color: 'from-primary-400/20 to-primary-500/20',
      available: userIntent === 'ready',
      action: '/enter',
      subtitle: 'For those with access keys'
    },
    {
      id: 'mystery',
      title: '???',
      description: 'Some paths reveal themselves to patient souls',
      icon: '🌙',
      color: 'from-neutral-400/10 to-neutral-500/10',
      available: signals.timeOnPage > 60 && signals.scrollDepth < 20,
      action: '/quantum',
      subtitle: 'The way of wu wei'
    }
  ];

  // Natural reveal based on user behavior
  const visiblePaths = pathways.filter(path => {
    if (path.id === 'explorer') return true; // Always visible
    if (path.id === 'seeker' && (userIntent === 'seeking' || userIntent === 'ready')) return true;
    if (path.id === 'ready' && userIntent === 'ready') return true;
    if (path.id === 'mystery' && userIntent === 'mystery') return true;
    return false;
  });

  return (
    <div className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-light text-neutral-800 mb-4">
          Every journey begins with a single step
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          There is no wrong path. Follow what calls to you.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {visiblePaths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: path.available ? 1 : 0.3, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredPath(path.id)}
            onMouseLeave={() => setHoveredPath(null)}
            className="relative group"
          >
            <Link 
              href={path.available ? path.action : '#'}
              onClick={() => path.available && onPathChosen(path.id)}
              className={`block p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 ${
                path.available ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Organic background gradient */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-4xl mb-4">{path.icon}</div>
                <h3 className="text-xl font-medium text-neutral-800 mb-2">
                  {path.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-3">
                  {path.description}
                </p>
                <p className="text-xs text-neutral-500 italic">
                  {path.subtitle}
                </p>
              </div>

              {/* Natural flow indicator */}
              {hoveredPath === path.id && path.available && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-consciousness-500/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Gentle encouragement based on behavior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-16"
      >
        {userIntent === 'exploring' && (
          <p className="text-sm text-neutral-500">
            Take your time. The right path will become clear.
          </p>
        )}
        {userIntent === 'seeking' && (
          <p className="text-sm text-consciousness-600">
            You seem drawn to something deeper. Trust that feeling.
          </p>
        )}
        {userIntent === 'mystery' && (
          <p className="text-sm text-neutral-400 italic">
            "The way is not in the sky. The way is in the heart." - Buddha
          </p>
        )}
      </motion.div>
    </div>
  );
}