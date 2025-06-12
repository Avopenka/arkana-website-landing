'use client';

// PACA Protocol: Advanced Lazy Loading System
// Intelligent component loading with performance optimization

import React, { Suspense, lazy, ComponentType, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { performanceMonitor } from '@/lib/performance-monitor';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallback?: React.ComponentType;
  preload?: boolean;
  priority?: 'low' | 'high' | 'critical';
}

interface LazyComponentProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ComponentType;
  options?: LazyLoadOptions;
  componentProps?: Record<string, unknown>;
}

// Advanced fallback components
const SkeletonCard: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
      <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
      <div className="h-20 bg-gray-700/50 rounded"></div>
    </div>
  </div>
);

const SkeletonHero: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-96 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-8 bg-gray-700/50 rounded w-64 mx-auto"></div>
        <div className="h-4 bg-gray-700/50 rounded w-48 mx-auto"></div>
        <div className="h-10 bg-gray-700/50 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

const SkeletonChart: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-4"></div>
      <div className="h-48 bg-gray-700/50 rounded flex items-end space-x-2 p-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-600/50 rounded-t"
            style={{
              height: `${Math.random() * 60 + 20}%`,
              width: '12%',
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const SkeletonText: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-700/50 rounded w-full"></div>
    <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
    <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
  </div>
);

// Intelligent fallback selector
const getFallbackComponent = (componentName: string): React.ComponentType => {
  const fallbackMap: Record<string, React.ComponentType> = {
    hero: SkeletonHero,
    card: SkeletonCard,
    chart: SkeletonChart,
    text: SkeletonText,
  };

  // Try to match component name to appropriate skeleton
  for (const [key, component] of Object.entries(fallbackMap)) {
    if (componentName.toLowerCase().includes(key)) {
      return component;
    }
  }

  return SkeletonCard; // Default fallback
};

// Error boundary for lazy loaded components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { componentProps?: Record<string, unknown> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component loading error:', error, errorInfo);
    
    // Track error
    performanceMonitor.trackApiCall('lazy_component_error', 0);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || SkeletonCard;
      return <Fallback />;
    }

    return this.props.children;
  }
}

// Progressive loading manager
class ProgressiveLoader {
  private static loadedComponents = new Set<string>();
  private static preloadQueue: Array<{ loader: () => Promise<any>; priority: string }> = [];
  private static isProcessingQueue = false;

  static markAsLoaded(componentName: string) {
    this.loadedComponents.add(componentName);
  }

  static isLoaded(componentName: string): boolean {
    return this.loadedComponents.has(componentName);
  }

  static addToPreloadQueue(loader: () => Promise<any>, priority: string = 'low') {
    this.preloadQueue.push({ loader, priority });
    this.processQueue();
  }

  private static async processQueue() {
    if (this.isProcessingQueue || this.preloadQueue.length === 0) return;

    this.isProcessingQueue = true;

    // Sort by priority
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - 
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });

    while (this.preloadQueue.length > 0) {
      const { loader } = this.preloadQueue.shift()!;
      
      try {
        await loader();
        await new Promise(resolve => requestIdleCallback(resolve));
      } catch (error) {
        console.warn('Failed to preload component:', error);
      }
    }

    this.isProcessingQueue = false;
  }
}

// Main lazy component loader
export const LazyComponent: React.FC<LazyComponentProps> = ({
  loader,
  fallback,
  options = {},
  componentProps = {},
}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    preload = false,
    priority = 'low',
  } = options;

  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // Get component name for better error tracking
  const componentName = loader.toString().match(/import\(['"`](.+?)['"`]\)/)?.[1] || 'unknown';

  // Preload component if specified
  useEffect(() => {
    if (preload) {
      ProgressiveLoader.addToPreloadQueue(loader, priority);
    }
  }, [loader, preload, priority]);

  // Load component when in view
  useEffect(() => {
    if (inView && !Component && !isLoading) {
      setIsLoading(true);
      const loadStart = performance.now();

      loader()
        .then((module) => {
          const loadTime = performance.now() - loadStart;
          
          // Track loading performance
          performanceMonitor.trackApiCall(`lazy_component_${componentName}`, loadTime);
          
          setComponent(() => module.default);
          ProgressiveLoader.markAsLoaded(componentName);
        })
        .catch((error) => {
          console.error(`Failed to load component ${componentName}:`, error);
          setLoadError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [inView, Component, isLoading, loader, componentName]);

  // Render logic
  if (loadError) {
    const ErrorFallback = fallback || getFallbackComponent(componentName);
    return <ErrorFallback />;
  }

  if (!inView) {
    return <div ref={ref} style={{ minHeight: '100px' }} />;
  }

  if (isLoading || !Component) {
    const LoadingFallback = fallback || getFallbackComponent(componentName);
    return (
      <div ref={ref}>
        <LoadingFallback />
      </div>
    );
  }

  return (
    <div ref={ref}>
      <LazyErrorBoundary fallback={fallback}>
        <Component {...componentProps} />
      </LazyErrorBoundary>
    </div>
  );
};

// Convenience wrappers for common lazy loading patterns
export const LazyHeroSection = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/HeroSection')}
    options={{ priority: 'critical', preload: true }}
    componentProps={props}
  />
);

export const LazyFeatureSection = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/LuxuryFeatureSection')}
    options={{ priority: 'high' }}
    componentProps={props}
  />
);

export const LazyPricingSection = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/Official8WavesPricingSection')}
    options={{ priority: 'high' }}
    componentProps={props}
  />
);

export const LazyTestimonialsSection = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/TrustBuilding')}
    options={{ priority: 'low' }}
    componentProps={props}
  />
);

export const LazyFooter = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/Footer')}
    options={{ priority: 'low', rootMargin: '200px' }}
    componentProps={props}
  />
);

export const LazyAdminDashboard = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/Dashboard/CRMDashboard')}
    options={{ priority: 'critical', preload: true }}
    componentProps={props}
  />
);

export const LazyAnalyticsDashboard = (props: Record<string, unknown>) => (
  <LazyComponent
    loader={() => import('@/components/analytics/ComprehensiveAnalyticsDashboard')}
    options={{ priority: 'high' }}
    componentProps={props}
  />
);

// Advanced image lazy loading with progressive enhancement
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  quality?: number;
  priority?: boolean;
  onLoad?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  quality = 75,
  priority = false,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px',
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 animate-pulse" />
      )}

      {/* Main image */}
      {(inView || priority) && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Image failed to load</span>
        </div>
      )}
    </div>
  );
};

// HOC for making any component lazy loadable
export function makeLazy<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  options?: LazyLoadOptions
) {
  return (props: React.ComponentProps<T>) => (
    <LazyComponent
      loader={loader}
      options={options}
      componentProps={props}
    />
  );
}

// Hook for managing lazy loading state
export function useLazyLoader() {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());

  const markAsLoaded = (componentName: string) => {
    setLoadedComponents(prev => new Set([...prev, componentName]));
    ProgressiveLoader.markAsLoaded(componentName);
  };

  const isLoaded = (componentName: string) => {
    return loadedComponents.has(componentName) || ProgressiveLoader.isLoaded(componentName);
  };

  const preloadComponent = (loader: () => Promise<any>, priority: string = 'low') => {
    ProgressiveLoader.addToPreloadQueue(loader, priority);
  };

  return {
    markAsLoaded,
    isLoaded,
    preloadComponent,
    loadedCount: loadedComponents.size,
  };
}

export default LazyComponent;