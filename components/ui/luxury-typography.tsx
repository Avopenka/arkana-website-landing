'use client';

import { cn } from '@/lib/utils';
import React from 'react';

// Luxury Typography Component - Dior/LVMH/Chanel Standard
// Implements premium typography hierarchy with optical adjustments

export interface LuxuryTypographyProps {
  variant?: 'profound' | 'statement' | 'headline' | 'body' | 'caption' | 'whisper';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'luxury-gold' | 'luxury-platinum';
  align?: 'left' | 'center' | 'right';
  optical?: boolean; // Enable optical adjustments for luxury brands
  className?: string;
  children?: React.ReactNode;
}

// Luxury Easing Functions (LVMH Standard)
const luxuryEasing = {
  silk: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  cashmere: 'cubic-bezier(0.23, 1, 0.32, 1)',
  diamond: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

const LuxuryTypography: React.FC<LuxuryTypographyProps> = ({ 
  className, 
  variant = 'body', 
  weight = 'regular',
  color = 'primary',
  align = 'left',
  optical = true,
  children,
}) => {
  
  // Variant-specific styling with luxury standards
  const variantStyles = {
    // Profound - Hero statements (Museum-quality)
    profound: cn(
      'font-serif text-[48px] md:text-[56px] lg:text-[64px] leading-[0.9] tracking-[-0.03em]',
      optical && 'font-optical-sizing-auto'
    ),
    
    // Statement - Major headings (Gallery-level sophistication)
    statement: 'font-serif text-[32px] md:text-[36px] lg:text-[42px] leading-[1.1] tracking-[-0.02em]',
    
    // Headline - Section headers (Premium editorial)
    headline: 'font-sans text-[24px] md:text-[28px] leading-[1.3] tracking-[-0.005em]',
    
    // Body - Reading text (Luxury comfort)
    body: cn(
      'font-sans text-[18px] md:text-[19px] leading-[1.7] tracking-[0.005em]',
      optical && 'font-optical-sizing-auto'
    ),
    
    // Caption - Support text (Swiss precision)
    caption: 'font-sans text-[14px] md:text-[15px] leading-[1.5] tracking-[0.01em]',
    
    // Whisper - Subtle details (French elegance)
    whisper: 'font-sans text-[12px] md:text-[13px] leading-[1.4] tracking-[0.02em] uppercase'
  };
  
  // Weight mapping (Luxury textile inspired)
  const weightStyles = {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  // Color palette (Luxury house inspired)
  const colorStyles = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    accent: 'text-cyan-400',
    muted: 'text-gray-500',
    'luxury-gold': 'text-[#FFD700]',
    'luxury-platinum': 'text-[#E5E4E2]'
  };
  
  // Alignment (Editorial precision)
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  const combinedClassName = cn(
    // Base luxury typography foundation
    'relative transition-all duration-300',
    // Apply variant styling
    variantStyles[variant],
    // Apply weight
    weightStyles[weight],
    // Apply color
    colorStyles[color],
    // Apply alignment
    alignStyles[align],
    // Custom className overrides
    className
  );
  
  const style: React.CSSProperties = {
    // Luxury transitions
    transition: `all 300ms ${luxuryEasing.silk}`,
    // Premium font feature settings (Chanel-level)
    ...(optical && {
      fontFeatureSettings: '"liga" 1, "kern" 1, "case" 1',
      textRendering: 'optimizeLegibility' as const,
      WebkitFontSmoothing: 'antialiased' as const,
      MozOsxFontSmoothing: 'grayscale' as const
    })
  };
  
  // Render appropriate element based on variant
  if (variant === 'profound') {
    return <h1 className={combinedClassName} style={style}>{children}</h1>;
  }
  if (variant === 'statement') {
    return <h2 className={combinedClassName} style={style}>{children}</h2>;
  }
  if (variant === 'headline') {
    return <h3 className={combinedClassName} style={style}>{children}</h3>;
  }
  
  return <p className={combinedClassName} style={style}>{children}</p>;
};

// Convenience components for semantic markup
export const LuxuryHeadline: React.FC<Omit<LuxuryTypographyProps, 'variant'>> = (props) => (
  <LuxuryTypography variant="headline" {...props} />
);

export const LuxuryBody: React.FC<Omit<LuxuryTypographyProps, 'variant'>> = (props) => (
  <LuxuryTypography variant="body" {...props} />
);

export const LuxuryCaption: React.FC<Omit<LuxuryTypographyProps, 'variant'>> = (props) => (
  <LuxuryTypography variant="caption" {...props} />
);

export default LuxuryTypography;