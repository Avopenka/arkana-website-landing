'use client'
import { useState, useEffect, useMemo } from 'react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, ReferenceLine
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Users, DollarSign, Activity, 
  AlertTriangle, CheckCircle, Target, Zap, Download,
  Calendar, Clock, Shield, Code, Gauge
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface ComprehensiveAnalytics {
  timeRange: string
  timestamp: string
  users: {
    total: number
    daily_signups: Record<string, number>
    growth_rate: number
    retention_estimate: number
  }
  revenue: {
    current_wave: string
    monthly_recurring_revenue: number
    annual_recurring_revenue: number
    average_revenue_per_user: number
    revenue_trend: Record<string, number>
  }
  system: {
    uptime_percentage: number
    avg_response_time: number
    total_requests: number
    error_rate: number
    performance_trend: Record<string, number>
  }
  quality: {
    code_quality_score: number
    technical_debt_level: number
    test_coverage: number
    quality_trend: Record<string, number>
  }
  automation: {
    overall_score: number
    grade: string
    status: string
    components: Array<{
      metric_type: string
      score: number
      status: string
    }>
  }
  predictions?: {
    user_growth: {
      next_30_days: { prediction: number; confidence: number }
      next_90_days: { prediction: number; confidence: number }
    }
    revenue: {
      next_month: { prediction: number; confidence: number }
      next_quarter: { prediction: number; confidence: number }
    }
    system_capacity: {
      predictedLoad: number
      recommendations: string[]
    }
    churn_risk: {
      riskScore: number
      factors: string[]
    }
  }
  insights: Array<{
    type: 'positive' | 'warning' | 'opportunity'
    title: string
    description: string
    action: string
  }>
  overallHealth: number
}
export function ComprehensiveAnalyticsDashboard() {
  const [data, setData] = useState<ComprehensiveAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [showPredictions, setShowPredictions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    loadAnalytics()
  }, [timeRange, showPredictions])
  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        range: timeRange,
        projections: showPredictions.toString()
      })
      const response = await fetch(`/api/analytics/comprehensive?${params}`)
      if (!response.ok) throw new Error('Failed to load analytics')
      const analytics = await response.json()
      setData(analytics)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }
  const exportData = async (format: 'csv' | 'json' | 'pdf') => {
    if (!data) return
    try {
      const params = new URLSearchParams({
        range: timeRange,
        format,
        projections: showPredictions.toString()
      })
      const response = await fetch(`/api/analytics/export?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `arkana-analytics-${timeRange}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
    }
  }
  // Einstein's elegant simplicity: Transform complex data into clear insights
  const chartData = useMemo(() => {
    if (!data) return null
    const signupData = Object.entries(data.users.daily_signups || {})
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        signups: count,
        cumulative: 0 // Will calculate below
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // Calculate cumulative signups
    let cumulative = 0
    signupData.forEach(item => {
      cumulative += item.signups
      item.cumulative = cumulative
    })
    const revenueData = Object.entries(data.revenue.revenue_trend || {})
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue,
        predicted: revenue * 1.1 // Simple prediction
      }))
    const performanceData = Object.entries(data.system.performance_trend || {})
      .map(([date, responseTime]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        responseTime: responseTime,
        target: 100 // 100ms target
      }))
    return { signupData, revenueData, performanceData }
  }, [data])
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'opportunity': return <Zap className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4" />
    }
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">
          Processing comprehensive analytics...
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
  if (!data || !chartData) return null
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPredictions(!showPredictions)}
          >
            {showPredictions ? 'Hide' : 'Show'} Predictions
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData('json')}>
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData('pdf')}>
            PDF
          </Button>
        </div>
      </div>
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Health Overview</CardTitle>
              <CardDescription>
                Comprehensive health assessment across all systems
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getHealthColor(data.overallHealth)}`}>
                {data.overallHealth}
              </div>
              <div className="text-sm text-muted-foreground">
                Overall Score
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={data.overallHealth} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.users.total}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${data.revenue.monthly_recurring_revenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">MRR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.system.uptime_percentage.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.automation.grade}</div>
              <div className="text-xs text-muted-foreground">Quality Grade</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Key Insights */}
      {data.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-generated insights from your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.insights.slice(0, 3).map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <p className="text-sm font-medium text-blue-600">{insight.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        {/* Growth Analytics */}
        <TabsContent value="growth" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.users.growth_rate > 0 ? '+' : ''}{data.users.growth_rate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Week over week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Est.</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.users.retention_estimate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Estimated retention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(Object.values(data.users.daily_signups).reduce((sum, val) => sum + val, 0) / Object.keys(data.users.daily_signups).length || 1).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Signups per day
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wave Status</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{data.revenue.current_wave}</div>
                <p className="text-xs text-muted-foreground">
                  Current pricing wave
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>Daily signups and cumulative growth</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData.signupData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="signups" fill="#3B82F6" name="Daily Signups" />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Cumulative Users"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MRR</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data.revenue.monthly_recurring_revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly Recurring Revenue
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ARR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${data.revenue.annual_recurring_revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Annual Recurring Revenue
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ARPU</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{data.revenue.average_revenue_per_user}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average Revenue Per User
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Projection</CardTitle>
              <CardDescription>Monthly recurring revenue trend and forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value) => [`€${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.2}
                    name="Actual Revenue"
                  />
                  {showPredictions && (
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.1}
                      strokeDasharray="5 5"
                      name="Predicted Revenue"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.system.uptime_percentage.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  System availability
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.system.avg_response_time.toFixed(0)}ms</div>
                <p className="text-xs text-muted-foreground">
                  Average response time
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.system.error_rate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  System error rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.system.total_requests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total requests
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Response time vs. target performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value) => [`${value}ms`, 'Response Time']}
                  />
                  <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="5 5" label="Target" />
                  <Line 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Actual Response Time"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Quality Analytics */}
        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.quality.code_quality_score.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Quality score
                </p>
                <Progress value={data.quality.code_quality_score} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Technical Debt</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.quality.technical_debt_level.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Debt level
                </p>
                <Progress value={100 - data.quality.technical_debt_level} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.quality.test_coverage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Test coverage
                </p>
                <Progress value={data.quality.test_coverage} className="mt-2" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Automation Health</CardTitle>
              <CardDescription>Component-level automation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.automation.components.map((component, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {component.metric_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <Badge variant={component.status === 'healthy' ? 'default' : 'warning'}>
                        {component.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{component.score?.toFixed(1) || 'N/A'}</div>
                      {component.score && <Progress value={component.score} className="w-24" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Predictions */}
        <TabsContent value="predictions" className="space-y-4">
          {data.predictions ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth Forecast</CardTitle>
                    <CardDescription>Kurzweil exponential growth predictions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">30 Days</span>
                          <Badge>
                            {(data.predictions.user_growth.next_30_days.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          +{data.predictions.user_growth.next_30_days.prediction} users
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">90 Days</span>
                          <Badge>
                            {(data.predictions.user_growth.next_90_days.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          +{data.predictions.user_growth.next_90_days.prediction} users
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Forecast</CardTitle>
                    <CardDescription>Projected revenue with confidence intervals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Next Month</span>
                          <Badge>
                            {(data.predictions.revenue.next_month.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          €{data.predictions.revenue.next_month.prediction.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Next Quarter</span>
                          <Badge>
                            {(data.predictions.revenue.next_quarter.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold">
                          €{data.predictions.revenue.next_quarter.prediction.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Capacity Planning</CardTitle>
                    <CardDescription>System load predictions and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Predicted Load</span>
                        <div className="text-2xl font-bold">
                          {data.predictions.system_capacity.predictedLoad.toLocaleString()} req/month
                        </div>
                      </div>
                      {data.predictions.system_capacity.recommendations.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Recommendations</span>
                          <ul className="mt-2 space-y-1">
                            {data.predictions.system_capacity.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Churn Risk Analysis</CardTitle>
                    <CardDescription>User retention risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Risk Score</span>
                        <div className="text-2xl font-bold">
                          {data.predictions.churn_risk.riskScore.toFixed(1)}%
                        </div>
                        <Progress value={data.predictions.churn_risk.riskScore} className="mt-2" />
                      </div>
                      {data.predictions.churn_risk.factors.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Risk Factors</span>
                          <ul className="mt-2 space-y-1">
                            {data.predictions.churn_risk.factors.map((factor, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  Enable predictions to see AI-powered forecasts and insights
                </div>
                <Button 
                  onClick={() => setShowPredictions(true)} 
                  className="mt-4"
                >
                  Enable Predictions
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ComprehensiveAnalyticsDashboard;