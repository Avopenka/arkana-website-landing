import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const SESSION_COOKIE = 'arkana-session'
const REFRESH_THRESHOLD = 5 * 60 * 1000 // Refresh if less than 5 min left

interface SessionPayload {
  userId: string
  email: string
  exp: number
  iat: number
}

export async function validateSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  
  if (!token) return null
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload
    
    // Check if expired
    if (Date.now() >= payload.exp * 1000) {
      return null
    }
    
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string, email: string): Promise<string> {
  const payload: SessionPayload = {
    userId,
    email,
    exp: Math.floor((Date.now() + SESSION_TIMEOUT) / 1000),
    iat: Math.floor(Date.now() / 1000)
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET!)
}

export async function refreshSessionIfNeeded(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const session = await validateSession(request)
  
  if (!session) return response
  
  // Check if session needs refresh
  const timeLeft = (session.exp * 1000) - Date.now()
  
  if (timeLeft < REFRESH_THRESHOLD) {
    // Create new session token
    const newToken = await createSession(session.userId, session.email)
    
    // Set new cookie
    response.cookies.set(SESSION_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT / 1000
    })
  }
  
  return response
}

// Middleware to check session on protected routes
export async function withSessionValidation(handler: Function) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const session = await validateSession(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      )
    }
    
    // Add session to request
    (request as any).session = session
    
    return handler(request, ...args)
  }
}