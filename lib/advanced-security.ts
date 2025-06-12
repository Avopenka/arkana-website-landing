// PACA Protocol: Advanced Security System
// Comprehensive security with rate limiting, caching, and threat detection

import { supabase } from './supabase';
import { analytics } from './analytics';
import { logger } from './logger';
import crypto from 'crypto';

export interface SecurityConfig {
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  };
  bruteForceProtection: {
    maxAttempts: number;
    lockoutDuration: number;
    decayTime: number;
  };
  ipWhitelist?: string[];
  ipBlacklist?: string[];
  csrfProtection: boolean;
  sessionSecurity: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

export interface SecurityThreat {
  type: 'brute_force' | 'sql_injection' | 'xss' | 'rate_limit' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress: string;
  userAgent?: string;
  endpoint?: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
  blocked: boolean;
}

const defaultConfig: SecurityConfig = {
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  bruteForceProtection: {
    maxAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
    decayTime: 60 * 60 * 1000, // 1 hour
  },
  csrfProtection: true,
  sessionSecurity: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
};

class AdvancedSecurityManager {
  private config: SecurityConfig;
  private rateLimitStore: Map<string, { count: number; resetTime: Date }> = new Map();
  private bruteForceStore: Map<string, { attempts: number; lastAttempt: Date; lockedUntil?: Date }> = new Map();
  private threatStore: SecurityThreat[] = [];
  private ipReputationCache: Map<string, { score: number; lastChecked: Date }> = new Map();

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.startCleanupInterval();
  }

  // Rate Limiting
  async checkRateLimit(identifier: string, customLimit?: number): Promise<RateLimitInfo> {
    const limit = customLimit || this.config.rateLimiting.maxRequests;
    const windowMs = this.config.rateLimiting.windowMs;
    const now = new Date();
    
    const key = `rate_limit_${identifier}`;
    let record = this.rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: new Date(now.getTime() + windowMs)
      };
      this.rateLimitStore.set(key, record);
      
      return {
        limit,
        remaining: limit - 1,
        resetTime: record.resetTime,
        blocked: false
      };
    }

    record.count++;
    
    const remaining = Math.max(0, limit - record.count);
    const blocked = record.count > limit;

    if (blocked) {
      await this.logSecurityThreat({
        type: 'rate_limit',
        severity: 'medium',
        ipAddress: identifier,
        details: {
          count: record.count,
          limit,
          windowMs
        },
        timestamp: now
      });
    }

    return {
      limit,
      remaining,
      resetTime: record.resetTime,
      blocked
    };
  }

  // Brute Force Protection
  async checkBruteForce(identifier: string): Promise<{ blocked: boolean; attemptsRemaining: number; lockedUntil?: Date }> {
    const config = this.config.bruteForceProtection;
    const now = new Date();
    
    let record = this.bruteForceStore.get(identifier);

    if (!record) {
      record = { attempts: 0, lastAttempt: now };
      this.bruteForceStore.set(identifier, record);
    }

    // Check if still locked
    if (record.lockedUntil && now < record.lockedUntil) {
      return {
        blocked: true,
        attemptsRemaining: 0,
        lockedUntil: record.lockedUntil
      };
    }

    // Decay attempts over time
    const timeSinceLastAttempt = now.getTime() - record.lastAttempt.getTime();
    if (timeSinceLastAttempt > config.decayTime) {
      record.attempts = Math.max(0, record.attempts - 1);
    }

    record.attempts++;
    record.lastAttempt = now;

    // Check if should be locked
    if (record.attempts > config.maxAttempts) {
      record.lockedUntil = new Date(now.getTime() + config.lockoutDuration);
      
      await this.logSecurityThreat({
        type: 'brute_force',
        severity: 'high',
        ipAddress: identifier,
        details: {
          attempts: record.attempts,
          maxAttempts: config.maxAttempts,
          lockoutDuration: config.lockoutDuration
        },
        timestamp: now
      });

      return {
        blocked: true,
        attemptsRemaining: 0,
        lockedUntil: record.lockedUntil
      };
    }

    return {
      blocked: false,
      attemptsRemaining: config.maxAttempts - record.attempts
    };
  }

  // IP Reputation Checking
  async checkIpReputation(ipAddress: string): Promise<{ safe: boolean; score: number; reason?: string }> {
    try {
      // Check cache first
      const cached = this.ipReputationCache.get(ipAddress);
      const cacheValidTime = 60 * 60 * 1000; // 1 hour
      
      if (cached && (Date.now() - cached.lastChecked.getTime()) < cacheValidTime) {
        return {
          safe: cached.score >= 0,
          score: cached.score,
          reason: cached.score < 0 ? 'Known malicious IP' : undefined
        };
      }

      // Check against blacklist
      if (this.config.ipBlacklist?.includes(ipAddress)) {
        this.ipReputationCache.set(ipAddress, { score: -100, lastChecked: new Date() });
        return { safe: false, score: -100, reason: 'Blacklisted IP' };
      }

      // Check against whitelist
      if (this.config.ipWhitelist?.includes(ipAddress)) {
        this.ipReputationCache.set(ipAddress, { score: 100, lastChecked: new Date() });
        return { safe: true, score: 100 };
      }

      // Check against threat intelligence (placeholder implementation)
      const score = await this.queryThreatIntelligence(ipAddress);
      
      this.ipReputationCache.set(ipAddress, { score, lastChecked: new Date() });
      
      return {
        safe: score >= 0,
        score,
        reason: score < 0 ? 'Threat intelligence match' : undefined
      };

    } catch (error) {
      logger.error('IP reputation check failed', error as Error, { ipAddress });
      // Fail open - assume safe if we can't check
      return { safe: true, score: 0 };
    }
  }

  // Input Validation and Sanitization
  validateInput(input: string, type: 'email' | 'alphanumeric' | 'sql_safe' | 'xss_safe'): { valid: boolean; sanitized: string; threats: string[] } {
    const threats: string[] = [];
    let sanitized = input;

    // Basic XSS detection
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /expression\s*\(/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        threats.push('XSS attempt detected');
        sanitized = sanitized.replace(pattern, '');
      }
    }

    // SQL injection detection
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)|--|\/\*|\*\//gi,
      /'\s*(or|and)\s*'?1'?='?1/gi,
      /\b(waitfor|delay)\b/gi
    ];

    if (type === 'sql_safe') {
      for (const pattern of sqlPatterns) {
        if (pattern.test(input)) {
          threats.push('SQL injection attempt detected');
          sanitized = sanitized.replace(pattern, '');
        }
      }
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
          threats.push('Invalid email format');
        }
        break;
        
      case 'alphanumeric':
        sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
        break;
    }

    return {
      valid: threats.length === 0,
      sanitized,
      threats
    };
  }

  // CSRF Token Management
  generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  validateCSRFToken(token: string, sessionToken: string): boolean {
    // In production, implement proper CSRF token validation
    // This is a simplified implementation
    return !!(token && sessionToken && token.length === 64);
  }

  // Session Security
  createSecureSession(userId: string, additionalData: Record<string, any> = {}): {
    sessionId: string;
    expiresAt: Date;
    token: string;
  } {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + this.config.sessionSecurity.maxAge);
    
    const payload = {
      sessionId,
      userId,
      expiresAt: expiresAt.toISOString(),
      ...additionalData
    };
    
    const token = this.encryptSessionData(JSON.stringify(payload));
    
    return { sessionId, expiresAt, token };
  }

  validateSession(token: string): { valid: boolean; data?: any; reason?: string } {
    try {
      const decrypted = this.decryptSessionData(token);
      const data = JSON.parse(decrypted);
      
      if (!data.expiresAt || new Date(data.expiresAt) < new Date()) {
        return { valid: false, reason: 'Session expired' };
      }
      
      return { valid: true, data };
    } catch (error) {
      return { valid: false, reason: 'Invalid session token' };
    }
  }

  // Threat Detection and Logging
  async logSecurityThreat(threat: SecurityThreat): Promise<void> {
    this.threatStore.push(threat);
    
    // Keep only recent threats in memory
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = new Date(Date.now() - maxAge);
    this.threatStore = this.threatStore.filter(t => t.timestamp > cutoff);

    // Log to analytics
    await analytics.trackEvent({
      event_type: 'security_threat',
      ip_address: threat.ipAddress,
      user_agent: threat.userAgent,
      metadata: {
        threat_type: threat.type,
        severity: threat.severity,
        endpoint: threat.endpoint,
        details: threat.details
      }
    });

    // Log to database for persistent storage
    try {
      await supabase
        .from('security_threats')
        .insert({
          type: threat.type,
          severity: threat.severity,
          ip_address: threat.ipAddress,
          user_agent: threat.userAgent,
          endpoint: threat.endpoint,
          details: threat.details,
          timestamp: threat.timestamp.toISOString()
        });
    } catch (error) {
      logger.error('Failed to log security threat to database', error as Error);
    }

    // Send alerts for high severity threats
    if (threat.severity === 'high' || threat.severity === 'critical') {
      await this.sendSecurityAlert(threat);
    }
  }

  // Security Monitoring
  async getSecurityMetrics(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<{
    totalThreats: number;
    threatsByType: Record<string, number>;
    threatsBySeverity: Record<string, number>;
    topThreatIPs: Array<{ ip: string; count: number }>;
    rateLimitViolations: number;
    bruteForceAttempts: number;
  }> {
    const now = new Date();
    let startTime: Date;
    
    switch (timeframe) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const recentThreats = this.threatStore.filter(t => t.timestamp >= startTime);
    
    const threatsByType = recentThreats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const threatsBySeverity = recentThreats.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ipCounts = recentThreats.reduce((acc, threat) => {
      acc[threat.ipAddress] = (acc[threat.ipAddress] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThreatIPs = Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalThreats: recentThreats.length,
      threatsByType,
      threatsBySeverity,
      topThreatIPs,
      rateLimitViolations: threatsByType.rate_limit || 0,
      bruteForceAttempts: threatsByType.brute_force || 0
    };
  }

  // Utility Methods
  private async queryThreatIntelligence(ipAddress: string): Promise<number> {
    // Placeholder implementation - integrate with real threat intelligence APIs
    // Return score: 100 (safe) to -100 (malicious)
    
    // Check against known bad IP ranges
    const privateRanges = [
      /^10\./,
      /^192\.168\./,
      /^172\.1[6-9]\./,
      /^172\.2[0-9]\./,
      /^172\.3[0-1]\./,
      /^127\./
    ];

    for (const range of privateRanges) {
      if (range.test(ipAddress)) {
        return 50; // Private IPs are generally safe
      }
    }

    // Simulate threat intelligence check
    const hash = crypto.createHash('sha256').update(ipAddress).digest('hex');
    const hashValue = parseInt(hash.substr(0, 8), 16);
    
    // 95% of IPs are safe, 5% flagged as suspicious
    return hashValue % 20 === 0 ? -50 : 25;
  }

  private encryptSessionData(data: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.SESSION_SECRET || 'default-secret', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  private decryptSessionData(encryptedData: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.SESSION_SECRET || 'default-secret', 'salt', 32);
    
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  private async sendSecurityAlert(threat: SecurityThreat): Promise<void> {
    // Implementation would send alerts via email, Slack, etc.
    logger.warn('High severity security threat detected', {
      type: threat.type,
      severity: threat.severity,
      ipAddress: threat.ipAddress,
      details: threat.details
    });
  }

  private startCleanupInterval(): void {
    // Clean up old records every hour
    setInterval(() => {
      this.cleanupOldRecords();
    }, 60 * 60 * 1000);
  }

  private cleanupOldRecords(): void {
    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    // Clean up rate limit records
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }

    // Clean up brute force records
    for (const [key, record] of this.bruteForceStore.entries()) {
      if (record.lockedUntil && now > record.lockedUntil && 
          (now.getTime() - record.lastAttempt.getTime()) > maxAge) {
        this.bruteForceStore.delete(key);
      }
    }

    // Clean up IP reputation cache
    for (const [key, record] of this.ipReputationCache.entries()) {
      if ((now.getTime() - record.lastChecked.getTime()) > maxAge) {
        this.ipReputationCache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const securityManager = new AdvancedSecurityManager();

// Middleware functions for Next.js
export function createSecurityMiddleware(config?: Partial<SecurityConfig>) {
  const security = new AdvancedSecurityManager(config);
  
  return async function securityMiddleware(request: Request): Promise<Response | null> {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check IP reputation
    const ipCheck = await security.checkIpReputation(ip);
    if (!ipCheck.safe) {
      await security.logSecurityThreat({
        type: 'suspicious_activity',
        severity: 'high',
        ipAddress: ip,
        userAgent,
        details: { reason: ipCheck.reason, score: ipCheck.score },
        timestamp: new Date()
      });
      
      return new Response('Access Denied', { status: 403 });
    }

    // Check rate limiting
    const rateLimit = await security.checkRateLimit(ip);
    if (rateLimit.blocked) {
      return new Response('Rate Limit Exceeded', { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toISOString(),
        }
      });
    }

    // Add security headers to response
    const response = new Response(null);
    response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toISOString());
    
    return null; // Allow request to proceed
  };
}

export default securityManager;