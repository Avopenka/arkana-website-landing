'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterRole !== 'all') {
      if (filterRole === 'admin') {
        query = query.eq('admin_access', true);
      } else if (filterRole === 'creator') {
        query = query.eq('creator_status', 'active');
      } else if (filterRole === 'beta') {
        query = query.eq('beta_access', true);
      }
    }

    const { data, error } = await query;
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const toggleAccess = async (userId, accessType, currentValue) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ [accessType]: !currentValue })
      .eq('id', userId);

    if (!error) {
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2">User Management</h1>
        <p className="text-gray-400 font-light">
          Manage user accounts, permissions, and access levels.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 px-4 py-2 pl-10 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/30"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-cyan-500/30"
          >
            <option value="all">All Users</option>
            <option value="admin">Admins</option>
            <option value="creator">Creators</option>
            <option value="beta">Beta Users</option>
          </select>
        </div>

        {/* Add User Button */}
        <motion.button
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black rounded-xl font-light"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add User
        </motion.button>
      </div>

      {/* User List */}
      <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/30 backdrop-blur-xl border-b border-white/[0.08]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">User</th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Joined</th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Admin</th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Beta</th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Creator</th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-light">{user.email}</div>
                      {user.full_name && (
                        <div className="text-sm text-gray-400">{user.full_name}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      onClick={() => toggleAccess(user.id, 'admin_access', user.admin_access)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        user.admin_access ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                        animate={{ left: user.admin_access ? '26px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <motion.button
                      onClick={() => toggleAccess(user.id, 'beta_access', user.beta_access)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        user.beta_access ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                        animate={{ left: user.beta_access ? '26px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-xs ${
                      user.creator_status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.creator_status || 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-lg text-xs bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.button
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}