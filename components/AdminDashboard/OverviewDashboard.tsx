'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function OverviewDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
    growth: 0,
    serverStatus: 'operational',
    apiCalls: 0,
    storageUsed: 0,
    activeCreators: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch user stats
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('beta_access', true);

    const { count: activeCreators } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('creator_status', 'active');

    setStats({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      revenue: 125000, // Placeholder
      growth: 23.5,
      serverStatus: 'operational',
      apiCalls: 45231,
      storageUsed: 67.3,
      activeCreators: activeCreators || 0
    });
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: '👥',
      color: 'from-cyan-500 to-cyan-400'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      change: '+8%',
      icon: '🚀',
      color: 'from-purple-500 to-purple-400'
    },
    {
      title: 'Revenue',
      value: `€${stats.revenue.toLocaleString()}`,
      change: `+${stats.growth}%`,
      icon: '💰',
      color: 'from-green-500 to-green-400'
    },
    {
      title: 'Active Creators',
      value: stats.activeCreators.toLocaleString(),
      change: '+15%',
      icon: '🎨',
      color: 'from-amber-500 to-amber-400'
    }
  ];

  const systemMetrics = [
    {
      label: 'Server Status',
      value: stats.serverStatus,
      status: 'healthy'
    },
    {
      label: 'API Calls (24h)',
      value: stats.apiCalls.toLocaleString(),
      status: 'normal'
    },
    {
      label: 'Storage Used',
      value: `${stats.storageUsed}%`,
      status: stats.storageUsed > 80 ? 'warning' : 'healthy'
    },
    {
      label: 'System Load',
      value: '2.3',
      status: 'healthy'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400 font-light">
          Welcome back, Admin. Here's what's happening with Arkana today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className={`text-xs px-2 py-1 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 text-white`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm text-gray-400 font-light mb-1">{stat.title}</h3>
            <p className="text-2xl text-white font-light">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
        >
          <h2 className="text-xl font-light text-white mb-4">System Metrics</h2>
          <div className="space-y-4">
            {systemMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between">
                <span className="text-gray-400 font-light">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-light">{metric.value}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    metric.status === 'healthy' ? 'bg-green-400' :
                    metric.status === 'warning' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
        >
          <h2 className="text-xl font-light text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New user signup', user: 'john@example.com', time: '2 min ago' },
              { action: 'Creator application', user: 'sarah@studio.com', time: '15 min ago' },
              { action: 'Payment received', user: 'mike@tech.com', time: '1 hour ago' },
              { action: 'API key generated', user: 'dev@company.com', time: '2 hours ago' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
              >
                <div>
                  <p className="text-sm text-white font-light">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
      >
        <h2 className="text-xl font-light text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Generate Report', icon: '📊', color: 'from-cyan-500 to-cyan-400' },
            { label: 'Send Announcement', icon: '📢', color: 'from-purple-500 to-purple-400' },
            { label: 'Export Data', icon: '💾', color: 'from-green-500 to-green-400' },
            { label: 'System Backup', icon: '🔒', color: 'from-amber-500 to-amber-400' },
          ].map((action) => (
            <motion.button
              key={action.label}
              className={`p-4 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-10 border border-white/[0.08] hover:bg-opacity-20 transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-sm text-white font-light">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}