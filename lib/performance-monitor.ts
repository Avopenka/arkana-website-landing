// PACA Protocol: Advanced Performance Monitoring System
// Real-time performance tracking and optimization

import { analytics } from './analytics';

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  
  // Additional metrics
  domContentLoaded: number;
  windowLoad: number;
  resourceCount: number;
  totalResourceSize: number;
  jsExecutionTime: number;
  renderTime: number;
  
  // Custom metrics
  hydrationTime?: number;
  routeChangeTime?: number;
  apiResponseTime?: number;
}

export interface BundleAnalysis {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  fontSize: number;
  chunksLoaded: string[];
  unusedCode: number;
}

export interface UserExperienceMetrics {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  batteryLevel?: number;
  memoryInfo?: {
    usedJSMemorySize: number;
    totalJSMemorySize: number;
    jsMemoryLimit: number;
  };
  screenResolution: {
    width: number;
    height: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {} as PerformanceMetrics;
  private observer: PerformanceObserver | null = null;
  private bundleAnalysis: BundleAnalysis = {} as BundleAnalysis;
  private userMetrics: UserExperienceMetrics = {} as UserExperienceMetrics;
  private startTime: number = performance.now();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
      this.collectUserMetrics();
      this.setupErrorTracking();
    }
  }

  private initializeMonitoring(): void {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe different performance entry types
      try {
        this.observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'layout-shift', 'first-input'] });
      } catch (e) {
        // Fallback for older browsers
        this.observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
      }
    }

    // Web Vitals measurement
    this.measureWebVitals();

    // Resource timing
    this.measureResourceTiming();

    // Custom measurements
    this.measureCustomMetrics();
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'resource':
        this.processResourceEntry(entry as PerformanceResourceTiming);
        break;
      case 'paint':
        this.processPaintEntry(entry as PerformancePaintTiming);
        break;
      case 'layout-shift':
        this.processLayoutShiftEntry(entry as any);
        break;
      case 'first-input':
        this.processFirstInputEntry(entry as any);
        break;
    }
  }

  private processNavigationEntry(entry: PerformanceNavigationTiming): void {
    this.metrics.ttfb = entry.responseStart - entry.requestStart;
    this.metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.startTime;
    this.metrics.windowLoad = entry.loadEventEnd - entry.startTime;
  }

  private processResourceEntry(entry: PerformanceResourceTiming): void {
    // Analyze resource loading
    const resourceType = this.getResourceType(entry.name);
    const size = entry.transferSize || 0;

    switch (resourceType) {
      case 'script':
        this.bundleAnalysis.jsSize = (this.bundleAnalysis.jsSize || 0) + size;
        break;
      case 'stylesheet':
        this.bundleAnalysis.cssSize = (this.bundleAnalysis.cssSize || 0) + size;
        break;
      case 'image':
        this.bundleAnalysis.imageSize = (this.bundleAnalysis.imageSize || 0) + size;
        break;
      case 'font':
        this.bundleAnalysis.fontSize = (this.bundleAnalysis.fontSize || 0) + size;
        break;
    }

    this.bundleAnalysis.totalSize = (this.bundleAnalysis.totalSize || 0) + size;
    this.metrics.resourceCount = (this.metrics.resourceCount || 0) + 1;
    this.metrics.totalResourceSize = (this.metrics.totalResourceSize || 0) + size;
  }

  private processPaintEntry(entry: PerformancePaintTiming): void {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.fcp = entry.startTime;
    }
  }

  private processLayoutShiftEntry(entry: any): void {
    this.metrics.cls = (this.metrics.cls || 0) + entry.value;
  }

  private processFirstInputEntry(entry: any): void {
    this.metrics.fid = entry.processingStart - entry.startTime;
  }

  private measureWebVitals(): void {
    // Web vitals disabled for build compatibility
    console.log('Web vitals measurement disabled for build compatibility');
  }

  private measureResourceTiming(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      this.metrics.resourceCount = resources.length;
      this.metrics.totalResourceSize = resources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);
    }
  }

  private measureCustomMetrics(): void {
    // Measure JavaScript execution time
    const scriptStart = performance.now();
    requestIdleCallback(() => {
      this.metrics.jsExecutionTime = performance.now() - scriptStart;
    });

    // Measure render time
    this.metrics.renderTime = performance.now() - this.startTime;

    // Track React hydration time if available
    if (typeof window !== 'undefined' && (window as any).__NEXT_HYDRATION_TIME) {
      this.metrics.hydrationTime = (window as any).__NEXT_HYDRATION_TIME;
    }
  }

  private collectUserMetrics(): void {
    if (typeof window === 'undefined') return;

    // Device type detection
    this.userMetrics.deviceType = this.detectDeviceType();

    // Connection type
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection;
      this.userMetrics.connectionType = connection?.effectiveType || 'unknown';
    }

    // Battery level
    if ('getBattery' in navigator) {
      (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery().then((battery: any) => {
        this.userMetrics.batteryLevel = battery.level * 100;
      });
    }

    // Memory info
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.userMetrics.memoryInfo = {
        usedJSMemorySize: memory.usedJSMemorySize,
        totalJSMemorySize: memory.totalJSMemorySize,
        jsMemoryLimit: memory.jsMemoryLimit,
      };
    }

    // Screen resolution
    this.userMetrics.screenResolution = {
      width: window.screen.width,
      height: window.screen.height,
    };
  }

  private setupErrorTracking(): void {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise_rejection',
        message: String(event.reason),
        stack: event.reason?.stack,
      });
    });

    // Track resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.reportError({
          type: 'resource',
          message: `Failed to load: ${(event.target as any)?.src || (event.target as any)?.href}`,
          element: (event.target as any)?.tagName,
        });
      }
    }, true);
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;

    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return width < 768 ? 'mobile' : 'tablet';
    }

    return width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (/\.(jpg|jpeg|png|gif|webp|avif|svg)/.test(url)) return 'image';
    if (/\.(woff|woff2|ttf|otf|eot)/.test(url)) return 'font';
    return 'other';
  }

  private reportMetric(name: string, value: number): void {
    // Report to analytics
    analytics.trackEvent({
      event_type: 'performance_metric',
      metadata: {
        metric_name: name,
        metric_value: value,
        device_type: this.userMetrics.deviceType,
        connection_type: this.userMetrics.connectionType,
        page_url: window.location.pathname,
      },
    });

    // Log performance issues
    if (this.isPerformanceIssue(name, value)) {
      console.warn(`Performance issue detected: ${name} = ${value}ms`);
      this.reportPerformanceIssue(name, value);
    }
  }

  private reportError(error: any): void {
    analytics.trackEvent({
      event_type: 'client_error',
      metadata: {
        error_type: error.type,
        error_message: error.message,
        error_stack: error.stack,
        page_url: window.location.pathname,
        user_agent: navigator.userAgent,
        device_type: this.userMetrics.deviceType,
      },
    });
  }

  private reportPerformanceIssue(metric: string, value: number): void {
    analytics.trackEvent({
      event_type: 'performance_issue',
      metadata: {
        metric_name: metric,
        metric_value: value,
        device_type: this.userMetrics.deviceType,
        connection_type: this.userMetrics.connectionType,
        page_url: window.location.pathname,
        bundle_size: this.bundleAnalysis.totalSize,
        resource_count: this.metrics.resourceCount,
      },
    });
  }

  private isPerformanceIssue(metric: string, value: number): boolean {
    const thresholds = {
      FCP: 2500, // First Contentful Paint should be < 2.5s
      LCP: 4000, // Largest Contentful Paint should be < 4s
      FID: 300,  // First Input Delay should be < 300ms
      CLS: 0.25, // Cumulative Layout Shift should be < 0.25
      TTFB: 1500, // Time to First Byte should be < 1.5s
    };

    return thresholds[metric as keyof typeof thresholds] 
      ? value > thresholds[metric as keyof typeof thresholds]
      : false;
  }

  // Public methods
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getBundleAnalysis(): BundleAnalysis {
    return { ...this.bundleAnalysis };
  }

  public getUserMetrics(): UserExperienceMetrics {
    return { ...this.userMetrics };
  }

  public trackRouteChange(route: string): void {
    const routeChangeStart = performance.now();
    
    // Track when route change completes
    requestIdleCallback(() => {
      const routeChangeTime = performance.now() - routeChangeStart;
      this.metrics.routeChangeTime = routeChangeTime;
      
      analytics.trackEvent({
        event_type: 'route_change',
        metadata: {
          route,
          route_change_time: routeChangeTime,
          device_type: this.userMetrics.deviceType,
        },
      });
    });
  }

  public trackApiCall(endpoint: string, duration: number): void {
    this.metrics.apiResponseTime = duration;
    
    analytics.trackEvent({
      event_type: 'api_call',
      metadata: {
        endpoint,
        response_time: duration,
        device_type: this.userMetrics.deviceType,
        connection_type: this.userMetrics.connectionType,
      },
    });
  }

  public generatePerformanceReport(): any {
    return {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      metrics: this.getMetrics(),
      bundleAnalysis: this.getBundleAnalysis(),
      userMetrics: this.getUserMetrics(),
      recommendations: this.generateRecommendations(),
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.lcp > 4000) {
      recommendations.push('Optimize Largest Contentful Paint by reducing image sizes and improving server response times');
    }

    if (this.metrics.fid > 300) {
      recommendations.push('Reduce First Input Delay by optimizing JavaScript execution and using requestIdleCallback');
    }

    if (this.metrics.cls > 0.25) {
      recommendations.push('Improve Cumulative Layout Shift by setting explicit dimensions for images and ads');
    }

    if (this.bundleAnalysis.totalSize > 1000000) { // 1MB
      recommendations.push('Reduce bundle size by implementing code splitting and removing unused dependencies');
    }

    if (this.metrics.resourceCount > 100) {
      recommendations.push('Reduce the number of resources by bundling CSS/JS files and using image sprites');
    }

    return recommendations;
  }

  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export hook for React components
export function usePerformanceMonitor() {
  return {
    getMetrics: () => performanceMonitor.getMetrics(),
    trackRouteChange: (route: string) => performanceMonitor.trackRouteChange(route),
    trackApiCall: (endpoint: string, duration: number) => performanceMonitor.trackApiCall(endpoint, duration),
    generateReport: () => performanceMonitor.generatePerformanceReport(),
  };
}