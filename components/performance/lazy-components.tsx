'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components with loading fallbacks
export const LazyParticleField = dynamic(() => import('../effects/ParticleField'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export const LazyEnhancedParticleField = dynamic(() => import('../enhancements/EnhancedParticleField'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export const LazyConsciousnessOrb3D = dynamic(() => import('../consciousness/ConsciousnessOrb3D-Safe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 animate-pulse" />
    </div>
  )
});

export const LazyCinematicLoader = dynamic(() => import('../CinematicLoader'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});

export const LazyScrollCinema = dynamic(() => import('../ScrollCinema').then(mod => ({ default: mod.ScrollCinema })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

// Wrapper with Suspense for better error boundaries
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyWrapper({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <div className="w-full h-full bg-transparent animate-pulse" />}>
      {children}
    </Suspense>
  );
}

export default {
  LazyParticleField,
  LazyEnhancedParticleField,
  LazyConsciousnessOrb3D,
  LazyCinematicLoader,
  LazyScrollCinema,
  LazyWrapper
};