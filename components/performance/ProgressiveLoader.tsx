/**
 * Progressive Loader - Natural rhythm of anticipation
 * 
 * Philosophy:
 * - Alan Watts: Loading that flows like water, never forced, always harmonious
 * - Andrej Karpathy: Intelligent prediction of user needs and adaptive loading strategies
 */

'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { performanceMonitor, trackOperation } from '@/lib/performance/performance-monitor'
import { apiCache } from '@/lib/performance/intelligent-cache'

interface ProgressiveLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  skeleton?: React.ReactNode
  loadingState?: 'idle' | 'loading' | 'success' | 'error'
  delay?: number
  timeout?: number
  className?: string
  enableAnimations?: boolean
  enablePredictive?: boolean
  cacheKey?: string
}

interface LoadingPhase {
  name: string
  duration: number
  progress: number
  component: React.ReactNode
}

interface AdaptiveLoadingConfig {
  phases: LoadingPhase[]
  adaptToConnection: boolean
  respectPrefersReducedMotion: boolean
  predictiveTimeout: number
}

// Skeleton components for different content types
const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-lg p-4 space-y-3">
      <div className="h-4 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gradient-to-r from-transparent via-muted to-transparent rounded"></div>
        <div className="h-3 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-5/6"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-1/4"></div>
        <div className="h-3 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-1/3"></div>
      </div>
    </div>
  </div>
)

const SkeletonList = ({ items = 5, className = '' }: { items?: number; className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

const SkeletonTable = ({ rows = 5, cols = 4, className = '' }: { rows?: number; cols?: number; className?: string }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }, (_, i) => (
        <div key={i} className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded"></div>
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }, (_, colIndex) => (
          <div 
            key={colIndex} 
            className="h-3 bg-gradient-to-r from-transparent via-muted/60 to-transparent rounded"
            style={{ animationDelay: `${(rowIndex + colIndex) * 100}ms` }}
          ></div>
        ))}
      </div>
    ))}
  </div>
)

const SkeletonDashboard = ({ className = '' }: { className?: string }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-r from-muted/50 via-muted/80 to-muted/50 rounded-lg p-4 space-y-2">
            <div className="h-3 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-1/2"></div>
            <div className="h-8 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-3/4"></div>
            <div className="h-2 bg-gradient-to-r from-transparent via-muted to-transparent rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Main content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard className="h-[400px]" />
      <SkeletonTable rows={8} cols={3} />
    </div>
  </div>
)

// Intelligent skeleton selection
function getIntelligentSkeleton(cacheKey?: string, fallback?: React.ReactNode): React.ReactNode {
  if (fallback) return fallback

  // Determine skeleton type based on cache key patterns
  if (cacheKey?.includes('dashboard')) return <SkeletonDashboard />
  if (cacheKey?.includes('table') || cacheKey?.includes('list')) return <SkeletonList items={8} />
  if (cacheKey?.includes('card')) return <SkeletonCard />
  
  return <SkeletonCard />
}

// Connection speed detection
function useConnectionSpeed() {
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown')

  useEffect(() => {
    const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection || (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).mozConnection || (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).webkitConnection
    
    if (connection) {
      const updateConnectionSpeed = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setConnectionSpeed('slow')
        } else {
          setConnectionSpeed('fast')
        }
      }

      updateConnectionSpeed()
      connection.addEventListener('change', updateConnectionSpeed)

      return () => {
        connection.removeEventListener('change', updateConnectionSpeed)
      }
    }
  }, [])

  return connectionSpeed
}

// Reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

export function ProgressiveLoader({
  children,
  fallback,
  skeleton,
  loadingState = 'idle',
  delay = 200,
  timeout = 10000,
  className = '',
  enableAnimations = true,
  enablePredictive = true,
  cacheKey
}: ProgressiveLoaderProps) {
  const [isLoading, setIsLoading] = useState(loadingState === 'loading')
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  
  const connectionSpeed = useConnectionSpeed()
  const prefersReducedMotion = usePrefersReducedMotion()

  // Adaptive loading configuration
  const loadingConfig = useMemo((): AdaptiveLoadingConfig => {
    const basePhases: LoadingPhase[] = [
      {
        name: 'initializing',
        duration: connectionSpeed === 'slow' ? 1000 : 500,
        progress: 20,
        component: getIntelligentSkeleton(cacheKey, skeleton)
      },
      {
        name: 'fetching',
        duration: connectionSpeed === 'slow' ? 2000 : 1000,
        progress: 60,
        component: getIntelligentSkeleton(cacheKey, skeleton)
      },
      {
        name: 'processing',
        duration: 500,
        progress: 90,
        component: getIntelligentSkeleton(cacheKey, skeleton)
      }
    ]

    return {
      phases: basePhases,
      adaptToConnection: true,
      respectPrefersReducedMotion: prefersReducedMotion,
      predictiveTimeout: connectionSpeed === 'slow' ? timeout * 1.5 : timeout
    }
  }, [connectionSpeed, prefersReducedMotion, timeout, cacheKey, skeleton])

  // Wu Wei principle: Natural loading progression
  const progressThroughPhases = useCallback(() => {
    if (currentPhase < loadingConfig.phases.length - 1) {
      const nextPhase = currentPhase + 1
      const phaseDuration = loadingConfig.phases[currentPhase].duration

      phaseTimeoutRef.current = setTimeout(() => {
        setCurrentPhase(nextPhase)
        setLoadingProgress(loadingConfig.phases[nextPhase].progress)
      }, phaseDuration)
    }
  }, [currentPhase, loadingConfig.phases])

  // Karpathy principle: Intelligent state management
  useEffect(() => {
    if (loadingState === 'loading' && !isLoading) {
      const operationId = performanceMonitor.startOperation('progressive_loading', 'user_interaction')
      startTimeRef.current = performance.now()
      
      // Check cache first for instant loading
      if (cacheKey && enablePredictive) {
        trackOperation('cache_check', 'cache_operation', async () => {
          const cached = await apiCache.get(cacheKey)
          if (cached) {
            setIsLoading(false)
            performanceMonitor.endOperation(operationId, 'success', { cached: true })
            return
          }
        })
      }

      setIsLoading(true)
      setCurrentPhase(0)
      setLoadingProgress(0)

      // Delayed skeleton show for perceived performance
      const skeletonTimeout = setTimeout(() => {
        setShowSkeleton(true)
        setLoadingProgress(loadingConfig.phases[0].progress)
        progressThroughPhases()
      }, delay)

      // Global timeout
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setShowSkeleton(false)
        performanceMonitor.endOperation(operationId, 'timeout')
      }, loadingConfig.predictiveTimeout)

      return () => {
        clearTimeout(skeletonTimeout)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current)
      }
    } else if (loadingState !== 'loading' && isLoading) {
      const duration = performance.now() - startTimeRef.current
      
      setIsLoading(false)
      setShowSkeleton(false)
      setCurrentPhase(0)
      setLoadingProgress(100)

      // Cache successful loads
      if (loadingState === 'success' && cacheKey && enablePredictive) {
        apiCache.set(cacheKey, true, 300000, duration) // Cache for 5 minutes
      }

      // Cleanup timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current)

      performanceMonitor.endOperation(
        performanceMonitor.startOperation('progressive_loading_complete', 'user_interaction'),
        loadingState === 'success' ? 'success' : 'error',
        { duration, phase: currentPhase }
      )
    }
  }, [
    loadingState, 
    isLoading, 
    delay, 
    loadingConfig.predictiveTimeout, 
    progressThroughPhases, 
    loadingConfig.phases, 
    cacheKey, 
    enablePredictive, 
    currentPhase
  ])

  // Continue phase progression
  useEffect(() => {
    if (isLoading && showSkeleton) {
      progressThroughPhases()
    }
  }, [isLoading, showSkeleton, progressThroughPhases])

  // Loading states with natural transitions
  if (loadingState === 'error') {
    return (
      <motion.div
        initial={enableAnimations ? { opacity: 0, y: 20 } : false}
        animate={enableAnimations ? { opacity: 1, y: 0 } : undefined}
        className={`flex items-center justify-center p-8 ${className}`}
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-destructive">Loading failed</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Something went wrong. Please try again.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (isLoading || showSkeleton) {
    const currentPhaseData = loadingConfig.phases[currentPhase]
    
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`phase-${currentPhase}`}
            initial={enableAnimations && !prefersReducedMotion ? { opacity: 0 } : false}
            animate={enableAnimations && !prefersReducedMotion ? { opacity: 1 } : undefined}
            exit={enableAnimations && !prefersReducedMotion ? { opacity: 0 } : undefined}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentPhaseData?.component || getIntelligentSkeleton(cacheKey, skeleton)}
          </motion.div>
        </AnimatePresence>

        {/* Progress indicator for slow connections */}
        {connectionSpeed === 'slow' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Loading {Math.round(loadingProgress)}%
              </div>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  // Success state with natural entrance
  return (
    <motion.div
      initial={enableAnimations && !prefersReducedMotion ? { opacity: 0, y: 10 } : false}
      animate={enableAnimations && !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Specialized loading components
export function LoadingCard({ className = '' }: { className?: string }) {
  return <SkeletonCard className={className} />
}

export function LoadingList({ items = 5, className = '' }: { items?: number; className?: string }) {
  return <SkeletonList items={items} className={className} />
}

export function LoadingTable({ rows = 5, cols = 4, className = '' }: { rows?: number; cols?: number; className?: string }) {
  return <SkeletonTable rows={rows} cols={cols} className={className} />
}

export function LoadingDashboard({ className = '' }: { className?: string }) {
  return <SkeletonDashboard className={className} />
}

// Higher-order component for progressive loading
export function withProgressiveLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingComponent?: React.ReactNode,
  cacheKey?: string
) {
  return function ProgressiveComponent(props: P & { loading?: boolean }) {
    const { loading, ...restProps } = props
    
    return (
      <ProgressiveLoader
        loadingState={loading ? 'loading' : 'success'}
        skeleton={loadingComponent}
        cacheKey={cacheKey}
        enablePredictive={true}
      >
        <Component {...(restProps as P)} />
      </ProgressiveLoader>
    )
  }
}

// Lazy loading wrapper with intersection observer
export function LazyLoader({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = ref.current
    if (!current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.unobserve(current)
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(current)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, threshold, hasLoaded])

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        children
      ) : (
        fallback || <SkeletonCard />
      )}
    </div>
  )
}

// Preloader for critical resources
export function CriticalResourcePreloader({
  resources,
  onAllLoaded,
  onProgress
}: {
  resources: string[]
  onAllLoaded?: () => void
  onProgress?: (loaded: number, total: number) => void
}) {
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    let mounted = true
    const loadResource = async (url: string) => {
      return new Promise<void>((resolve) => {
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          // Image preloading
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve() // Still resolve to continue
          img.src = url
        } else if (url.match(/\.(woff2?|ttf|eot)$/i)) {
          // Font preloading
          const font = new FontFace('preload-font', `url(${url})`)
          font.load().then(() => resolve()).catch(() => resolve())
        } else {
          // Generic resource preloading
          fetch(url).then(() => resolve()).catch(() => resolve())
        }
      })
    }

    const loadAll = async () => {
      let loaded = 0
      
      for (const resource of resources) {
        await loadResource(resource)
        loaded++
        
        if (mounted) {
          setLoadedCount(loaded)
          onProgress?.(loaded, resources.length)
        }
      }

      if (mounted) {
        onAllLoaded?.()
      }
    }

    loadAll()

    return () => {
      mounted = false
    }
  }, [resources, onAllLoaded, onProgress])

  return loadedCount
}

// Preload hook for next likely actions
export function usePreloadNext(predictions: string[]) {
  useEffect(() => {
    predictions.forEach(url => {
      // Preload with low priority
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })

    return () => {
      // Cleanup prefetch links
      predictions.forEach(url => {
        const link = document.querySelector(`link[href="${url}"]`)
        if (link) {
          document.head.removeChild(link)
        }
      })
    }
  }, [predictions])
}