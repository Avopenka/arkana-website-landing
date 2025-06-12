import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
// Rate limiter middleware
export function rateLimit(
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const userLimit = rateLimitStore.get(ip);
    if (!userLimit || userLimit.resetAt < now) {
      rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      return null; // Allow request
    }
    if (userLimit.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    userLimit.count++;
    return null; // Allow request
  };
}
// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}
// Validate input to prevent SQL injection
export function validateInput(input: any, schema: {
  type: 'string' | 'number' | 'email';
  maxLength?: number;
  pattern?: RegExp;
}): boolean {
  if (schema.type === 'string') {
    if (typeof input !== 'string') return false;
    if (schema.maxLength && input.length > schema.maxLength) return false;
    if (schema.pattern && !schema.pattern.test(input)) return false;
    // Check for SQL injection patterns
    const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|--|\/\*|\*\/)/i;
    if (sqlPatterns.test(input)) return false;
  }
  if (schema.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) return false;
  }
  if (schema.type === 'number') {
    if (isNaN(Number(input))) return false;
  }
  return true;
}
// API key authentication
export async function authenticateAPIKey(req: NextRequest): Promise<boolean> {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) return false;
  // In production, check against database
  // For now, check against environment variable
  const validApiKey = process.env.INTERNAL_API_KEY;
  return apiKey === validApiKey;
}
// Sanitize error messages
export function sanitizeError(error: any): { message: string; code: string } {
  // Never expose internal error details
   // Log for debugging
  return {
    message: 'An error occurred processing your request',
    code: 'INTERNAL_ERROR'
  };
}