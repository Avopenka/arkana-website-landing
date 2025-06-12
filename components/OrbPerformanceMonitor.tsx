'use client';
import React, { useEffect, useState } from 'react';
import type { AssetValidationResult } from '../types/components';
import { OrbAssets } from '../lib/orb-assets';
interface PerformanceMetrics {
  orbImageLoadTime: number | null;
  lottieLoadTime: number | null;
  totalLoadTime: number | null;
  assetValidation: AssetValidationResult | null;
  errors: string[];
  warnings: string[];
}
interface OrbPerformanceMonitorProps {
  /** Show performance overlay for debugging */
  showDebugOverlay?: boolean;
  /** Report performance metrics to console */
  reportToConsole?: boolean;
  /** Performance monitoring callback */
  onMetrics?: (metrics: PerformanceMetrics) => void;
}
/**
 * V6.0 Orb Performance Monitor
 * Tracks asset loading performance and validates orb implementation
 */
export default function OrbPerformanceMonitor({
  showDebugOverlay = false,
  reportToConsole = false,
  onMetrics
}: OrbPerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    orbImageLoadTime: null,
    lottieLoadTime: null,
    totalLoadTime: null,
    assetValidation: null,
    errors: [],
    warnings: []
  });
  useEffect(() => {
    const runPerformanceTest = async () => {
      const startTime = performance.now();
      const newMetrics: PerformanceMetrics = {
        orbImageLoadTime: null,
        lottieLoadTime: null,
        totalLoadTime: null,
        assetValidation: null,
        errors: [],
        warnings: []
      };
      try {
        // Test orb image loading
        const imageStartTime = performance.now();
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => {
            newMetrics.orbImageLoadTime = performance.now() - imageStartTime;
            resolve(true);
          };
          img.onerror = () => {
            newMetrics.errors.push('Failed to load orb image');
            reject(new Error('Image load failed'));
          };
          img.src = '/orb/OrbRefined.png';
        });
        // Test Lottie animation loading
        const lottieStartTime = performance.now();
        try {
          const response = await fetch('/animations/living_orb_idle.json');
          if (response.ok) {
            await response.json();
            newMetrics.lottieLoadTime = performance.now() - lottieStartTime;
          } else {
            newMetrics.warnings.push('Lottie animation not available');
          }
        } catch (error) {
          newMetrics.warnings.push('Lottie animation load failed');
        }
        // Run asset validation
        try {
          newMetrics.assetValidation = await OrbAssets.validateAssets();
        } catch (error) {
          newMetrics.errors.push('Asset validation failed');
        }
        newMetrics.totalLoadTime = performance.now() - startTime;
        // Performance analysis
        if (newMetrics.orbImageLoadTime && newMetrics.orbImageLoadTime > 500) {
          newMetrics.warnings.push('Orb image load time > 500ms');
        }
        if (newMetrics.lottieLoadTime && newMetrics.lottieLoadTime > 1000) {
          newMetrics.warnings.push('Lottie animation load time > 1000ms');
        }
        setMetrics(newMetrics);
        if (reportToConsole) {
          console.group('🔮 Arkana Orb V6.0 Performance Report');
          if (newMetrics.errors.length > 0) {
          }
          if (newMetrics.warnings.length > 0) {
          }
          console.groupEnd();
        }
        if (onMetrics) {
          onMetrics(newMetrics);
        }
      } catch (error) {
        newMetrics.errors.push(`Performance test failed: ${error}`);
        setMetrics(newMetrics);
      }
    };
    runPerformanceTest();
  }, [reportToConsole, onMetrics]);
  if (!showDebugOverlay) {
    return null;
  }
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 text-xs text-white font-mono max-w-xs">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <span className="text-cyan-400">Orb V6.0 Performance</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Image:</span>
          <span className={metrics.orbImageLoadTime ? (metrics.orbImageLoadTime < 500 ? 'text-green-400' : 'text-yellow-400') : 'text-gray-400'}>
            {metrics.orbImageLoadTime ? `${metrics.orbImageLoadTime.toFixed(0)}ms` : 'Loading...'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Lottie:</span>
          <span className={metrics.lottieLoadTime ? (metrics.lottieLoadTime < 1000 ? 'text-green-400' : 'text-yellow-400') : 'text-gray-400'}>
            {metrics.lottieLoadTime ? `${metrics.lottieLoadTime.toFixed(0)}ms` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-600 pt-1">
          <span>Total:</span>
          <span className="text-cyan-400">
            {metrics.totalLoadTime ? `${metrics.totalLoadTime.toFixed(0)}ms` : 'Loading...'}
          </span>
        </div>
        {metrics.assetValidation && (
          <div className="flex justify-between text-xs">
            <span>Mode:</span>
            <span className="text-purple-400">{metrics.assetValidation.recommendedMode}</span>
          </div>
        )}
        {metrics.errors.length > 0 && (
          <div className="text-red-400 text-xs">
            ⚠ {metrics.errors.length} error(s)
          </div>
        )}
        {metrics.warnings.length > 0 && (
          <div className="text-yellow-400 text-xs">
            ⚠ {metrics.warnings.length} warning(s)
          </div>
        )}
      </div>
    </div>
  );
}
/**
 * Quick performance test function for debugging
 */
export const testOrbPerformance = async (): Promise<PerformanceMetrics> => {
  const startTime = performance.now();
  const metrics: PerformanceMetrics = {
    orbImageLoadTime: null,
    lottieLoadTime: null,
    totalLoadTime: null,
    assetValidation: null,
    errors: [],
    warnings: []
  };
  try {
    // Test all orb assets
    const validation = await OrbAssets.validateAssets();
    metrics.assetValidation = validation;
    metrics.totalLoadTime = performance.now() - startTime;
    return metrics;
  } catch (error) {
    metrics.errors.push(`Test failed: ${error}`);
    return metrics;
  }
};