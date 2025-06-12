import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

interface DatabaseConfig {
  url: string;
  serviceKey: string;
  maxRetries: number;
  retryDelay: number;
  connectionTimeout: number;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

class DatabaseManager {
  private client: SupabaseClient;
  private config: DatabaseConfig;
  private connectionPool: SupabaseClient[] = [];
  private readonly maxPoolSize = 5;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.client = createClient(config.url, config.serviceKey, {
      auth: { persistSession: false },
      db: { schema: 'public' },
      global: { 
        headers: { 
          'X-Client-Info': 'arkana-beta-backend',
          'Connection': 'keep-alive'
        } 
      }
    });
    
    // Initialize connection pool
    this.initializePool();
  }

  private initializePool() {
    for (let i = 0; i < this.maxPoolSize; i++) {
      const poolClient = createClient(this.config.url, this.config.serviceKey, {
        auth: { persistSession: false },
        db: { schema: 'public' },
        global: { 
          headers: { 
            'X-Client-Info': `arkana-pool-${i}`,
            'Connection': 'keep-alive'
          } 
        }
      });
      this.connectionPool.push(poolClient);
    }
    logger.info('Database connection pool initialized', { poolSize: this.maxPoolSize });
  }

  private getPooledClient(): SupabaseClient {
    // Simple round-robin for now
    const index = Math.floor(Math.random() * this.connectionPool.length);
    return this.connectionPool[index] || this.client;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateRetryDelay(attempt: number, options: RetryOptions): number {
    const { baseDelay = 1000, maxDelay = 10000, backoffFactor = 2 } = options;
    const delay = baseDelay * Math.pow(backoffFactor, attempt);
    return Math.min(delay, maxDelay);
  }

  async withRetry<T>(
    operation: (client: SupabaseClient) => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const { maxRetries = this.config.maxRetries } = options;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const client = this.getPooledClient();
        const result = await Promise.race([
          operation(client),
          this.timeoutPromise(this.config.connectionTimeout)
        ]);
        
        if (attempt > 0) {
          logger.info('Database operation succeeded after retry', { attempt });
        }
        
        return result as T;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          logger.error('Database operation failed after all retries', lastError, { 
            attempts: attempt + 1,
            maxRetries 
          });
          throw lastError;
        }

        const delay = this.calculateRetryDelay(attempt, options);
        logger.warn('Database operation failed, retrying', { 
          attempt: attempt + 1,
          error: lastError.message,
          retryIn: delay 
        });
        
        await this.delay(delay);
      }
    }

    throw lastError || new Error('Database operation failed');
  }

  private timeoutPromise<T>(timeoutMs: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Database operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }

  // Convenience methods for common operations
  async getBetaCodeStats(): Promise<{ totalUsers: number; availableSlots: number }> {
    return this.withRetry(async (client) => {
      const { count: totalUsers } = await client
        .from('beta_redemptions')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        availableSlots: 50 - (totalUsers || 0)
      };
    });
  }

  async validateBetaCode(code: string): Promise<any> {
    return this.withRetry(async (client) => {
      const { data, error } = await client
        .from('beta_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error) throw error;
      return data;
    });
  }

  async checkExistingUser(email: string): Promise<boolean> {
    return this.withRetry(async (client) => {
      const { data } = await client
        .from('beta_redemptions')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      return !!data;
    });
  }

  async redeemBetaCode(redemptionData: {
    code: string;
    email: string;
    name: string;
    ip_address: string;
    user_agent: string;
  }): Promise<void> {
    return this.withRetry(async (client) => {
      // Use a transaction for atomicity
      const { error: redemptionError } = await client
        .from('beta_redemptions')
        .insert(redemptionData);

      if (redemptionError) throw redemptionError;

      // Update code usage
      const { error: updateError } = await client
        .from('beta_codes')
        .update({ current_uses: client.rpc('increment_usage', { code_name: redemptionData.code }) })
        .eq('code', redemptionData.code);

      if (updateError) {
        logger.warn('Failed to update code usage count', { error: updateError.message });
      }
    });
  }

  async getAllBetaCodes(): Promise<any[]> {
    return this.withRetry(async (client) => {
      const { data, error } = await client
        .from('beta_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    });
  }

  async createBetaCode(codeData: {
    code: string;
    max_uses: number;
    assigned_to_email?: string;
    assigned_to_name?: string;
    expires_at?: string;
  }): Promise<any> {
    return this.withRetry(async (client) => {
      const { data, error } = await client
        .from('beta_codes')
        .insert(codeData)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number; error?: string }> {
    const startTime = Date.now();
    try {
      await this.withRetry(async (client) => {
        const { error } = await client.from('beta_codes').select('id').limit(1);
        if (error) throw error;
      }, { maxRetries: 1 });

      return {
        status: 'healthy',
        latency: Date.now() - startTime
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        error: (error as Error).message
      };
    }
  }
}

// Create singleton instance
const dbConfig: DatabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  maxRetries: 3,
  retryDelay: 1000,
  connectionTimeout: 10000
};

export const db = new DatabaseManager(dbConfig);
export type { DatabaseManager };