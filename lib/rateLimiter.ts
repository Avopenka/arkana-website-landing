import { NextRequest } from 'next/server';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextRequest) => string;
}

class InMemoryStore {
  private store = new Map<string, RateLimitInfo>();

  get(key: string): RateLimitInfo | undefined {
    const info = this.store.get(key);
    if (info && Date.now() > info.resetTime) {
      this.store.delete(key);
      return undefined;
    }
    return info;
  }

  set(key: string, info: RateLimitInfo): void {
    this.store.set(key, info);
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, info] of this.store.entries()) {
      if (now > info.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

export class RateLimiter {
  private store = new InMemoryStore();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.store.cleanup(), 5 * 60 * 1000);
  }

  async checkLimit(req: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    error?: string;
  }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    const resetTime = now + this.config.windowMs;

    const existing = this.store.get(key);

    if (!existing) {
      // First request in window
      this.store.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime
      };
    }

    if (existing.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime,
        error: 'Rate limit exceeded'
      };
    }

    // Increment count
    existing.count++;
    this.store.set(key, existing);

    return {
      allowed: true,
      remaining: this.config.maxRequests - existing.count,
      resetTime: existing.resetTime
    };
  }

  private getDefaultKey(req: NextRequest): string {
    // Use IP address as default key
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    return `rate_limit:${ip}`;
  }

  public getMaxRequests(): number {
    return this.config.maxRequests;
  }
}

// Pre-configured rate limiters
export const betaApiLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes per IP
});

export const adminApiLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
});

export const generalApiLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute per IP
});

// Utility function to apply rate limiting to API routes
export async function withRateLimit(
  req: NextRequest,
  limiter: RateLimiter,
  handler: () => Promise<Response>
): Promise<Response> {
  const result = await limiter.checkLimit(req);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: result.error,
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(limiter.getMaxRequests()),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
          'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000))
        }
      }
    );
  }

  const response = await handler();
  
  // Add rate limit headers to successful responses
  response.headers.set('X-RateLimit-Limit', String(limiter.getMaxRequests()));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

  return response;
}