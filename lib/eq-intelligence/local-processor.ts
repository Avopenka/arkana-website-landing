/**
 * Local EQ Processing Engine
 * On-device emotional intelligence processing with zero data leakage
 */

import { 
  EQMetrics, 
  EQPattern, 
  EQPatternType, 
  PrivacyLevel,
  PrivateEQData,
  EncryptionStandard,
  LocalEQCoach,
  CoachingStyle,
  GrowthMilestone
} from './types';
import { webcrypto } from 'crypto';

export class LocalEQProcessor {
  private readonly crypto = webcrypto;
  private encryptionKey: CryptoKey | null = null;
  private processingQueue: Map<string, Promise<any>> = new Map();
  
  constructor(private deviceId: string) {}

  /**
   * Initialize local encryption with user-derived key
   * Key never leaves device, derived from user's biometric or passphrase
   */
  async initializeEncryption(userSecret: string): Promise<void> {
    const encoder = new TextEncoder();
    const keyMaterial = await this.crypto.subtle.importKey(
      'raw',
      encoder.encode(userSecret),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derive a strong key from user secret
    this.encryptionKey = await this.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(this.deviceId), // Device-specific salt
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Process emotional signals locally
   * All processing happens on device, no network calls
   */
  async processEmotionalSignals(signals: EmotionalSignal[]): Promise<EQMetrics> {
    // Ensure we're not accidentally sending data
    if (typeof window !== 'undefined' && 'navigator' in window) {
      // Temporarily override fetch to prevent accidental data leaks
      const originalFetch = window.fetch;
      window.fetch = () => {
        throw new Error('Network access blocked during EQ processing');
      };
      
      try {
        return await this._processSignalsLocally(signals);
      } finally {
        window.fetch = originalFetch;
      }
    }
    
    return await this._processSignalsLocally(signals);
  }

  private async _processSignalsLocally(signals: EmotionalSignal[]): Promise<EQMetrics> {
    // Core EQ dimensions processing
    const metrics: EQMetrics = {
      selfAwareness: this.calculateSelfAwareness(signals),
      selfRegulation: this.calculateSelfRegulation(signals),
      motivation: this.calculateMotivation(signals),
      empathy: this.calculateEmpathy(signals),
      socialSkills: this.calculateSocialSkills(signals),
      
      // Advanced metrics
      emotionalResilience: this.calculateResilience(signals),
      emotionalFlexibility: this.calculateFlexibility(signals),
      emotionalDepth: this.calculateDepth(signals),
      emotionalAuthenticity: this.calculateAuthenticity(signals),
      
      // Metadata
      lastUpdated: new Date(),
      confidenceScore: this.calculateConfidence(signals),
      dataPoints: signals.length
    };

    // Store encrypted locally
    await this.storeMetricsLocally(metrics);
    
    return metrics;
  }

  /**
   * Pattern detection without exposing raw data
   */
  async detectPatterns(metrics: EQMetrics, history: EQMetrics[]): Promise<EQPattern[]> {
    const patterns: EQPattern[] = [];

    // Stress resilience pattern
    if (this.detectStressResilience(metrics, history)) {
      patterns.push({
        patternId: this.generatePatternId(),
        patternType: EQPatternType.STRESS_RESILIENCE,
        confidence: 0.85,
        detectedAt: new Date(),
        anonymizedInsight: 'Strong recovery from emotional challenges detected',
        personalGrowthSuggestion: 'Your resilience is growing. Consider sharing this strength with others who might benefit.',
        privacyLevel: PrivacyLevel.DEVICE_ONLY
      });
    }

    // Empathy spike pattern
    if (this.detectEmpathySpike(metrics, history)) {
      patterns.push({
        patternId: this.generatePatternId(),
        patternType: EQPatternType.EMPATHY_SPIKE,
        confidence: 0.92,
        detectedAt: new Date(),
        anonymizedInsight: 'Heightened empathetic response patterns observed',
        personalGrowthSuggestion: 'Your empathy is exceptionally strong right now. This is a powerful time for deep connections.',
        privacyLevel: PrivacyLevel.DEVICE_ONLY
      });
    }

    return patterns;
  }

  /**
   * Local EQ coaching without external dependencies
   */
  async generateCoachingInsights(
    metrics: EQMetrics,
    patterns: EQPattern[],
    style: CoachingStyle = CoachingStyle.SUPPORTIVE_COMPANION
  ): Promise<LocalEQCoach> {
    const insights = this.generatePersonalizedInsights(metrics, patterns, style);
    const milestones = this.checkGrowthMilestones(metrics, patterns);

    return {
      coachingStyle: style,
      personalizedInsights: insights,
      growthMilestones: milestones,
      localModelVersion: '1.0.0',
      lastTrainingUpdate: new Date()
    };
  }

  /**
   * Private storage with encryption
   */
  private async storeMetricsLocally(metrics: EQMetrics): Promise<void> {
    if (!this.encryptionKey) {
      throw new Error('Encryption not initialized');
    }

    const dataToEncrypt = JSON.stringify(metrics);
    const encoder = new TextEncoder();
    const data = encoder.encode(dataToEncrypt);

    // Generate IV for each encryption
    const iv = this.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await this.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      data
    );

    const privateData: PrivateEQData = {
      encryptedMetrics: this.arrayBufferToBase64(encryptedData),
      encryptionStandard: EncryptionStandard.AES256_GCM,
      deviceId: this.deviceId,
      localStorageVersion: 1,
      syncEnabled: false
    };

    // Store in IndexedDB (local only)
    await this.storeInIndexedDB(privateData);
  }

  /**
   * Zero-knowledge proof generation
   */
  async generateZKProof(claim: string, metrics: EQMetrics): Promise<string> {
    // Simple ZK proof simulation
    // In production, use proper ZK libraries
    const proof = {
      claim,
      timestamp: Date.now(),
      commitment: await this.hashMetrics(metrics),
      challenge: this.crypto.getRandomValues(new Uint8Array(32)),
      response: 'proof_without_revealing_data'
    };

    return JSON.stringify(proof);
  }

  // Helper methods for EQ calculations
  private calculateSelfAwareness(signals: EmotionalSignal[]): number {
    // Complex calculation based on signal patterns
    const awarenessFactors = signals.filter(s => s.type === 'self_reflection');
    const score = (awarenessFactors.length / signals.length) * 100;
    return Math.min(100, Math.max(0, score * 1.2)); // Normalized 0-100
  }

  private calculateSelfRegulation(signals: EmotionalSignal[]): number {
    const regulationEvents = signals.filter(s => s.type === 'regulation_success');
    const challengeEvents = signals.filter(s => s.type === 'emotional_challenge');
    
    if (challengeEvents.length === 0) return 50; // Neutral if no challenges
    
    const successRate = regulationEvents.length / challengeEvents.length;
    return Math.min(100, successRate * 100);
  }

  private calculateMotivation(signals: EmotionalSignal[]): number {
    const motivationSignals = signals.filter(s => 
      s.type === 'goal_pursuit' || s.type === 'persistence'
    );
    return (motivationSignals.length / signals.length) * 100;
  }

  private calculateEmpathy(signals: EmotionalSignal[]): number {
    const empathySignals = signals.filter(s => 
      s.type === 'emotional_resonance' || s.type === 'perspective_taking'
    );
    const depth = empathySignals.reduce((sum, s) => sum + (s.intensity || 0), 0);
    return Math.min(100, (depth / signals.length) * 20);
  }

  private calculateSocialSkills(signals: EmotionalSignal[]): number {
    const socialSignals = signals.filter(s => s.category === 'social');
    const positiveOutcomes = socialSignals.filter(s => s.outcome === 'positive');
    
    if (socialSignals.length === 0) return 50;
    
    return (positiveOutcomes.length / socialSignals.length) * 100;
  }

  private calculateResilience(signals: EmotionalSignal[]): number {
    const challenges = signals.filter(s => s.type === 'emotional_challenge');
    const recoveries = signals.filter(s => s.type === 'recovery');
    
    if (challenges.length === 0) return 70; // Good baseline
    
    const resilience = (recoveries.length / challenges.length) * 100;
    return Math.min(100, resilience * 1.1); // Slight boost for recovery
  }

  private calculateFlexibility(signals: EmotionalSignal[]): number {
    const transitions = signals.filter(s => s.type === 'emotional_transition');
    const smoothTransitions = transitions.filter(s => s.smoothness && s.smoothness > 0.7);
    
    if (transitions.length === 0) return 60;
    
    return (smoothTransitions.length / transitions.length) * 100;
  }

  private calculateDepth(signals: EmotionalSignal[]): number {
    const avgIntensity = signals.reduce((sum, s) => sum + (s.intensity || 0), 0) / signals.length;
    const complexityScore = this.calculateEmotionalComplexity(signals);
    
    return (avgIntensity * 50 + complexityScore * 50) / 100;
  }

  private calculateAuthenticity(signals: EmotionalSignal[]): number {
    const authenticSignals = signals.filter(s => s.authentic === true);
    return (authenticSignals.length / signals.length) * 100;
  }

  private calculateConfidence(signals: EmotionalSignal[]): number {
    // Confidence based on signal quality and consistency
    const qualityScore = signals.reduce((sum, s) => sum + (s.quality || 0), 0) / signals.length;
    const consistencyScore = this.calculateConsistency(signals);
    
    return (qualityScore * 60 + consistencyScore * 40) / 100;
  }

  private calculateEmotionalComplexity(signals: EmotionalSignal[]): number {
    const uniqueTypes = new Set(signals.map(s => s.type)).size;
    const uniqueCategories = new Set(signals.map(s => s.category)).size;
    
    return Math.min(100, (uniqueTypes + uniqueCategories) * 5);
  }

  private calculateConsistency(signals: EmotionalSignal[]): number {
    if (signals.length < 2) return 100;
    
    let consistencyScore = 0;
    for (let i = 1; i < signals.length; i++) {
      const similarity = this.calculateSignalSimilarity(signals[i-1], signals[i]);
      consistencyScore += similarity;
    }
    
    return (consistencyScore / (signals.length - 1)) * 100;
  }

  private calculateSignalSimilarity(s1: EmotionalSignal, s2: EmotionalSignal): number {
    let similarity = 0;
    if (s1.type === s2.type) similarity += 0.3;
    if (s1.category === s2.category) similarity += 0.3;
    if (Math.abs((s1.intensity || 0) - (s2.intensity || 0)) < 0.2) similarity += 0.4;
    
    return similarity;
  }

  // Pattern detection helpers
  private detectStressResilience(current: EQMetrics, history: EQMetrics[]): boolean {
    if (history.length < 3) return false;
    
    const recent = history.slice(-3);
    const avgResilience = recent.reduce((sum, m) => sum + m.emotionalResilience, 0) / 3;
    
    return current.emotionalResilience > avgResilience * 1.2;
  }

  private detectEmpathySpike(current: EQMetrics, history: EQMetrics[]): boolean {
    if (history.length < 2) return false;
    
    const recent = history.slice(-2);
    const avgEmpathy = recent.reduce((sum, m) => sum + m.empathy, 0) / 2;
    
    return current.empathy > avgEmpathy * 1.3 && current.empathy > 75;
  }

  private generatePatternId(): string {
    return `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePersonalizedInsights(
    metrics: EQMetrics,
    patterns: EQPattern[],
    style: CoachingStyle
  ): string[] {
    const insights: string[] = [];

    // Style-specific insight generation
    switch (style) {
      case CoachingStyle.GENTLE_GUIDE:
        insights.push(this.generateGentleInsight(metrics));
        break;
      case CoachingStyle.DIRECT_MENTOR:
        insights.push(this.generateDirectInsight(metrics));
        break;
      case CoachingStyle.SOCRATIC_QUESTIONER:
        insights.push(this.generateSocraticInsight(metrics));
        break;
      case CoachingStyle.SUPPORTIVE_COMPANION:
        insights.push(this.generateSupportiveInsight(metrics));
        break;
    }

    // Pattern-based insights
    patterns.forEach(pattern => {
      insights.push(pattern.personalGrowthSuggestion);
    });

    return insights;
  }

  private generateGentleInsight(metrics: EQMetrics): string {
    if (metrics.selfAwareness > 80) {
      return "Your self-awareness is beautifully developed. Notice how this clarity ripples into all areas of your life.";
    }
    return "Each moment of reflection strengthens your self-awareness. You're on a wonderful journey.";
  }

  private generateDirectInsight(metrics: EQMetrics): string {
    if (metrics.selfRegulation < 50) {
      return "Your emotional regulation needs attention. Practice pause-and-breathe techniques before reacting.";
    }
    return "Strong emotional regulation detected. Use this skill to mentor others.";
  }

  private generateSocraticInsight(metrics: EQMetrics): string {
    return "What patterns do you notice in your emotional responses? How might greater awareness serve you?";
  }

  private generateSupportiveInsight(metrics: EQMetrics): string {
    return "You're doing important inner work. Every step forward, no matter how small, is valuable progress.";
  }

  private checkGrowthMilestones(metrics: EQMetrics, patterns: EQPattern[]): GrowthMilestone[] {
    const milestones: GrowthMilestone[] = [];

    // Check for specific achievements
    if (metrics.empathy > 90 && !this.hasMilestone('empathy_master')) {
      milestones.push({
        milestoneId: 'empathy_master',
        achievedAt: new Date(),
        insightGained: 'You\'ve reached exceptional empathy levels',
        nextSteps: ['Share your gift wisely', 'Protect your energy boundaries'],
        shareable: true,
        anonymizedVersion: 'User achieved Empathy Master level'
      });
    }

    return milestones;
  }

  private hasMilestone(milestoneId: string): boolean {
    // Check local storage for existing milestones
    // Implementation depends on storage strategy
    return false;
  }

  // Utility methods
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private async hashMetrics(metrics: EQMetrics): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(metrics));
    const hash = await this.crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(hash);
  }

  private async storeInIndexedDB(data: PrivateEQData): Promise<void> {
    // IndexedDB implementation for local storage
    // This is a placeholder - implement based on your IndexedDB strategy
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      // Store data locally
    }
  }
}

// Type definitions for emotional signals
export interface EmotionalSignal {
  type: string;
  category?: string;
  intensity?: number;
  timestamp: Date;
  authentic?: boolean;
  outcome?: 'positive' | 'negative' | 'neutral';
  quality?: number; // 0-1
  smoothness?: number; // For transitions
}