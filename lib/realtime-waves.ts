// Supabase real-time integration for Genesis Wave management
// Agent Gamma: Supabase real-time architect
'use client'
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { WAVES, getWaveProgress } from './wave-management';
export interface WaveSubscription {
  waveNumber: number;
  tier: string;
  currentSeats: number;
  totalSeats: number;
  velocity: number; // seats filled per hour
  lastUpdated: string;
  recentSignups: WaveSignup[];
}
export interface WaveSignup {
  id: string;
  pioneerNumber: number;
  tier: string;
  timestamp: string;
  location?: string; // Optional for social proof
  firstName?: string; // Optional, anonymized
}
export interface RealtimeWaveManager {
  subscribe: (callback: (update: WaveSubscription) => void) => () => void;
  getCurrentWave: () => Promise<WaveSubscription | null>;
  recordSignup: (signup: Omit<WaveSignup, 'id' | 'timestamp'>) => Promise<void>;
  getRecentActivity: () => Promise<WaveSignup[]>;
}
class SupabaseWaveManager implements RealtimeWaveManager {
  private subscribers: ((update: WaveSubscription) => void)[] = [];
  private realtimeChannel: any = null;
  constructor() {
    this.initializeRealtimeSubscription();
  }
  private initializeRealtimeSubscription() {
    // Subscribe to wave_signups table for real-time updates
    this.realtimeChannel = supabase
      .channel('wave_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wave_signups'
        },
        (payload) => {
          this.handleRealtimeUpdate(payload);
        }
      )
      .subscribe();
  }
  private async handleRealtimeUpdate(payload: any) {
    // Fetch updated wave data and notify subscribers
    const currentWave = await this.getCurrentWave();
    if (currentWave) {
      this.notifySubscribers(currentWave);
    }
  }
  private notifySubscribers(update: WaveSubscription) {
    this.subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
      }
    });
  }
  async getCurrentWave(): Promise<WaveSubscription | null> {
    try {
      // Get current wave statistics
      const { data: signupCounts, error: countError } = await supabase
        .rpc('get_wave_signup_counts');
      if (countError) {
        return null;
      }
      // Find the current active wave
      for (const wave of WAVES) {
        const seatsClaimed = signupCounts?.[wave.tier] || 0;
        const progress = getWaveProgress(wave, seatsClaimed);
        if (progress.status !== 'full') {
          // Calculate velocity (signups in last hour)
          const { data: recentSignups, error: velocityError } = await supabase
            .from('wave_signups')
            .select('created_at')
            .eq('tier', wave.tier)
            .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
          const velocity = recentSignups?.length || 0;
          // Get recent signups for social proof
          const recentActivity = await this.getRecentActivity();
          return {
            waveNumber: wave.number,
            tier: wave.tier,
            currentSeats: seatsClaimed,
            totalSeats: wave.maxSeats,
            velocity,
            lastUpdated: new Date().toISOString(),
            recentSignups: recentActivity
          };
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  async recordSignup(signup: Omit<WaveSignup, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('wave_signups')
        .insert({
          pioneer_number: signup.pioneerNumber,
          tier: signup.tier,
          location: signup.location,
          first_name: signup.firstName,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
  async getRecentActivity(): Promise<WaveSignup[]> {
    try {
      const { data, error } = await supabase
        .from('wave_signups')
        .select('id, pioneer_number, tier, created_at, location, first_name')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) {
        return [];
      }
      return data?.map(signup => ({
        id: signup.id,
        pioneerNumber: signup.pioneer_number,
        tier: signup.tier,
        timestamp: signup.created_at,
        location: signup.location,
        firstName: signup.first_name
      })) || [];
    } catch (error) {
      return [];
    }
  }
  subscribe(callback: (update: WaveSubscription) => void): () => void {
    this.subscribers.push(callback);
    // Send initial data
    this.getCurrentWave().then(wave => {
      if (wave) callback(wave);
    });
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }
  destroy() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }
    this.subscribers = [];
  }
}
// Singleton instance
let waveManager: SupabaseWaveManager | null = null;
export function getWaveManager(): RealtimeWaveManager {
  if (!waveManager) {
    waveManager = new SupabaseWaveManager();
  }
  return waveManager;
}
// React hook for wave updates
export function useRealtimeWaves() {
  const [waveData, setWaveData] = useState<WaveSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Only initialize on client-side to prevent SSR issues
    if (typeof window === 'undefined') return;
    // Add delay to prevent hydration issues
    const timer = setTimeout(() => {
      try {
        const manager = getWaveManager();
        setIsLoading(true);
        const unsubscribe = manager.subscribe((update) => {
          setWaveData(update);
          setIsLoading(false);
          setError(null);
        });
        // Handle errors gracefully
        manager.getCurrentWave().catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
        return unsubscribe;
      } catch (err) {
        setIsLoading(false);
        setError('Wave manager unavailable');
      }
    }, 500); // 500ms delay for hydration
    return () => clearTimeout(timer);
  }, []);
  const recordSignup = async (signup: Omit<WaveSignup, 'id' | 'timestamp'>) => {
    try {
      const manager = getWaveManager();
      await manager.recordSignup(signup);
    } catch (err: unknown) {
      setError(err.message);
      throw err;
    }
  };
  return {
    waveData,
    isLoading,
    error,
    recordSignup
  };
}
// Utility functions for social proof
export function generateSocialProofMessage(recentSignups: WaveSignup[]): string {
  if (recentSignups.length === 0) return '';
  const latest = recentSignups[0];
  const timeAgo = getTimeAgo(latest.timestamp);
  if (latest.firstName && latest.location) {
    return `${latest.firstName} from ${latest.location} just joined • ${timeAgo}`;
  } else if (latest.location) {
    return `Someone from ${latest.location} just joined • ${timeAgo}`;
  } else {
    return `Pioneer #${latest.pioneerNumber} just joined • ${timeAgo}`;
  }
}
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
// SQL to create the required table in Supabase:
/*
CREATE TABLE wave_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pioneer_number INTEGER NOT NULL,
  tier TEXT NOT NULL,
  location TEXT,
  first_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS policies
ALTER TABLE wave_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wave signups" ON wave_signups
  FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert" ON wave_signups
  FOR INSERT WITH CHECK (true);
-- Function to get signup counts by tier
CREATE OR REPLACE FUNCTION get_wave_signup_counts()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_object_agg(tier, count)
  FROM (
    SELECT tier, COUNT(*) as count
    FROM wave_signups
    GROUP BY tier
  ) subquery
  INTO result;
  RETURN COALESCE(result, '{}'::JSON);
END;
$$ LANGUAGE plpgsql;
*/