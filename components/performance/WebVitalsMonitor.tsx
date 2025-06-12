'use client';

import { useEffect, useState } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  unit: string;
}

// Musk Performance: Real metrics, not theater
export default function WebVitalsMonitor() {
  const [metrics, setMetrics] = useState<VitalMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show/hide with Cmd+Shift+P (performance)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  useEffect(() => {
    const updateMetric = (metric: any) => {
      const rating = 
        metric.name === 'CLS' ? (metric.value < 0.1 ? 'good' : metric.value < 0.25 ? 'needs-improvement' : 'poor') :
        metric.name === 'INP' ? (metric.value < 200 ? 'good' : metric.value < 500 ? 'needs-improvement' : 'poor') :
        metric.name === 'FCP' ? (metric.value < 1800 ? 'good' : metric.value < 3000 ? 'needs-improvement' : 'poor') :
        metric.name === 'LCP' ? (metric.value < 2500 ? 'good' : metric.value < 4000 ? 'needs-improvement' : 'poor') :
        metric.name === 'TTFB' ? (metric.value < 800 ? 'good' : metric.value < 1800 ? 'needs-improvement' : 'poor') :
        'good';

      const newMetric: VitalMetric = {
        name: metric.name,
        value: metric.value,
        rating,
        unit: metric.name === 'CLS' ? '' : 'ms'
      };

      setMetrics(prev => {
        const existing = prev.findIndex(m => m.name === metric.name);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = newMetric;
          return updated;
        }
        return [...prev, newMetric];
      });
    };

    // Collect all Web Vitals
    onCLS(updateMetric);
    onINP(updateMetric);
    onFCP(updateMetric);
    onLCP(updateMetric);
    onTTFB(updateMetric);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 font-mono text-xs text-white min-w-[300px]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-brand-gold font-bold">Performance Metrics</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        {metrics.map(metric => (
          <div key={metric.name} className="flex justify-between items-center">
            <span className="text-white/80">{metric.name}:</span>
            <span className={`font-bold ${
              metric.rating === 'good' ? 'text-green-400' :
              metric.rating === 'needs-improvement' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}{metric.unit}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-white/20 text-white/60 text-[10px]">
        Press ⌘⇧P to toggle • Real metrics only
      </div>
    </div>
  );
}