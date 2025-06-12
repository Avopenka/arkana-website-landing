interface RateLimiterOptions {
  windowMs: number
  max: number
  message?: string
  keyPrefix?: string
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
  message?: string
}

export class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>()
  
  constructor(private options: RateLimiterOptions) {
    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000)
  }
  
  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const key = `${this.options.keyPrefix || 'rl'}:${identifier}`
    const record = this.attempts.get(key)
    
    // If no record or window expired, create new
    if (!record || now > record.resetTime) {
      const resetTime = now + this.options.windowMs
      this.attempts.set(key, { count: 1, resetTime })
      
      return {
        success: true,
        limit: this.options.max,
        remaining: this.options.max - 1,
        resetTime
      }
    }
    
    // Check if limit exceeded
    if (record.count >= this.options.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000)
      
      return {
        success: false,
        limit: this.options.max,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter,
        message: this.options.message || 'Rate limit exceeded'
      }
    }
    
    // Increment counter
    record.count++
    
    return {
      success: true,
      limit: this.options.max,
      remaining: this.options.max - record.count,
      resetTime: record.resetTime
    }
  }
  
  private cleanup() {
    const now = Date.now()
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key)
      }
    }
  }
}