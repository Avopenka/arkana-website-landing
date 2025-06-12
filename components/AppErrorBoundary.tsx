'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Additional error handling
        console.error('App Error:', error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}