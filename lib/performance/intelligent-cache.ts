/**
 * Intelligent Caching Layer - Neural efficiency meets Wu Wei flow
 * 
 * Philosophy:
 * - Alan Watts: Cache that flows naturally, invisible to users, adapts like water
 * - Andrej Karpathy: Neural patterns that learn and optimize automatically
 */

import { performanceMonitor } from './performance-monitor'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
  computeTime: number
  compressionRatio?: number
  popularity: number
  pattern: 'stable' | 'volatile' | 'periodic' | 'unknown'
}

interface CacheConfig {
  maxSize: number
  defaultTtl: number
  maxTtl: number
  minTtl: number
  compressionThreshold: number
  adaptiveTtl: boolean
  enablePredictive: boolean
  enableCompression: boolean
}

interface AccessPattern {
  key: string
  intervals: number[]
  avgInterval: number
  variance: number
  trend: 'increasing' | 'decreasing' | 'stable'
  predictedNextAccess?: number
}

interface CacheStats {
  hits: number
  misses: number
  evictions: number
  compressionSaved: number
  avgComputeTime: number
  hitRate: number
  memoryUsage: number
  predictions: {
    accuracy: number
    totalPredictions: number
    correctPredictions: number
  }
}

class IntelligentCache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map()
  private accessPatterns: Map<string, AccessPattern> = new Map()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    compressionSaved: 0,
    avgComputeTime: 0,
    hitRate: 0,
    memoryUsage: 0,
    predictions: {
      accuracy: 0,
      totalPredictions: 0,
      correctPredictions: 0
    }
  }
  private config: CacheConfig
  private cleanupInterval: NodeJS.Timeout | null = null
  private prefetchQueue: Set<string> = new Set()

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      defaultTtl: 300000, // 5 minutes
      maxTtl: 3600000, // 1 hour
      minTtl: 10000, // 10 seconds
      compressionThreshold: 1024, // 1KB
      adaptiveTtl: true,
      enablePredictive: true,
      enableCompression: true,
      ...config
    }

    this.startCleanupCycle()
    this.startPredictiveEngine()
  }

  // Karpathy principle: Learn from access patterns
  async get(key: string): Promise<T | null> {
    const startTime = performance.now()
    
    this.updateAccessPattern(key)
    
    const entry = this.cache.get(key)
    if (!entry) {
      this.stats.misses++
      performanceMonitor.recordCacheMiss(key)
      this.updateHitRate()
      return null
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.stats.misses++
      performanceMonitor.recordCacheMiss(key)
      this.updateHitRate()
      return null
    }

    // Update access metadata
    entry.accessCount++
    entry.lastAccessed = now
    entry.popularity = this.calculatePopularity(entry)

    this.stats.hits++
    performanceMonitor.recordCacheHit(key)
    this.updateHitRate()

    // Adaptive TTL extension for popular items
    if (this.config.adaptiveTtl && entry.popularity > 0.8) {
      entry.ttl = Math.min(this.config.maxTtl, entry.ttl * 1.2)
    }

    const duration = performance.now() - startTime
    performanceMonitor.endOperation(
      performanceMonitor.startOperation(`cache_get_${key}`, 'cache_operation'),
      'success',
      { hit: true, duration }
    )

    return this.decompress(entry.data)
  }

  // Watts principle: Natural storage that adapts
  async set(
    key: string, 
    data: T, 
    customTtl?: number,
    computeTime?: number
  ): Promise<void> {
    const startTime = performance.now()
    const now = Date.now()

    // Intelligent TTL calculation
    const ttl = customTtl || this.calculateIntelligentTtl(key, computeTime)
    
    // Compress if beneficial
    const finalData = this.config.enableCompression ? 
      this.compress(data) : data

    const entry: CacheEntry<T> = {
      data: finalData,
      timestamp: now,
      ttl,
      accessCount: 1,
      lastAccessed: now,
      computeTime: computeTime || 0,
      popularity: 0,
      pattern: this.detectPattern(key)
    }

    // Memory management with intelligent eviction
    if (this.cache.size >= this.config.maxSize) {
      this.intelligentEviction()
    }

    this.cache.set(key, entry)

    const duration = performance.now() - startTime
    performanceMonitor.endOperation(
      performanceMonitor.startOperation(`cache_set_${key}`, 'cache_operation'),
      'success',
      { duration, ttl, compressed: finalData !== data }
    )

    // Trigger predictive prefetching
    if (this.config.enablePredictive) {
      this.triggerPredictivePrefetch(key)
    }
  }

  // Neural pattern detection
  private detectPattern(key: string): 'stable' | 'volatile' | 'periodic' | 'unknown' {
    const pattern = this.accessPatterns.get(key)
    if (!pattern || pattern.intervals.length < 5) return 'unknown'

    const avgInterval = pattern.avgInterval
    const variance = pattern.variance

    // Stable: low variance, consistent access
    if (variance < avgInterval * 0.2) return 'stable'
    
    // Periodic: regular intervals
    if (this.detectPeriodicity(pattern.intervals)) return 'periodic'
    
    // Volatile: high variance
    if (variance > avgInterval * 0.8) return 'volatile'
    
    return 'unknown'
  }

  private detectPeriodicity(intervals: number[]): boolean {
    if (intervals.length < 6) return false
    
    // Simple periodicity detection using autocorrelation
    const autocorrelation = (lag: number) => {
      let sum = 0
      let count = 0
      for (let i = 0; i < intervals.length - lag; i++) {
        sum += intervals[i] * intervals[i + lag]
        count++
      }
      return count > 0 ? sum / count : 0
    }

    const lag1 = autocorrelation(1)
    const lag2 = autocorrelation(2)
    const lag3 = autocorrelation(3)

    return lag2 > lag1 * 1.5 || lag3 > lag1 * 1.5
  }

  // Intelligent TTL calculation
  private calculateIntelligentTtl(key: string, computeTime?: number): number {
    if (!this.config.adaptiveTtl) return this.config.defaultTtl

    const pattern = this.accessPatterns.get(key)
    const existing = this.cache.get(key)

    let baseTtl = this.config.defaultTtl

    // Factor 1: Compute time - expensive operations cache longer
    if (computeTime && computeTime > 100) {
      baseTtl *= Math.min(3, 1 + computeTime / 1000)
    }

    // Factor 2: Access pattern
    if (pattern) {
      switch (this.detectPattern(key)) {
        case 'stable':
          baseTtl *= 2 // Cache stable data longer
          break
        case 'volatile':
          baseTtl *= 0.5 // Cache volatile data shorter
          break
        case 'periodic':
          // Cache until next predicted access
          if (pattern.predictedNextAccess) {
            baseTtl = Math.max(
              this.config.minTtl,
              pattern.predictedNextAccess - Date.now()
            )
          }
          break
      }
    }

    // Factor 3: Existing popularity
    if (existing && existing.popularity > 0.7) {
      baseTtl *= 1.5
    }

    return Math.max(
      this.config.minTtl,
      Math.min(this.config.maxTtl, baseTtl)
    )
  }

  // Wu Wei eviction - natural selection
  private intelligentEviction() {
    const entries = Array.from(this.cache.entries())
    
    // Score-based eviction (multiple factors)
    const scored = entries.map(([key, entry]) => ({
      key,
      entry,
      score: this.calculateEvictionScore(entry)
    }))

    // Sort by score (lower = more likely to evict)
    scored.sort((a, b) => a.score - b.score)

    // Evict bottom 10% or at least 1
    const evictCount = Math.max(1, Math.floor(this.config.maxSize * 0.1))
    
    for (let i = 0; i < evictCount && i < scored.length; i++) {
      this.cache.delete(scored[i].key)
      this.stats.evictions++
    }
  }

  private calculateEvictionScore(entry: CacheEntry<T>): number {
    const now = Date.now()
    const age = (now - entry.timestamp) / entry.ttl // Normalized age
    const recency = (now - entry.lastAccessed) / 60000 // Minutes since last access
    const popularity = entry.popularity
    
    // Lower score = more likely to evict
    return age * 0.4 + recency * 0.4 - popularity * 0.2
  }

  // Predictive prefetching
  private triggerPredictivePrefetch(key: string) {
    const pattern = this.accessPatterns.get(key)
    if (!pattern || !pattern.predictedNextAccess) return

    const timeUntilNext = pattern.predictedNextAccess - Date.now()
    
    // Schedule prefetch shortly before predicted access
    if (timeUntilNext > 5000 && timeUntilNext < 60000) {
      setTimeout(() => {
        this.prefetchQueue.add(key)
      }, Math.max(0, timeUntilNext - 5000))
    }
  }

  // Access pattern learning
  private updateAccessPattern(key: string) {
    const now = Date.now()
    const existing = this.accessPatterns.get(key)

    if (!existing) {
      this.accessPatterns.set(key, {
        key,
        intervals: [],
        avgInterval: 0,
        variance: 0,
        trend: 'stable'
      })
      return
    }

    // Record interval
    const interval = now - (existing.intervals[existing.intervals.length - 1] || now)
    existing.intervals.push(interval)

    // Keep only recent intervals (sliding window)
    if (existing.intervals.length > 20) {
      existing.intervals.shift()
    }

    // Calculate statistics
    existing.avgInterval = existing.intervals.reduce((a, b) => a + b, 0) / existing.intervals.length
    existing.variance = this.calculateVariance(existing.intervals, existing.avgInterval)
    existing.trend = this.calculateTrend(existing.intervals)

    // Predict next access
    if (existing.intervals.length >= 3) {
      existing.predictedNextAccess = now + this.predictNextAccess(existing)
    }
  }

  private calculateVariance(values: number[], mean: number): number {
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length
  }

  private calculateTrend(intervals: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (intervals.length < 5) return 'stable'
    
    const recent = intervals.slice(-5)
    const earlier = intervals.slice(-10, -5)
    
    if (earlier.length === 0) return 'stable'
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length
    
    const change = (recentAvg - earlierAvg) / earlierAvg
    
    if (change > 0.2) return 'increasing'
    if (change < -0.2) return 'decreasing'
    return 'stable'
  }

  private predictNextAccess(pattern: AccessPattern): number {
    const { intervals, avgInterval, trend } = pattern
    
    let prediction = avgInterval
    
    // Adjust based on trend
    switch (trend) {
      case 'increasing':
        prediction *= 1.1
        break
      case 'decreasing':
        prediction *= 0.9
        break
    }
    
    // Use recent intervals for better accuracy
    if (intervals.length >= 3) {
      const recentAvg = intervals.slice(-3).reduce((a, b) => a + b, 0) / 3
      prediction = (prediction + recentAvg) / 2
    }
    
    return prediction
  }

  private calculatePopularity(entry: CacheEntry<T>): number {
    const now = Date.now()
    const age = now - entry.timestamp
    const timeFactor = Math.max(0, 1 - age / entry.ttl) // Decay over time
    const accessFactor = Math.min(1, entry.accessCount / 10) // More accesses = higher popularity
    const recencyFactor = Math.max(0, 1 - (now - entry.lastAccessed) / 300000) // Recent access boost
    
    return (timeFactor * 0.3 + accessFactor * 0.4 + recencyFactor * 0.3)
  }

  // Compression utilities
  private compress(data: T): T {
    if (!this.config.enableCompression) return data
    
    try {
      const serialized = JSON.stringify(data)
      if (serialized.length < this.config.compressionThreshold) return data
      
      // Simple compression (in real implementation, use proper compression)
      const compressed = this.simpleCompress(serialized)
      this.stats.compressionSaved += serialized.length - compressed.length
      
      return compressed as T
    } catch {
      return data
    }
  }

  private decompress(data: T): T {
    if (!this.config.enableCompression) return data
    
    try {
      if (typeof data === 'string' && data.startsWith('COMPRESSED:')) {
        const decompressed = this.simpleDecompress(data)
        return JSON.parse(decompressed)
      }
      return data
    } catch {
      return data
    }
  }

  private simpleCompress(str: string): string {
    // Placeholder for actual compression
    return 'COMPRESSED:' + btoa(str)
  }

  private simpleDecompress(compressed: string): string {
    return atob(compressed.replace('COMPRESSED:', ''))
  }

  // Cache invalidation patterns
  invalidate(key: string): boolean {
    const existed = this.cache.has(key)
    this.cache.delete(key)
    this.accessPatterns.delete(key)
    return existed
  }

  invalidatePattern(pattern: string | RegExp): number {
    let count = 0
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        this.accessPatterns.delete(key)
        count++
      }
    }
    
    return count
  }

  invalidateByTags(tags: string[]): number {
    // Implementation for tag-based invalidation
    // This would require storing tags with cache entries
    return 0
  }

  // Maintenance cycles
  private startCleanupCycle() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired()
      this.updateStats()
      this.optimizePatterns()
    }, 60000) // Every minute
  }

  private cleanupExpired() {
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        cleaned++
      }
    }
    
    this.stats.evictions += cleaned
  }

  private updateStats() {
    this.updateHitRate()
    this.updateMemoryUsage()
    this.updatePredictionAccuracy()
  }

  private updateHitRate() {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }

  private updateMemoryUsage() {
    let totalSize = 0
    for (const entry of this.cache.values()) {
      totalSize += this.estimateSize(entry.data)
    }
    this.stats.memoryUsage = totalSize
  }

  private updatePredictionAccuracy() {
    // This would be updated when validating predictions
    // For now, we'll calculate based on pattern consistency
    let totalAccuracy = 0
    let count = 0
    
    for (const pattern of this.accessPatterns.values()) {
      if (pattern.intervals.length >= 5) {
        const consistency = 1 - (pattern.variance / pattern.avgInterval)
        totalAccuracy += Math.max(0, Math.min(1, consistency))
        count++
      }
    }
    
    this.stats.predictions.accuracy = count > 0 ? totalAccuracy / count : 0
  }

  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2 // Rough estimate
    } catch {
      return 1024 // Default estimate
    }
  }

  private optimizePatterns() {
    // Remove stale access patterns
    const cutoff = Date.now() - 3600000 // 1 hour
    
    for (const [key, pattern] of this.accessPatterns.entries()) {
      const lastInterval = pattern.intervals[pattern.intervals.length - 1] || 0
      if (lastInterval < cutoff && !this.cache.has(key)) {
        this.accessPatterns.delete(key)
      }
    }
  }

  private startPredictiveEngine() {
    if (!this.config.enablePredictive) return
    
    setInterval(() => {
      this.processPrefetchQueue()
    }, 5000) // Check every 5 seconds
  }

  private processPrefetchQueue() {
    for (const key of this.prefetchQueue) {
      // In a real implementation, this would trigger the actual data fetching
      // For now, we just remove from queue
      this.prefetchQueue.delete(key)
    }
  }

  // Public API
  getStats(): CacheStats {
    return { ...this.stats }
  }

  getSize(): number {
    return this.cache.size
  }

  clear(): void {
    this.cache.clear()
    this.accessPatterns.clear()
    this.prefetchQueue.clear()
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      compressionSaved: 0,
      avgComputeTime: 0,
      hitRate: 0,
      memoryUsage: 0,
      predictions: {
        accuracy: 0,
        totalPredictions: 0,
        correctPredictions: 0
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }

  // Advanced cache operations
  async getOrSet<U = T>(
    key: string,
    factory: () => Promise<U>,
    ttl?: number
  ): Promise<U> {
    const existing = await this.get(key)
    if (existing !== null) {
      return existing as U
    }

    const computeStart = performance.now()
    const data = await factory()
    const computeTime = performance.now() - computeStart

    await this.set(key, data as T, ttl, computeTime)
    return data
  }

  async mget(keys: string[]): Promise<(T | null)[]> {
    return Promise.all(keys.map(key => this.get(key)))
  }

  async mset(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    await Promise.all(
      entries.map(({ key, value, ttl }) => this.set(key, value, ttl))
    )
  }
}

// Global cache instances
export const apiCache = new IntelligentCache({
  maxSize: 500,
  defaultTtl: 300000, // 5 minutes
  adaptiveTtl: true,
  enablePredictive: true
})

export const queryCache = new IntelligentCache({
  maxSize: 200,
  defaultTtl: 600000, // 10 minutes
  adaptiveTtl: true,
  enableCompression: true
})

export const renderCache = new IntelligentCache({
  maxSize: 100,
  defaultTtl: 60000, // 1 minute
  adaptiveTtl: false, // UI cache needs consistent timing
  enablePredictive: false
})

export { IntelligentCache }