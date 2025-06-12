'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Musk Performance: <3 second rule - lazy load all 3D components
const ClientOrb = dynamic(() => import('../ClientOrb'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

const ParticleField = dynamic(() => import('../effects/ParticleField'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-transparent to-brand-purple/5" />
});

const HolographicLayer = dynamic(() => import('../effects/HolographicLayer'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 opacity-10" />
});

export { ClientOrb, ParticleField, HolographicLayer };