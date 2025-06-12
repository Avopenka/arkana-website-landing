'use client';

import { OrbRefinedPNG } from './OrbRefinedPNG';

interface ClientOrbProps {
  isActive?: boolean;
  showParticles?: boolean;
  style?: 'mystical' | 'techno' | 'elegant';
  className?: string;
}

export default function ClientOrb({ 
  isActive = true, 
  showParticles = true, 
  style = 'mystical',
  className = ''
}: ClientOrbProps) {
  return (
    <OrbRefinedPNG 
      isActive={isActive}
      showParticles={showParticles}
      style={style}
      className={className}
    />
  );
}