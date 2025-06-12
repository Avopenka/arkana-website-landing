import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LogoutButton({ className = '' }: { className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleLogout = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (response.ok) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}