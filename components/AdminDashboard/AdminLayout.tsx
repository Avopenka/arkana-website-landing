'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export default function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊', href: '/admin' },
    { id: 'crm', label: 'CRM', icon: '👥', href: '/admin/crm' },
    { id: 'dev', label: 'Dev Control', icon: '🛠️', href: '/admin/dev' },
    { id: 'users', label: 'User Management', icon: '🔐', href: '/admin/users' },
    { id: 'creator', label: 'Creator Studio', icon: '🎨', href: '/admin/creator' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* AP Elite Design: Premium glassmorphic background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,255,225,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,176,0,0.02)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <motion.aside 
          className="w-64 min-h-screen bg-black/40 backdrop-blur-2xl border-r border-white/[0.08]"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/[0.08]">
            <h1 className="text-2xl font-light text-white tracking-tight">ARKANA</h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Admin Console</p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <motion.a
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-light">{item.label}</span>
              </motion.a>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.08]">
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center text-black font-bold">
                  A
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-light">Admin</p>
                  <p className="text-xs text-gray-400">office@aristovopenka.com</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <motion.header 
            className="bg-black/40 backdrop-blur-xl border-b border-white/[0.08]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-gray-400 font-light">
                  System Status: <span className="text-green-400">Operational</span>
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Documentation
                </motion.button>
                <motion.button
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Support
                </motion.button>
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xs font-bold text-white">3</span>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}