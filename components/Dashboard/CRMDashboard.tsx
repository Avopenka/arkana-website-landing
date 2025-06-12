'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface UserSegment {
  email: string;
  name: string | null;
  device_type: string;
  total_score: number;
  hardware_score: number;
  time_score: number;
  engagement_score: number;
  days_waiting: number;
  segment: 'VIP' | 'Priority' | 'Standard' | 'Monitor';
  motivation: string | null;
}

export function CRMDashboard() {
  const [users, setUsers] = useState<UserSegment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [selectedSegment]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('crm_dashboard')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(50);
    
    if (selectedSegment !== 'all') {
      query = query.eq('segment', selectedSegment);
    }
    
    const { data, error } = await query;
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    if (percentage >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getDeviceEmoji = (device: string) => {
    if (device?.includes('m4_max')) return '🚀';
    if (device?.includes('m4_pro')) return '💎';
    if (device?.includes('m3')) return '✨';
    if (device?.includes('m2')) return '⭐';
    if (device?.includes('m1')) return '🌟';
    if (device?.includes('iphone')) return '📱';
    return '💻';
  };

  const sendPersonalEmail = async (email: string) => {
    // Implement email sending logic
  };

  const generateInvite = async (email: string) => {
    // Implement invite generation
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with Real-time Updates */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-white tracking-tight">CRM Dashboard</h1>
              <div className="flex items-center space-x-2 mt-3">
                <motion.div 
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-gray-400 font-light">Live data • Updated {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          
            {/* Quick Actions - AP Elite Design */}
            <div className="flex items-center space-x-3">
              <motion.button 
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-xl
                         border border-purple-500/20 rounded-xl font-light text-purple-300 
                         hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/30
                         transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Export Data
              </motion.button>
              <motion.button 
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 backdrop-blur-xl
                         border border-cyan-500/20 rounded-xl font-light text-cyan-300 
                         hover:from-cyan-500/20 hover:to-cyan-600/20 hover:border-cyan-500/30
                         transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Campaign
              </motion.button>
              <motion.button 
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-xl
                         border border-blue-500/20 rounded-xl font-light text-blue-300 
                         hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-500/30
                         transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Analytics
              </motion.button>
            </div>
          </div>

          {/* Segment Filter - AP Elite Design */}
          <div className="flex gap-3 mb-8">
            {['all', 'VIP', 'Priority', 'Standard', 'Monitor'].map((segment) => (
              <motion.button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                className={`px-5 py-2.5 rounded-xl font-light transition-all duration-300 ${
                  selectedSegment === segment
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] text-gray-400 hover:bg-white/[0.05] hover:border-white/[0.12]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {segment === 'all' ? 'All Users' : segment}
              </motion.button>
            ))}
          </div>

          {/* Quick Stats - AP Elite Design */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <motion.div 
              className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-light text-cyan-400">
                {users.filter(u => u.hardware_score >= 35).length}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-2">M4 Max Users</div>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-light text-purple-400">
                {users.filter(u => u.days_waiting >= 30).length}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-2">30+ Day Believers</div>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-light text-green-400">
                {users.filter(u => u.total_score >= 80).length}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-2">VIP Tier</div>
            </motion.div>
            <motion.div 
              className="p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl font-light text-amber-400">
                {Math.round(users.reduce((acc, u) => acc + u.total_score, 0) / users.length) || 0}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-2">Avg Score</div>
            </motion.div>
          </div>

          {/* User List - AP Elite Design */}
          <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-black/30 backdrop-blur-xl border-b border-white/[0.08]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">User</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Device</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Total Score</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Hardware</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Time</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Engagement</th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Days</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <motion.tr
                      key={user.email}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-300"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-light text-white">{user.email}</div>
                          {user.name && (
                            <div className="text-sm text-gray-400 font-light mt-1">{user.name}</div>
                          )}
                          {user.motivation && (
                            <div className="text-xs text-gray-500 mt-2 truncate max-w-xs italic opacity-70">
                              "{user.motivation}"
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-2xl">{getDeviceEmoji(user.device_type)}</span>
                        <div className="text-xs text-gray-400">
                          {user.device_type?.replace(/_/g, ' ')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className={`text-xl font-bold ${getScoreColor(user.total_score, 100)}`}>
                          {user.total_score}
                        </div>
                        <div className={`text-xs px-3 py-1.5 rounded-lg inline-block mt-2 font-light backdrop-blur-xl ${
                          user.segment === 'VIP' ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-200 border border-purple-500/30' :
                          user.segment === 'Priority' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200 border border-blue-500/30' :
                          user.segment === 'Standard' ? 'bg-white/[0.05] text-gray-300 border border-white/[0.1]' :
                          'bg-white/[0.02] text-gray-400 border border-white/[0.05]'
                        }`}>
                          {user.segment}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className={getScoreColor(user.hardware_score, 40)}>
                          {user.hardware_score}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className={getScoreColor(user.time_score, 30)}>
                          {user.time_score}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className={getScoreColor(user.engagement_score, 30)}>
                          {user.engagement_score}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-sm">
                          {user.days_waiting}d
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          {user.segment === 'VIP' && (
                            <motion.button
                              onClick={() => generateInvite(user.email)}
                              className="px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-xl
                                       border border-purple-500/20 rounded-lg font-light text-purple-300 text-sm
                                       hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/30
                                       transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Invite
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => sendPersonalEmail(user.email)}
                            className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 backdrop-blur-xl
                                     border border-cyan-500/20 rounded-lg font-light text-cyan-300 text-sm
                                     hover:from-cyan-500/20 hover:to-cyan-600/20 hover:border-cyan-500/30
                                     transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Email
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Action Buttons - AP Elite Design */}
          <div className="mt-8 flex gap-4">
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-medium rounded-xl
                       shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 
                       transform transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Export VIP List
            </motion.button>
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white font-medium rounded-xl
                       shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 
                       transform transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate Invite Codes
            </motion.button>
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-medium rounded-xl
                       shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 
                       transform transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Wave Announcement
            </motion.button>
          </div>
      </div>
    </div>
  );
}

export default CRMDashboard;