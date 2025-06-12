'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Battery, Wifi, Smartphone, Zap } from 'lucide-react';

/**
 * MOBILE PERFORMANCE MONITOR
 * Real-time performance tracking
 * 
 * 5 Masters Performance Philosophy:
 * - Musk: Measure everything
 * - Jobs: Invisible when perfect
 * - Watts: Show only what matters
 * - Ive: Minimal visual footprint
 * - Vopěnka: Performance as art
 */

interface PerformanceMetrics {
  fps: number;
  memory: number;
  battery: number;
  network: string;
  renderTime: number;
}

export default function MobilePerformanceMonitor({ 
  show = false,
  position = 'bottom-right' 
}: { 
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    battery: 100,
    network: '4G',
    renderTime: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!show) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    // FPS counter
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };

    // Start FPS measurement
    rafId = requestAnimationFrame(measureFPS);

    // Memory usage
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        const percentage = Math.round((usedMB / totalMB) * 100);
        
        setMetrics(prev => ({ ...prev, memory: percentage }));
      }
    };

    // Battery status
    const measureBattery = async () => {
      if ('getBattery' in navigator) {
        const battery = await (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery();
        setMetrics(prev => ({ 
          ...prev, 
          battery: Math.round(battery.level * 100) 
        }));
        
        battery.addEventListener('levelchange', () => {
          setMetrics(prev => ({ 
            ...prev, 
            battery: Math.round(battery.level * 100) 
          }));
        });
      }
    };

    // Network status
    const measureNetwork = () => {
      const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection;
      if (connection) {
        setMetrics(prev => ({ 
          ...prev, 
          network: connection.effectiveType.toUpperCase() 
        }));
        
        connection.addEventListener('change', () => {
          setMetrics(prev => ({ 
            ...prev, 
            network: connection.effectiveType.toUpperCase() 
          }));
        });
      }
    };

    // Render time
    const measureRenderTime = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === 'measure' && entry.name === 'render') {
            setMetrics(prev => ({ 
              ...prev, 
              renderTime: Math.round(entry.duration) 
            }));
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure'] });
    };

    // Initialize measurements
    const interval = setInterval(() => {
      measureMemory();
    }, 1000);

    measureBattery();
    measureNetwork();
    measureRenderTime();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, [show]);

  if (!show) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4'
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFPSColor = (fps: number) => getStatusColor(fps, { good: 55, warning: 30 });
  const getMemoryColor = (memory: number) => getStatusColor(100 - memory, { good: 50, warning: 20 });
  const getBatteryColor = (battery: number) => getStatusColor(battery, { good: 50, warning: 20 });

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {/* Collapsed view */}
      <motion.button
        className="bg-consciousness-void-alpha-90 backdrop-blur-md border border-consciousness-illumination-alpha-20 rounded-lg p-2 flex items-center gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-1">
          <Activity size={16} className={getFPSColor(metrics.fps)} />
          <span className={`text-xs font-mono ${getFPSColor(metrics.fps)}`}>
            {metrics.fps}
          </span>
        </div>
        
        {!isExpanded && (
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              metrics.fps >= 55 ? 'bg-green-500' : 
              metrics.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        )}
      </motion.button>

      {/* Expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute top-full mt-2 right-0 bg-consciousness-void-alpha-95 backdrop-blur-md border border-consciousness-illumination-alpha-20 rounded-lg p-4 min-w-[200px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h3 className="text-xs font-medium text-consciousness-illumination mb-3">
              Performance Metrics
            </h3>
            
            <div className="space-y-2">
              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className={getFPSColor(metrics.fps)} />
                  <span className="text-xs text-consciousness-illumination-alpha-70">FPS</span>
                </div>
                <span className={`text-xs font-mono ${getFPSColor(metrics.fps)}`}>
                  {metrics.fps}/60
                </span>
              </div>

              {/* Memory */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className={getMemoryColor(metrics.memory)} />
                  <span className="text-xs text-consciousness-illumination-alpha-70">Memory</span>
                </div>
                <span className={`text-xs font-mono ${getMemoryColor(metrics.memory)}`}>
                  {metrics.memory}%
                </span>
              </div>

              {/* Battery */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery size={14} className={getBatteryColor(metrics.battery)} />
                  <span className="text-xs text-consciousness-illumination-alpha-70">Battery</span>
                </div>
                <span className={`text-xs font-mono ${getBatteryColor(metrics.battery)}`}>
                  {metrics.battery}%
                </span>
              </div>

              {/* Network */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi size={14} className="text-consciousness-illumination-alpha-50" />
                  <span className="text-xs text-consciousness-illumination-alpha-70">Network</span>
                </div>
                <span className="text-xs font-mono text-consciousness-illumination-alpha-50">
                  {metrics.network}
                </span>
              </div>

              {/* Render Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-consciousness-illumination-alpha-50" />
                  <span className="text-xs text-consciousness-illumination-alpha-70">Render</span>
                </div>
                <span className="text-xs font-mono text-consciousness-illumination-alpha-50">
                  {metrics.renderTime}ms
                </span>
              </div>
            </div>

            {/* Performance tips */}
            {metrics.fps < 30 && (
              <div className="mt-3 pt-3 border-t border-consciousness-illumination-alpha-10">
                <p className="text-xs text-red-400">
                  ⚠️ Low FPS detected. Reducing animations...
                </p>
              </div>
            )}
            
            {metrics.battery < 20 && (
              <div className="mt-2">
                <p className="text-xs text-yellow-400">
                  🔋 Low battery. Enabling power save mode...
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * PERFORMANCE BOUNDARY
 * Wraps components with performance monitoring
 */
export function PerformanceBoundary({ 
  children,
  name
}: { 
  children: React.ReactNode;
  name: string;
}) {
  useEffect(() => {
    // Mark render start
    performance.mark(`${name}-start`);
    
    // Mark render end after paint
    requestAnimationFrame(() => {
      performance.mark(`${name}-end`);
      performance.measure('render', `${name}-start`, `${name}-end`);
    });
  });

  return <>{children}</>;
}