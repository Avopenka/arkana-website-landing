'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'creators', label: 'Creators', icon: '👥' },
    { id: 'content', label: 'Content', icon: '🎨' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'paas', label: 'PaaS System', icon: '🔧' },
  ];

  const tiers = [
    { 
      name: 'Apprentice',
      revenue: '60%',
      requirements: 'Starting tier',
      creators: 45,
      color: 'from-gray-500 to-gray-400'
    },
    { 
      name: 'Artisan',
      revenue: '65%',
      requirements: '€1,000 total earnings',
      creators: 32,
      color: 'from-blue-500 to-blue-400'
    },
    { 
      name: 'Master',
      revenue: '70%',
      requirements: '€5,000 + 50 subscribers',
      creators: 18,
      color: 'from-purple-500 to-purple-400'
    },
    { 
      name: 'Grandmaster',
      revenue: '75%',
      requirements: '€25,000 + quality score',
      creators: 8,
      color: 'from-amber-500 to-amber-400'
    },
    { 
      name: 'Sage',
      revenue: '80%',
      requirements: '€100,000 + mentorship',
      creators: 3,
      color: 'from-cyan-500 to-cyan-400'
    },
    { 
      name: 'Legend',
      revenue: '85%',
      requirements: 'Exceptional impact',
      creators: 1,
      color: 'from-red-500 to-red-400'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2">Creator Studio</h1>
        <p className="text-gray-400 font-light">
          Manage the creator ecosystem and PaaS (Platform as a Service) system.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-light transition-all duration-300 flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] text-gray-400 hover:bg-white/[0.05] hover:border-white/[0.12]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Creators', value: '107', change: '+15%' },
              { label: 'Monthly Revenue', value: '€287K', change: '+23%' },
              { label: 'Content Created', value: '3,421', change: '+42%' },
              { label: 'Avg Creator Revenue', value: '€2,682', change: '+18%' },
            ].map((metric) => (
              <motion.div
                key={metric.label}
                className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                <p className="text-2xl text-white font-light mb-1">{metric.value}</p>
                <p className="text-xs text-green-400">{metric.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Creator Tiers */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-light text-white mb-6">Creator Progression Tiers</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {tiers.map((tier) => (
                <motion.div
                  key={tier.name}
                  className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${tier.color} bg-opacity-20 mb-3`}>
                    <span className="text-sm font-medium text-white">{tier.name}</span>
                  </div>
                  <p className="text-2xl text-white font-light mb-2">{tier.revenue}</p>
                  <p className="text-xs text-gray-400 mb-3">{tier.requirements}</p>
                  <p className="text-sm text-gray-300">{tier.creators} creators</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'paas' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* PaaS Overview */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xl font-light text-white mb-4">Platform as a Service System</h2>
            <p className="text-gray-400 mb-6">
              Our revolutionary 6-tier creator progression system with industry-leading revenue shares.
            </p>
            
            {/* Revenue Flow Visualization */}
            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <h3 className="text-lg text-white mb-4">Revenue Distribution Model</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Creator Share</span>
                  <span className="text-xl text-cyan-400 font-light">60% - 85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Platform Share</span>
                  <span className="text-xl text-purple-400 font-light">40% - 15%</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Creator Earnings</span>
                  <span className="text-xl text-green-400 font-light">€2,682/month</span>
                </div>
              </div>
            </div>

            {/* PaaS Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { feature: 'AI Content Tools', status: 'Active', usage: '89%' },
                { feature: 'Analytics Dashboard', status: 'Active', usage: '76%' },
                { feature: 'Collaboration Hub', status: 'Beta', usage: '42%' },
                { feature: 'Revenue Optimizer', status: 'Active', usage: '91%' },
              ].map((item) => (
                <div key={item.feature} className="p-4 bg-white/[0.02] rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-light">{item.feature}</h4>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Usage</span>
                    <span className="text-sm text-white">{item.usage}</span>
                  </div>
                  <div className="mt-2 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: item.usage }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { action: 'Onboard Creator', icon: '👤', color: 'from-green-500 to-green-400' },
              { action: 'Generate Report', icon: '📊', color: 'from-blue-500 to-blue-400' },
              { action: 'Configure Tiers', icon: '⚙️', color: 'from-purple-500 to-purple-400' },
            ].map((action) => (
              <motion.button
                key={action.action}
                className={`p-6 rounded-xl bg-gradient-to-r ${action.color} bg-opacity-10 border border-white/[0.08] hover:bg-opacity-20 transition-all duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="text-sm text-white font-light">{action.action}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}