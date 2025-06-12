import { createClient } from '@supabase/supabase-js';
export interface IssueUpdate {
  type: 'new' | 'update' | 'resolved' | 'escalated';
  issue: any;
  timestamp: string;
}
export class IssueUpdateService {
  private supabase;
  private subscribers: Set<(update: IssueUpdate) => void> = new Set();
  private channel: any = null;
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  subscribe(callback: (update: IssueUpdate) => void) {
    this.subscribers.add(callback);
    // Start listening if this is the first subscriber
    if (this.subscribers.size === 1) {
      this.startListening();
    }
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
      // Stop listening if no more subscribers
      if (this.subscribers.size === 0) {
        this.stopListening();
      }
    };
  }
  private startListening() {
    // Subscribe to issue changes
    this.channel = this.supabase
      .channel('issue-updates')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'unified_issues' 
        },
        (payload) => {
          this.notifySubscribers({
            type: 'new',
            issue: payload.new,
            timestamp: new Date().toISOString()
          });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'unified_issues' 
        },
        (payload) => {
          const oldStatus = payload.old.status;
          const newStatus = payload.new.status;
          let type: IssueUpdate['type'] = 'update';
          if (newStatus === 'resolved' && oldStatus !== 'resolved') {
            type = 'resolved';
          } else if (newStatus === 'escalated' && oldStatus !== 'escalated') {
            type = 'escalated';
          }
          this.notifySubscribers({
            type,
            issue: payload.new,
            timestamp: new Date().toISOString()
          });
        }
      )
      .subscribe();
  }
  private stopListening() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
  private notifySubscribers(update: IssueUpdate) {
    this.subscribers.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
      }
    });
  }
  // Manual trigger for testing or external events
  triggerUpdate(update: IssueUpdate) {
    this.notifySubscribers(update);
  }
}
// Singleton instance
let instance: IssueUpdateService | null = null;
export function getIssueUpdateService(): IssueUpdateService {
  if (!instance) {
    instance = new IssueUpdateService();
  }
  return instance;
}