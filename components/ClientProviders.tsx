'use client'

import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Dynamically import components to avoid SSR issues and handle missing components
const ConnectionProvider = dynamic(() => 
  import('@/lib/connection-manager').then(mod => ({ default: mod.ConnectionProvider })), {
  ssr: false,
  loading: () => null
})

// Optional mystery components - won't break if missing
const SafeComponent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MysteryProvider = dynamic(() => 
  import('@/components/MysteryProvider').catch(() => ({ default: SafeComponent })), {
  ssr: false,
  loading: () => null
})

const DeviceMagic = dynamic(() => 
  import('@/components/DeviceMagic').catch(() => ({ default: () => null })), {
  ssr: false,
  loading: () => null
})

const HiddenPathways = dynamic(() => 
  import('@/components/HiddenPathways').catch(() => ({ default: () => null })), {
  ssr: false,
  loading: () => null
})

const TemporalMysteries = dynamic(() => 
  import('@/components/TemporalMysteries').catch(() => ({ default: () => null })), {
  ssr: false,
  loading: () => null
})

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <ConnectionProvider>
        <MysteryProvider>
          {/* Hidden mysteries and easter eggs - optional */}
          <HiddenPathways />
          <TemporalMysteries />
          <DeviceMagic />
          
          {/* Main content */}
          {children}
        </MysteryProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  )
}