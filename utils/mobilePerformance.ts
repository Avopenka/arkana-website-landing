/// <reference path='../types/global.d.ts' />
/**
 * MOBILE PERFORMANCE OPTIMIZATION
 * 
 * 5 Masters Performance Philosophy:
 * - Musk: Every millisecond counts
 * - Jobs: Instant response or nothing
 * - Watts: Natural timing, no jarring
 * - Ive: Smooth as silk
 * - Vopěnka: Performance as emotional intelligence
 */

// Detect device capabilities
export const deviceCapabilities = {
  // Check if device is low-end
  isLowEnd: (): boolean => {
    // Check for low memory
    const memory = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).deviceMemory;
    if (memory && memory < 4) return true;
    
    // Check for slow connection
    const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') return true;
    }
    
    // Check for battery saver mode
    if ('getBattery' in navigator) {
      (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery().then((battery: any) => {
        if (battery.level < 0.2) return true;
      });
    }
    
    return false;
  },

  // Check if reduced motion is preferred
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check if device supports haptics
  supportsHaptics: (): boolean => {
    return 'vibrate' in navigator;
  },

  // Check touch capabilities
  hasTouch: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get safe animation duration based on device
  getAnimationDuration: (base: number): number => {
    if (deviceCapabilities.prefersReducedMotion()) return 0;
    if (deviceCapabilities.isLowEnd()) return base * 0.5;
    return base;
  }
};

// Performance-optimized animation configs
export const mobileAnimations = {
  // Instant feedback for touch
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  
  // Quick transitions
  quickFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: deviceCapabilities.getAnimationDuration(0.2) }
  },
  
  // Smooth slide
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { 
      duration: deviceCapabilities.getAnimationDuration(0.3),
      ease: [0.32, 0.72, 0, 1]
    }
  },
  
  // Gentle scale
  gentleScale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { 
      duration: deviceCapabilities.getAnimationDuration(0.4),
      ease: "easeOut"
    }
  }
};

// Intersection Observer for lazy loading
export const lazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Request Idle Callback wrapper
export const whenIdle = (callback: () => void, timeout = 2000): void => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for Safari
    setTimeout(callback, 0);
  }
};

// Debounced resize handler
export const debounce = <T extends (...args: unknown[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Touch-optimized scroll handler
export const smoothScroll = (element: HTMLElement, options?: ScrollIntoViewOptions) => {
  const defaultOptions: ScrollIntoViewOptions = {
    behavior: deviceCapabilities.prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };
  
  element.scrollIntoView(defaultOptions);
};

// Battery-conscious animation controller
export class BatteryAwareAnimator {
  private batteryLevel: number = 1;
  private isCharging: boolean = true;
  
  constructor() {
    this.checkBattery();
  }
  
  private async checkBattery() {
    if ('getBattery' in navigator) {
      const battery = await (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery();
      this.batteryLevel = battery.level;
      this.isCharging = battery.charging;
      
      battery.addEventListener('levelchange', () => {
        this.batteryLevel = battery.level;
      });
      
      battery.addEventListener('chargingchange', () => {
        this.isCharging = battery.charging;
      });
    }
  }
  
  shouldReduceAnimations(): boolean {
    // Reduce animations if battery < 20% and not charging
    return this.batteryLevel < 0.2 && !this.isCharging;
  }
  
  getAnimationMultiplier(): number {
    if (this.shouldReduceAnimations()) return 0.5;
    if (this.batteryLevel < 0.5) return 0.8;
    return 1;
  }
}

// Network-aware asset loader
export class NetworkAwareLoader {
  private connection: NetworkInformation | null;
  
  constructor() {
    this.connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection;
  }
  
  shouldLoadHighQuality(): boolean {
    if (!this.connection) return true;
    
    const effectiveType = this.connection.effectiveType;
    return effectiveType === '4g' || effectiveType === 'wifi';
  }
  
  getImageQuality(): 'low' | 'medium' | 'high' {
    if (!this.connection) return 'high';
    
    const effectiveType = this.connection.effectiveType;
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      default:
        return 'high';
    }
  }
  
  preloadCriticalAssets(urls: string[]): void {
    if (this.shouldLoadHighQuality()) {
      urls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
      });
    }
  }
}

// Haptic feedback manager
export class HapticManager {
  private canVibrate: boolean;
  
  constructor() {
    this.canVibrate = 'vibrate' in navigator;
  }
  
  light(): void {
    if (this.canVibrate) navigator.vibrate(5);
  }
  
  medium(): void {
    if (this.canVibrate) navigator.vibrate(10);
  }
  
  heavy(): void {
    if (this.canVibrate) navigator.vibrate([15, 5, 15]);
  }
  
  success(): void {
    if (this.canVibrate) navigator.vibrate([10, 30, 10]);
  }
  
  warning(): void {
    if (this.canVibrate) navigator.vibrate([20, 10, 20, 10, 20]);
  }
  
  error(): void {
    if (this.canVibrate) navigator.vibrate([50, 30, 50, 30, 50]);
  }
}

// Touch gesture detector
export class GestureDetector {
  private element: HTMLElement;
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  
  constructor(element: HTMLElement) {
    this.element = element;
    this.setupListeners();
  }
  
  private setupListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }
  
  private handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  }
  
  private handleTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();
    
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const deltaTime = endTime - this.startTime;
    
    // Detect gesture type
    if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.element.dispatchEvent(new CustomEvent('tap'));
    } else if (deltaTime > 500 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      this.element.dispatchEvent(new CustomEvent('longpress'));
    } else if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
      this.element.dispatchEvent(new CustomEvent('swipe', {
        detail: { direction: deltaX > 0 ? 'right' : 'left' }
      }));
    }
  }
}

// Export singleton instances
export const batteryAnimator = new BatteryAwareAnimator();
export const networkLoader = new NetworkAwareLoader();
export const haptics = new HapticManager();