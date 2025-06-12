'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TestAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setProfile(profile)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 bg-black text-white min-h-screen">Loading...</div>
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-6">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Session:</h2>
          <pre className="bg-gray-800 p-4 rounded text-sm overflow-auto">
            {session ? JSON.stringify(session.user, null, 2) : 'No session'}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-bold">User Profile:</h2>
          <pre className="bg-gray-800 p-4 rounded text-sm overflow-auto">
            {profile ? JSON.stringify(profile, null, 2) : 'No profile'}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-bold">Admin Access:</h2>
          <p className={`text-lg font-bold ${profile?.admin_access ? 'text-green-400' : 'text-red-400'}`}>
            {profile?.admin_access ? '✅ Yes' : '❌ No'}
          </p>
        </div>
        
        {profile?.admin_access && (
          <div>
            <a 
              href="/admin" 
              className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Go to Admin Dashboard
            </a>
          </div>
        )}
        
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}