import { NextRequest, NextResponse } from 'next/server'
import * as crypto from 'node:crypto'

const CSRF_HEADER = 'x-csrf-token'
const CSRF_COOKIE = 'csrf-token'

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function validateCSRFToken(request: NextRequest): Promise<boolean> {
  // Skip CSRF for GET requests
  if (request.method === 'GET') return true
  
  const token = request.headers.get(CSRF_HEADER)
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value
  
  if (!token || !cookieToken) return false
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(cookieToken)
  )
}

export function withCSRFProtection(handler: Function) {
  return async (request: NextRequest, ...args: unknown[]) => {
    // Validate CSRF token
    const isValid = await validateCSRFToken(request)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }
    
    return handler(request, ...args)
  }
}

export function setCSRFToken(response: NextResponse): NextResponse {
  const token = generateCSRFToken()
  
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  })
  
  response.headers.set(CSRF_HEADER, token)
  
  return response
}