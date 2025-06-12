'use client'

import { useEffect, useState } from 'react'

interface UnifiedIssue {
  id: string
  external_id: string | null
  source: 'linear' | 'github_actions' | 'automation_audit' | 'manual_report' | 'performance_alert'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'blocked' | 'resolved' | 'closed' | 'escalated'
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export function UnifiedIssueDashboard() {
  const [issues, setIssues] = useState<UnifiedIssue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading issues
    setTimeout(() => {
      setIssues([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Unified Issue Dashboard</h2>
          <p className="text-gray-600">
            Real-time issue tracking across all systems
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Open Issues</h3>
          <p className="text-2xl font-bold text-red-500">{issues.filter(i => i.status === 'open').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-500">{issues.filter(i => i.status === 'in_progress').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Resolved</h3>
          <p className="text-2xl font-bold text-green-500">{issues.filter(i => i.status === 'resolved').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Total</h3>
          <p className="text-2xl font-bold">{issues.length}</p>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No issues found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id} className="border-t">
                  <td className="px-4 py-2">{issue.title}</td>
                  <td className="px-4 py-2">{issue.source}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      issue.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      issue.status === 'open' ? 'bg-red-100 text-red-800' :
                      issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}