import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter } from '@/lib/rate-limiter'

// Initialize rate limiters for different endpoints
const loginLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later'
})

const signupLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 signups per hour
  message: 'Too many signup attempts, please try again later'
})

export async function withRateLimit(
  request: NextRequest,
  endpoint: 'login' | 'signup' | 'general'
) {
  const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'
  
  const limiter = endpoint === 'login' ? loginLimiter : 
                  endpoint === 'signup' ? signupLimiter : 
                  null
  
  if (limiter) {
    const result = await limiter.check(ip)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { 
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
          }
        }
      )
    }
  }
  
  return null
}