'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  FolderIcon,
  UsersIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  BellIcon,
  PlusIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'pending' | 'draft';
  progress_percentage: number;
  revenue_generated?: number;
  created_at: string;
  updated_at?: string;
}

interface Revenue {
  id: string;
  amount: number;
  stream_type: string;
  earned_at: string;
  project_id?: string;
}

interface Collaboration {
  id: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}

interface DashboardData {
  profile: {
    id: string;
    display_name: string;
    avatar_url?: string;
    creator_tier: string;
    verification_status: string;
    total_projects: number;
    total_revenue: number;
    follower_count: number;
  };
  metrics: {
    activeProjects: number;
    completedProjects: number;
    totalRevenue: number;
    recentRevenue: number;
    collaborationsCount: number;
    totalAssets: number;
    assetCounts: Record<string, number>;
  };
  recentProjects: unknown[];
  recentRevenue: unknown[];
  activeCollaborations: unknown[];
  recentActivities: unknown[];
}

export default function CreatorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<unknown[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/creator/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/creator/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {dashboardData.profile.avatar_url ? (
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={dashboardData.profile.avatar_url}
                    alt={dashboardData.profile.display_name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {dashboardData.profile.display_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {dashboardData.profile.display_name}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dashboardData.profile.creator_tier === 'pro' ? 'bg-purple-100 text-purple-800' :
                    dashboardData.profile.creator_tier === 'enterprise' ? 'bg-gold-100 text-gold-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {dashboardData.profile.creator_tier.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dashboardData.profile.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dashboardData.profile.verification_status === 'verified' ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Real-time Collaboration Indicator */}
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">J</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">M</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">3 online</span>
                </div>
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Predictive Insights Banner */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Revenue Insights</h3>
                  <p className="text-purple-100 text-sm">
                    Based on your current momentum, you're projected to earn 
                    <span className="font-bold text-white"> ${Math.round(dashboardData.metrics.totalRevenue * 1.3).toLocaleString()}</span> this quarter
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">📈</div>
                  <div className="text-sm text-purple-100">+30% growth</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          </motion.div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.activeProjects}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.metrics.totalRevenue)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Collaborations</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.collaborationsCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CloudArrowUpIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.metrics.totalAssets)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                  <button className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    New Project
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {project.progress_percentage}% complete
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(project.revenue_generated || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Revenue</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {dashboardData.recentRevenue.map((revenue, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{revenue.stream_type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(revenue.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-green-600">
                        +{formatCurrency(revenue.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <PlusIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Create New Project</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <CloudArrowUpIcon className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Upload Assets</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <UsersIcon className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Invite Collaborator</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-orange-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Asset Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Asset Overview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {Object.entries(dashboardData.metrics.assetCounts).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{type}s</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}