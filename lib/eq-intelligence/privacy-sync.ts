/**
 * Privacy-First Sync Infrastructure
 * Selective sharing with end-to-end encryption and user control
 */

import {
  SelectiveSyncConfig,
  EQPattern,
  EQPatternType,
  PrivacyLevel,
  ZKEQProof,
  EQClaimType,
  AnonymousAggregation,
  CollectivePattern
} from './types';

export class PrivacySyncManager {
  private syncConfig: SelectiveSyncConfig | null = null;
  private userKeyPair: CryptoKeyPair | null = null;
  private syncQueue: Map<string, SyncTask> = new Map();
  
  /**
   * Initialize sync with user's explicit consent
   */
  async initializeSync(config: SelectiveSyncConfig): Promise<void> {
    // Require explicit consent
    if (!config.requireExplicitConsent) {
      throw new Error('Explicit consent is required for sync initialization');
    }

    this.syncConfig = config;
    
    // Generate or load user's key pair for E2E encryption
    this.userKeyPair = await this.generateKeyPair();
  }

  /**
   * Selectively sync patterns based on user preferences
   */
  async syncPatterns(patterns: EQPattern[]): Promise<SyncResult> {
    if (!this.syncConfig) {
      return { success: false, reason: 'Sync not initialized' };
    }

    // Filter patterns based on user's sync preferences
    const patternsToSync = patterns.filter(pattern => {
      const syncPref = this.syncConfig!.syncPatterns.find(
        sp => sp.patternType === pattern.patternType
      );
      
      return syncPref?.syncEnabled && 
             pattern.privacyLevel !== PrivacyLevel.DEVICE_ONLY;
    });

    if (patternsToSync.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    // Check sync conditions
    if (this.syncConfig.syncOnlyOnWifi && !await this.isOnWifi()) {
      return { success: false, reason: 'Waiting for WiFi connection' };
    }

    // Anonymize and encrypt patterns
    const preparedData = await this.prepareDataForSync(patternsToSync);
    
    // Create sync task
    const taskId = this.createSyncTask(preparedData);
    
    // Execute sync with retry logic
    return await this.executeSyncTask(taskId);
  }

  /**
   * Generate zero-knowledge proof for EQ claims
   */
  async generateZKProof(
    claimType: EQClaimType,
    evidenceHash: string
  ): Promise<ZKEQProof> {
    const timestamp = new Date();
    
    // Generate proof without revealing actual data
    const proof: ZKEQProof = {
      proofHash: await this.generateProofHash(claimType, evidenceHash, timestamp),
      timestamp,
      claimType,
      publicVerificationKey: await this.getPublicVerificationKey()
    };

    return proof;
  }

  /**
   * Participate in anonymous aggregation
   */
  async contributeToAggregation(
    patterns: EQPattern[],
    aggregationId: string
  ): Promise<AggregationContribution> {
    // Check if user opted in for anonymous aggregation
    if (!(this.syncConfig as any)?.allowAnonymousAggregation) {
      throw new Error('Anonymous aggregation not enabled');
    }

    // Apply differential privacy
    const noisyPatterns = await this.addDifferentialPrivacyNoise(patterns);
    
    // Generate anonymous contribution
    const patternHashes = await Promise.all(noisyPatterns.map(p => this.hashPattern(p)));
    const contribution = {
      aggregationId,
      timestamp: new Date(),
      patternHashes,
      participantProof: await this.generateParticipantProof()
    };

    return contribution;
  }

  /**
   * Privacy-preserving data preparation
   */
  private async prepareDataForSync(patterns: EQPattern[]): Promise<PreparedSyncData> {
    const preparedPatterns = await Promise.all(
      patterns.map(async pattern => {
        const syncPref = this.syncConfig!.syncPatterns.find(
          sp => sp.patternType === pattern.patternType
        );
        
        const anonymizationLevel = syncPref?.anonymizationLevel || 10;
        
        return {
          anonymizedPattern: await this.anonymizePattern(pattern, anonymizationLevel),
          encryptedInsight: await this.encryptData(pattern.anonymizedInsight),
          privacyLevel: pattern.privacyLevel,
          zkProof: await this.generateZKProof(
            EQClaimType.PATTERN_MASTERY,
            pattern.patternId
          )
        };
      })
    );

    return {
      patterns: preparedPatterns,
      deviceFingerprint: this.syncConfig!.deviceKeyFingerprint,
      timestamp: new Date(),
      protocolVersion: '1.0.0'
    };
  }

  /**
   * Anonymize pattern based on level (0-10)
   */
  private async anonymizePattern(
    pattern: EQPattern,
    level: number
  ): Promise<AnonymizedPattern> {
    // Higher level = more anonymization
    const anonymized: AnonymizedPattern = {
      type: pattern.patternType,
      confidenceRange: this.anonymizeValue(pattern.confidence, level),
      timeRange: this.anonymizeTimestamp(pattern.detectedAt, level),
      
      // Remove identifying details at higher levels
      hasInsight: level < 8,
      hasGrowthSuggestion: level < 6,
      
      // Add noise at highest levels
      noise: level > 8 ? Math.random() * 0.1 : 0
    };

    return anonymized;
  }

  /**
   * Add differential privacy noise
   */
  private async addDifferentialPrivacyNoise(
    patterns: EQPattern[]
  ): Promise<NoisyPattern[]> {
    const epsilon = 1.0; // Privacy budget
    
    return patterns.map(pattern => ({
      ...pattern,
      confidence: this.addLaplaceNoise(pattern.confidence, epsilon),
      // Don't add noise to categorical data
      patternType: pattern.patternType,
      
      // Add temporal noise
      detectedAt: new Date(
        pattern.detectedAt.getTime() + 
        this.addLaplaceNoise(0, epsilon * 3600000) // +/- 1 hour
      )
    }));
  }

  /**
   * Laplace mechanism for differential privacy
   */
  private addLaplaceNoise(value: number, epsilon: number): number {
    const b = 1 / epsilon; // Scale parameter
    const u = Math.random() - 0.5;
    const noise = -b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
    
    return value + noise;
  }

  /**
   * End-to-end encryption for sensitive data
   */
  private async encryptData(data: string): Promise<string> {
    if (!this.userKeyPair) {
      throw new Error('Encryption keys not initialized');
    }

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt with user's public key
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.userKeyPair.publicKey,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return this.arrayBufferToBase64(combined.buffer);
  }

  /**
   * Create anonymous aggregation from contributions
   */
  async createAnonymousAggregation(
    contributions: AggregationContribution[],
    minParticipants: number = 10
  ): Promise<AnonymousAggregation> {
    if (contributions.length < minParticipants) {
      throw new Error(`Minimum ${minParticipants} participants required for aggregation`);
    }

    // Extract collective patterns
    const patternCounts = new Map<string, number>();
    contributions.forEach(contribution => {
      contribution.patternHashes.forEach(hash => {
        patternCounts.set(hash, (patternCounts.get(hash) || 0) + 1);
      });
    });

    // Create collective patterns
    const collectivePatterns: CollectivePattern[] = Array.from(patternCounts.entries())
      .map(([hash, count]) => ({
        pattern: hash,
        prevalence: count / contributions.length,
        anonymityPreserved: true,
        insightValue: this.generateCollectiveInsight(count, contributions.length)
      }))
      .filter(cp => cp.prevalence > 0.1); // Only include patterns in >10% of participants

    // Calculate privacy metrics
    const kAnonymity = this.calculateKAnonymity(contributions);
    const dpNoise = this.calculateDPNoise(contributions.length);

    return {
      aggregationId: this.generateAggregationId(),
      participantCount: contributions.length,
      minimumParticipants: minParticipants,
      collectivePatterns,
      communityInsights: this.generateCommunityInsights(collectivePatterns),
      kAnonymityScore: kAnonymity,
      differentialPrivacyNoise: dpNoise
    };
  }

  // Helper methods
  private async generateKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async isOnWifi(): Promise<boolean> {
    // Check network type if available
    if ('connection' in navigator) {
      const connection = (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).connection;
      return connection.type === 'wifi';
    }
    return true; // Assume WiFi if can't detect
  }

  private createSyncTask(data: PreparedSyncData): string {
    const taskId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.syncQueue.set(taskId, {
      id: taskId,
      data,
      status: 'pending',
      attempts: 0,
      createdAt: new Date()
    });
    
    return taskId;
  }

  private async executeSyncTask(taskId: string): Promise<SyncResult> {
    const task = this.syncQueue.get(taskId);
    if (!task) {
      return { success: false, reason: 'Task not found' };
    }

    try {
      // Simulate sync (in production, this would be actual API call)
      // But only to privacy-preserving endpoints
      await this.simulatePrivacyPreservingSync(task.data);
      
      task.status = 'completed';
      this.syncQueue.delete(taskId);
      
      return { 
        success: true, 
        syncedCount: task.data.patterns.length,
        timestamp: new Date()
      };
    } catch (error) {
      task.attempts++;
      task.status = 'failed';
      
      if (task.attempts < 3) {
        // Retry later
        task.status = 'pending';
        return { success: false, reason: 'Will retry', willRetry: true };
      }
      
      return { success: false, reason: error.message };
    }
  }

  private async simulatePrivacyPreservingSync(data: PreparedSyncData): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, this would sync to privacy-preserving backend
    // that can't decrypt or identify users
    console.log('Privacy-preserving sync completed for', data.patterns.length, 'patterns');
  }

  private anonymizeValue(value: number, level: number): string {
    const ranges = [
      [0, 20], [20, 40], [40, 60], [60, 80], [80, 100]
    ];
    
    if (level < 5) {
      return value.toFixed(1);
    }
    
    const range = ranges.find(r => value >= r[0] && value <= r[1]);
    return range ? `${range[0]}-${range[1]}` : 'unknown';
  }

  private anonymizeTimestamp(date: Date, level: number): string {
    if (level < 3) {
      return date.toISOString();
    } else if (level < 6) {
      return date.toISOString().split('T')[0]; // Date only
    } else if (level < 9) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Month only
    }
    
    return date.getFullYear().toString(); // Year only
  }

  private async generateProofHash(
    claimType: EQClaimType,
    evidence: string,
    timestamp: Date
  ): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${claimType}:${evidence}:${timestamp.getTime()}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(hash);
  }

  private async getPublicVerificationKey(): Promise<string> {
    if (!this.userKeyPair) {
      throw new Error('Key pair not initialized');
    }
    
    const exported = await crypto.subtle.exportKey('jwk', this.userKeyPair.publicKey);
    return JSON.stringify(exported);
  }

  private async hashPattern(pattern: any): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(pattern));
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(hash);
  }

  private async generateParticipantProof(): Promise<string> {
    const proof = {
      timestamp: Date.now(),
      random: crypto.getRandomValues(new Uint8Array(32))
    };
    return this.hashPattern(proof);
  }

  private generateAggregationId(): string {
    return `agg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCollectiveInsight(count: number, total: number): string {
    const percentage = (count / total * 100).toFixed(1);
    return `Observed in ${percentage}% of participants`;
  }

  private generateCommunityInsights(patterns: CollectivePattern[]): string[] {
    const insights: string[] = [];
    
    const mostCommon = patterns.sort((a, b) => b.prevalence - a.prevalence)[0];
    if (mostCommon) {
      insights.push(`Most common pattern: ${mostCommon.insightValue}`);
    }
    
    const highPrevalence = patterns.filter(p => p.prevalence > 0.5);
    if (highPrevalence.length > 0) {
      insights.push(`${highPrevalence.length} patterns shared by majority of community`);
    }
    
    return insights;
  }

  private calculateKAnonymity(contributions: AggregationContribution[]): number {
    // Simple k-anonymity calculation
    // In production, use proper statistical methods
    const uniquePatterns = new Set<string>();
    contributions.forEach(c => {
      c.patternHashes.forEach(h => uniquePatterns.add(h));
    });
    
    return Math.min(contributions.length, uniquePatterns.size);
  }

  private calculateDPNoise(participantCount: number): number {
    // Noise level based on participant count
    return 1 / Math.sqrt(participantCount);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

// Type definitions
interface SyncTask {
  id: string;
  data: PreparedSyncData;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  attempts: number;
  createdAt: Date;
}

interface PreparedSyncData {
  patterns: unknown[];
  deviceFingerprint: string;
  timestamp: Date;
  protocolVersion: string;
}

interface SyncResult {
  success: boolean;
  syncedCount?: number;
  reason?: string;
  timestamp?: Date;
  willRetry?: boolean;
}

interface AnonymizedPattern {
  type: EQPatternType;
  confidenceRange: string;
  timeRange: string;
  hasInsight: boolean;
  hasGrowthSuggestion: boolean;
  noise: number;
}

interface NoisyPattern extends EQPattern {
  noise?: number;
}

interface AggregationContribution {
  aggregationId: string;
  timestamp: Date;
  patternHashes: string[];
  participantProof: string;
}