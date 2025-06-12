'use client';

import { useEffect } from 'react';
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to your analytics service
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        custom_map: { metric_value: 'value' },
        value: Math.round(metric.value),
        metric_rating: metric.rating,
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Web Vital: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        threshold: getThreshold(metric.name),
        status: metric.rating === 'good' ? '✅' : 
               metric.rating === 'needs-improvement' ? '⚠️' : '❌'
      });
    }
  }
}

function getThreshold(name: string) {
  const thresholds: Record<string, { good: number; poor: number }> = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 }
  };
  return thresholds[name];
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = getThreshold(name);
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export default function WebVitalsReporter() {
  useEffect(() => {
    // Web vitals tracking disabled for build compatibility
    // getCLS, getFID, getFCP, getLCP, getTTFB functions would be used here
  }, []);

  // This component doesn't render anything
  return null;
}

// Performance debug overlay for development
export function PerformanceDebugOverlay() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white text-xs p-3 rounded-lg border border-brand-teal/30 backdrop-blur-sm">
      <div className="font-mono">
        <div className="text-brand-teal mb-2">🔍 Performance Monitor</div>
        <div>Check console for Web Vitals</div>
        <div className="text-xs text-gray-400 mt-1">
          Development mode only
        </div>
      </div>
    </div>
  );
}