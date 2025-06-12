import { z } from 'zod'
import jwt from 'jsonwebtoken'
// Input validation schemas
export const userRegistrationSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  wave: z.number().int().min(0).max(7),
})
export const webhookSchema = z.object({
  type: z.string(),
  data: z.object({}).passthrough(),
})
export const checkoutSchema = z.object({
  wave: z.number().int().min(0).max(7),
  billing_cycle: z.enum(['monthly', 'yearly']),
  user_email: z.string().email(),
})
// JWT utilities
export function generateSecureJWT(payload: any, expiresIn = '24h'): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }
  return jwt.sign(payload, secret, { 
    expiresIn: expiresIn,
    issuer: 'arkana.chat',
    audience: 'arkana-users'
  } as jwt.SignOptions)
}
export function verifyJWT(token: string): any {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }
  return jwt.verify(token, secret, {
    issuer: 'arkana.chat',
    audience: 'arkana-users'
  })
}
// Security headers
export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' js.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' *.stripe.com *.supabase.co;
      frame-src js.stripe.com;
    `.replace(/\s+/g, ' ').trim(),
  }
}
// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000) // Limit length
}
// Verify webhook signatures
export function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    stripe.webhooks.constructEvent(payload, signature, secret)
    return true
  } catch (err) {
    return false
  }
}
export function verifyLinearSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}
// Error handling without exposing sensitive info
export function createSecureErrorResponse(
  error: unknown,
  fallbackMessage = 'Internal server error'
): Response {
   // Log for debugging
  return new Response(
    JSON.stringify({ 
      error: fallbackMessage,
      timestamp: new Date().toISOString()
    }),
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getSecurityHeaders()
      }
    }
  )
}