import { db } from './database';
import { logger } from './logger';
import { analytics } from './analytics';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  status: 'waitlist' | 'beta' | 'active' | 'churned' | 'VIP';
  tier: 'free' | 'pro' | 'enterprise' | 'founder';
  source: 'organic' | 'referral' | 'marketing' | 'beta_code';
  first_seen: string;
  last_active: string;
  total_sessions: number;
  engagement_score: number;
  lifetime_value: number;
  preferences: Record<string, any>;
  tags: string[];
  notes: Array<{
    id: string;
    content: string;
    created_by: string;
    created_at: string;
    type: 'note' | 'call' | 'email' | 'meeting' | 'support';
  }>;
  interactions: Array<{
    id: string;
    type: 'page_view' | 'feature_use' | 'support_request' | 'purchase' | 'referral';
    data: Record<string, any>;
    timestamp: string;
  }>;
  conversion_funnel: {
    stage: 'awareness' | 'interest' | 'consideration' | 'trial' | 'purchase' | 'retention';
    progression_date: string;
    conversion_probability: number;
  };
}

export interface CRMInsights {
  totalUsers: number;
  activeUsers: number;
  churnRate: number;
  avgEngagementScore: number;
  conversionRates: Record<string, number>;
  topFeatures: Array<{ feature: string; usage: number }>;
  userGrowthTrend: Array<{ date: string; newUsers: number; totalUsers: number }>;
  cohortAnalysis: Array<{
    cohort: string;
    users: number;
    retention: Record<string, number>;
  }>;
}

class CRMManager {
  private readonly engagementWeights = {
    page_view: 1,
    feature_use: 5,
    support_request: 3,
    purchase: 20,
    referral: 15,
    beta_signup: 10,
    daily_active: 2
  };

  async createUserProfile(userData: {
    email: string;
    name: string;
    source?: 'organic' | 'referral' | 'marketing' | 'beta_code';
    initial_data?: Record<string, any>;
  }): Promise<UserProfile> {
    try {
      const { email, name, source = 'organic', initial_data = {} } = userData;
      
      const profile: UserProfile = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        name,
        status: 'waitlist',
        tier: 'free',
        source,
        first_seen: new Date().toISOString(),
        last_active: new Date().toISOString(),
        total_sessions: 1,
        engagement_score: this.engagementWeights.page_view,
        lifetime_value: 0,
        preferences: initial_data,
        tags: [source],
        notes: [],
        interactions: [{
          id: `interaction_${Date.now()}`,
          type: 'page_view',
          data: { page: 'signup', ...initial_data },
          timestamp: new Date().toISOString()
        }],
        conversion_funnel: {
          stage: 'awareness',
          progression_date: new Date().toISOString(),
          conversion_probability: this.calculateConversionProbability('awareness', source)
        }
      };

      await this.saveUserProfile(profile);
      
      // Track user creation
      await analytics.trackEvent({
        event_type: 'user_created',
        user_email: email,
        metadata: { source, tier: 'free' }
      });

      logger.info('User profile created', { 
        userId: profile.id, 
        email: profile.email, 
        source 
      });

      return profile;
    } catch (error) {
      logger.error('Failed to create user profile', error as Error, userData);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const existing = await this.getUserProfile(userId);
      if (!existing) {
        throw new Error('User profile not found');
      }

      const updated: UserProfile = {
        ...existing,
        ...updates,
        last_active: new Date().toISOString()
      };

      await this.saveUserProfile(updated);
      
      logger.info('User profile updated', { userId, updates: Object.keys(updates) });
      
      return updated;
    } catch (error) {
      logger.error('Failed to update user profile', error as Error, { userId, updates });
      throw error;
    }
  }

  async trackUserInteraction(userId: string, interaction: {
    type: UserProfile['interactions'][0]['type'];
    data?: Record<string, any>;
  }): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        logger.warn('Attempted to track interaction for non-existent user', { userId });
        return;
      }

      const newInteraction = {
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        type: interaction.type,
        data: interaction.data || {},
        timestamp: new Date().toISOString()
      };

      // Update engagement score
      const scoreIncrease = this.engagementWeights[interaction.type] || 1;
      const newEngagementScore = profile.engagement_score + scoreIncrease;

      // Update conversion probability based on interaction
      const newConversionProbability = this.calculateConversionProbability(
        profile.conversion_funnel.stage, 
        profile.source, 
        newEngagementScore
      );

      await this.updateUserProfile(userId, {
        interactions: [...profile.interactions, newInteraction],
        engagement_score: newEngagementScore,
        total_sessions: interaction.type === 'page_view' ? profile.total_sessions + 1 : profile.total_sessions,
        conversion_funnel: {
          ...profile.conversion_funnel,
          conversion_probability: newConversionProbability
        }
      });

      // Track interaction analytically
      await analytics.trackEvent({
        event_type: 'user_interaction',
        user_email: profile.email,
        metadata: {
          interaction_type: interaction.type,
          engagement_score: newEngagementScore,
          ...interaction.data
        }
      });

      logger.debug('User interaction tracked', { userId, type: interaction.type });
    } catch (error) {
      logger.error('Failed to track user interaction', error as Error, { userId, interaction });
    }
  }

  async addUserNote(userId: string, note: {
    content: string;
    created_by: string;
    type?: UserProfile['notes'][0]['type'];
  }): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        throw new Error('User profile not found');
      }

      const newNote = {
        id: `note_${Date.now()}`,
        content: note.content,
        created_by: note.created_by,
        created_at: new Date().toISOString(),
        type: note.type || 'note'
      };

      await this.updateUserProfile(userId, {
        notes: [...profile.notes, newNote]
      });

      logger.info('User note added', { userId, noteType: note.type, createdBy: note.created_by });
    } catch (error) {
      logger.error('Failed to add user note', error as Error, { userId, note });
      throw error;
    }
  }

  async updateUserStatus(userId: string, newStatus: UserProfile['status']): Promise<void> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        throw new Error('User profile not found');
      }

      // Determine new funnel stage based on status
      let newStage = profile.conversion_funnel.stage;
      switch (newStatus) {
        case 'waitlist':
          newStage = 'interest';
          break;
        case 'beta':
          newStage = 'trial';
          break;
        case 'active':
          newStage = 'purchase';
          break;
        case 'VIP':
          newStage = 'retention';
          break;
      }

      await this.updateUserProfile(userId, {
        status: newStatus,
        conversion_funnel: {
          stage: newStage,
          progression_date: new Date().toISOString(),
          conversion_probability: this.calculateConversionProbability(newStage, profile.source)
        }
      });

      // Track status change
      await analytics.trackEvent({
        event_type: 'user_status_changed',
        user_email: profile.email,
        metadata: {
          old_status: profile.status,
          new_status: newStatus,
          funnel_stage: newStage
        }
      });

      logger.info('User status updated', { userId, oldStatus: profile.status, newStatus });
    } catch (error) {
      logger.error('Failed to update user status', error as Error, { userId, newStatus });
      throw error;
    }
  }

  async getUsersBySegment(segment: {
    status?: UserProfile['status'][];
    tier?: UserProfile['tier'][];
    engagement_min?: number;
    engagement_max?: number;
    source?: string[];
    tags?: string[];
    last_active_since?: string;
  }): Promise<UserProfile[]> {
    try {
      // In a real implementation, this would be a database query
      // For now, we'll use in-memory filtering
      const allUsers = await this.getAllUsers();
      
      return allUsers.filter(user => {
        if (segment.status && !segment.status.includes(user.status)) return false;
        if (segment.tier && !segment.tier.includes(user.tier)) return false;
        if (segment.engagement_min && user.engagement_score < segment.engagement_min) return false;
        if (segment.engagement_max && user.engagement_score > segment.engagement_max) return false;
        if (segment.source && !segment.source.includes(user.source)) return false;
        if (segment.tags && !segment.tags.some(tag => user.tags.includes(tag))) return false;
        if (segment.last_active_since && new Date(user.last_active) < new Date(segment.last_active_since)) return false;
        
        return true;
      });
    } catch (error) {
      logger.error('Failed to get users by segment', error as Error, segment);
      throw error;
    }
  }

  async getCRMInsights(): Promise<CRMInsights> {
    try {
      const allUsers = await this.getAllUsers();
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate basic metrics
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter(user => 
        new Date(user.last_active) > thirtyDaysAgo
      ).length;

      // Calculate churn rate (users inactive for 30+ days)
      const churnedUsers = allUsers.filter(user => 
        new Date(user.last_active) <= thirtyDaysAgo && user.status !== 'churned'
      ).length;
      const churnRate = totalUsers > 0 ? (churnedUsers / totalUsers) * 100 : 0;

      // Average engagement score
      const avgEngagementScore = totalUsers > 0 
        ? allUsers.reduce((sum, user) => sum + user.engagement_score, 0) / totalUsers 
        : 0;

      // Conversion rates by stage
      const stageUsers = allUsers.reduce((acc, user) => {
        acc[user.conversion_funnel.stage] = (acc[user.conversion_funnel.stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const conversionRates = {
        'awareness_to_interest': this.calculateStageConversion(stageUsers, 'awareness', 'interest'),
        'interest_to_consideration': this.calculateStageConversion(stageUsers, 'interest', 'consideration'),
        'consideration_to_trial': this.calculateStageConversion(stageUsers, 'consideration', 'trial'),
        'trial_to_purchase': this.calculateStageConversion(stageUsers, 'trial', 'purchase'),
        'purchase_to_retention': this.calculateStageConversion(stageUsers, 'purchase', 'retention')
      };

      // Top features by interaction
      const featureUsage = allUsers.flatMap(user => user.interactions)
        .filter(interaction => interaction.type === 'feature_use')
        .reduce((acc, interaction) => {
          const feature = interaction.data.feature || 'unknown';
          acc[feature] = (acc[feature] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topFeatures = Object.entries(featureUsage)
        .map(([feature, usage]) => ({ feature, usage }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 10);

      // User growth trend (last 30 days)
      const userGrowthTrend = this.calculateGrowthTrend(allUsers, 30);

      // Cohort analysis (simplified)
      const cohortAnalysis = this.calculateCohortAnalysis(allUsers);

      return {
        totalUsers,
        activeUsers,
        churnRate,
        avgEngagementScore,
        conversionRates,
        topFeatures,
        userGrowthTrend,
        cohortAnalysis
      };
    } catch (error) {
      logger.error('Failed to generate CRM insights', error as Error);
      throw error;
    }
  }

  private calculateConversionProbability(stage: string, source: string, engagementScore: number = 0): number {
    const baseRates = {
      awareness: 0.1,
      interest: 0.25,
      consideration: 0.4,
      trial: 0.6,
      purchase: 0.8,
      retention: 0.9
    };

    const sourceMultipliers = {
      organic: 1.0,
      referral: 1.3,
      marketing: 0.8,
      beta_code: 1.5
    };

    const baseRate = baseRates[stage as keyof typeof baseRates] || 0.1;
    const sourceMultiplier = sourceMultipliers[source as keyof typeof sourceMultipliers] || 1.0;
    const engagementBonus = Math.min(engagementScore / 100, 0.3); // Max 30% boost

    return Math.min(baseRate * sourceMultiplier + engagementBonus, 0.95);
  }

  private calculateStageConversion(stageUsers: Record<string, number>, fromStage: string, toStage: string): number {
    const fromCount = stageUsers[fromStage] || 0;
    const toCount = stageUsers[toStage] || 0;
    return fromCount > 0 ? (toCount / fromCount) * 100 : 0;
  }

  private calculateGrowthTrend(users: UserProfile[], days: number): Array<{ date: string; newUsers: number; totalUsers: number }> {
    const trend: { date: string; newUsers: number; totalUsers: number }[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const newUsers = users.filter(user => 
        user.first_seen.split('T')[0] === dateStr
      ).length;
      
      const totalUsers = users.filter(user => 
        new Date(user.first_seen) <= date
      ).length;
      
      trend.push({ date: dateStr, newUsers, totalUsers });
    }
    
    return trend;
  }

  private calculateCohortAnalysis(users: UserProfile[]): Array<{ cohort: string; users: number; retention: Record<string, number> }> {
    // Simplified cohort analysis by month
    const cohorts = users.reduce((acc, user) => {
      const cohort = user.first_seen.substring(0, 7); // YYYY-MM
      if (!acc[cohort]) acc[cohort] = [];
      acc[cohort].push(user);
      return acc;
    }, {} as Record<string, UserProfile[]>);

    return Object.entries(cohorts).map(([cohort, cohortUsers]) => ({
      cohort,
      users: cohortUsers.length,
      retention: this.calculateRetentionRates(cohortUsers)
    }));
  }

  private calculateRetentionRates(cohortUsers: UserProfile[]): Record<string, number> {
    const now = new Date();
    const retention: Record<string, number> = {};
    
    [7, 14, 30, 60, 90].forEach(days => {
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const retainedUsers = cohortUsers.filter(user => 
        new Date(user.last_active) >= cutoffDate
      ).length;
      
      retention[`day_${days}`] = cohortUsers.length > 0 
        ? (retainedUsers / cohortUsers.length) * 100 
        : 0;
    });
    
    return retention;
  }

  // Storage methods (would be database operations in production)
  private async saveUserProfile(profile: UserProfile): Promise<void> {
    // In production, this would save to database
    logger.debug('User profile saved', { userId: profile.id });
  }

  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    // In production, this would query database
    return null;
  }

  private async getAllUsers(): Promise<UserProfile[]> {
    // In production, this would query database
    return [];
  }
}

export const crm = new CRMManager();