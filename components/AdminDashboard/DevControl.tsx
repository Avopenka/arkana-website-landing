'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function DevControl() {
  const [activeTab, setActiveTab] = useState('deployment');
  const [deployments, setDeployments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);

  const tabs = [
    { id: 'deployment', label: 'Deployments', icon: '🚀' },
    { id: 'database', label: 'Database', icon: '🗄️' },
    { id: 'api', label: 'API Management', icon: '🔌' },
    { id: 'logs', label: 'System Logs', icon: '📋' },
    { id: 'monitoring', label: 'Monitoring', icon: '📊' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2">Developer Control Center</h1>
        <p className="text-gray-400 font-light">
          Manage deployments, monitor systems, and control technical infrastructure.
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

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'deployment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Deployment Status */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-light text-white mb-4">Current Deployments</h2>
              <div className="space-y-4">
                {[
                  { env: 'Production', status: 'active', version: 'v2.4.1', lastDeploy: '2 hours ago' },
                  { env: 'Staging', status: 'building', version: 'v2.5.0-beta', lastDeploy: '15 min ago' },
                  { env: 'Development', status: 'active', version: 'v2.5.0-dev', lastDeploy: '5 min ago' },
                ].map((deployment) => (
                  <div key={deployment.env} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl">
                    <div>
                      <h3 className="text-white font-light">{deployment.env}</h3>
                      <p className="text-sm text-gray-400">Version: {deployment.version}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">{deployment.lastDeploy}</span>
                      <div className={`px-3 py-1 rounded-lg text-xs font-light ${
                        deployment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        deployment.status === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {deployment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Actions */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { action: 'Deploy to Production', icon: '🚀', color: 'from-green-500 to-green-400' },
                { action: 'Rollback', icon: '⏪', color: 'from-amber-500 to-amber-400' },
                { action: 'View Build Logs', icon: '📋', color: 'from-blue-500 to-blue-400' },
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

        {activeTab === 'database' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
          >
            <h2 className="text-xl font-light text-white mb-4">Database Management</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Database Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Records', value: '1.2M' },
                    { label: 'Database Size', value: '4.7 GB' },
                    { label: 'Active Connections', value: '127' },
                    { label: 'Query Performance', value: '12ms avg' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between">
                      <span className="text-gray-400">{stat.label}</span>
                      <span className="text-white font-light">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Quick Actions</h3>
                <div className="space-y-2">
                  {['Run Migration', 'Backup Database', 'Optimize Tables', 'View Schema'].map((action) => (
                    <motion.button
                      key={action}
                      className="w-full px-4 py-2 text-left bg-white/[0.02] rounded-lg hover:bg-white/[0.05] transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-white">API Keys Management</h2>
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black rounded-lg font-light"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate New Key
              </motion.button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Production API', key: 'sk_prod_...abc123', created: '2024-01-15', lastUsed: '2 min ago' },
                { name: 'Development API', key: 'sk_dev_...xyz789', created: '2024-01-10', lastUsed: '1 hour ago' },
                { name: 'Mobile App Key', key: 'sk_mob_...def456', created: '2024-01-05', lastUsed: '3 days ago' },
              ].map((apiKey) => (
                <div key={apiKey.key} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl">
                  <div>
                    <h3 className="text-white font-light">{apiKey.name}</h3>
                    <p className="text-sm text-gray-400 font-mono">{apiKey.key}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400">Last used: {apiKey.lastUsed}</span>
                    <motion.button
                      className="text-red-400 hover:text-red-300 text-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Revoke
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
          >
            <h2 className="text-xl font-light text-white mb-4">System Logs</h2>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
              {[
                { time: '2024-01-15 14:32:45', level: 'INFO', message: 'User authentication successful' },
                { time: '2024-01-15 14:32:44', level: 'DEBUG', message: 'Database query executed in 12ms' },
                { time: '2024-01-15 14:32:43', level: 'WARNING', message: 'High memory usage detected (87%)' },
                { time: '2024-01-15 14:32:42', level: 'INFO', message: 'API request processed successfully' },
                { time: '2024-01-15 14:32:41', level: 'ERROR', message: 'Failed to send email notification' },
              ].map((log, index) => (
                <div key={index} className={`flex space-x-4 ${
                  log.level === 'ERROR' ? 'text-red-400' :
                  log.level === 'WARNING' ? 'text-yellow-400' :
                  log.level === 'DEBUG' ? 'text-gray-500' :
                  'text-green-400'
                }`}>
                  <span className="text-gray-500">{log.time}</span>
                  <span className="font-bold">[{log.level}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}