'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Einstein Optimization: Only load heavy animation libraries when needed
const GlitchText = dynamic(() => import('../effects/GlitchText'), {
  ssr: false,
  loading: () => <span className="opacity-80">ARKANA</span>
});

// Note: LottieAnimation component will be created when needed
// For now, this is a placeholder for future Lottie integrations
const LottieAnimation = dynamic(() => Promise.resolve(() => <div>Lottie placeholder</div>), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-teal/20 rounded-lg animate-pulse" />
  )
});

// Ive Visual Performance: Fallback maintains visual hierarchy
const LoadingFallback = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="relative">
      <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-0 w-8 h-8 border-2 border-brand-teal/30 border-b-transparent rounded-full animate-spin animation-delay-150" />
    </div>
  </div>
);

export { GlitchText, LottieAnimation, LoadingFallback };