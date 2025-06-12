/**
 * Performance Monitor - Watts-inspired effortless tracking with Karpathy's neural efficiency
 * 
 * Philosophy:
 * - Alan Watts: Natural flow - monitoring that feels like breathing, invisible yet vital
 * - Andrej Karpathy: Neural efficiency - intelligent patterns that adapt and optimize
 */
interface PerformanceMetric {
  id: string
  timestamp: number
  type: 'api_call' | 'database_query' | 'render' | 'cache_operation' | 'user_interaction'
  name: string
  duration: number
  status: 'success' | 'error' | 'timeout'
  metadata?: Record<string, any>
  parentId?: string
}
interface PerformanceThreshold {
  operation: string
  warningThreshold: number
  criticalThreshold: number
  target: number
}
interface PerformanceInsight {
  type: 'slow_query' | 'memory_leak' | 'cache_miss' | 'render_bottleneck' | 'optimization_opportunity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  recommendation: string
  impact: number
  pattern?: string
}
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private activeOperations: Map<string, { startTime: number; name: string; type: PerformanceMetric['type'] }> = new Map()
  private thresholds: PerformanceThreshold[] = []
  private insights: PerformanceInsight[] = []
  private subscribers: Array<(metrics: PerformanceMetric[]) => void> = []
  private cacheHitRates: Map<string, { hits: number; misses: number }> = new Map()
  private adaptiveBufferSize = 1000
  private isEnabled = true
  constructor() {
    this.setupDefaultThresholds()
    this.startPerformanceObserver()
    this.startAdaptiveAnalysis()
  }
  private setupDefaultThresholds() {
    this.thresholds = [
      { operation: 'api_call', warningThreshold: 100, criticalThreshold: 500, target: 50 },
      { operation: 'database_query', warningThreshold: 50, criticalThreshold: 200, target: 25 },
      { operation: 'render', warningThreshold: 16, criticalThreshold: 33, target: 8 },
      { operation: 'cache_operation', warningThreshold: 10, criticalThreshold: 50, target: 2 },
      { operation: 'user_interaction', warningThreshold: 100, criticalThreshold: 300, target: 50 }
    ]
  }
  // Watts principle: Effortless tracking
  startOperation(name: string, type: PerformanceMetric['type'], metadata?: Record<string, any>): string {
    if (!this.isEnabled) return ''
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const startTime = performance.now()
    this.activeOperations.set(id, { startTime, name, type })
    return id
  }
  // Natural completion tracking
  endOperation(id: string, status: 'success' | 'error' | 'timeout' = 'success', metadata?: Record<string, any>) {
    if (!this.isEnabled || !id) return
    const operation = this.activeOperations.get(id)
    if (!operation) return
    const endTime = performance.now()
    const duration = endTime - operation.startTime
    const metric: PerformanceMetric = {
      id,
      timestamp: Date.now(),
      type: operation.type,
      name: operation.name,
      duration,
      status,
      metadata
    }
    this.addMetric(metric)
    this.activeOperations.delete(id)
    // Adaptive insights generation
    this.generateAdaptiveInsights(metric)
  }
  // Karpathy principle: Intelligent pattern recognition
  private generateAdaptiveInsights(metric: PerformanceMetric) {
    const threshold = this.thresholds.find(t => t.operation === metric.type)
    if (!threshold) return
    // Critical performance violation
    if (metric.duration > threshold.criticalThreshold) {
      this.insights.push({
        type: 'render_bottleneck',
        severity: 'critical',
        description: `${metric.name} took ${metric.duration.toFixed(2)}ms (${threshold.criticalThreshold}ms threshold)`,
        recommendation: this.getIntelligentRecommendation(metric),
        impact: this.calculateImpact(metric, threshold),
        pattern: this.detectPattern(metric)
      })
    }
    // Proactive optimization suggestions
    this.detectOptimizationOpportunities(metric, threshold)
  }
  private getIntelligentRecommendation(metric: PerformanceMetric): string {
    const recommendations = {
      api_call: [
        'Consider implementing request deduplication',
        'Add intelligent caching with adaptive TTL',
        'Implement request batching for similar operations',
        'Use progressive loading for large datasets'
      ],
      database_query: [
        'Add database indexes for frequently queried fields',
        'Implement query result caching',
        'Consider pagination for large result sets',
        'Optimize query structure and joins'
      ],
      render: [
        'Implement React.memo for expensive components',
        'Use virtual scrolling for large lists',
        'Add skeleton screens during loading',
        'Optimize re-render triggers'
      ],
      cache_operation: [
        'Increase cache size or adjust eviction policy',
        'Implement cache warming strategies',
        'Add cache compression for large objects',
        'Use more efficient serialization'
      ],
      user_interaction: [
        'Add debouncing for rapid user inputs',
        'Implement optimistic UI updates',
        'Preload likely next actions',
        'Use web workers for heavy computations'
      ]
    }
    const typeRecommendations = recommendations[metric.type] || ['Investigate performance bottleneck']
    return typeRecommendations[Math.floor(Math.random() * typeRecommendations.length)]
  }
  private calculateImpact(metric: PerformanceMetric, threshold: PerformanceThreshold): number {
    const excessTime = metric.duration - threshold.target
    const maxExcess = threshold.criticalThreshold - threshold.target
    return Math.min(100, (excessTime / maxExcess) * 100)
  }
  private detectPattern(metric: PerformanceMetric): string {
    const recentMetrics = this.metrics
      .filter(m => m.name === metric.name && m.timestamp > Date.now() - 300000) // Last 5 minutes
      .slice(-10)
    if (recentMetrics.length < 3) return 'insufficient_data'
    const avgDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
    if (metric.duration > avgDuration * 2) return 'performance_spike'
    if (recentMetrics.every(m => m.duration > avgDuration * 1.5)) return 'degrading_performance'
    if (recentMetrics.filter(m => m.status === 'error').length > recentMetrics.length * 0.3) return 'error_prone'
    return 'normal_variation'
  }
  private detectOptimizationOpportunities(metric: PerformanceMetric, threshold: PerformanceThreshold) {
    // Neural efficiency: Learn from patterns
    const similarMetrics = this.metrics
      .filter(m => m.name === metric.name)
      .slice(-50)
    if (similarMetrics.length >= 10) {
      const avgDuration = similarMetrics.reduce((sum, m) => sum + m.duration, 0) / similarMetrics.length
      // Consistent inefficiency pattern
      if (avgDuration > threshold.target * 1.5) {
        this.insights.push({
          type: 'optimization_opportunity',
          severity: 'medium',
          description: `${metric.name} consistently exceeds target performance (avg: ${avgDuration.toFixed(2)}ms vs target: ${threshold.target}ms)`,
          recommendation: 'Consider architectural improvements or caching strategies',
          impact: ((avgDuration - threshold.target) / threshold.target) * 100
        })
      }
    }
  }
  // Cache performance tracking
  recordCacheHit(cacheKey: string) {
    const current = this.cacheHitRates.get(cacheKey) || { hits: 0, misses: 0 }
    current.hits++
    this.cacheHitRates.set(cacheKey, current)
  }
  recordCacheMiss(cacheKey: string) {
    const current = this.cacheHitRates.get(cacheKey) || { hits: 0, misses: 0 }
    current.misses++
    this.cacheHitRates.set(cacheKey, current)
  }
  getCacheHitRate(cacheKey?: string): number {
    if (cacheKey) {
      const stats = this.cacheHitRates.get(cacheKey)
      if (!stats) return 0
      return stats.hits / (stats.hits + stats.misses)
    }
    // Overall hit rate
    let totalHits = 0
    let totalRequests = 0
    this.cacheHitRates.forEach(({ hits, misses }) => {
      totalHits += hits
      totalRequests += hits + misses
    })
    return totalRequests === 0 ? 0 : totalHits / totalRequests
  }
  // Real-time metrics
  getRealtimeMetrics() {
    const now = Date.now()
    const last5Minutes = this.metrics.filter(m => now - m.timestamp < 300000)
    return {
      totalOperations: last5Minutes.length,
      averageResponseTime: last5Minutes.reduce((sum, m) => sum + m.duration, 0) / last5Minutes.length || 0,
      errorRate: last5Minutes.filter(m => m.status === 'error').length / last5Minutes.length || 0,
      slowOperations: last5Minutes.filter(m => {
        const threshold = this.thresholds.find(t => t.operation === m.type)
        return threshold && m.duration > threshold.warningThreshold
      }).length,
      cacheHitRate: this.getCacheHitRate() * 100,
      activeOperations: this.activeOperations.size,
      insights: this.insights.slice(-10),
      memoryUsage: this.getMemoryUsage()
    }
  }
  private getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }
    }
    return null
  }
  // Adaptive buffer management (Karpathy neural efficiency)
  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)
    // Adaptive buffer size based on activity
    if (this.metrics.length > this.adaptiveBufferSize) {
      const removeCount = Math.floor(this.adaptiveBufferSize * 0.2) // Remove 20%
      this.metrics.splice(0, removeCount)
    }
    // Notify subscribers (reactive updates)
    this.subscribers.forEach(callback => {
      try {
        callback([metric])
      } catch (error) {
      }
    })
  }
  // Performance Observer integration
  private startPerformanceObserver() {
    if (typeof window === 'undefined') return
    try {
      // Navigation timing
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navTiming = entry as PerformanceNavigationTiming
            this.addMetric({
              id: 'navigation_' + Date.now(),
              timestamp: Date.now(),
              type: 'render',
              name: 'page_load',
              duration: navTiming.loadEventEnd - navTiming.fetchStart,
              status: 'success',
              metadata: {
                domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
                firstPaint: navTiming.domContentLoadedEventEnd - navTiming.fetchStart
              }
            })
          }
        }
      })
      observer.observe({ entryTypes: ['navigation', 'measure'] })
    } catch (error) {
    }
  }
  // Continuous adaptive analysis (Wu Wei - natural flow)
  private startAdaptiveAnalysis() {
    setInterval(() => {
      this.adaptThresholds()
      this.cleanupOldInsights()
      this.adjustBufferSize()
    }, 60000) // Every minute
  }
  private adaptThresholds() {
    const now = Date.now()
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 1800000) // Last 30 minutes
    this.thresholds.forEach(threshold => {
      const relevantMetrics = recentMetrics.filter(m => m.type === threshold.operation)
      if (relevantMetrics.length < 10) return
      const p95 = this.percentile(relevantMetrics.map(m => m.duration), 95)
      const p50 = this.percentile(relevantMetrics.map(m => m.duration), 50)
      // Adaptive threshold adjustment
      if (p95 < threshold.warningThreshold * 0.8) {
        threshold.warningThreshold = Math.max(threshold.target * 1.5, p95 * 1.2)
      } else if (p95 > threshold.criticalThreshold * 0.9) {
        threshold.warningThreshold = Math.min(threshold.criticalThreshold * 0.7, p95 * 0.8)
      }
    })
  }
  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]
  }
  private cleanupOldInsights() {
    const cutoff = Date.now() - 3600000 // 1 hour
    this.insights = this.insights.filter(insight => 
      this.metrics.some(m => m.timestamp > cutoff && m.name.includes(insight.description.split(' ')[0]))
    )
  }
  private adjustBufferSize() {
    const recentActivity = this.metrics.filter(m => Date.now() - m.timestamp < 300000).length
    if (recentActivity > this.adaptiveBufferSize * 0.8) {
      this.adaptiveBufferSize = Math.min(5000, this.adaptiveBufferSize * 1.2)
    } else if (recentActivity < this.adaptiveBufferSize * 0.2) {
      this.adaptiveBufferSize = Math.max(500, this.adaptiveBufferSize * 0.8)
    }
  }
  // Subscription management
  subscribe(callback: (metrics: PerformanceMetric[]) => void): () => void {
    this.subscribers.push(callback)
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }
  // Performance reporting
  generateReport(timeRange: number = 3600000) { // Default 1 hour
    const cutoff = Date.now() - timeRange
    const relevantMetrics = this.metrics.filter(m => m.timestamp > cutoff)
    const report = {
      summary: {
        totalOperations: relevantMetrics.length,
        averageResponseTime: relevantMetrics.reduce((sum, m) => sum + m.duration, 0) / relevantMetrics.length || 0,
        errorRate: relevantMetrics.filter(m => m.status === 'error').length / relevantMetrics.length || 0,
        cacheHitRate: this.getCacheHitRate() * 100
      },
      byType: {} as Record<string, any>,
      insights: this.insights.slice(-20),
      recommendations: this.generateRecommendations(relevantMetrics)
    }
    // Group by type
    const types = ['api_call', 'database_query', 'render', 'cache_operation', 'user_interaction']
    types.forEach(type => {
      const typeMetrics = relevantMetrics.filter(m => m.type === type)
      if (typeMetrics.length > 0) {
        report.byType[type] = {
          count: typeMetrics.length,
          averageTime: typeMetrics.reduce((sum, m) => sum + m.duration, 0) / typeMetrics.length,
          errorRate: typeMetrics.filter(m => m.status === 'error').length / typeMetrics.length,
          p95: this.percentile(typeMetrics.map(m => m.duration), 95),
          slowestOperations: typeMetrics
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 5)
            .map(m => ({ name: m.name, duration: m.duration }))
        }
      }
    })
    return report
  }
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = []
    // High-impact recommendations based on data
    const avgResponseTime = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length || 0
    if (avgResponseTime > 100) {
      recommendations.push('Implement aggressive caching strategy to reduce average response time')
    }
    const errorRate = metrics.filter(m => m.status === 'error').length / metrics.length || 0
    if (errorRate > 0.05) {
      recommendations.push('Investigate and fix high error rate affecting user experience')
    }
    const cacheHitRate = this.getCacheHitRate()
    if (cacheHitRate < 0.8) {
      recommendations.push('Optimize caching strategy to improve hit rate')
    }
    return recommendations
  }
  // Performance control
  enable() {
    this.isEnabled = true
  }
  disable() {
    this.isEnabled = false
  }
  reset() {
    this.metrics = []
    this.insights = []
    this.cacheHitRates.clear()
    this.activeOperations.clear()
  }
}
// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()
// Convenient wrapper functions
export function trackOperation<T>(
  name: string,
  type: PerformanceMetric['type'],
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const id = performanceMonitor.startOperation(name, type, metadata)
  return operation()
    .then(result => {
      performanceMonitor.endOperation(id, 'success')
      return result
    })
    .catch(error => {
      performanceMonitor.endOperation(id, 'error', { error: error.message })
      throw error
    })
}
export function trackSync<T>(
  name: string,
  type: PerformanceMetric['type'],
  operation: () => T,
  metadata?: Record<string, any>
): T {
  const id = performanceMonitor.startOperation(name, type, metadata)
  try {
    const result = operation()
    performanceMonitor.endOperation(id, 'success')
    return result
  } catch (error) {
    performanceMonitor.endOperation(id, 'error', { error: (error as Error).message })
    throw error
  }
}
// React hook for performance tracking
export function usePerformanceTracking() {
  return {
    trackOperation,
    trackSync,
    startOperation: performanceMonitor.startOperation.bind(performanceMonitor),
    endOperation: performanceMonitor.endOperation.bind(performanceMonitor),
    getMetrics: performanceMonitor.getRealtimeMetrics.bind(performanceMonitor),
    subscribe: performanceMonitor.subscribe.bind(performanceMonitor)
  }
}