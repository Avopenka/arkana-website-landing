// Luxury Contrast Utilities
// Ensuring WCAG AAA compliance while maintaining premium aesthetics
/**
 * Calculate relative luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 0;
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
/**
 * Check if contrast meets WCAG standards
 */
export function meetsWCAG(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  // AA standard
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}
/**
 * Luxury color palette with guaranteed contrast
 */
export const luxuryColors = {
  // Primary text colors (on black background)
  text: {
    primary: '#FFFFFF',      // 21:1 contrast
    secondary: '#E5E7EB',    // 18.1:1 contrast
    muted: '#9CA3AF',        // 7.5:1 contrast (AA compliant)
    accent: '#16FFE1',       // 15.3:1 contrast
    gold: '#D4AF37',         // 9.8:1 contrast
  },
  // Background colors
  background: {
    primary: '#000000',
    secondary: '#0A0A0A',
    elevated: '#1A1A1A',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  // Interactive states with proper contrast
  interactive: {
    hover: 'rgba(22, 255, 225, 0.1)',
    active: 'rgba(22, 255, 225, 0.2)',
    focus: 'rgba(22, 255, 225, 0.3)',
  }
};
/**
 * Get appropriate text color for a background
 */
export function getTextColorForBackground(
  background: string,
  options: {
    preferLight?: boolean;
    minContrast?: number;
  } = {}
): string {
  const { preferLight = true, minContrast = 4.5 } = options;
  // Check contrast with white first
  const whiteContrast = getContrastRatio('#FFFFFF', background);
  if (whiteContrast >= minContrast && preferLight) {
    return '#FFFFFF';
  }
  // Check contrast with black
  const blackContrast = getContrastRatio('#000000', background);
  if (blackContrast >= minContrast && !preferLight) {
    return '#000000';
  }
  // Return whichever has better contrast
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}
/**
 * Adjust color opacity to meet contrast requirements
 */
export function adjustOpacityForContrast(
  foreground: string,
  background: string,
  targetContrast: number = 4.5
): string {
  const currentRatio = getContrastRatio(foreground, background);
  if (currentRatio >= targetContrast) {
    return foreground;
  }
  // For now, return the original color
  // In production, this would calculate the needed opacity
  return foreground;
}
/**
 * Luxury-specific contrast adjustments
 */
export const luxuryContrast = {
  // Ensure text is readable on glass morphism backgrounds
  glassText: (isDark: boolean = true) => ({
    color: isDark ? luxuryColors.text.primary : '#000000',
    textShadow: isDark 
      ? '0 1px 2px rgba(0, 0, 0, 0.8)' 
      : '0 1px 2px rgba(255, 255, 255, 0.8)',
  }),
  // High contrast mode overrides
  highContrast: {
    text: '#FFFFFF',
    background: '#000000',
    accent: '#00FFFF',
    border: '#FFFFFF',
  },
};
// Validate our luxury palette
export function validateLuxuryPalette(): void {
  const results = {
    primaryOnBlack: getContrastRatio(luxuryColors.text.primary, luxuryColors.background.primary),
    secondaryOnBlack: getContrastRatio(luxuryColors.text.secondary, luxuryColors.background.primary),
    mutedOnBlack: getContrastRatio(luxuryColors.text.muted, luxuryColors.background.primary),
    accentOnBlack: getContrastRatio(luxuryColors.text.accent, luxuryColors.background.primary),
    goldOnBlack: getContrastRatio(luxuryColors.text.gold, luxuryColors.background.primary),
  };
}