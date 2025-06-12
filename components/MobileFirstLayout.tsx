'use client';
import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileThumbZone, { ThumbReachHeatmap } from './MobileThumbZone';
import { Sacred7GestureTutorial } from './Sacred7Mobile';
import { deviceCapabilities } from '../utils/mobilePerformance';
/**
 * MOBILE-FIRST LAYOUT WRAPPER
 * 
 * 5 Masters Layout Philosophy:
 * - Musk: Efficient space usage
 * - Jobs: Intuitive navigation
 * - Watts: Natural information flow
 * - Ive: Clean visual hierarchy
 * - Vopěnka: Consciousness-aware spacing
 */
interface MobileFirstLayoutProps {
  children: ReactNode;
  showThumbZone?: boolean;
  showHeatmap?: boolean;
  onVoiceActivate?: () => void;
}
export default function MobileFirstLayout({ 
  children, 
  showThumbZone = true,
  showHeatmap = false,
  onVoiceActivate
}: MobileFirstLayoutProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');
  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || deviceCapabilities.hasTouch());
    };
    // Handle viewport height for mobile browsers
    const updateViewportHeight = () => {
      // Use visualViewport for accurate height on mobile
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(`${vh}px`);
    };
    // Check for first-time user
    const isFirstVisit = !localStorage.getItem('arkana-tutorial-complete');
    if (isFirstVisit && isMobile) {
      setShowTutorial(true);
    }
    checkMobile();
    updateViewportHeight();
    // Event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
    };
  }, [isMobile]);
  const handleTutorialComplete = () => {
    localStorage.setItem('arkana-tutorial-complete', 'true');
    setShowTutorial(false);
  };
  const handleNavigate = (path: string) => {
    // Handle navigation
  };
  return (
    <div 
      className="mobile-first-layout min-h-screen bg-consciousness-void"
      style={{ minHeight: viewportHeight }}
    >
      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <Sacred7GestureTutorial onComplete={handleTutorialComplete} />
        )}
      </AnimatePresence>
      {/* Development heatmap */}
      {showHeatmap && <ThumbReachHeatmap show={showHeatmap} />}
      {/* Main content area */}
      <main className={`
        ${isMobile && showThumbZone ? 'pb-20' : ''}
        min-h-screen
      `}>
        {/* Safe area wrapper */}
        <div className="safe-area-wrapper">
          {children}
        </div>
      </main>
      {/* Mobile thumb zone navigation */}
      {isMobile && showThumbZone && (
        <MobileThumbZone 
          onVoiceActivate={onVoiceActivate}
          onNavigate={handleNavigate}
        />
      )}
      {/* Orientation lock warning */}
      <AnimatePresence>
        {isMobile && (
          <OrientationWarning />
        )}
      </AnimatePresence>
    </div>
  );
}
/**
 * ORIENTATION WARNING
 * Suggests portrait mode for optimal experience
 */
function OrientationWarning() {
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      const isSmallHeight = window.innerHeight < 500;
      setShowWarning(isLandscape && isSmallHeight);
    };
    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);
  if (!showWarning) return null;
  return (
    <motion.div
      className="fixed inset-0 bg-consciousness-void-alpha-95 z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, -90, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📱
        </motion.div>
        <h3 className="text-xl text-consciousness-illumination mb-2">
          Rotate for Better Experience
        </h3>
        <p className="text-sm text-consciousness-illumination-alpha-60">
          Arkana is optimized for portrait mode
        </p>
      </div>
    </motion.div>
  );
}
/**
 * MOBILE-OPTIMIZED SECTION
 * Consistent section wrapper with mobile spacing
 */
export function MobileSection({ 
  children, 
  className = '',
  id
}: { 
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section 
      id={id}
      className={`
        mobile-section
        px-6 py-12
        sm:px-8 sm:py-16
        md:px-12 md:py-20
        lg:px-16 lg:py-24
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
/**
 * MOBILE CARD GRID
 * Responsive grid that works great on mobile
 */
export function MobileCardGrid({ 
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 }
}: {
  children: ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}) {
  const gridCols = `
    grid-cols-${columns.xs || 1}
    sm:grid-cols-${columns.sm || 2}
    md:grid-cols-${columns.md || 3}
    lg:grid-cols-${columns.lg || 4}
  `;
  return (
    <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
      {children}
    </div>
  );
}
/**
 * MOBILE-SAFE IMAGE
 * Optimizes images for mobile networks
 */
export function MobileSafeImage({
  src,
  alt,
  className = '',
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [imageQuality, setImageQuality] = useState<'low' | 'medium' | 'high'>('high');
  useEffect(() => {
    // Determine image quality based on network
    const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setImageQuality('low');
      } else if (effectiveType === '3g') {
        setImageQuality('medium');
      }
    }
  }, []);
  // Construct optimized image URL
  const optimizedSrc = src.includes('?') 
    ? `${src}&q=${imageQuality === 'low' ? 30 : imageQuality === 'medium' ? 60 : 90}`
    : `${src}?q=${imageQuality === 'low' ? 30 : imageQuality === 'medium' ? 60 : 90}`;
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={`${className} ${priority ? '' : 'loading-lazy'}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}