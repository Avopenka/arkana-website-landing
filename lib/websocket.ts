// Real-time WebSocket connections for consciousness tracking and wave updates
// Agent Beta: Real-time consciousness streaming architect

'use client'

import { useState, useEffect } from 'react';

export interface ConsciousnessUpdate {
  userId: string;
  level: number;
  sessionTime: number;
  insights: number;
  connections: number;
  dailyGrowth: number;
  timestamp: number;
}

export interface WaveUpdate {
  waveNumber: number;
  tier: string;
  currentSeats: number;
  totalSeats: number;
  lastUpdate: number;
  velocity: number; // seats filled per hour
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface ConnectionStatus {
  isConnected: boolean;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  latency: number;
  lastHeartbeat: number;
}

// WebSocket connection manager with auto-reconnection
export class ArkanaWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    quality: 'poor',
    latency: 0,
    lastHeartbeat: 0
  };

  // Event listeners
  private consciousnessListeners: ((update: ConsciousnessUpdate) => void)[] = [];
  private waveListeners: ((update: WaveUpdate) => void)[] = [];
  private statusListeners: ((status: ConnectionStatus) => void)[] = [];

  constructor(private userId: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use secure WebSocket in production, regular in development
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = process.env.NODE_ENV === 'production' 
          ? 'wss://api.arkana.chat/ws' 
          : 'ws://localhost:3001/ws';
        
        this.ws = new WebSocket(`${host}?userId=${this.userId}`);

        this.ws.onopen = () => {
          console.log('🔗 Arkana consciousness stream connected');
          this.connectionStatus.isConnected = true;
          this.connectionStatus.quality = 'excellent';
          this.connectionStatus.lastHeartbeat = Date.now();
          this.reconnectAttempts = 0;
          
          this.startHeartbeat();
          this.notifyStatusListeners();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('🔌 Arkana consciousness stream disconnected');
          this.connectionStatus.isConnected = false;
          this.connectionStatus.quality = 'poor';
          this.stopHeartbeat();
          this.notifyStatusListeners();
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connectionStatus.quality = 'poor';
          this.notifyStatusListeners();
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: any) {
    const now = Date.now();
    
    switch (message.type) {
      case 'consciousness_update':
        this.consciousnessListeners.forEach(listener => {
          listener(message.data as ConsciousnessUpdate);
        });
        break;
        
      case 'wave_update':
        this.waveListeners.forEach(listener => {
          listener(message.data as WaveUpdate);
        });
        break;
        
      case 'pong':
        // Calculate latency from heartbeat
        const latency = now - this.connectionStatus.lastHeartbeat;
        this.connectionStatus.latency = latency;
        this.connectionStatus.quality = this.calculateQuality(latency);
        this.connectionStatus.lastHeartbeat = now;
        this.notifyStatusListeners();
        break;
        
      case 'error':
        console.error('Server error:', message.data);
        break;
    }
  }

  private calculateQuality(latency: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (latency < 50) return 'excellent';
    if (latency < 150) return 'good';
    if (latency < 300) return 'fair';
    return 'poor';
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.connectionStatus.lastHeartbeat = Date.now();
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  // Event listener management
  onConsciousnessUpdate(listener: (update: ConsciousnessUpdate) => void) {
    this.consciousnessListeners.push(listener);
    return () => {
      const index = this.consciousnessListeners.indexOf(listener);
      if (index > -1) this.consciousnessListeners.splice(index, 1);
    };
  }

  onWaveUpdate(listener: (update: WaveUpdate) => void) {
    this.waveListeners.push(listener);
    return () => {
      const index = this.waveListeners.indexOf(listener);
      if (index > -1) this.waveListeners.splice(index, 1);
    };
  }

  onStatusChange(listener: (status: ConnectionStatus) => void) {
    this.statusListeners.push(listener);
    return () => {
      const index = this.statusListeners.indexOf(listener);
      if (index > -1) this.statusListeners.splice(index, 1);
    };
  }

  private notifyStatusListeners() {
    this.statusListeners.forEach(listener => {
      listener({ ...this.connectionStatus });
    });
  }

  // Send consciousness data to server
  updateConsciousness(data: Partial<ConsciousnessUpdate>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'consciousness_sync',
        data: {
          ...data,
          userId: this.userId,
          timestamp: Date.now()
        }
      }));
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }
}

// Singleton pattern for global WebSocket connection
let globalWebSocket: ArkanaWebSocket | null = null;

export function initializeWebSocket(userId: string): ArkanaWebSocket {
  if (globalWebSocket) {
    globalWebSocket.disconnect();
  }
  
  globalWebSocket = new ArkanaWebSocket(userId);
  return globalWebSocket;
}

export function getWebSocket(): ArkanaWebSocket | null {
  return globalWebSocket;
}

// React hook for WebSocket integration
export function useArkanaWebSocket(userId: string) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    quality: 'poor',
    latency: 0,
    lastHeartbeat: 0
  });
  
  const [consciousness, setConsciousness] = useState<ConsciousnessUpdate | null>(null);
  const [waveUpdate, setWaveUpdate] = useState<WaveUpdate | null>(null);

  useEffect(() => {
    // Only connect WebSocket in authenticated state and if userId exists
    if (!userId || typeof window === 'undefined') return;

    // Add a delay to prevent SSR/hydration issues
    const timer = setTimeout(() => {
      try {
        const ws = initializeWebSocket(userId);
        
        const unsubscribeStatus = ws.onStatusChange(setConnectionStatus);
        const unsubscribeConsciousness = ws.onConsciousnessUpdate(setConsciousness);
        const unsubscribeWave = ws.onWaveUpdate(setWaveUpdate);

        // Only attempt connection if we're in a proper browser environment
        ws.connect().catch((error) => {
          console.warn('WebSocket connection failed (non-critical):', error);
          // Set offline status instead of crashing
          setConnectionStatus({
            isConnected: false,
            quality: 'poor',
            latency: 0,
            lastHeartbeat: 0
          });
        });

        return () => {
          unsubscribeStatus();
          unsubscribeConsciousness();
          unsubscribeWave();
          ws.disconnect();
        };
      } catch (error) {
        console.warn('WebSocket initialization failed (non-critical):', error);
      }
    }, 1000); // 1 second delay to ensure proper hydration

    return () => clearTimeout(timer);
  }, [userId]);

  return {
    connectionStatus,
    consciousness,
    waveUpdate,
    updateConsciousness: (data: Partial<ConsciousnessUpdate>) => {
      globalWebSocket?.updateConsciousness(data);
    }
  };
}
