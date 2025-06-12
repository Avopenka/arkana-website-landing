'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  score: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export const AdvancedPerformanceMonitor: React.FC<{ 
  visible?: boolean;
  onAlert?: (alert: PerformanceAlert) => void;
}> = ({ visible = false, onAlert }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    loadTime: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    score: 100
  });
  
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const fpsCounterRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    // FPS Monitoring
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      if (delta >= 1000) {
        const fps = Math.round((fpsCounterRef.current * 1000) / delta);
        fpsCounterRef.current = 0;
        lastTimeRef.current = now;
        
        setMetrics(prev => ({ ...prev, fps }));
        
        if (fps < 30) {
          const alert: PerformanceAlert = {
            type: 'warning',
            message: `Low FPS detected: ${fps}`,
            timestamp: Date.now()
          };
          setAlerts(prev => [alert, ...prev.slice(0, 4)]);
          onAlert?.(alert);
        }
      }
      
      fpsCounterRef.current++;
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Memory Monitoring
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memory }));
        
        if (memory > 100) {
          const alert: PerformanceAlert = {
            type: 'warning',
            message: `High memory usage: ${memory}MB`,
            timestamp: Date.now()
          };
          setAlerts(prev => [alert, ...prev.slice(0, 4)]);
          onAlert?.(alert);
        }
      }
    };

    const memoryInterval = setInterval(measureMemory, 5000);

    // Web Vitals Monitoring
    const measureWebVitals = () => {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = Math.round(lastEntry.startTime);
            setMetrics(prev => ({ ...prev, lcp }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // FID (First Input Delay)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const fid = Math.round(entry.processingStart - entry.startTime);
              setMetrics(prev => ({ ...prev, fid }));
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // CLS (Cumulative Layout Shift)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.warn('Performance monitoring not fully supported');
        }
      }

      // Navigation Timing
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
        
        setMetrics(prev => ({ 
          ...prev, 
          loadTime: Math.round(loadTime), 
          ttfb: Math.round(ttfb) 
        }));
      }
    };

    measureWebVitals();

    return () => {
      clearInterval(memoryInterval);
    };
  }, [onAlert]);

  // Calculate Performance Score
  useEffect(() => {
    const score = Math.round(
      (metrics.fps >= 60 ? 25 : (metrics.fps / 60) * 25) +
      (metrics.lcp <= 2500 ? 25 : Math.max(0, 25 - ((metrics.lcp - 2500) / 100))) +
      (metrics.fid <= 100 ? 25 : Math.max(0, 25 - ((metrics.fid - 100) / 10))) +
      (metrics.cls <= 0.1 ? 25 : Math.max(0, 25 - ((metrics.cls - 0.1) * 250)))
    );
    
    setMetrics(prev => ({ ...prev, score }));
  }, [metrics.fps, metrics.lcp, metrics.fid, metrics.cls]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getMetricStatus = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      fps: { good: 55, poor: 30 },
      memory: { good: 50, poor: 100 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (metric === 'fps') {
      if (value >= threshold.good) return 'good';
      if (value >= threshold.poor) return 'poor';
      return 'bad';
    } else {
      if (value <= threshold.good) return 'good';
      if (value <= threshold.poor) return 'poor';
      return 'bad';
    }
  };

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-xs w-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Performance Monitor</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getScoreColor(metrics.score)}`} />
          <span className="font-bold">{metrics.score}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={`font-mono ${
              getMetricStatus('fps', metrics.fps) === 'good' ? 'text-green-400' :
              getMetricStatus('fps', metrics.fps) === 'poor' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.fps}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className={`font-mono ${
              getMetricStatus('memory', metrics.memory) === 'good' ? 'text-green-400' :
              getMetricStatus('memory', metrics.memory) === 'poor' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.memory}MB
            </span>
          </div>
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={`font-mono ${
              getMetricStatus('lcp', metrics.lcp) === 'good' ? 'text-green-400' :
              getMetricStatus('lcp', metrics.lcp) === 'poor' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.lcp}ms
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={`font-mono ${
              getMetricStatus('fid', metrics.fid) === 'good' ? 'text-green-400' :
              getMetricStatus('fid', metrics.fid) === 'poor' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.fid}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={`font-mono ${
              getMetricStatus('cls', metrics.cls) === 'good' ? 'text-green-400' :
              getMetricStatus('cls', metrics.cls) === 'poor' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.cls}
            </span>
          </div>
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span className={`font-mono ${
              getMetricStatus('ttfb', metrics.ttfb) === 'good' ? 'text-green-400' :
              getMetricStatus('ttfb', metrics.ttfb) === 'poor' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.ttfb}ms
            </span>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="border-t border-gray-600 pt-2">
          <div className="text-yellow-400 font-semibold mb-1">Recent Alerts:</div>
          {alerts.slice(0, 2).map((alert, index) => (
            <div key={index} className="text-xs text-gray-300 truncate">
              {alert.message}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdvancedPerformanceMonitor;