import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
// Get environment variables with defaults for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Enhanced Supabase client with better error handling and auto-recovery
function getSupabaseClient() {
  // Check if we have valid configuration
  const hasValidConfig = supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder') &&
    supabaseUrl.startsWith('https://');
  
  if (!hasValidConfig) {
    console.warn('🔧 Supabase configuration missing or using placeholders');
    return createMockClient();
  }
  
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey
        }
      }
    });

    // Test the connection with a simple query
    Promise.resolve(client.from('user_profiles').select('count', { count: 'exact', head: true }))
      .then(({ error }) => {
        if (error && error.message.includes('relation "user_profiles" does not exist')) {
          console.warn('⚠️  Database tables not found. Please run the schema setup.');
        }
      })
      .catch(() => {
        // Silently handle connection test errors
      });
    
    return client;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    return createMockClient();
  }
}

function createMockClient() {
  return {
    from: (table: string) => ({
      select: (columns?: string, options?: any) => ({
        single: () => ({ 
          data: null, 
          error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
        }),
        eq: (column: string, value: any) => ({ 
          single: () => ({ 
            data: null, 
            error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
          }),
          head: () => ({ count: 0, error: null })
        }),
        head: () => ({ count: 0, error: null }),
        gte: () => ({ single: () => ({ data: null, error: null }) }),
        or: () => ({ single: () => ({ data: null, error: null }) })
      }),
      insert: (data: any) => ({
        select: () => ({ 
          single: () => ({ 
            data: null, 
            error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
          }) 
        })
      }),
      upsert: (data: any) => ({
        select: () => ({ 
          single: () => ({ 
            data: null, 
            error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
          }) 
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({ 
          data: null, 
          error: null 
        })
      })
    }),
    rpc: () => ({ 
      data: null, 
      error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
    }),
    auth: { 
      signUp: (credentials: any) => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
      }),
      signInWithPassword: (credentials: any) => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: new Error('Authentication service is being configured. Please check back in a few minutes.') 
      }),
      getSession: () => Promise.resolve({ 
        data: { session: null }, 
        error: null 
      }),
      getUser: () => Promise.resolve({ 
        data: { user: null }, 
        error: null 
      }),
      signOut: () => Promise.resolve({ error: null })
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({})
    }),
    removeChannel: () => ({})
  } as any;
}
// Client for public operations
export const supabase = getSupabaseClient();
// Admin client for server operations (only create if service role key exists)
function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || !supabaseUrl) {
    return null;
  }
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
export const supabaseAdmin = getSupabaseAdmin();
// Database types
export interface License {
  id: string;
  stripe_customer_id: string;
  stripe_subscription_id?: string;
  tier: 'founder_29' | 'founder_34' | 'elite_39' | 'elite_39_yr';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  created_at: string;
  expires_at?: string;
  jwt_token?: string;
  device_hash?: string;
  activation_count: number;
  max_activations: number;
  metadata?: any;
}
export interface Customer {
  id: string;
  stripe_customer_id: string;
  email: string;
  name?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}
// JWT generation for new schema
export function generateLicenseJWT(params: {
  tier: string;
  email: string;
  customer_id: string;
  subscription_id: string;
  exp: number;
}): string {
  const payload = {
    tier: params.tier,
    email: params.email,
    customer_id: params.customer_id,
    subscription_id: params.subscription_id,
    exp: params.exp,
    iat: Math.floor(Date.now() / 1000),
    iss: 'arkana.chat',
    ent: ['mac', 'ios'], // entitlements
  };
  // For now, use HS256 with symmetric key (switch to RS256 in production)
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key-here', { 
    algorithm: 'HS256',
  });
}
// License key generation
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  const key = Array.from({ length: segments }, () =>
    Array.from({ length: segmentLength }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  ).join('-');
  return key;
}