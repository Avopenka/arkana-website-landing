'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  GitBranch, 
  Code, 
  Workflow,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react'

interface HealthScore {
  score: number
  grade: string
  status: string
  issues: string[]
  timestamp: string
}

interface ComponentHealth {
  metric_type: string
  score: number
  status: string
  issues: unknown[]
  details: Record<string, unknown>
}

interface DailyMetric {
  date: string
  system: string
  total_events: number
  successful_events: number
  failed_events: number
  avg_duration_ms: number
}

interface MetricsData {
  healthScore: HealthScore
  componentHealth: ComponentHealth[]
  dailyMetrics: DailyMetric[]
  timestamp: string
}

export function AutomationDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/automation-metrics')
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    if (grade.startsWith('D')) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="success">Healthy</Badge>
      case 'needs_attention':
        return <Badge variant="warning">Needs Attention</Badge>
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'git_hooks':
        return <GitBranch className="h-5 w-5" />
      case 'quality_scripts':
        return <Code className="h-5 w-5" />
      case 'ci_workflows':
        return <Workflow className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">
          Loading automation metrics...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Automation Health Score</CardTitle>
              <CardDescription>
                Overall system health and performance
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getGradeColor(metrics.healthScore.grade)}`}>
                {metrics.healthScore.grade}
              </div>
              <div className="text-sm text-muted-foreground">
                {metrics.healthScore.score}/100
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={metrics.healthScore.score} className="mb-4" />
          
          <div className="flex items-center justify-between mb-4">
            {getStatusBadge(metrics.healthScore.status)}
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(metrics.healthScore.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {metrics.healthScore.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Issues:</h4>
              <ul className="space-y-1">
                {metrics.healthScore.issues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Component Health */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.componentHealth.map((component) => (
          <Card key={component.metric_type}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getComponentIcon(component.metric_type)}
                  <CardTitle className="text-lg">
                    {component.metric_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                </div>
                {component.score && (
                  <span className="text-2xl font-bold">
                    {component.score}%
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {component.score && <Progress value={component.score} className="mb-2" />}
              {getStatusBadge(component.status)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Metrics */}
      {metrics.dailyMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Automation events over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.dailyMetrics.slice(0, 5).map((day) => {
                const successRate = day.total_events > 0 
                  ? (day.successful_events / day.total_events * 100).toFixed(1)
                  : '0'
                
                return (
                  <div key={`${day.date}-${day.system}`} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{day.system}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {parseFloat(successRate) >= 80 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="font-medium">{successRate}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {day.total_events} events • {day.avg_duration_ms.toFixed(0)}ms avg
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}