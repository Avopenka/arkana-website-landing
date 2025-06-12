'use client'

import { useState, useEffect } from 'react'

interface BetaUser {
  id: string
  email: string
  beta_tier: number
  created_at: string
  last_active: string | null
}

interface AnalyticsData {
  totalUsers: number
  newUsersToday: number
  activeUsers: number
  conversionRate: number
}

export function BetaUserAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading analytics
    setTimeout(() => {
      setAnalytics({
        totalUsers: 127,
        newUsersToday: 5,
        activeUsers: 89,
        conversionRate: 12.5
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="p-6">Loading analytics...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Beta User Analytics</h2>
        <p className="text-gray-600">Insights into beta user engagement and growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers}</p>
          <p className="text-sm text-green-600">↗ +{analytics.newUsersToday} today</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.activeUsers}</p>
          <p className="text-sm text-gray-500">{Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">New Today</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics.newUsersToday}</p>
          <p className="text-sm text-gray-500">Last 24 hours</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.conversionRate}%</p>
          <p className="text-sm text-gray-500">Waitlist to beta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Distribution by Tier</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Genesis (Wave 0)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-sm font-medium">57</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Ultra Early (Wave 1)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
                <span className="text-sm font-medium">44</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Early Adopters (Wave 2)</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <span className="text-sm font-medium">26</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium">New user signup</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium">Beta code activated</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Genesis</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="text-sm font-medium">Feedback submitted</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Wave 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}