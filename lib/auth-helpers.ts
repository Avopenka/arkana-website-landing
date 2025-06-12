/**
 * Auth Helpers - Safe wrappers for external service initialization
 * Handles missing API keys gracefully during build time
 */

import { createRouteHandlerClient as originalCreateRouteHandlerClient, createMiddlewareClient as originalCreateMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Build-time detection
export const isBuildTime = () => false

// Mock Supabase client for build time
const mockSupabaseClient = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Authentication not available during build', code: 'BUILD_TIME' } }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Authentication not available', code: 'NO_AUTH' } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Authentication not available', code: 'NO_AUTH' } }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Database not available during build' } }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        neq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      single: () => Promise.resolve({ data: null, error: { message: 'Database not available during build' } }),
      head: () => Promise.resolve({ count: 0, error: null })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Database not available during build' } })
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Database not available during build' } })
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ error: null })
    })
  }),
  rpc: (functionName: string, params?: any) => Promise.resolve({ data: null, error: { message: 'RPC not available during build' } })
}

/**
 * Safe Supabase client for route handlers
 */
export function createRouteHandlerClient(options = {}) {
  if (isBuildTime() || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mockSupabaseClient as any
  }
  
  try {
    return originalCreateRouteHandlerClient({ cookies, ...options })
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return mockSupabaseClient as any
  }
}

/**
 * Alias for backward compatibility
 */
export function getSafeSupabaseRouteClient() {
  return createRouteHandlerClient()
}

/**
 * Safe Supabase client for middleware
 */
export function createMiddlewareClient(options: any) {
  if (isBuildTime() || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mockSupabaseClient as any
  }
  
  try {
    return originalCreateMiddlewareClient(options)
  } catch (error) {
    console.error('Error creating Supabase middleware client:', error)
    return mockSupabaseClient as any
  }
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: any, message = 'Authentication required') {
  if (isBuildTime()) {
    return NextResponse.json({ 
      error: 'Service temporarily unavailable',
      code: 'BUILD_TIME' 
    }, { status: 503 })
  }

  if (error?.code === 'BUILD_TIME' || error?.code === 'NO_AUTH') {
    return NextResponse.json({ 
      error: 'Authentication service not configured',
      code: error.code 
    }, { status: 503 })
  }

  return NextResponse.json({ 
    error: error?.message || message 
  }, { status: 401 })
}

/**
 * Safe Stripe client initialization with dynamic import
 */
export async function getStripeInstance() {
  if (!(!isBuildTime() && process.env.STRIPE_SECRET_KEY)) {
    return null
  }
  
  try {
    // Dynamic import to avoid Edge Runtime issues
    const { default: Stripe } = await import('stripe')
    return new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    })
  } catch (error) {
    console.error('Error initializing Stripe:', error)
    return null
  }
}

/**
 * Alias for backward compatibility
 */
export async function getSafeStripeClient() {
  return await getStripeInstance()
}

/**
 * Check if required services are configured
 */
export function getServiceStatus() {
  return {
    supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    buildTime: isBuildTime()
  }
}

/**
 * Consistent error response for unconfigured services
 */
export function createServiceUnavailableResponse(service: string) {
  return NextResponse.json(
    { 
      error: `${service} service is not configured`,
      message: 'This feature will be available once the backend is properly configured'
    },
    { status: 503 }
  )
}

/**
 * Build-time response for API routes
 */
export function createBuildTimeResponse() {
  return NextResponse.json(
    { 
      error: 'Service unavailable during build',
      message: 'This API route is not available during the build process'
    },
    { status: 503 }
  )
}