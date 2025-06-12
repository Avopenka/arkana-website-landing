/**
 * Privacy-First EQ Intelligence Types
 * Core types for emotional intelligence processing with privacy guarantees
 */

// Privacy Council approved encryption standards
export enum EncryptionStandard {
  AES256_GCM = 'AES256_GCM',
  CHACHA20_POLY1305 = 'CHACHA20_POLY1305',
  XCHACHA20_POLY1305 = 'XCHACHA20_POLY1305'
}

// EQ Intelligence Council defined metrics
export interface EQMetrics {
  // Core emotional dimensions
  selfAwareness: number; // 0-100
  selfRegulation: number; // 0-100
  motivation: number; // 0-100
  empathy: number; // 0-100
  socialSkills: number; // 0-100
  
  // Advanced metrics
  emotionalResilience: number;
  emotionalFlexibility: number;
  emotionalDepth: number;
  emotionalAuthenticity: number;
  
  // Metadata (never leaves device)
  lastUpdated: Date;
  confidenceScore: number;
  dataPoints: number;
}

// Privacy-first storage format
export interface PrivateEQData {
  // Encrypted on device with user's key
  encryptedMetrics: string;
  encryptionStandard: EncryptionStandard;
  
  // Local-only metadata
  deviceId: string;
  localStorageVersion: number;
  
  // Optional sync markers
  syncEnabled: boolean;
  lastSyncHash?: string; // Zero-knowledge proof
  selectiveSyncPatterns?: string[]; // User-chosen data to share
}

// EQ Pattern Recognition
export interface EQPattern {
  patternId: string;
  patternType: EQPatternType;
  confidence: number;
  detectedAt: Date;
  
  // Privacy-preserving insights
  anonymizedInsight: string;
  personalGrowthSuggestion: string;
  
  // Never stored raw emotional data
  privacyLevel: PrivacyLevel;
}

export enum EQPatternType {
  STRESS_RESILIENCE = 'STRESS_RESILIENCE',
  EMPATHY_SPIKE = 'EMPATHY_SPIKE',
  SOCIAL_HARMONY = 'SOCIAL_HARMONY',
  EMOTIONAL_BREAKTHROUGH = 'EMOTIONAL_BREAKTHROUGH',
  REGULATION_SUCCESS = 'REGULATION_SUCCESS',
  AWARENESS_EXPANSION = 'AWARENESS_EXPANSION'
}

export enum PrivacyLevel {
  DEVICE_ONLY = 'DEVICE_ONLY', // Never leaves device
  ANONYMOUS_AGGREGATE = 'ANONYMOUS_AGGREGATE', // Can contribute to anonymous pools
  SELECTIVE_SHARE = 'SELECTIVE_SHARE', // User explicitly chooses what to share
  RESEARCH_CONTRIBUTION = 'RESEARCH_CONTRIBUTION' // Opt-in for research with consent
}

// Monetization Council approved value models
export interface EQValueCreation {
  // Anonymous marketplace participation
  anonymousPatternId?: string;
  marketplaceListingEnabled: boolean;
  
  // Privacy-preserving monetization
  revenueShare: {
    userPercentage: number; // User keeps majority
    platformPercentage: number;
    researchContribution?: number;
  };
  
  // Value metrics (computed locally)
  insightValue: number;
  rarityScore: number;
  impactPotential: number;
}

// User Experience Council approved controls
export interface EQPrivacyControls {
  // Granular privacy settings
  allowLocalProcessing: boolean;
  allowAnonymousAggregation: boolean;
  allowSelectiveSync: boolean;
  allowResearchParticipation: boolean;
  
  // Data boundaries
  dataBoundaries: {
    emotionalDepthLimit: number; // How deep AI can analyze
    retentionPeriodDays: number; // Auto-delete old data
    aggregationThreshold: number; // Min users before aggregating
  };
  
  // Transparency settings
  showProcessingIndicators: boolean;
  showDataUsageReports: boolean;
  enablePrivacyAuditLog: boolean;
}

// Zero-knowledge proof for EQ verification
export interface ZKEQProof {
  proofHash: string;
  timestamp: Date;
  claimType: EQClaimType;
  
  // Verify without revealing
  publicVerificationKey: string;
  privateProofData?: never; // Explicitly never sent
}

export enum EQClaimType {
  HIGH_EMPATHY = 'HIGH_EMPATHY',
  EMOTIONAL_STABILITY = 'EMOTIONAL_STABILITY',
  GROWTH_ACHIEVEMENT = 'GROWTH_ACHIEVEMENT',
  PATTERN_MASTERY = 'PATTERN_MASTERY'
}

// Technical Architecture Council approved edge computing
export interface EdgeEQProcessor {
  processorId: string;
  capabilities: ProcessorCapability[];
  privacyGuarantees: PrivacyGuarantee[];
  
  // Local processing metrics
  processingSpeed: number;
  accuracyScore: number;
  privacyScore: number; // 0-100, higher is better
}

export enum ProcessorCapability {
  REAL_TIME_ANALYSIS = 'REAL_TIME_ANALYSIS',
  PATTERN_DETECTION = 'PATTERN_DETECTION',
  GROWTH_TRACKING = 'GROWTH_TRACKING',
  ANONYMOUS_AGGREGATION = 'ANONYMOUS_AGGREGATION'
}

export interface PrivacyGuarantee {
  guaranteeType: string;
  verificationMethod: string;
  auditTrail: boolean;
}

// EQ Coaching (fully local)
export interface LocalEQCoach {
  coachingStyle: CoachingStyle;
  personalizedInsights: string[];
  growthMilestones: GrowthMilestone[];
  
  // All processing happens on device
  localModelVersion: string;
  lastTrainingUpdate: Date;
}

export enum CoachingStyle {
  GENTLE_GUIDE = 'GENTLE_GUIDE',
  DIRECT_MENTOR = 'DIRECT_MENTOR',
  SOCRATIC_QUESTIONER = 'SOCRATIC_QUESTIONER',
  SUPPORTIVE_COMPANION = 'SUPPORTIVE_COMPANION'
}

export interface GrowthMilestone {
  milestoneId: string;
  achievedAt: Date;
  insightGained: string;
  nextSteps: string[];
  
  // Privacy-first celebration
  shareable: boolean;
  anonymizedVersion?: string;
}

// Selective sync infrastructure
export interface SelectiveSyncConfig {
  // User controls exactly what syncs
  syncPatterns: {
    patternType: EQPatternType;
    syncEnabled: boolean;
    anonymizationLevel: number; // 0-10
  }[];
  
  // End-to-end encryption
  userPublicKey: string;
  deviceKeyFingerprint: string;
  
  // Sync boundaries
  maxSyncFrequency: number; // seconds
  syncOnlyOnWifi: boolean;
  requireExplicitConsent: boolean;
}

// Anonymous aggregation service
export interface AnonymousAggregation {
  aggregationId: string;
  participantCount: number;
  minimumParticipants: number; // Privacy threshold
  
  // Aggregated insights (no individual data)
  collectivePatterns: CollectivePattern[];
  communityInsights: string[];
  
  // Privacy metrics
  kAnonymityScore: number;
  differentialPrivacyNoise: number;
}

export interface CollectivePattern {
  pattern: string;
  prevalence: number;
  anonymityPreserved: boolean;
  insightValue: string;
}

// Research participation (opt-in only)
export interface ResearchParticipation {
  studyId: string;
  consentGiven: boolean;
  consentTimestamp: Date;
  
  // What user agreed to share
  dataShareScope: DataShareScope;
  compensationModel: CompensationModel;
  
  // User controls
  withdrawalRight: boolean; // Always true
  dataExportRight: boolean; // Always true
  deletionRight: boolean; // Always true
}

export interface DataShareScope {
  anonymizedPatterns: boolean;
  aggregatedMetrics: boolean;
  selectiveInsights: boolean;
  
  // Explicitly excluded
  rawEmotionalData: false; // Always false
  personalIdentifiers: false; // Always false
  deviceInformation: false; // Always false
}

export interface CompensationModel {
  type: 'MONETARY' | 'INSIGHTS' | 'FEATURES' | 'RECOGNITION';
  amount?: number;
  description: string;
}