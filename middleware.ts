import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/auth-helpers'
// Rate limiting for API endpoints
const rateLimit = new Map<string, { count: number; lastReset: number }>()
function getRateLimitKey(req: NextRequest, endpoint: string): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `${endpoint}_${ip}`
}
function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const current = rateLimit.get(key)
  if (!current || (now - current.lastReset) > windowMs) {
    rateLimit.set(key, { count: 1, lastReset: now })
    return true
  }
  if (current.count >= limit) {
    return false
  }
  current.count++
  return true
}
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  // PACA V12 - Agent Epsilon: Enhanced Security Headers
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  res.headers.set('X-DNS-Prefetch-Control', 'on')
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Enhanced Content Security Policy
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://js.stripe.com https://vercel.live https://*.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://api.forwardemail.net; frame-src 'self' https://checkout.stripe.com https://js.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
  )
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    )
  }
  // Rate limiting for beta validation API
  if (req.nextUrl.pathname === '/api/beta/validate') {
    const rateLimitKey = getRateLimitKey(req, 'beta_validate')
    const allowed = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000) // 10 requests per 15 minutes
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ 
          valid: false, 
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
  // Rate limiting for other sensitive endpoints
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitKey = getRateLimitKey(req, 'api_general')
    const allowed = checkRateLimit(rateLimitKey, 100, 60 * 1000) // 100 requests per minute
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.'
        }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
  // Only create Supabase client if we have the required env vars
  let session: any = null;
  try {
    const supabase = createMiddlewareClient({ req, res })
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      session = data.session
    }
  } catch (error) {
    // Continue without session - public routes should still work
  }
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    
    try {
      const supabase = createMiddlewareClient({ req, res })
      if (supabase) {
        // Check admin_access in user_profiles table
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('admin_access')
          .eq('id', session.user.id)
          .single()
        
        if (!profile?.admin_access) {
          return NextResponse.redirect(new URL('/', req.url))
        }
      }
    } catch (error) {
      // If we can't verify admin access, redirect to home
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  return res
}
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/automation-metrics',
    '/api/beta/:path*',
    '/api/:path*'
  ]
}