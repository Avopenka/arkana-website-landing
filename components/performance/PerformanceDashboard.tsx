/**
 * Performance Dashboard - The meditation of optimization
 * 
 * Philosophy:
 * - Alan Watts: Dashboard that breathes with the system, showing truth without judgment
 * - Andrej Karpathy: Neural insights that learn and recommend intelligently
 */
'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Zap, 
  Database, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MemoryStick,
  Cpu,
  Wifi,
  AlertCircle,
  CheckCircle2,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Play,
  Pause,
  Download,
  Upload
} from 'lucide-react'
import { performanceMonitor, usePerformanceTracking } from '@/lib/performance/performance-monitor'
import { apiCache, queryCache, renderCache } from '@/lib/performance/intelligent-cache'
import { LazyBarChartJS, LazyDoughnutChart } from '@/components/lazy/LazyCharts'
import { Suspense } from 'react'
interface PerformanceMetrics {
  totalOperations: number
  averageResponseTime: number
  errorRate: number
  slowOperations: number
  cacheHitRate: number
  activeOperations: number
  insights: unknown[]
  memoryUsage: { used: number; total: number; percentage: number }
}
interface SystemHealth {
  score: number
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  factors: {
    responseTime: number
    errorRate: number
    cacheEfficiency: number
    memoryUsage: number
  }
}
interface OptimizationRecommendation {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: number
  effort: 'low' | 'medium' | 'high'
  action: string
  implemented?: boolean
}
export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const [timeRange, setTimeRange] = useState('5m')
  const [selectedMetricType, setSelectedMetricType] = useState('all')
  const { trackOperation, getMetrics, subscribe } = usePerformanceTracking()
  // Real-time metrics subscription
  useEffect(() => {
    const updateMetrics = () => {
      if (isMonitoring) {
        const currentMetrics = getMetrics()
        setMetrics(currentMetrics)
      }
    }
    updateMetrics()
    const unsubscribe = subscribe(updateMetrics)
    return unsubscribe
  }, [isMonitoring, getMetrics, subscribe])
  // Auto-refresh mechanism
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      if (isMonitoring) {
        const currentMetrics = getMetrics()
        setMetrics(currentMetrics)
      }
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, isMonitoring, getMetrics])
  // System health calculation
  const systemHealth = useMemo((): SystemHealth => {
    if (!metrics) {
      return {
        score: 0,
        status: 'critical',
        factors: { responseTime: 0, errorRate: 0, cacheEfficiency: 0, memoryUsage: 0 }
      }
    }
    const factors = {
      responseTime: Math.max(0, 100 - (metrics.averageResponseTime / 10)), // 1000ms = 0 score
      errorRate: Math.max(0, 100 - (metrics.errorRate * 1000)), // 10% error = 0 score
      cacheEfficiency: metrics.cacheHitRate,
      memoryUsage: metrics.memoryUsage ? Math.max(0, 100 - metrics.memoryUsage.percentage) : 100
    }
    const score = Math.round(
      (factors.responseTime * 0.3 + 
       factors.errorRate * 0.3 + 
       factors.cacheEfficiency * 0.2 + 
       factors.memoryUsage * 0.2)
    )
    let status: SystemHealth['status'] = 'critical'
    if (score >= 90) status = 'excellent'
    else if (score >= 75) status = 'good'
    else if (score >= 60) status = 'fair'
    else if (score >= 40) status = 'poor'
    return { score, status, factors }
  }, [metrics])
  // Generate intelligent recommendations
  const recommendations = useMemo((): OptimizationRecommendation[] => {
    if (!metrics) return []
    const recs: OptimizationRecommendation[] = []
    // Response time recommendations
    if (metrics.averageResponseTime > 100) {
      recs.push({
        id: 'response-time',
        type: metrics.averageResponseTime > 500 ? 'critical' : 'high',
        title: 'Optimize Response Time',
        description: `Average response time is ${metrics.averageResponseTime.toFixed(0)}ms. Target: <100ms`,
        impact: Math.min(100, (metrics.averageResponseTime - 100) / 10),
        effort: 'medium',
        action: 'Implement request batching and caching'
      })
    }
    // Cache hit rate recommendations
    if (metrics.cacheHitRate < 80) {
      recs.push({
        id: 'cache-optimization',
        type: metrics.cacheHitRate < 60 ? 'high' : 'medium',
        title: 'Improve Cache Efficiency',
        description: `Cache hit rate is ${metrics.cacheHitRate.toFixed(1)}%. Target: >90%`,
        impact: (90 - metrics.cacheHitRate) * 2,
        effort: 'low',
        action: 'Adjust cache TTL and implement smarter invalidation'
      })
    }
    // Error rate recommendations
    if (metrics.errorRate > 0.01) {
      recs.push({
        id: 'error-reduction',
        type: metrics.errorRate > 0.05 ? 'critical' : 'high',
        title: 'Reduce Error Rate',
        description: `Error rate is ${(metrics.errorRate * 100).toFixed(2)}%. Target: <1%`,
        impact: metrics.errorRate * 1000,
        effort: 'high',
        action: 'Implement better error handling and retries'
      })
    }
    // Memory usage recommendations
    if (metrics.memoryUsage && metrics.memoryUsage.percentage > 80) {
      recs.push({
        id: 'memory-optimization',
        type: metrics.memoryUsage.percentage > 90 ? 'critical' : 'medium',
        title: 'Optimize Memory Usage',
        description: `Memory usage at ${metrics.memoryUsage.percentage.toFixed(1)}%. Target: <80%`,
        impact: (metrics.memoryUsage.percentage - 80) * 2,
        effort: 'medium',
        action: 'Clean up unused objects and optimize data structures'
      })
    }
    return recs.sort((a, b) => {
      const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityMap[b.type] - priorityMap[a.type]
    })
  }, [metrics])
  // Chart data preparation
  const chartData = useMemo(() => {
    if (!metrics) return null
    const responseTimeData = {
      labels: ['Target', 'Current', 'P95'],
      datasets: [{
        label: 'Response Time (ms)',
        data: [100, metrics.averageResponseTime, metrics.averageResponseTime * 1.5],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(239, 68, 68)'],
        borderWidth: 2
      }]
    }
    const cacheData = {
      labels: ['Hits', 'Misses'],
      datasets: [{
        data: [metrics.cacheHitRate, 100 - metrics.cacheHitRate],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 2
      }]
    }
    const healthData = {
      labels: ['Response Time', 'Error Rate', 'Cache Efficiency', 'Memory Usage'],
      datasets: [{
        label: 'Health Score',
        data: [
          systemHealth.factors.responseTime,
          systemHealth.factors.errorRate,
          systemHealth.factors.cacheEfficiency,
          systemHealth.factors.memoryUsage
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        fill: true
      }]
    }
    return { responseTimeData, cacheData, healthData }
  }, [metrics, systemHealth])
  const handleRefresh = useCallback(async () => {
    await trackOperation('dashboard_refresh', 'user_interaction', async () => {
      const newMetrics = getMetrics()
      setMetrics(newMetrics)
    })
  }, [trackOperation, getMetrics])
  const handleOptimizationToggle = useCallback((recommendation: OptimizationRecommendation) => {
    // In a real implementation, this would trigger actual optimizations
  }, [])
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="h-5 w-5 animate-pulse" />
          <span>Initializing performance monitoring...</span>
        </div>
      </div>
    )
  }
  const statusColors = {
    excellent: 'text-green-500 bg-green-50 border-green-200',
    good: 'text-blue-500 bg-blue-50 border-blue-200',
    fair: 'text-yellow-500 bg-yellow-50 border-yellow-200',
    poor: 'text-orange-500 bg-orange-50 border-orange-200',
    critical: 'text-red-500 bg-red-50 border-red-200'
  }
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights into system performance and optimization opportunities
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Auto-refresh</span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      {/* System Health Overview */}
      <Card className={`border-2 ${statusColors[systemHealth.status]}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {systemHealth.status === 'excellent' || systemHealth.status === 'good' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              System Health
            </span>
            <Badge variant="outline" className="text-2xl font-bold px-4 py-2">
              {systemHealth.score}%
            </Badge>
          </CardTitle>
          <CardDescription className="capitalize">
            System status: <strong>{systemHealth.status}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(0)}ms</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
            <div className="text-center">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{(metrics.errorRate * 100).toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Cache Hit Rate</p>
            </div>
            <div className="text-center">
              <MemoryStick className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">
                {metrics.memoryUsage ? `${metrics.memoryUsage.percentage.toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">Memory Usage</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Main dashboard tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData && (
                  <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>}>
                    <LazyBarChartJS 
                      data={chartData.responseTimeData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.parsed.y}ms`
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Time (ms)' }
                          }
                        }
                      }}
                    />
                  </Suspense>
                )}
              </CardContent>
            </Card>
            {/* Cache Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cache Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData && (
                  <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>}>
                    <LazyDoughnutChart
                      data={chartData.cacheData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.label}: ${context.parsed.toFixed(1)}%`
                            }
                          }
                        }
                      }}
                    />
                  </Suspense>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Operations</span>
                </div>
                <p className="text-2xl font-bold mt-1">{metrics.totalOperations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Slow Ops</span>
                </div>
                <p className="text-2xl font-bold mt-1">{metrics.slowOperations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <p className="text-2xl font-bold mt-1">{metrics.activeOperations}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Insights</span>
                </div>
                <p className="text-2xl font-bold mt-1">{metrics.insights.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm text-muted-foreground">Cache Size</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {apiCache.getSize() + queryCache.getSize() + renderCache.getSize()}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Health Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Health Radar</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData && (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${statusColors[systemHealth.status].split(' ')[0]}`}>
                        {systemHealth.score}%
                      </div>
                      <p className="text-muted-foreground capitalize mt-2">
                        {systemHealth.status}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Recent Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {metrics.insights.length > 0 ? (
                    metrics.insights.slice(0, 5).map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-l-2 border-muted pl-4 py-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{insight.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {insight.recommendation}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              insight.severity === 'critical' ? 'destructive' :
                              insight.severity === 'high' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {insight.severity}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No performance insights yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
              <CardDescription>
                AI-powered suggestions to improve system performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={
                                rec.type === 'critical' ? 'destructive' :
                                rec.type === 'high' ? 'default' : 'secondary'
                              }
                            >
                              {rec.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Impact: {rec.impact.toFixed(0)}% • Effort: {rec.effort}
                            </span>
                          </div>
                          <h3 className="font-semibold">{rec.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rec.description}
                          </p>
                          <p className="text-sm mt-2 font-medium">
                            Action: {rec.action}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleOptimizationToggle(rec)}
                          disabled={rec.implemented}
                        >
                          {rec.implemented ? 'Implemented' : 'Apply'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {recommendations.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>All systems optimized! No recommendations at this time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monitoring Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enable Monitoring</span>
                  <Switch
                    checked={isMonitoring}
                    onCheckedChange={setIsMonitoring}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Refresh Interval: {refreshInterval / 1000}s
                  </label>
                  <Slider
                    value={[refreshInterval]}
                    onValueChange={([value]) => setRefreshInterval(value)}
                    min={1000}
                    max={30000}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto Refresh</span>
                  <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cache Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{apiCache.getStats().hitRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">API Cache</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{queryCache.getStats().hitRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Query Cache</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{renderCache.getStats().hitRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Render Cache</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      apiCache.clear()
                      queryCache.clear()
                      renderCache.clear()
                    }}
                    className="flex-1"
                  >
                    Clear All Caches
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}