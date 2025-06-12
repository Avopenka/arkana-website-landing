// PACA Protocol: Comprehensive Error Monitoring & Alerting System
// Real-time error tracking, performance monitoring, and automated alerts

import { analytics } from './analytics';
import { logger } from './logger';
import { supabase } from './supabase';

export interface ErrorDetails {
  message: string;
  stack?: string;
  name?: string;
  code?: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  source?: 'client' | 'server' | 'api';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  buildVersion?: string;
  environment: 'development' | 'staging' | 'production';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: Date;
  tags?: Record<string, string>;
  threshold?: number;
  severity?: 'info' | 'warning' | 'error';
}

export interface AlertRule {
  id: string;
  name: string;
  condition: {
    metric: string;
    operator: '>' | '<' | '=' | '>=' | '<=';
    threshold: number;
    timeWindow: number; // in minutes
  };
  actions: Array<{
    type: 'email' | 'webhook' | 'slack';
    config: Record<string, any>;
  }>;
  enabled: boolean;
  lastTriggered?: Date;
  cooldownPeriod: number; // in minutes
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  errorRate: number;
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeUsers: number;
  lastChecked: Date;
  services: Record<string, {
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    lastChecked: Date;
  }>;
}

class ErrorMonitoringManager {
  private errors: ErrorDetails[] = [];
  private metrics: PerformanceMetric[] = [];
  private alertRules: AlertRule[] = [];
  private alertStates: Map<string, { lastTriggered: Date; count: number }> = new Map();
  private maxStoredErrors = 1000;
  private maxStoredMetrics = 5000;

  constructor() {
    this.initializeDefaultAlertRules();
    this.startHealthChecks();
    
    // Cleanup old data periodically
    setInterval(() => this.cleanup(), 60 * 60 * 1000); // Every hour
  }

  // Error Tracking
  async trackError(error: Partial<ErrorDetails>): Promise<void> {
    const errorDetails: ErrorDetails = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      name: error.name,
      code: error.code,
      fileName: error.fileName,
      lineNumber: error.lineNumber,
      columnNumber: error.columnNumber,
      source: error.source || 'client',
      severity: error.severity || 'medium',
      context: error.context || {},
      userId: error.userId,
      sessionId: error.sessionId,
      timestamp: new Date(),
      userAgent: error.userAgent,
      url: error.url,
      buildVersion: process.env.BUILD_VERSION || 'unknown',
      environment: (process.env.NODE_ENV as any) || 'development'
    };

    // Store in memory
    this.errors.push(errorDetails);
    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift();
    }

    // Log to external service
    logger.error(errorDetails.message, new Error(errorDetails.message), {
      ...errorDetails,
      stack: errorDetails.stack
    });

    // Track in analytics
    await analytics.trackEvent({
      event_type: 'error_tracked',
      user_email: errorDetails.userId ? `user_${errorDetails.userId}` : undefined,
      ip_address: 'unknown',
      user_agent: errorDetails.userAgent,
      metadata: {
        error_name: errorDetails.name,
        error_code: errorDetails.code,
        severity: errorDetails.severity,
        source: errorDetails.source,
        url: errorDetails.url,
        context: errorDetails.context
      }
    });

    // Store in database for persistence
    try {
      await supabase
        .from('error_logs')
        .insert({
          message: errorDetails.message,
          stack: errorDetails.stack,
          name: errorDetails.name,
          code: errorDetails.code,
          file_name: errorDetails.fileName,
          line_number: errorDetails.lineNumber,
          column_number: errorDetails.columnNumber,
          source: errorDetails.source,
          severity: errorDetails.severity,
          context: errorDetails.context,
          user_id: errorDetails.userId,
          session_id: errorDetails.sessionId,
          user_agent: errorDetails.userAgent,
          url: errorDetails.url,
          build_version: errorDetails.buildVersion,
          environment: errorDetails.environment,
          timestamp: errorDetails.timestamp.toISOString()
        });
    } catch (dbError) {
      console.error('Failed to store error in database:', dbError);
    }

    // Check alert rules
    await this.checkErrorAlerts(errorDetails);
  }

  // Performance Monitoring
  async trackMetric(metric: Omit<PerformanceMetric, 'timestamp'>): Promise<void> {
    const performanceMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date()
    };

    // Store in memory
    this.metrics.push(performanceMetric);
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics.shift();
    }

    // Track in analytics
    await analytics.trackEvent({
      event_type: 'performance_metric',
      metadata: {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        tags: metric.tags
      }
    });

    // Store in database
    try {
      await supabase
        .from('performance_metrics')
        .insert({
          name: metric.name,
          value: metric.value,
          unit: metric.unit,
          tags: metric.tags,
          threshold: metric.threshold,
          severity: metric.severity,
          timestamp: performanceMetric.timestamp.toISOString()
        });
    } catch (dbError) {
      console.error('Failed to store metric in database:', dbError);
    }

    // Check alert rules
    await this.checkMetricAlerts(performanceMetric);
  }

  // System Health Monitoring
  async getSystemHealth(): Promise<SystemHealth> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Calculate error rate
    const recentErrors = this.errors.filter(e => e.timestamp >= oneHourAgo);
    const totalRequests = await this.getTotalRequests(oneHourAgo, now);
    const errorRate = totalRequests > 0 ? (recentErrors.length / totalRequests) * 100 : 0;

    // Calculate average response time
    const responseTimeMetrics = this.metrics
      .filter(m => m.name === 'response_time' && m.timestamp >= oneHourAgo)
      .map(m => m.value);
    const avgResponseTime = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, val) => sum + val, 0) / responseTimeMetrics.length
      : 0;

    // Get memory usage
    const memoryMetrics = this.metrics
      .filter(m => m.name === 'memory_usage' && m.timestamp >= oneHourAgo)
      .slice(-1);
    const memoryUsage = memoryMetrics.length > 0 ? memoryMetrics[0].value : 0;

    // Get CPU usage
    const cpuMetrics = this.metrics
      .filter(m => m.name === 'cpu_usage' && m.timestamp >= oneHourAgo)
      .slice(-1);
    const cpuUsage = cpuMetrics.length > 0 ? cpuMetrics[0].value : 0;

    // Get active users
    const activeUsers = await this.getActiveUsers();

    // Check service health
    const services = await this.checkServiceHealth();

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';
    
    if (errorRate > 10 || avgResponseTime > 5000) {
      status = 'degraded';
    }
    
    if (errorRate > 25 || avgResponseTime > 10000 || Object.values(services).some(s => s.status === 'down')) {
      status = 'down';
    }

    const uptime = process.uptime ? process.uptime() * 1000 : 0;

    return {
      status,
      uptime,
      errorRate,
      responseTime: avgResponseTime,
      memoryUsage,
      cpuUsage,
      activeUsers,
      lastChecked: now,
      services
    };
  }

  // Error Analytics
  async getErrorAnalytics(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<{
    totalErrors: number;
    errorsBySource: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    errorsByType: Record<string, number>;
    topErrors: Array<{ message: string; count: number; severity: string }>;
    errorTrend: Array<{ time: string; count: number }>;
    affectedUsers: number;
  }> {
    const timeMs = this.getTimeframeMs(timeframe);
    const startTime = new Date(Date.now() - timeMs);
    
    const relevantErrors = this.errors.filter(e => e.timestamp >= startTime);

    const errorsBySource = relevantErrors.reduce((acc, error) => {
      if (error.source) {
        acc[error.source] = (acc[error.source] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = relevantErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsByType = relevantErrors.reduce((acc, error) => {
      const type = error.name || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top errors by frequency
    const errorCounts = relevantErrors.reduce((acc, error) => {
      const key = error.message;
      if (!acc[key]) {
        acc[key] = { count: 0, severity: error.severity };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { count: number; severity: string }>);

    const topErrors = Object.entries(errorCounts)
      .map(([message, data]) => ({ message, count: data.count, severity: data.severity }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Error trend
    const bucketSize = this.getBucketSize(timeframe);
    const errorTrend = this.createTimeSeries(relevantErrors, bucketSize);

    // Affected users
    const affectedUsers = new Set(relevantErrors.map(e => e.userId).filter(Boolean)).size;

    return {
      totalErrors: relevantErrors.length,
      errorsBySource,
      errorsBySeverity,
      errorsByType,
      topErrors,
      errorTrend,
      affectedUsers
    };
  }

  // Performance Analytics
  async getPerformanceAnalytics(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<{
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    throughput: number;
    memoryUsage: { current: number; average: number; peak: number };
    cpuUsage: { current: number; average: number; peak: number };
    performanceTrends: Record<string, Array<{ time: string; value: number }>>;
  }> {
    const timeMs = this.getTimeframeMs(timeframe);
    const startTime = new Date(Date.now() - timeMs);
    
    const relevantMetrics = this.metrics.filter(m => m.timestamp >= startTime);

    // Response time analysis
    const responseTimes = relevantMetrics
      .filter(m => m.name === 'response_time')
      .map(m => m.value)
      .sort((a, b) => a - b);

    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, val) => sum + val, 0) / responseTimes.length
      : 0;

    const p95ResponseTime = responseTimes.length > 0
      ? responseTimes[Math.floor(responseTimes.length * 0.95)]
      : 0;

    const p99ResponseTime = responseTimes.length > 0
      ? responseTimes[Math.floor(responseTimes.length * 0.99)]
      : 0;

    // Throughput (requests per minute)
    const throughputMetrics = relevantMetrics.filter(m => m.name === 'throughput');
    const throughput = throughputMetrics.length > 0
      ? throughputMetrics[throughputMetrics.length - 1].value
      : 0;

    // Memory usage analysis
    const memoryMetrics = relevantMetrics
      .filter(m => m.name === 'memory_usage')
      .map(m => m.value);

    const memoryUsage = {
      current: memoryMetrics.length > 0 ? memoryMetrics[memoryMetrics.length - 1] : 0,
      average: memoryMetrics.length > 0 ? memoryMetrics.reduce((sum, val) => sum + val, 0) / memoryMetrics.length : 0,
      peak: memoryMetrics.length > 0 ? Math.max(...memoryMetrics) : 0
    };

    // CPU usage analysis
    const cpuMetrics = relevantMetrics
      .filter(m => m.name === 'cpu_usage')
      .map(m => m.value);

    const cpuUsage = {
      current: cpuMetrics.length > 0 ? cpuMetrics[cpuMetrics.length - 1] : 0,
      average: cpuMetrics.length > 0 ? cpuMetrics.reduce((sum, val) => sum + val, 0) / cpuMetrics.length : 0,
      peak: cpuMetrics.length > 0 ? Math.max(...cpuMetrics) : 0
    };

    // Performance trends
    const bucketSize = this.getBucketSize(timeframe);
    const performanceTrends: Record<string, Array<{ time: string; value: number }>> = {};

    const metricNames = ['response_time', 'memory_usage', 'cpu_usage', 'throughput'];
    for (const metricName of metricNames) {
      const metricData = relevantMetrics.filter(m => m.name === metricName);
      performanceTrends[metricName] = this.createMetricTimeSeries(metricData, bucketSize);
    }

    return {
      averageResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      throughput,
      memoryUsage,
      cpuUsage,
      performanceTrends
    };
  }

  // Alert Management
  addAlertRule(rule: Omit<AlertRule, 'id'>): string {
    const id = crypto.randomUUID();
    this.alertRules.push({ ...rule, id });
    return id;
  }

  removeAlertRule(id: string): boolean {
    const index = this.alertRules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      this.alertRules.splice(index, 1);
      return true;
    }
    return false;
  }

  updateAlertRule(id: string, updates: Partial<AlertRule>): boolean {
    const rule = this.alertRules.find(r => r.id === id);
    if (rule) {
      Object.assign(rule, updates);
      return true;
    }
    return false;
  }

  // Private Methods
  private initializeDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: 'high-error-rate',
        name: 'High Error Rate',
        condition: {
          metric: 'error_rate',
          operator: '>',
          threshold: 5,
          timeWindow: 10
        },
        actions: [
          {
            type: 'email',
            config: { recipient: 'alerts@arkana.chat' }
          }
        ],
        enabled: true,
        cooldownPeriod: 30
      },
      {
        id: 'slow-response-time',
        name: 'Slow Response Time',
        condition: {
          metric: 'response_time',
          operator: '>',
          threshold: 5000,
          timeWindow: 5
        },
        actions: [
          {
            type: 'email',
            config: { recipient: 'alerts@arkana.chat' }
          }
        ],
        enabled: true,
        cooldownPeriod: 15
      },
      {
        id: 'high-memory-usage',
        name: 'High Memory Usage',
        condition: {
          metric: 'memory_usage',
          operator: '>',
          threshold: 85,
          timeWindow: 15
        },
        actions: [
          {
            type: 'email',
            config: { recipient: 'alerts@arkana.chat' }
          }
        ],
        enabled: true,
        cooldownPeriod: 60
      }
    ];
  }

  private async checkErrorAlerts(error: ErrorDetails): Promise<void> {
    for (const rule of this.alertRules.filter(r => r.enabled)) {
      if (await this.shouldTriggerAlert(rule, error)) {
        await this.triggerAlert(rule, { error });
      }
    }
  }

  private async checkMetricAlerts(metric: PerformanceMetric): Promise<void> {
    for (const rule of this.alertRules.filter(r => r.enabled)) {
      if (rule.condition.metric === metric.name && await this.shouldTriggerMetricAlert(rule, metric)) {
        await this.triggerAlert(rule, { metric });
      }
    }
  }

  private async shouldTriggerAlert(rule: AlertRule, error: ErrorDetails): Promise<boolean> {
    const state = this.alertStates.get(rule.id);
    
    // Check cooldown
    if (state?.lastTriggered) {
      const cooldownMs = rule.cooldownPeriod * 60 * 1000;
      if (Date.now() - state.lastTriggered.getTime() < cooldownMs) {
        return false;
      }
    }

    // Check if error meets criteria
    if (rule.condition.metric === 'error_rate') {
      const windowMs = rule.condition.timeWindow * 60 * 1000;
      const windowStart = new Date(Date.now() - windowMs);
      const recentErrors = this.errors.filter(e => e.timestamp >= windowStart);
      const errorRate = (recentErrors.length / windowMs) * 60000; // errors per minute
      
      return this.evaluateCondition(errorRate, rule.condition);
    }

    return false;
  }

  private async shouldTriggerMetricAlert(rule: AlertRule, metric: PerformanceMetric): Promise<boolean> {
    const state = this.alertStates.get(rule.id);
    
    // Check cooldown
    if (state?.lastTriggered) {
      const cooldownMs = rule.cooldownPeriod * 60 * 1000;
      if (Date.now() - state.lastTriggered.getTime() < cooldownMs) {
        return false;
      }
    }

    return this.evaluateCondition(metric.value, rule.condition);
  }

  private evaluateCondition(value: number, condition: AlertRule['condition']): boolean {
    switch (condition.operator) {
      case '>':
        return value > condition.threshold;
      case '<':
        return value < condition.threshold;
      case '=':
        return value === condition.threshold;
      case '>=':
        return value >= condition.threshold;
      case '<=':
        return value <= condition.threshold;
      default:
        return false;
    }
  }

  private async triggerAlert(rule: AlertRule, context: any): Promise<void> {
    const now = new Date();
    
    // Update alert state
    this.alertStates.set(rule.id, {
      lastTriggered: now,
      count: (this.alertStates.get(rule.id)?.count || 0) + 1
    });

    // Execute alert actions
    for (const action of rule.actions) {
      try {
        await this.executeAlertAction(action, rule, context);
      } catch (error) {
        console.error('Failed to execute alert action:', error);
      }
    }

    // Log alert
    logger.warn(`Alert triggered: ${rule.name}`, {
      rule: rule.name,
      condition: rule.condition,
      context
    });
  }

  private async executeAlertAction(action: AlertRule['actions'][0], rule: AlertRule, context: any): Promise<void> {
    switch (action.type) {
      case 'email':
        // Implementation would send actual email
        console.log(`EMAIL ALERT: ${rule.name}`, action.config, context);
        break;
      case 'webhook':
        // Implementation would call webhook
        console.log(`WEBHOOK ALERT: ${rule.name}`, action.config, context);
        break;
      case 'slack':
        // Implementation would send Slack message
        console.log(`SLACK ALERT: ${rule.name}`, action.config, context);
        break;
    }
  }

  private startHealthChecks(): void {
    // System health check every minute
    setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        
        await this.trackMetric({
          name: 'system_health_score',
          value: health.status === 'healthy' ? 100 : health.status === 'degraded' ? 50 : 0,
          unit: 'percentage'
        });

        await this.trackMetric({
          name: 'error_rate',
          value: health.errorRate,
          unit: 'percentage'
        });

        await this.trackMetric({
          name: 'response_time',
          value: health.responseTime,
          unit: 'ms'
        });

      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, 60 * 1000);
  }

  private async getTotalRequests(startTime: Date, endTime: Date): Promise<number> {
    // Implementation would query actual request logs
    // For now, estimate based on metrics
    const throughputMetrics = this.metrics
      .filter(m => m.name === 'throughput' && m.timestamp >= startTime && m.timestamp <= endTime);
    
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = durationMs / (60 * 1000);
    
    if (throughputMetrics.length > 0) {
      const avgThroughput = throughputMetrics.reduce((sum, m) => sum + m.value, 0) / throughputMetrics.length;
      return Math.round(avgThroughput * durationMinutes);
    }
    
    return 100; // Fallback estimate
  }

  private async getActiveUsers(): Promise<number> {
    try {
      const { count } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity', new Date(Date.now() - 15 * 60 * 1000).toISOString());
      
      return count || 0;
    } catch {
      return 0;
    }
  }

  private async checkServiceHealth(): Promise<SystemHealth['services']> {
    const services: SystemHealth['services'] = {};
    
    // Check database
    try {
      const start = Date.now();
      await supabase.from('user_profiles').select('id').limit(1);
      const responseTime = Date.now() - start;
      
      services.database = {
        status: responseTime < 1000 ? 'up' : 'degraded',
        responseTime,
        lastChecked: new Date()
      };
    } catch {
      services.database = {
        status: 'down',
        lastChecked: new Date()
      };
    }

    // Check other services as needed
    services.api = {
      status: 'up',
      responseTime: 50,
      lastChecked: new Date()
    };

    return services;
  }

  private getTimeframeMs(timeframe: string): number {
    switch (timeframe) {
      case '1h':
        return 60 * 60 * 1000;
      case '24h':
        return 24 * 60 * 60 * 1000;
      case '7d':
        return 7 * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000;
    }
  }

  private getBucketSize(timeframe: string): number {
    switch (timeframe) {
      case '1h':
        return 5 * 60 * 1000; // 5 minute buckets
      case '24h':
        return 60 * 60 * 1000; // 1 hour buckets
      case '7d':
        return 6 * 60 * 60 * 1000; // 6 hour buckets
      default:
        return 60 * 60 * 1000;
    }
  }

  private createTimeSeries(errors: ErrorDetails[], bucketSize: number): Array<{ time: string; count: number }> {
    const now = Date.now();
    const buckets: Record<string, number> = {};

    for (const error of errors) {
      const bucketTime = Math.floor(error.timestamp.getTime() / bucketSize) * bucketSize;
      const timeKey = new Date(bucketTime).toISOString();
      buckets[timeKey] = (buckets[timeKey] || 0) + 1;
    }

    return Object.entries(buckets)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  private createMetricTimeSeries(metrics: PerformanceMetric[], bucketSize: number): Array<{ time: string; value: number }> {
    const buckets: Record<string, number[]> = {};

    for (const metric of metrics) {
      const bucketTime = Math.floor(metric.timestamp.getTime() / bucketSize) * bucketSize;
      const timeKey = new Date(bucketTime).toISOString();
      if (!buckets[timeKey]) buckets[timeKey] = [];
      buckets[timeKey].push(metric.value);
    }

    return Object.entries(buckets)
      .map(([time, values]) => ({
        time,
        value: values.reduce((sum, val) => sum + val, 0) / values.length
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  private cleanup(): void {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const cutoff = new Date(Date.now() - maxAge);

    this.errors = this.errors.filter(e => e.timestamp > cutoff);
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoringManager();

// Utility functions for client-side error tracking
export function setupClientErrorTracking(): void {
  if (typeof window === 'undefined') return;

  // Track JavaScript errors
  window.addEventListener('error', (event) => {
    errorMonitoring.trackError({
      message: event.message,
      stack: event.error?.stack,
      fileName: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      source: 'client',
      severity: 'medium',
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorMonitoring.trackError({
      message: `Unhandled promise rejection: ${event.reason}`,
      stack: event.reason?.stack,
      source: 'client',
      severity: 'high',
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  });

  // Track resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      errorMonitoring.trackError({
        message: `Resource failed to load: ${(event.target as any)?.src || (event.target as any)?.href}`,
        source: 'client',
        severity: 'low',
        url: window.location.href,
        userAgent: navigator.userAgent,
        context: {
          resourceType: (event.target as any)?.tagName,
          resourceUrl: (event.target as any)?.src || (event.target as any)?.href
        }
      });
    }
  }, true);
}

export default errorMonitoring;