import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()
  
  useEffect(() => {
    let warningTimer: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout
    
    const resetTimers = () => {
      clearTimeout(warningTimer)
      clearInterval(countdownInterval)
      
      // Show warning 2 minutes before timeout
      warningTimer = setTimeout(() => {
        setShowWarning(true)
        setTimeLeft(120) // 2 minutes
        
        countdownInterval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              handleTimeout()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }, 28 * 60 * 1000) // 28 minutes
    }
    
    const handleTimeout = () => {
      // Clear session and redirect to login
      fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login?reason=timeout')
    }
    
    const handleActivity = () => {
      if (showWarning) {
        // Extend session
        fetch('/api/auth/extend-session', { method: 'POST' })
        setShowWarning(false)
        clearInterval(countdownInterval)
      }
      resetTimers()
    }
    
    // Track user activity
    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)
    
    resetTimers()
    
    return () => {
      clearTimeout(warningTimer)
      clearInterval(countdownInterval)
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [showWarning, router])
  
  if (!showWarning) return null
  
  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-yellow-800 font-semibold mb-2">
        Session Expiring Soon
      </h3>
      <p className="text-yellow-700 text-sm mb-3">
        Your session will expire in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </p>
      <button
        onClick={() => {
          fetch('/api/auth/extend-session', { method: 'POST' })
          setShowWarning(false)
        }}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
      >
        Extend Session
      </button>
    </div>
  )
}