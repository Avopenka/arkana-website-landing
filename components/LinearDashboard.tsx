'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LinearMetric {
  id: string;
  title: string;
  description: string;
  priority: string;
  created_at: string;
  metric_type: 'wave' | 'revenue' | 'feature';
  data: Record<string, unknown>;
}

export default function LinearDashboard() {
  const [metrics, setMetrics] = useState<LinearMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    loadMetrics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('linear-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'linear_metrics'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMetrics(prev => [payload.new as LinearMetric, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadMetrics() {
    const { data, error } = await supabase
      .from('linear_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setMetrics(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="animate-pulse">Loading metrics...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Launch Metrics</h2>
      
      {/* Wave Progress */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl mb-4">Wave Tracking</h3>
        {metrics
          .filter(m => m.metric_type === 'wave')
          .map(metric => (
            <div key={metric.id} className="mb-3">
              <div className="flex justify-between">
                <span>{metric.title}</span>
                <span className="text-brand-teal">{metric.data.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-brand-teal to-accent-gold h-full rounded-full"
                  style={{ width: `${metric.data.progress}%` }}
                />
              </div>
            </div>
          ))}
      </div>

      {/* Revenue Metrics */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl mb-4">Revenue Tracking</h3>
        {metrics
          .filter(m => m.metric_type === 'revenue')
          .map(metric => (
            <div key={metric.id} className="flex justify-between mb-2">
              <span>{metric.title}</span>
              <span className="text-accent-gold font-bold">
                €{metric.data.value}
              </span>
            </div>
          ))}
      </div>

      {/* Recent Issues */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl mb-4">Recent Updates</h3>
        <div className="space-y-2">
          {metrics.slice(0, 5).map(metric => (
            <div key={metric.id} className="text-sm">
              <span className="text-neutral-gray">
                {new Date(metric.created_at).toLocaleTimeString()}
              </span>
              <span className="ml-2">{metric.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}