'use client';

import { useState, useEffect } from 'react';

export function useResponsiveParticles() {
  const [isMobile, setIsMobile] = useState(false);
  const [particleDensity, setParticleDensity] = useState(2);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Reduce particle density for mobile performance
      setParticleDensity(mobile ? 1 : 2);
    };

    // Check initially
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, particleDensity };
}