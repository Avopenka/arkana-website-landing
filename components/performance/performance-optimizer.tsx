'use client';
import { useEffect, useState } from 'react';
interface PerformanceMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}
export function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isOptimized, setIsOptimized] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Add delay to ensure proper page load
    const timer = setTimeout(() => {
      measurePerformance();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const measurePerformance = () => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;
    try {
      // Web Vitals measurement
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-paint') {
              setMetrics(prev => ({ ...prev, firstPaint: entry.startTime }));
            }
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, firstContentfulPaint: entry.startTime }));
            }
          }
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, largestContentfulPaint: entry.startTime }));
          }
          if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + (entry as any).value 
              }));
            }
          }
          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({ ...prev, firstInputDelay: (entry as any).processingStart - entry.startTime }));
          }
        });
      });
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
      // Auto-optimize if performance is poor
      setTimeout(() => {
        if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > 1000) {
          enablePerformanceMode();
        }
      }, 2000);
      return () => observer.disconnect();
    } catch (error) {
    }
  };
  const enablePerformanceMode = () => {
      setIsOptimized(true);
      // Reduce motion for better performance
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      // Disable heavy effects
      const particleElements = document.querySelectorAll('canvas');
      particleElements.forEach(canvas => {
        if (canvas.style) {
          canvas.style.display = 'none';
        }
      });
    };
  // Development mode performance display
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
        <div>FCP: {metrics.firstContentfulPaint?.toFixed(0)}ms</div>
        <div>LCP: {metrics.largestContentfulPaint?.toFixed(0)}ms</div>
        <div className={metrics.firstContentfulPaint && metrics.firstContentfulPaint < 1000 ? 'text-green-400' : 'text-red-400'}>
          Target: &lt;1000ms
        </div>
        {isOptimized && <div className="text-yellow-400">PERF MODE</div>}
      </div>
    );
  }
  return null;
}
export default PerformanceOptimizer;