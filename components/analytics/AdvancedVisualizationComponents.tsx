'use client'

import { useMemo } from 'react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, ScatterChart, Scatter, ReferenceLine, RadialBarChart, RadialBar
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TrendIndicatorProps {
  value: number
  threshold?: number
  format?: 'number' | 'percentage' | 'currency'
  suffix?: string
}

export function TrendIndicator({ value, threshold = 0, format = 'number', suffix = '' }: TrendIndicatorProps) {
  const isPositive = value > threshold
  const isNeutral = Math.abs(value - threshold) < 0.01
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'currency':
        return `€${val.toLocaleString()}`
      default:
        return `${val.toFixed(1)}${suffix}`
    }
  }
  
  return (
    <div className="flex items-center gap-1">
      {isNeutral ? (
        <Minus className="h-4 w-4 text-muted-foreground" />
      ) : isPositive ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-600" />
      )}
      <span className={`font-medium ${
        isNeutral ? 'text-muted-foreground' : 
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {formatValue(value)}
      </span>
    </div>
  )
}

interface PredictiveLineChartProps {
  data: Array<{
    date: string
    actual?: number
    predicted?: number
    confidence_upper?: number
    confidence_lower?: number
  }>
  title: string
  description?: string
  actualKey?: string
  predictedKey?: string
  showConfidence?: boolean
  unit?: string
}

export function PredictiveLineChart({ 
  data, 
  title, 
  description, 
  actualKey = 'actual',
  predictedKey = 'predicted',
  showConfidence = true,
  unit = ''
}: PredictiveLineChartProps) {
  const formatTooltip = (value: any, name: string) => {
    const formattedValue = typeof value === 'number' ? 
      `${value.toLocaleString()}${unit}` : value
    return [formattedValue, name.charAt(0).toUpperCase() + name.slice(1)]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
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
              formatter={formatTooltip}
            />
            <Legend />
            
            {/* Confidence interval area */}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="confidence_upper"
                stroke="none"
                fill="#3B82F6"
                fillOpacity={0.1}
                name="Confidence Interval"
              />
            )}
            
            {/* Actual data line */}
            <Line 
              type="monotone" 
              dataKey={actualKey}
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2 }}
              name="Actual"
            />
            
            {/* Predicted data line */}
            <Line 
              type="monotone" 
              dataKey={predictedKey}
              stroke="#3B82F6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              name="Predicted"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface HealthGaugeProps {
  score: number
  title: string
  description?: string
  thresholds?: {
    excellent: number
    good: number
    fair: number
    poor: number
  }
}

export function HealthGauge({ 
  score, 
  title, 
  description,
  thresholds = { excellent: 90, good: 80, fair: 70, poor: 60 }
}: HealthGaugeProps) {
  const getHealthLevel = (value: number) => {
    if (value >= thresholds.excellent) return { level: 'Excellent', color: '#10B981' }
    if (value >= thresholds.good) return { level: 'Good', color: '#3B82F6' }
    if (value >= thresholds.fair) return { level: 'Fair', color: '#F59E0B' }
    if (value >= thresholds.poor) return { level: 'Poor', color: '#EF4444' }
    return { level: 'Critical', color: '#DC2626' }
  }

  const health = getHealthLevel(score)
  
  const gaugeData = [
    { name: 'Score', value: score, fill: health.color },
    { name: 'Remaining', value: 100 - score, fill: '#F3F4F6' }
  ]

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="60%" 
              outerRadius="90%" 
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold" style={{ color: health.color }}>
              {score}
            </div>
            <div className="text-sm text-muted-foreground">
              {health.level}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MultiMetricComparisonProps {
  data: Array<{
    category: string
    current: number
    previous: number
    target?: number
  }>
  title: string
  description?: string
}

export function MultiMetricComparison({ data, title, description }: MultiMetricComparisonProps) {
  const chartData = data.map(item => ({
    ...item,
    improvement: item.current - item.previous,
    improvement_percentage: item.previous > 0 ? ((item.current - item.previous) / item.previous) * 100 : 0
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              type="category"
              dataKey="category"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={80}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            
            <Bar dataKey="previous" fill="#94A3B8" name="Previous" />
            <Bar dataKey="current" fill="#3B82F6" name="Current" />
            {data.some(item => item.target) && (
              <Bar dataKey="target" fill="#10B981" name="Target" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <TrendIndicator 
                value={item.improvement_percentage} 
                format="percentage"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface HeatmapCalendarProps {
  data: Record<string, number>
  title: string
  description?: string
  colorScheme?: 'blue' | 'green' | 'red' | 'purple'
}

export function HeatmapCalendar({ 
  data, 
  title, 
  description, 
  colorScheme = 'blue' 
}: HeatmapCalendarProps) {
  const processedData = useMemo(() => {
    const dates = Object.keys(data).sort()
    const values = Object.values(data)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    
    return dates.map(date => {
      const value = data[date]
      const intensity = maxValue > minValue ? (value - minValue) / (maxValue - minValue) : 0
      return {
        date,
        value,
        intensity,
        day: new Date(date).getDay(),
        week: Math.floor((new Date(date).getTime() - new Date(dates[0]).getTime()) / (7 * 24 * 60 * 60 * 1000))
      }
    })
  }, [data])

  const getColor = (intensity: number) => {
    const opacity = Math.max(0.1, intensity)
    switch (colorScheme) {
      case 'green':
        return `rgba(16, 185, 129, ${opacity})`
      case 'red':
        return `rgba(239, 68, 68, ${opacity})`
      case 'purple':
        return `rgba(139, 92, 246, ${opacity})`
      default:
        return `rgba(59, 130, 246, ${opacity})`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mt-2">
          {processedData.map((item, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-sm border border-muted flex items-center justify-center text-xs font-medium relative group cursor-pointer"
              style={{ backgroundColor: getColor(item.intensity) }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                {item.date}: {item.value}
              </div>
              {item.intensity > 0.5 && (
                <span className="text-white">{new Date(item.date).getDate()}</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm border border-muted"
                style={{ backgroundColor: getColor(intensity) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface FunnelChartProps {
  data: Array<{
    stage: string
    value: number
    color?: string
  }>
  title: string
  description?: string
}

export function FunnelChart({ data, title, description }: FunnelChartProps) {
  const total = data[0]?.value || 1
  const processedData = data.map((item, idx) => ({
    ...item,
    percentage: (item.value / total) * 100,
    conversionRate: idx > 0 ? (item.value / data[idx - 1].value) * 100 : 100,
    color: item.color || `hsl(${210 + idx * 30}, 70%, 50%)`
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {processedData.map((item, idx) => (
            <div key={item.stage} className="relative">
              <div 
                className="relative overflow-hidden rounded"
                style={{ 
                  backgroundColor: item.color,
                  width: `${item.percentage}%`,
                  minWidth: '60%',
                  height: '48px'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-4 text-white font-medium">
                  <span>{item.stage}</span>
                  <span>{item.value.toLocaleString()}</span>
                </div>
              </div>
              
              {idx > 0 && (
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>{item.percentage.toFixed(1)}% of total</span>
                  <Badge variant="outline">
                    {item.conversionRate.toFixed(1)}% conversion
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CorrelationMatrixProps {
  data: Record<string, Record<string, number>>
  title: string
  description?: string
}

export function CorrelationMatrix({ data, title, description }: CorrelationMatrixProps) {
  const metrics = Object.keys(data)
  
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue > 0.8) return value > 0 ? '#10B981' : '#EF4444'
    if (absValue > 0.6) return value > 0 ? '#34D399' : '#F87171'
    if (absValue > 0.4) return value > 0 ? '#6EE7B7' : '#FCA5A5'
    return '#F3F4F6'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${metrics.length + 1}, 1fr)` }}>
          {/* Header row */}
          <div></div>
          {metrics.map(metric => (
            <div key={metric} className="text-xs font-medium text-center p-2 text-muted-foreground">
              {metric.replace(/_/g, ' ').slice(0, 8)}
            </div>
          ))}
          
          {/* Data rows */}
          {metrics.map(rowMetric => (
            <>
              <div key={rowMetric} className="text-xs font-medium p-2 text-muted-foreground">
                {rowMetric.replace(/_/g, ' ').slice(0, 8)}
              </div>
              {metrics.map(colMetric => {
                const correlation = data[rowMetric]?.[colMetric] || 0
                return (
                  <div
                    key={`${rowMetric}-${colMetric}`}
                    className="aspect-square flex items-center justify-center text-xs font-medium rounded relative group cursor-pointer"
                    style={{ backgroundColor: getCorrelationColor(correlation) }}
                  >
                    <span className={correlation > 0.5 || correlation < -0.5 ? 'text-white' : 'text-black'}>
                      {correlation.toFixed(2)}
                    </span>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                      {rowMetric} vs {colMetric}: {correlation.toFixed(3)}
                    </div>
                  </div>
                )
              })}
            </>
          ))}
        </div>
        
        <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Negative</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Positive</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}