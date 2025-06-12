'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CodeBracketIcon,
  CpuChipIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  CommandLineIcon,
  CloudIcon
} from '@heroicons/react/24/outline'

interface ApiEndpoint {
  path: string
  method: string
  description: string
  lastCall?: string
  responseTime?: number
  status: 'healthy' | 'warning' | 'error'
  callsToday: number
}

interface SystemMetrics {
  uptime: string
  responseTime: number
  errorRate: number
  requestsPerMinute: number
  activeConnections: number
  memoryUsage: number
  cpuUsage: number
}

export default function DeveloperDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: '99.9%',
    responseTime: 120,
    errorRate: 0.1,
    requestsPerMinute: 45,
    activeConnections: 12,
    memoryUsage: 68,
    cpuUsage: 23
  })

  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([
    {
      path: '/api/auth/login',
      method: 'POST',
      description: 'User authentication endpoint',
      lastCall: '2 minutes ago',
      responseTime: 89,
      status: 'healthy',
      callsToday: 156
    },
    {
      path: '/api/waitlist',
      method: 'POST',
      description: 'Waitlist registration',
      lastCall: '5 minutes ago',
      responseTime: 145,
      status: 'healthy',
      callsToday: 89
    },
    {
      path: '/api/creator/projects',
      method: 'GET',
      description: 'Creator project management',
      lastCall: '1 minute ago',
      responseTime: 203,
      status: 'warning',
      callsToday: 234
    },
    {
      path: '/api/webhooks/stripe',
      method: 'POST',
      description: 'Stripe payment webhooks',
      lastCall: '10 minutes ago',
      responseTime: 567,
      status: 'error',
      callsToday: 12
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-50'
      case 'warning': return 'text-yellow-500 bg-yellow-50'
      case 'error': return 'text-red-500 bg-red-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800'
      case 'POST': return 'bg-green-100 text-green-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-gray-400 mt-2">API monitoring, documentation, and development tools</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
              <DocumentDuplicateIcon className="h-4 w-4 inline mr-2" />
              API Docs
            </button>
            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg font-medium transition-colors">
              <KeyIcon className="h-4 w-4 inline mr-2" />
              Generate Key
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              <CommandLineIcon className="h-4 w-4 inline mr-2" />
              CLI Tools
            </button>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Uptime</p>
                <p className="text-2xl font-bold text-green-400">{metrics.uptime}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Response Time</p>
                <p className="text-2xl font-bold text-blue-400">{metrics.responseTime}ms</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Error Rate</p>
                <p className="text-2xl font-bold text-yellow-400">{metrics.errorRate}%</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Requests/min</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.requestsPerMinute}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Endpoints */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">API Endpoints</h3>
                  <span className="text-sm text-gray-400">Live monitoring</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <motion.div
                      key={endpoint.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm text-gray-300 font-mono">{endpoint.path}</code>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                            {endpoint.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{endpoint.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{endpoint.responseTime}ms</p>
                        <p className="text-xs text-gray-400">{endpoint.callsToday} calls today</p>
                        <p className="text-xs text-gray-500">{endpoint.lastCall}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Resources */}
            <div className="bg-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">System Resources</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">CPU Usage</span>
                    <span className="text-sm text-white">{metrics.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Memory Usage</span>
                    <span className="text-sm text-white">{metrics.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Active Connections</span>
                    <span className="text-sm text-white">{metrics.activeConnections}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Developer Tools</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                    <CodeBracketIcon className="h-5 w-5 text-blue-400 mr-3" />
                    <span className="text-sm font-medium">API Playground</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                    <DocumentDuplicateIcon className="h-5 w-5 text-purple-400 mr-3" />
                    <span className="text-sm font-medium">Generate SDK</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                    <CloudIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-sm font-medium">Deploy Webhooks</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-orange-400 mr-3" />
                    <span className="text-sm font-medium">View Logs</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">API key regenerated</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">2 minutes ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">Webhook endpoint updated</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">1 hour ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-300">Rate limit adjustment</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">3 hours ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}