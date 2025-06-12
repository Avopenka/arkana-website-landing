/**
 * Virtual Scroll List - Effortless infinite performance
 * 
 * Philosophy:
 * - Alan Watts: Natural flow - scrolling that feels like flowing water
 * - Andrej Karpathy: Neural efficiency - intelligent windowing and predictive rendering
 */

'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { performanceMonitor, trackOperation } from '@/lib/performance/performance-monitor'
import { motion, AnimatePresence } from 'framer-motion'

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number | ((index: number, item: T) => number)
  containerHeight: number
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode
  overscan?: number
  onScrollEnd?: () => void
  onItemsRendered?: (startIndex: number, endIndex: number) => void
  enablePredictive?: boolean
  enableAnimations?: boolean
  className?: string
  gap?: number
  horizontal?: boolean
}

interface VisibleRange {
  start: number
  end: number
  overscanStart: number
  overscanEnd: number
}

interface ScrollMetrics {
  scrollTop: number
  scrollLeft: number
  velocity: number
  direction: 'up' | 'down' | 'left' | 'right' | 'idle'
  isScrolling: boolean
  momentum: number
}

interface PredictiveState {
  predictedScrollDirection: 'up' | 'down' | 'left' | 'right' | null
  predictedVelocity: number
  prerenderedItems: Set<number>
  lastScrollTime: number
}

export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onScrollEnd,
  onItemsRendered,
  enablePredictive = true,
  enableAnimations = true,
  className = '',
  gap = 0,
  horizontal = false
}: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    start: 0,
    end: 0,
    overscanStart: 0,
    overscanEnd: 0
  })
  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    scrollTop: 0,
    scrollLeft: 0,
    velocity: 0,
    direction: 'idle',
    isScrolling: false,
    momentum: 0
  })
  const [predictiveState, setPredictiveState] = useState<PredictiveState>({
    predictedScrollDirection: null,
    predictedVelocity: 0,
    prerenderedItems: new Set(),
    lastScrollTime: 0
  })

  // Memoized item heights for performance
  const itemHeights = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return Array(items.length).fill(itemHeight)
    }
    return items.map((item, index) => itemHeight(index, item))
  }, [items, itemHeight])

  // Memoized offsets for efficient lookups
  const itemOffsets = useMemo(() => {
    const offsets = [0]
    for (let i = 0; i < itemHeights.length; i++) {
      offsets.push(offsets[i] + itemHeights[i] + gap)
    }
    return offsets
  }, [itemHeights, gap])

  // Total content size
  const totalSize = useMemo(() => {
    return itemOffsets[itemOffsets.length - 1] || 0
  }, [itemOffsets])

  // Wu Wei principle: Natural scroll calculation
  const calculateVisibleRange = useCallback((
    scrollOffset: number,
    containerSize: number,
    velocity: number = 0
  ): VisibleRange => {
    const operationId = performanceMonitor.startOperation('calculate_visible_range', 'render')

    try {
      // Binary search for start index
      let start = 0
      let end = items.length - 1

      while (start <= end) {
        const mid = Math.floor((start + end) / 2)
        const itemOffset = itemOffsets[mid]
        
        if (itemOffset < scrollOffset) {
          start = mid + 1
        } else {
          end = mid - 1
        }
      }

      const startIndex = Math.max(0, end)

      // Find end index
      let endIndex = startIndex
      let currentOffset = itemOffsets[startIndex]
      
      while (endIndex < items.length && currentOffset < scrollOffset + containerSize) {
        endIndex++
        currentOffset = itemOffsets[endIndex] || totalSize
      }

      endIndex = Math.min(items.length - 1, endIndex)

      // Adaptive overscan based on velocity
      const adaptiveOverscan = enablePredictive 
        ? Math.ceil(overscan * (1 + Math.abs(velocity) / 1000))
        : overscan

      const overscanStart = Math.max(0, startIndex - adaptiveOverscan)
      const overscanEnd = Math.min(items.length - 1, endIndex + adaptiveOverscan)

      performanceMonitor.endOperation(operationId, 'success')

      return {
        start: startIndex,
        end: endIndex,
        overscanStart,
        overscanEnd
      }
    } catch (error) {
      performanceMonitor.endOperation(operationId, 'error')
      throw error
    }
  }, [items.length, itemOffsets, totalSize, overscan, enablePredictive])

  // Karpathy principle: Intelligent prediction
  const updatePredictiveState = useCallback((currentMetrics: ScrollMetrics) => {
    if (!enablePredictive) return

    const now = performance.now()
    const timeDelta = now - predictiveState.lastScrollTime

    if (timeDelta > 16) { // ~60fps
      const velocityThreshold = 500 // pixels/second
      
      if (Math.abs(currentMetrics.velocity) > velocityThreshold) {
        const predictedDirection = currentMetrics.velocity > 0 
          ? (horizontal ? 'right' : 'down')
          : (horizontal ? 'left' : 'up')

        // Predict where user will scroll to
        const momentum = currentMetrics.velocity * 0.8 // Decay factor
        const futureScroll = currentMetrics.scrollTop + momentum * 0.1 // 100ms ahead

        const futureRange = calculateVisibleRange(
          Math.max(0, futureScroll),
          containerHeight,
          momentum
        )

        // Pre-render items in predicted direction
        const prerenderedItems = new Set<number>()
        const direction = predictedDirection === 'down' || predictedDirection === 'right' ? 1 : -1
        const currentEnd = direction > 0 ? visibleRange.end : visibleRange.start
        
        for (let i = 0; i < overscan; i++) {
          const index = currentEnd + (direction * (i + 1))
          if (index >= 0 && index < items.length) {
            prerenderedItems.add(index)
          }
        }

        setPredictiveState({
          predictedScrollDirection: predictedDirection,
          predictedVelocity: momentum,
          prerenderedItems,
          lastScrollTime: now
        })
      } else {
        // Clear predictions when scrolling slowly
        setPredictiveState(prev => ({
          ...prev,
          predictedScrollDirection: null,
          predictedVelocity: 0,
          prerenderedItems: new Set()
        }))
      }
    }
  }, [
    enablePredictive, 
    predictiveState.lastScrollTime, 
    horizontal, 
    containerHeight, 
    calculateVisibleRange, 
    visibleRange, 
    overscan, 
    items.length
  ])

  // Scroll event handler with momentum calculation
  const handleScroll = useCallback(() => {
    const container = scrollElementRef.current
    if (!container) return

    return trackOperation(
      'virtual_scroll_update',
      'user_interaction',
      async () => {
        const now = performance.now()
        const scrollOffset = horizontal ? container.scrollLeft : container.scrollTop
        const timeDelta = now - scrollMetrics.scrollTop // Using scrollTop as lastUpdateTime
        
        // Calculate velocity (pixels per second)
        const positionDelta = scrollOffset - (horizontal ? scrollMetrics.scrollLeft : scrollMetrics.scrollTop)
        const velocity = timeDelta > 0 ? (positionDelta / timeDelta) * 1000 : 0

        // Determine direction
        let direction: ScrollMetrics['direction'] = 'idle'
        if (Math.abs(velocity) > 10) {
          if (horizontal) {
            direction = velocity > 0 ? 'right' : 'left'
          } else {
            direction = velocity > 0 ? 'down' : 'up'
          }
        }

        const newMetrics: ScrollMetrics = {
          scrollTop: horizontal ? scrollMetrics.scrollTop : scrollOffset,
          scrollLeft: horizontal ? scrollOffset : scrollMetrics.scrollLeft,
          velocity,
          direction,
          isScrolling: Math.abs(velocity) > 10,
          momentum: Math.abs(velocity) * 0.9 // Decay factor
        }

        setScrollMetrics(newMetrics)

        // Calculate new visible range
        const newRange = calculateVisibleRange(
          scrollOffset,
          containerHeight,
          velocity
        )

        if (
          newRange.start !== visibleRange.start ||
          newRange.end !== visibleRange.end
        ) {
          setVisibleRange(newRange)
          onItemsRendered?.(newRange.start, newRange.end)
        }

        // Update predictive state
        updatePredictiveState(newMetrics)
      }
    )
  }, [
    horizontal,
    scrollMetrics,
    containerHeight,
    calculateVisibleRange,
    visibleRange,
    onItemsRendered,
    updatePredictiveState
  ])

  // Smooth scroll end detection
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (scrollMetrics.isScrolling) {
      timeoutId = setTimeout(() => {
        setScrollMetrics(prev => ({ ...prev, isScrolling: false }))
        onScrollEnd?.()
      }, 150) // 150ms of no scrolling = scroll end
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [scrollMetrics.isScrolling, onScrollEnd])

  // Initialize visible range
  useEffect(() => {
    const initialRange = calculateVisibleRange(0, containerHeight)
    setVisibleRange(initialRange)
    onItemsRendered?.(initialRange.start, initialRange.end)
  }, [calculateVisibleRange, containerHeight, onItemsRendered])

  // Render visible items with intelligent batching
  const renderedItems = useMemo(() => {
    const operationId = performanceMonitor.startOperation('render_virtual_items', 'render')

    try {
      const items_to_render: React.ReactElement[] = []
      const { overscanStart, overscanEnd } = visibleRange

      for (let index = overscanStart; index <= overscanEnd; index++) {
        if (index < 0 || index >= items.length) continue

        const item = items[index]
        const offset = itemOffsets[index]
        const height = itemHeights[index]
        const isVisible = index >= visibleRange.start && index <= visibleRange.end
        const isPredictive = predictiveState.prerenderedItems.has(index)

        const style = horizontal ? {
          position: 'absolute' as const,
          left: offset,
          width: height,
          height: '100%',
          transform: isPredictive ? 'translateZ(0)' : undefined // GPU layer for predicted items
        } : {
          position: 'absolute' as const,
          top: offset,
          width: '100%',
          height: height,
          transform: isPredictive ? 'translateZ(0)' : undefined
        }

        const key = `item-${index}`

        items_to_render.push(
          <motion.div
            key={key}
            style={style}
            initial={enableAnimations && isVisible ? { opacity: 0, y: 20 } : false}
            animate={enableAnimations && isVisible ? { opacity: 1, y: 0 } : undefined}
            exit={enableAnimations ? { opacity: 0, y: -20 } : undefined}
            transition={enableAnimations ? { duration: 0.2, ease: 'easeOut' } : undefined}
            layout={enableAnimations}
          >
            {renderItem(item, index, isVisible)}
          </motion.div>
        )
      }

      performanceMonitor.endOperation(operationId, 'success', {
        itemsRendered: items_to_render.length,
        visibleCount: visibleRange.end - visibleRange.start + 1,
        overscanCount: overscanEnd - overscanStart + 1
      })

      return items_to_render
    } catch (error) {
      performanceMonitor.endOperation(operationId, 'error')
      throw error
    }
  }, [
    visibleRange,
    items,
    itemOffsets,
    itemHeights,
    renderItem,
    horizontal,
    predictiveState.prerenderedItems,
    enableAnimations
  ])

  // Scroll to index with smooth animation
  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    const container = scrollElementRef.current
    if (!container || index < 0 || index >= items.length) return

    const offset = itemOffsets[index]
    const itemSize = itemHeights[index]
    
    let targetOffset = offset

    if (align === 'center') {
      targetOffset = offset - (containerHeight - itemSize) / 2
    } else if (align === 'end') {
      targetOffset = offset - containerHeight + itemSize
    }

    targetOffset = Math.max(0, Math.min(totalSize - containerHeight, targetOffset))

    if (horizontal) {
      container.scrollTo({ left: targetOffset, behavior: 'smooth' })
    } else {
      container.scrollTo({ top: targetOffset, behavior: 'smooth' })
    }
  }, [itemOffsets, itemHeights, containerHeight, totalSize, items.length, horizontal])

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll-container ${className}`}
      style={{
        height: containerHeight,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        ref={scrollElementRef}
        className="virtual-scroll-element"
        style={{
          height: '100%',
          width: '100%',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
          scrollbarWidth: 'thin',
        }}
        onScroll={handleScroll}
      >
        {/* Virtual content area */}
        <div
          className="virtual-content"
          style={{
            position: 'relative',
            height: horizontal ? '100%' : totalSize,
            width: horizontal ? totalSize : '100%',
            minHeight: horizontal ? undefined : containerHeight,
            minWidth: horizontal ? containerHeight : undefined
          }}
        >
          {enableAnimations ? (
            <AnimatePresence mode="popLayout">
              {renderedItems}
            </AnimatePresence>
          ) : (
            renderedItems
          )}
        </div>
      </div>

      {/* Performance indicator (dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          <div>Items: {renderedItems.length} / {items.length}</div>
          <div>Range: {visibleRange.start}-{visibleRange.end}</div>
          <div>Velocity: {Math.round(scrollMetrics.velocity)}px/s</div>
          {predictiveState.predictedScrollDirection && (
            <div>Pred: {predictiveState.predictedScrollDirection}</div>
          )}
        </div>
      )}
    </div>
  )
}

// Hook for programmatic control
export function useVirtualScroll<T>(items: T[]) {
  const [scrollApi, setScrollApi] = useState<{
    scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void
    scrollToTop: () => void
    scrollToBottom: () => void
    getVisibleRange: () => VisibleRange | null
  } | null>(null)

  const registerScrollApi = useCallback((api: typeof scrollApi) => {
    setScrollApi(api)
  }, [])

  return {
    scrollApi,
    registerScrollApi
  }
}

// Specialized list components
export function VirtualIssueList({ 
  issues, 
  onIssueClick,
  className = ''
}: {
  issues: unknown[]
  onIssueClick?: (issue: unknown, index: number) => void
  className?: string
}) {
  return (
    <VirtualScrollList
      items={issues}
      itemHeight={120}
      containerHeight={600}
      overscan={3}
      enablePredictive={true}
      enableAnimations={true}
      className={className}
      renderItem={(issue, index, isVisible) => (
        <div
          className={`
            border rounded-lg p-4 mx-2 mb-2 cursor-pointer
            hover:bg-accent/50 transition-colors
            ${isVisible ? 'bg-background' : 'bg-muted/50'}
          `}
          onClick={() => onIssueClick?.(issue, index)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-sm line-clamp-2">
                {issue.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {issue.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${issue.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'}
              `}>
                {issue.priority}
              </span>
              <span className="text-xs text-muted-foreground">
                {issue.source}
              </span>
            </div>
          </div>
        </div>
      )}
    />
  )
}

export function VirtualUserList({
  users,
  onUserClick,
  className = ''
}: {
  users: unknown[]
  onUserClick?: (user: unknown, index: number) => void
  className?: string
}) {
  return (
    <VirtualScrollList
      items={users}
      itemHeight={80}
      containerHeight={500}
      overscan={5}
      enablePredictive={true}
      className={className}
      renderItem={(user, index, isVisible) => (
        <div
          className={`
            flex items-center gap-3 p-3 mx-2 mb-1 rounded-lg
            hover:bg-accent/50 transition-colors cursor-pointer
            ${isVisible ? 'bg-background' : 'bg-muted/50'}
          `}
          onClick={() => onUserClick?.(user, index)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              Wave {user.wave} • {user.status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    />
  )
}