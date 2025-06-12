import { useEffect, useState } from 'react'

export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string>('')
  
  useEffect(() => {
    // Get CSRF token from meta tag or cookie
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    
    if (metaToken) {
      setCSRFToken(metaToken)
    } else {
      // Fetch CSRF token from API
      fetch('/api/csrf-token')
        .then(res => res.json())
        .then(data => setCSRFToken(data.token))
        .catch(console.error)
    }
  }, [])
  
  return csrfToken
}

export function addCSRFToRequest(csrfToken: string, options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...options.headers,
      'x-csrf-token': csrfToken
    }
  }
}