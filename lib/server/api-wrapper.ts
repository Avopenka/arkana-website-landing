// Server-only API wrapper to hide sensitive keys
import { NextRequest } from 'next/server'

// These keys are only available server-side
const SENSITIVE_KEYS = {
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET: process.env.STRIPE_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY
}

// Validate that we're running server-side
export function assertServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error('This module can only be imported server-side')
  }
}

// Get sensitive key with validation
export function getSensitiveKey(key: keyof typeof SENSITIVE_KEYS): string {
  assertServerOnly()
  
  const value = SENSITIVE_KEYS[key]
  if (!value) {
    throw new Error(`Missing required environment variable for ${key}`)
  }
  
  return value
}

// Create authenticated Supabase admin client
export function createAdminClient() {
  assertServerOnly()
  
  const { createClient } = require('@supabase/supabase-js')
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSensitiveKey('SUPABASE_SERVICE_ROLE'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}