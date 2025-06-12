// Environment variable validation
const requiredEnvVars = {
  // Public variables (safe to expose)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  
  // Server-only variables (never expose)
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY
}

// Validate environment on startup
export function validateEnvironment() {
  const missing: string[] = []
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key)
    }
  }
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    
    // Only throw in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
  
  // Ensure sensitive keys are not exposed
  if (typeof window !== 'undefined') {
    const exposed = Object.keys(requiredEnvVars).filter(key => 
      !key.startsWith('NEXT_PUBLIC_') && (window as any)[key]
    )
    
    if (exposed.length > 0) {
      console.error('SECURITY WARNING: Sensitive keys exposed to client:', exposed)
    }
  }
}