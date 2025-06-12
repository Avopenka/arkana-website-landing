import { db } from './database';
import { logger } from './logger';

export interface AnalyticsEvent {
  event_type: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export interface UsageStats {
  totalRedemptions: number;
  redemptionsToday: number;
  redemptionsThisWeek: number;
  redemptionsThisMonth: number;
  mostPopularCodes: Array<{ code: string; uses: number }>;
  peakUsageHours: Array<{ hour: number; count: number }>;
  topUserAgents: Array<{ userAgent: string; count: number }>;
  geographicDistribution: Array<{ country: string; count: number }>;
}

export interface SystemHealth {
  databaseStatus: 'healthy' | 'degraded' | 'down';
  databaseLatency: number;
  apiResponseTimes: Array<{ endpoint: string; avgResponseTime: number }>;
  errorRate: number;
  uptime: number;
}

class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private readonly maxInMemoryEvents = 1000;
  private responseTimeBuffer: Array<{ endpoint: string; responseTime: number; timestamp: number }> = [];
  private startTime = Date.now();

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const enhancedEvent = {
        ...event,
        timestamp: event.timestamp || new Date().toISOString()
      };

      // Store in memory for immediate access
      this.events.push(enhancedEvent);
      if (this.events.length > this.maxInMemoryEvents) {
        this.events.shift(); // Remove oldest event
      }

      // Optionally persist to database for long-term storage
      if (process.env.ANALYTICS_PERSISTENCE === 'true') {
        await this.persistEvent(enhancedEvent);
      }

      logger.debug('Analytics event tracked', { eventType: event.event_type });
    } catch (error) {
      logger.error('Failed to track analytics event', error as Error, { event });
    }
  }

  private async persistEvent(event: AnalyticsEvent): Promise<void> {
    // This would require an analytics table in the database
    // For now, we'll just log it
    logger.info('Analytics event', event);
  }

  trackApiResponse(endpoint: string, responseTime: number): void {
    this.responseTimeBuffer.push({
      endpoint,
      responseTime,
      timestamp: Date.now()
    });

    // Keep only last 100 response times per endpoint
    const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour
    this.responseTimeBuffer = this.responseTimeBuffer.filter(
      entry => entry.timestamp > cutoff
    );
  }

  async getUsageStats(): Promise<UsageStats> {
    try {
      // Get basic redemption counts
      const stats = await db.getBetaCodeStats();
      
      // Get redemptions by time period
      const redemptionsToday = this.events.filter(event => 
        event.event_type === 'beta_code_redeemed' &&
        this.isWithinPeriod(event.timestamp!, 'day')
      ).length;

      const redemptionsThisWeek = this.events.filter(event => 
        event.event_type === 'beta_code_redeemed' &&
        this.isWithinPeriod(event.timestamp!, 'week')
      ).length;

      const redemptionsThisMonth = this.events.filter(event => 
        event.event_type === 'beta_code_redeemed' &&
        this.isWithinPeriod(event.timestamp!, 'month')
      ).length;

      // Analyze code popularity
      const codeUsage = this.events
        .filter(event => event.event_type === 'beta_code_redeemed')
        .reduce((acc, event) => {
          const code = event.metadata?.code || 'unknown';
          acc[code] = (acc[code] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const mostPopularCodes = Object.entries(codeUsage)
        .map(([code, uses]) => ({ code, uses }))
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 5);

      // Analyze peak usage hours
      const hourlyUsage = this.events
        .filter(event => event.event_type === 'beta_code_redeemed')
        .reduce((acc, event) => {
          const hour = new Date(event.timestamp!).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

      const peakUsageHours = Object.entries(hourlyUsage)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Analyze user agents
      const userAgentUsage = this.events
        .filter(event => event.user_agent)
        .reduce((acc, event) => {
          const agent = this.simplifyUserAgent(event.user_agent!);
          acc[agent] = (acc[agent] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topUserAgents = Object.entries(userAgentUsage)
        .map(([userAgent, count]) => ({ userAgent, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalRedemptions: stats.totalUsers,
        redemptionsToday,
        redemptionsThisWeek,
        redemptionsThisMonth,
        mostPopularCodes,
        peakUsageHours,
        topUserAgents,
        geographicDistribution: [] // Would need IP geolocation service
      };
    } catch (error) {
      logger.error('Failed to generate usage stats', error as Error);
      throw error;
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      // Check database health
      const dbHealth = await db.healthCheck();
      
      // Calculate API response times
      const apiResponseTimes = this.calculateApiResponseTimes();
      
      // Calculate error rate from recent events
      const errorEvents = this.events.filter(event => 
        event.event_type === 'api_error' &&
        this.isWithinPeriod(event.timestamp!, 'hour')
      ).length;
      
      const totalEvents = this.events.filter(event => 
        this.isWithinPeriod(event.timestamp!, 'hour')
      ).length;
      
      const errorRate = totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;
      
      // Calculate uptime
      const uptime = Date.now() - this.startTime;

      return {
        databaseStatus: dbHealth.status === 'healthy' ? 'healthy' : 
                       dbHealth.latency < 5000 ? 'degraded' : 'down',
        databaseLatency: dbHealth.latency,
        apiResponseTimes,
        errorRate,
        uptime
      };
    } catch (error) {
      logger.error('Failed to get system health', error as Error);
      throw error;
    }
  }

  private calculateApiResponseTimes(): Array<{ endpoint: string; avgResponseTime: number }> {
    const endpointTimes = this.responseTimeBuffer.reduce((acc, entry) => {
      if (!acc[entry.endpoint]) {
        acc[entry.endpoint] = [];
      }
      acc[entry.endpoint].push(entry.responseTime);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(endpointTimes).map(([endpoint, times]) => ({
      endpoint,
      avgResponseTime: times.reduce((sum, time) => sum + time, 0) / times.length
    }));
  }

  private isWithinPeriod(timestamp: string, period: 'hour' | 'day' | 'week' | 'month'): boolean {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();

    switch (period) {
      case 'hour':
        return diffMs <= 60 * 60 * 1000;
      case 'day':
        return diffMs <= 24 * 60 * 60 * 1000;
      case 'week':
        return diffMs <= 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      default:
        return false;
    }
  }

  private simplifyUserAgent(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
  }

  // Event tracking helpers
  async trackBetaCodeRedemption(code: string, email: string, ip: string, userAgent: string): Promise<void> {
    await this.trackEvent({
      event_type: 'beta_code_redeemed',
      user_email: email,
      ip_address: ip,
      user_agent: userAgent,
      metadata: { code }
    });
  }

  async trackBetaCodeValidationFailure(code: string, reason: string, ip: string): Promise<void> {
    await this.trackEvent({
      event_type: 'beta_code_validation_failed',
      ip_address: ip,
      metadata: { code, reason }
    });
  }

  async trackApiError(endpoint: string, error: string, ip: string): Promise<void> {
    await this.trackEvent({
      event_type: 'api_error',
      ip_address: ip,
      metadata: { endpoint, error }
    });
  }

  async trackAdminAction(action: string, adminKey: string, ip: string): Promise<void> {
    await this.trackEvent({
      event_type: 'admin_action',
      ip_address: ip,
      metadata: { action, adminKey: adminKey.substring(0, 8) + '...' }
    });
  }
}

export const analytics = new AnalyticsManager();