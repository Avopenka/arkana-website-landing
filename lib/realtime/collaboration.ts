import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

interface CollaborationEvent {
  type: string;
  payload: any;
  userId: string;
  timestamp: string;
}

interface CursorPosition {
  x: number;
  y: number;
  userId: string;
  userName: string;
  color: string;
}

interface DocumentChange {
  operation: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  attributes?: Record<string, any>;
}

export class RealtimeCollaboration {
  private supabase: any;
  private channels: Map<string, RealtimeChannel> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private userCursors: Map<string, CursorPosition> = new Map();
  private currentUserId: string;
  private currentUserName: string;
  private userColor: string;

  constructor(supabaseUrl: string, supabaseKey: string, userId: string, userName: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.currentUserId = userId;
    this.currentUserName = userName;
    this.userColor = this.generateUserColor(userId);
  }

  /**
   * Join a collaboration room for a specific project
   */
  async joinProject(projectId: string): Promise<void> {
    const channelName = `project:${projectId}`;
    
    if (this.channels.has(channelName)) {
      console.warn(`Already connected to project ${projectId}`);
      return;
    }

    const channel = this.supabase
      .channel(channelName)
      .on('broadcast', { event: 'cursor_move' }, (payload: any) => {
        this.handleCursorMove(payload);
      })
      .on('broadcast', { event: 'document_change' }, (payload: any) => {
        this.handleDocumentChange(payload);
      })
      .on('broadcast', { event: 'task_update' }, (payload: any) => {
        this.handleTaskUpdate(payload);
      })
      .on('broadcast', { event: 'milestone_update' }, (payload: any) => {
        this.handleMilestoneUpdate(payload);
      })
      .on('broadcast', { event: 'user_join' }, (payload: any) => {
        this.handleUserJoin(payload);
      })
      .on('broadcast', { event: 'user_leave' }, (payload: any) => {
        this.handleUserLeave(payload);
      })
      .on('presence', { event: 'sync' }, () => {
        this.handlePresenceSync(channel);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
        this.handlePresenceJoin(newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
        this.handlePresenceLeave(leftPresences);
      });

    await channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        // Track user presence
        await channel.track({
          userId: this.currentUserId,
          userName: this.currentUserName,
          color: this.userColor,
          joinedAt: new Date().toISOString()
        });

        // Announce user joining
        await this.broadcast(projectId, 'user_join', {
          userId: this.currentUserId,
          userName: this.currentUserName,
          color: this.userColor
        });

        this.emit('project_joined', { projectId, userId: this.currentUserId });
      }
    });

    this.channels.set(channelName, channel);
  }

  /**
   * Leave a collaboration room
   */
  async leaveProject(projectId: string): Promise<void> {
    const channelName = `project:${projectId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      // Announce user leaving
      await this.broadcast(projectId, 'user_leave', {
        userId: this.currentUserId,
        userName: this.currentUserName
      });

      await channel.unsubscribe();
      this.channels.delete(channelName);
      this.emit('project_left', { projectId, userId: this.currentUserId });
    }
  }

  /**
   * Broadcast cursor position to other collaborators
   */
  async broadcastCursorMove(projectId: string, x: number, y: number, elementId?: string): Promise<void> {
    await this.broadcast(projectId, 'cursor_move', {
      userId: this.currentUserId,
      userName: this.currentUserName,
      color: this.userColor,
      x,
      y,
      elementId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Broadcast document changes for real-time editing
   */
  async broadcastDocumentChange(projectId: string, documentId: string, changes: DocumentChange[]): Promise<void> {
    await this.broadcast(projectId, 'document_change', {
      documentId,
      changes,
      userId: this.currentUserId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Broadcast task updates
   */
  async broadcastTaskUpdate(projectId: string, taskId: string, update: any): Promise<void> {
    await this.broadcast(projectId, 'task_update', {
      taskId,
      update,
      userId: this.currentUserId,
      userName: this.currentUserName,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Broadcast milestone updates
   */
  async broadcastMilestoneUpdate(projectId: string, milestoneId: string, update: any): Promise<void> {
    await this.broadcast(projectId, 'milestone_update', {
      milestoneId,
      update,
      userId: this.currentUserId,
      userName: this.currentUserName,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get list of active collaborators
   */
  getActiveCollaborators(projectId: string): CursorPosition[] {
    return Array.from(this.userCursors.values());
  }

  /**
   * Add event listener
   */
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Remove event listener
   */
  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to handlers
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Broadcast message to project channel
   */
  private async broadcast(projectId: string, event: string, payload: any): Promise<void> {
    const channelName = `project:${projectId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await channel.send({
        type: 'broadcast',
        event,
        payload
      });
    }
  }

  /**
   * Handle cursor movement from other users
   */
  private handleCursorMove(payload: any): void {
    const { userId, userName, color, x, y, elementId } = payload.payload;

    if (userId !== this.currentUserId) {
      this.userCursors.set(userId, {
        x,
        y,
        userId,
        userName,
        color
      });

      this.emit('cursor_move', {
        userId,
        userName,
        color,
        x,
        y,
        elementId
      });
    }
  }

  /**
   * Handle document changes from other users
   */
  private handleDocumentChange(payload: any): void {
    const { documentId, changes, userId } = payload.payload;

    if (userId !== this.currentUserId) {
      this.emit('document_change', {
        documentId,
        changes,
        userId
      });
    }
  }

  /**
   * Handle task updates from other users
   */
  private handleTaskUpdate(payload: any): void {
    const { taskId, update, userId, userName } = payload.payload;

    if (userId !== this.currentUserId) {
      this.emit('task_update', {
        taskId,
        update,
        userId,
        userName
      });
    }
  }

  /**
   * Handle milestone updates from other users
   */
  private handleMilestoneUpdate(payload: any): void {
    const { milestoneId, update, userId, userName } = payload.payload;

    if (userId !== this.currentUserId) {
      this.emit('milestone_update', {
        milestoneId,
        update,
        userId,
        userName
      });
    }
  }

  /**
   * Handle user joining
   */
  private handleUserJoin(payload: any): void {
    const { userId, userName, color } = payload.payload;

    if (userId !== this.currentUserId) {
      this.emit('user_join', {
        userId,
        userName,
        color
      });
    }
  }

  /**
   * Handle user leaving
   */
  private handleUserLeave(payload: any): void {
    const { userId, userName } = payload.payload;

    if (userId !== this.currentUserId) {
      this.userCursors.delete(userId);
      this.emit('user_leave', {
        userId,
        userName
      });
    }
  }

  /**
   * Handle presence sync
   */
  private handlePresenceSync(channel: RealtimeChannel): void {
    const presenceState = channel.presenceState();
    const users = Object.values(presenceState).flat();
    
    this.emit('presence_sync', { users });
  }

  /**
   * Handle presence join
   */
  private handlePresenceJoin(newPresences: unknown[]): void {
    newPresences.forEach(presence => {
      if (presence.userId !== this.currentUserId) {
        this.emit('user_presence_join', presence);
      }
    });
  }

  /**
   * Handle presence leave
   */
  private handlePresenceLeave(leftPresences: unknown[]): void {
    leftPresences.forEach(presence => {
      if (presence.userId !== this.currentUserId) {
        this.userCursors.delete(presence.userId);
        this.emit('user_presence_leave', presence);
      }
    });
  }

  /**
   * Generate a consistent color for a user
   */
  private generateUserColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#F39C12', '#E74C3C', '#9B59B6', '#3498DB',
      '#1ABC9C', '#2ECC71', '#F1C40F', '#E67E22', '#34495E'
    ];

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
    }

    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Clean up all connections
   */
  async cleanup(): Promise<void> {
    for (const [channelName, channel] of this.channels) {
      await channel.unsubscribe();
    }
    this.channels.clear();
    this.eventHandlers.clear();
    this.userCursors.clear();
  }
}

/**
 * Hook for using real-time collaboration in React components
 */
export function useRealtimeCollaboration(projectId: string, userId: string, userName: string) {
  const [collaboration, setCollaboration] = React.useState<RealtimeCollaboration | null>(null);
  const [activeUsers, setActiveUsers] = React.useState<unknown[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (!projectId || !userId || !userName) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const collab = new RealtimeCollaboration(supabaseUrl, supabaseKey, userId, userName);

    // Set up event listeners
    collab.on('project_joined', () => setIsConnected(true));
    collab.on('project_left', () => setIsConnected(false));
    
    collab.on('user_join', (data) => {
      setActiveUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
    });
    
    collab.on('user_leave', (data) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
    });

    collab.on('presence_sync', (data) => {
      setActiveUsers(data.users);
    });

    // Join the project
    collab.joinProject(projectId);
    setCollaboration(collab);

    return () => {
      collab.leaveProject(projectId);
      collab.cleanup();
    };
  }, [projectId, userId, userName]);

  return {
    collaboration,
    activeUsers,
    isConnected,
    broadcastCursorMove: collaboration?.broadcastCursorMove.bind(collaboration),
    broadcastDocumentChange: collaboration?.broadcastDocumentChange.bind(collaboration),
    broadcastTaskUpdate: collaboration?.broadcastTaskUpdate.bind(collaboration),
    broadcastMilestoneUpdate: collaboration?.broadcastMilestoneUpdate.bind(collaboration)
  };
}

export default RealtimeCollaboration;