'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminDashboard/AdminLayout'
import OverviewDashboard from '@/components/AdminDashboard/OverviewDashboard'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/')
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('admin_access')
        .eq('id', session.user.id)
        .single()

      if (profile?.admin_access) {
        setIsAdmin(true)
      } else {
        // Not admin, redirect to home
        router.push('/')
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <AdminLayout activeTab="overview">
      <OverviewDashboard />
    </AdminLayout>
  )
}