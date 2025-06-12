// Performance optimization utilities

// Preload critical resources
export const preloadCriticalAssets = () => {
  if (typeof window === 'undefined') return

  // Preload critical images
  const criticalImages = [
    '/demo-screenshot.png',
    '/video-poster.jpg',
    '/avatars/sarah.jpg',
    '/avatars/marcus.jpg',
    '/avatars/elena.jpg',
    '/avatars/james.jpg'
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })

  // Preload video
  const videoLink = document.createElement('link')
  videoLink.rel = 'preload'
  videoLink.as = 'video'
  videoLink.href = '/arkana-demo-60s.mp4'
  document.head.appendChild(videoLink)
}

// Lazy load images with intersection observer
export const createLazyImageObserver = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
          }
        }
      })
    },
    { rootMargin: '50px' }
  )
}

// Optimize loading sequence
export const optimizeLoadingSequence = () => {
  if (typeof window === 'undefined') return

  // Critical CSS should be inlined in head
  // Defer non-critical CSS
  const deferCSS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ]

  deferCSS.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.media = 'print'
    link.onload = () => {
      link.media = 'all'
    }
    document.head.appendChild(link)
  })
}

// Track core web vitals
export const trackCoreWebVitals = () => {
  if (typeof window === 'undefined') return

  // LCP - Largest Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime)
        if ((window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            event_category: 'performance',
            event_label: 'LCP',
            value: Math.round(entry.startTime)
          })
        }
      }
    }
  })

  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (e) {
    console.warn('Performance observer not supported')
  }

  // FID - First Input Delay
  let firstInputProcessed = false
  const handleFirstInput = (event: Event) => {
    if (firstInputProcessed) return
    firstInputProcessed = true

    const fid = Date.now() - (event as any).timeStamp
    console.log('FID:', fid)
    
    if ((window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: 'FID',
        value: Math.round(fid)
      })
    }
  }

  ['click', 'keydown'].forEach(type => {
    addEventListener(type, handleFirstInput, { once: true, passive: true })
  })
}

// Service worker registration for caching
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service Worker registered:', registration)
  } catch (error) {
    console.warn('Service Worker registration failed:', error)
  }
}

// Progressive enhancement
export const enhanceInteractivity = () => {
  if (typeof window === 'undefined') return

  // Add hover effects only on non-touch devices
  if (!('ontouchstart' in window)) {
    document.body.classList.add('hover-enabled')
  }

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion')
  }
}

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run immediately
  preloadCriticalAssets()
  optimizeLoadingSequence()
  enhanceInteractivity()

  // Run after load
  window.addEventListener('load', () => {
    trackCoreWebVitals()
    registerServiceWorker()
  })
}

// Analytics tracking optimized
export const trackConversion = (event: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return

  // Track to multiple providers
  const trackingData = {
    event_category: 'conversion',
    event_label: event,
    ...data
  }

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', event, trackingData)
  }

  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq('track', 'Lead', data)
  }

  // Custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data: trackingData })
  }).catch(() => {}) // Silent fail
}