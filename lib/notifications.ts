import { logger } from './logger';

interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

interface SlackNotification {
  webhook: string;
  message: string;
  channel?: string;
  username?: string;
}

class NotificationManager {
  private readonly adminEmail = process.env.ADMIN_EMAIL;
  private readonly slackWebhook = process.env.SLACK_WEBHOOK_URL;
  private readonly notificationThresholds = {
    betaUsageCritical: 48, // Alert when 48/50 slots used
    betaUsageWarning: 40,  // Warning when 40/50 slots used
    errorRateHigh: 10,     // Alert when error rate > 10%
    responseTimeSlow: 2000 // Alert when avg response time > 2s
  };

  async sendBetaCodeNotification(type: 'redeemed' | 'failed', data: {
    code: string;
    email?: string;
    name?: string;
    ip: string;
    totalUsers: number;
    reason?: string;
  }): Promise<void> {
    try {
      if (type === 'redeemed') {
        await this.handleSuccessfulRedemption(data);
      } else {
        await this.handleFailedRedemption(data);
      }
    } catch (error) {
      logger.error('Failed to send beta code notification', error as Error, { type, data });
    }
  }

  private async handleSuccessfulRedemption(data: {
    code: string;
    email?: string;
    name?: string;
    ip: string;
    totalUsers: number;
  }): Promise<void> {
    const { code, email, name, ip, totalUsers } = data;
    
    // Send critical alert when approaching limit
    if (totalUsers >= this.notificationThresholds.betaUsageCritical) {
      await this.sendCriticalAlert({
        subject: `🚨 CRITICAL: Beta Program Almost Full (${totalUsers}/50)`,
        message: `Beta program is at ${totalUsers}/50 capacity. Only ${50 - totalUsers} slots remaining!`,
        details: { code, email, name, ip, totalUsers }
      });
    } 
    // Send warning when reaching warning threshold
    else if (totalUsers >= this.notificationThresholds.betaUsageWarning) {
      await this.sendWarningAlert({
        subject: `⚠️ WARNING: Beta Program ${totalUsers}/50 Full`,
        message: `Beta program usage is high: ${totalUsers}/50 slots used.`,
        details: { code, email, name, ip, totalUsers }
      });
    }

    // Log successful redemption
    logger.info('Beta code successfully redeemed - notification sent', {
      code, email, totalUsers
    });
  }

  private async handleFailedRedemption(data: {
    code: string;
    ip: string;
    reason?: string;
  }): Promise<void> {
    const { code, ip, reason } = data;
    
    // Only notify for suspicious activity (multiple failures from same IP)
    // This would require tracking failure counts in analytics
    logger.warn('Beta code redemption failed', { code, ip, reason });
  }

  async sendSystemAlert(type: 'error_rate' | 'response_time' | 'database_health', data: {
    value: number;
    threshold: number;
    details?: any;
  }): Promise<void> {
    try {
      const { value, threshold, details } = data;
      let subject: string;
      let message: string;

      switch (type) {
        case 'error_rate':
          subject = `🚨 High Error Rate Alert: ${value.toFixed(2)}%`;
          message = `System error rate (${value.toFixed(2)}%) exceeds threshold (${threshold}%).`;
          break;
        case 'response_time':
          subject = `🐌 Slow Response Time Alert: ${value}ms`;
          message = `Average API response time (${value}ms) exceeds threshold (${threshold}ms).`;
          break;
        case 'database_health':
          subject = `💾 Database Health Alert`;
          message = `Database health check failed or degraded performance detected.`;
          break;
        default:
          return;
      }

      await this.sendCriticalAlert({ subject, message, details });
    } catch (error) {
      logger.error('Failed to send system alert', error as Error, { type, data });
    }
  }

  private async sendCriticalAlert(alert: {
    subject: string;
    message: string;
    details?: any;
  }): Promise<void> {
    const { subject, message, details } = alert;
    
    // Send email if configured
    if (this.adminEmail) {
      await this.sendEmail({
        to: this.adminEmail,
        subject,
        body: this.formatAlertEmail(message, details),
        isHtml: true
      });
    }

    // Send Slack notification if configured
    if (this.slackWebhook) {
      await this.sendSlackNotification({
        webhook: this.slackWebhook,
        message: `${subject}\n\n${message}${details ? `\n\nDetails: ${JSON.stringify(details, null, 2)}` : ''}`,
        channel: '#arkana-alerts'
      });
    }

    logger.info('Critical alert sent', { subject, hasEmail: !!this.adminEmail, hasSlack: !!this.slackWebhook });
  }

  private async sendWarningAlert(alert: {
    subject: string;
    message: string;
    details?: any;
  }): Promise<void> {
    // For warnings, only send Slack notifications to avoid email spam
    if (this.slackWebhook) {
      await this.sendSlackNotification({
        webhook: this.slackWebhook,
        message: `${alert.subject}\n\n${alert.message}`,
        channel: '#arkana-warnings'
      });
    }

    logger.info('Warning alert sent', { subject: alert.subject });
  }

  private async sendEmail(notification: EmailNotification): Promise<void> {
    try {
      // In a real implementation, you'd use a service like SendGrid, AWS SES, or Nodemailer
      // For now, we'll log it and potentially use a webhook
      
      logger.info('Email notification would be sent', {
        to: notification.to,
        subject: notification.subject,
        bodyLength: notification.body.length
      });

      // If you have a webhook for email sending, you could call it here
      if (process.env.EMAIL_WEBHOOK_URL) {
        await fetch(process.env.EMAIL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
      }
    } catch (error) {
      logger.error('Failed to send email notification', error as Error, notification);
    }
  }

  private async sendSlackNotification(notification: SlackNotification): Promise<void> {
    try {
      await fetch(notification.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: notification.message,
          channel: notification.channel,
          username: notification.username || 'Arkana Bot',
          icon_emoji: ':robot_face:'
        })
      });

      logger.info('Slack notification sent successfully');
    } catch (error) {
      logger.error('Failed to send Slack notification', error as Error, notification);
    }
  }

  private formatAlertEmail(message: string, details?: any): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
            <h2 style="color: #dc3545; margin: 0 0 16px 0;">🚨 Arkana System Alert</h2>
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">${message}</p>
            ${details ? `
              <div style="background: #ffffff; padding: 16px; border-radius: 4px; margin-top: 16px;">
                <h3 style="margin: 0 0 12px 0; color: #495057;">Details:</h3>
                <pre style="background: #f8f9fa; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 14px;">${JSON.stringify(details, null, 2)}</pre>
              </div>
            ` : ''}
            <p style="margin-top: 20px; font-size: 14px; color: #6c757d;">
              Timestamp: ${new Date().toISOString()}<br>
              System: Arkana Beta Management
            </p>
          </div>
        </body>
      </html>
    `;
  }

  // Daily summary notification
  async sendDailySummary(stats: {
    totalRedemptions: number;
    redemptionsToday: number;
    errorRate: number;
    avgResponseTime: number;
  }): Promise<void> {
    try {
      const { totalRedemptions, redemptionsToday, errorRate, avgResponseTime } = stats;
      
      const subject = `📊 Arkana Daily Summary - ${totalRedemptions}/50 Beta Users`;
      const message = `
Daily Summary for ${new Date().toLocaleDateString()}:

📈 Beta Usage: ${totalRedemptions}/50 total users (${redemptionsToday} new today)
⚡ Error Rate: ${errorRate.toFixed(2)}%
🚀 Avg Response Time: ${avgResponseTime.toFixed(0)}ms
💚 System Status: ${errorRate < 5 && avgResponseTime < 1000 ? 'Healthy' : 'Needs Attention'}

${totalRedemptions >= 45 ? '⚠️ Beta program is nearly full!' : '✅ System running smoothly'}
      `;

      if (this.slackWebhook) {
        await this.sendSlackNotification({
          webhook: this.slackWebhook,
          message,
          channel: '#arkana-daily-summary'
        });
      }

      logger.info('Daily summary sent', stats);
    } catch (error) {
      logger.error('Failed to send daily summary', error as Error, stats);
    }
  }
}

export const notifications = new NotificationManager();