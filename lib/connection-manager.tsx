// Connection state management across the entire customer journey
// Agent Epsilon: Connection state optimization architect
'use client'
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useArkanaWebSocket } from './websocket';
import { useRealtimeWaves } from './realtime-waves';
export interface ConnectionState {
  websocket: {
    isConnected: boolean;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    latency: number;
    reconnectAttempts: number;
  };
  supabase: {
    isConnected: boolean;
    lastSync: number;
    error: string | null;
  };
  consciousness: {
    isTracking: boolean;
    lastUpdate: number;
    syncStatus: 'synced' | 'pending' | 'error';
  };
  waves: {
    isSubscribed: boolean;
    lastWaveUpdate: number;
    currentWave: any;
  };
}
export interface UserSession {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  pioneerNumber: number | null;
  wave: string | null;
  betaAccess: boolean;
  consciousnessScore: number | null;
}
export interface ConnectionContextType {
  connectionState: ConnectionState;
  userSession: UserSession;
  consciousness: any;
  waveData: any;
  actions: {
    initializeSession: (userData: Partial<UserSession>) => void;
    updateConsciousness: (data: any) => void;
    clearSession: () => void;
    reconnect: () => Promise<void>;
    getHealthStatus: () => 'healthy' | 'degraded' | 'offline';
  };
}
const ConnectionContext = createContext<ConnectionContextType | null>(null);
// Connection state manager with optimized reconnection and health monitoring
export function ConnectionProvider({ children }: { children: ReactNode }) {
  // User session state
  const [userSession, setUserSession] = useState<UserSession>({
    userId: null,
    email: null,
    isAuthenticated: false,
    pioneerNumber: null,
    wave: null,
    betaAccess: false,
    consciousnessScore: null
  });
  // Connection state tracking
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    websocket: {
      isConnected: false,
      quality: 'poor',
      latency: 0,
      reconnectAttempts: 0
    },
    supabase: {
      isConnected: false,
      lastSync: 0,
      error: null
    },
    consciousness: {
      isTracking: false,
      lastUpdate: 0,
      syncStatus: 'synced'
    },
    waves: {
      isSubscribed: false,
      lastWaveUpdate: 0,
      currentWave: null
    }
  });
  // Initialize WebSocket connection (only if user is authenticated)
  const { 
    connectionStatus: wsStatus, 
    consciousness, 
    updateConsciousness: wsUpdateConsciousness 
  } = useArkanaWebSocket(userSession.userId || '');
  // Initialize real-time waves
  const { waveData, isLoading: waveLoading, error: waveError } = useRealtimeWaves();
  // Update connection state when WebSocket status changes
  useEffect(() => {
    setConnectionState(prev => ({
      ...prev,
      websocket: {
        isConnected: wsStatus.isConnected,
        quality: wsStatus.quality,
        latency: wsStatus.latency,
        reconnectAttempts: 0 // Reset on status change
      },
      consciousness: {
        ...prev.consciousness,
        isTracking: wsStatus.isConnected && !!userSession.userId,
        lastUpdate: consciousness ? Date.now() : prev.consciousness.lastUpdate
      }
    }));
  }, [wsStatus, consciousness, userSession.userId]);
  // Update wave connection state
  useEffect(() => {
    setConnectionState(prev => ({
      ...prev,
      waves: {
        isSubscribed: !waveLoading && !waveError,
        lastWaveUpdate: waveData ? Date.now() : prev.waves.lastWaveUpdate,
        currentWave: waveData
      },
      supabase: {
        isConnected: !waveError,
        lastSync: Date.now(),
        error: waveError
      }
    }));
  }, [waveData, waveLoading, waveError]);
  // Initialize session from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedSession = localStorage.getItem('arkana_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setUserSession(session);
      }
    } catch (error) {
    }
  }, []);
  // Save session to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (userSession.userId) {
      localStorage.setItem('arkana_session', JSON.stringify(userSession));
    } else {
      localStorage.removeItem('arkana_session');
    }
  }, [userSession]);
  // Connection health monitoring
  const getHealthStatus = (): 'healthy' | 'degraded' | 'offline' => {
    const { websocket, supabase, consciousness, waves } = connectionState;
    // Offline: No connections
    if (!websocket.isConnected && !supabase.isConnected) {
      return 'offline';
    }
    // Degraded: Some connections failing or poor quality
    if (!websocket.isConnected || 
        websocket.quality === 'poor' || 
        supabase.error || 
        !waves.isSubscribed) {
      return 'degraded';
    }
    return 'healthy';
  };
  // Auto-retry connection logic with exponential backoff
  useEffect(() => {
    const healthStatus = getHealthStatus();
    if (healthStatus === 'offline' || healthStatus === 'degraded') {
      const retryDelay = Math.min(1000 * Math.pow(2, connectionState.websocket.reconnectAttempts), 30000);
      const retryTimer = setTimeout(() => {
        // The WebSocket hook handles its own reconnection
        // Here we just update the attempt counter
        setConnectionState(prev => ({
          ...prev,
          websocket: {
            ...prev.websocket,
            reconnectAttempts: prev.websocket.reconnectAttempts + 1
          }
        }));
      }, retryDelay);
      return () => clearTimeout(retryTimer);
    }
  }, [connectionState.websocket.reconnectAttempts, connectionState.websocket.isConnected]);
  // Context actions
  const actions = {
    initializeSession: (userData: Partial<UserSession>) => {
      setUserSession(prev => ({
        ...prev,
        ...userData,
        isAuthenticated: !!userData.userId
      }));
    },
    updateConsciousness: (data: any) => {
      if (userSession.userId) {
        wsUpdateConsciousness(data);
        // Also sync to API for persistence
        fetch('/api/consciousness', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userSession.userId,
            ...data
          })
        }).catch(error => {
          setConnectionState(prev => ({
            ...prev,
            consciousness: {
              ...prev.consciousness,
              syncStatus: 'error'
            }
          }));
        });
      }
    },
    clearSession: () => {
      setUserSession({
        userId: null,
        email: null,
        isAuthenticated: false,
        pioneerNumber: null,
        wave: null,
        betaAccess: false,
        consciousnessScore: null
      });
    },
    reconnect: async () => {
      // Reset reconnection attempts
      setConnectionState(prev => ({
        ...prev,
        websocket: {
          ...prev.websocket,
          reconnectAttempts: 0
        }
      }));
      // Force reconnection will be handled by the WebSocket hook
    },
    getHealthStatus
  };
  const contextValue: ConnectionContextType = {
    connectionState,
    userSession,
    consciousness,
    waveData,
    actions
  };
  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
}
// Hook to use connection context
export function useConnection(): ConnectionContextType {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}
// Specialized hooks for specific use cases
export function useConsciousnessTracking() {
  const { consciousness, userSession, actions } = useConnection();
  return {
    consciousness,
    isTracking: !!userSession.userId,
    updateConsciousness: actions.updateConsciousness,
    userId: userSession.userId
  };
}
export function useWaveStatus() {
  const { waveData, connectionState } = useConnection();
  return {
    waveData,
    isConnected: connectionState.waves.isSubscribed,
    lastUpdate: connectionState.waves.lastWaveUpdate
  };
}
export function useSessionStatus() {
  const { userSession, connectionState, actions } = useConnection();
  return {
    user: userSession,
    isAuthenticated: userSession.isAuthenticated,
    healthStatus: actions.getHealthStatus(),
    initializeSession: actions.initializeSession,
    clearSession: actions.clearSession
  };
}
// Connection health indicator component
export function ConnectionHealthIndicator() {
  const { actions, connectionState } = useConnection();
  const healthStatus = actions.getHealthStatus();
  const getStatusColor = () => {
    switch (healthStatus) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
    }
  };
  const getStatusIcon = () => {
    switch (healthStatus) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'offline': return '🔴';
    }
  };
  return (
    <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
      <span>{getStatusIcon()}</span>
      <span className="capitalize">{healthStatus}</span>
      {connectionState.websocket.latency > 0 && (
        <span className="text-xs text-white/60">
          {connectionState.websocket.latency}ms
        </span>
      )}
    </div>
  );
}