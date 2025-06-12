'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ParticleField, HolographicLayer } from '../lazy/LazyThreeJS';

interface MousePosition {
  x: number;
  y: number;
}

// Einstein Elegance: Background effects as pure mathematical motion
export default function HeroBackground() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Particle effects - Performance optimized */}
      <Suspense fallback={null}>
        <ParticleField type="spice" density={2} speed={0.3} />
        <ParticleField type="void" density={1} speed={0.2} className="opacity-50" />
      </Suspense>

      {/* Atmospheric fog */}
      <div className="fog-layer" />

      {/* Background layers with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        <Image 
          src="/images/dune-silhouette-distant.svg" 
          alt="Distant Dune" 
          fill
          className="opacity-10 object-cover"
          style={{ transform: 'translateZ(-50px) scale(1.5)' }}
          priority={false}
        />
        <Image 
          src="/images/rock-formation-close.svg" 
          alt="Rock Formation" 
          fill
          className="opacity-15 object-cover"
          style={{ transform: 'translateZ(-20px) scale(1.2)' }}
          priority={false}
        />
      </motion.div>
      
      {/* Holographic Grid Overlay */}
      <Suspense fallback={null}>
        <HolographicLayer intensity="low">
          <div></div>
        </HolographicLayer>
      </Suspense>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        />
      </div>
    </>
  );
}