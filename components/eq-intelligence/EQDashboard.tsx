/**
 * EQ Intelligence Dashboard
 * Privacy-first emotional intelligence interface
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Lock, 
  Sparkles,
  Eye,
  EyeOff,
  Upload,
  Download,
  DollarSign,
  Users
} from 'lucide-react';
import { LocalEQProcessor } from '@/lib/eq-intelligence/local-processor';
import { PrivacySyncManager } from '@/lib/eq-intelligence/privacy-sync';
import { EQValueCreator } from '@/lib/eq-intelligence/value-creation';
import { 
  EQMetrics, 
  EQPattern, 
  EQPrivacyControls,
  LocalEQCoach,
  CoachingStyle
} from '@/lib/eq-intelligence/types';

export function EQDashboard() {
  const [eqMetrics, setEqMetrics] = useState<EQMetrics | null>(null);
  const [patterns, setPatterns] = useState<EQPattern[]>([]);
  const [privacyControls, setPrivacyControls] = useState<EQPrivacyControls>({
    allowLocalProcessing: true,
    allowAnonymousAggregation: false,
    allowSelectiveSync: false,
    allowResearchParticipation: false,
    dataBoundaries: {
      emotionalDepthLimit: 7,
      retentionPeriodDays: 30,
      aggregationThreshold: 10
    },
    showProcessingIndicators: true,
    showDataUsageReports: true,
    enablePrivacyAuditLog: true
  });
  const [showRawData, setShowRawData] = useState(false);
  const [coach, setCoach] = useState<LocalEQCoach | null>(null);
  const [revenue, setRevenue] = useState(0);
  const [processingLocal, setProcessingLocal] = useState(false);

  // Initialize processors
  const [processor] = useState(() => new LocalEQProcessor('device_001'));
  const [syncManager] = useState(() => new PrivacySyncManager());
  const [valueCreator] = useState(() => new EQValueCreator());

  useEffect(() => {
    // Initialize encryption on mount
    initializeSystem();
  }, []);

  const initializeSystem = async () => {
    try {
      // Initialize with user's biometric or passphrase
      await processor.initializeEncryption('user_secret_key');
      
      // Load cached metrics if available
      loadCachedMetrics();
    } catch (error) {
      console.error('Failed to initialize EQ system:', error);
    }
  };

  const loadCachedMetrics = () => {
    // In production, load from IndexedDB
    // For demo, use sample data
    const sampleMetrics: EQMetrics = {
      selfAwareness: 75,
      selfRegulation: 68,
      motivation: 82,
      empathy: 88,
      socialSkills: 71,
      emotionalResilience: 79,
      emotionalFlexibility: 73,
      emotionalDepth: 85,
      emotionalAuthenticity: 91,
      lastUpdated: new Date(),
      confidenceScore: 0.87,
      dataPoints: 142
    };
    setEqMetrics(sampleMetrics);
  };

  const processNewSignals = async () => {
    setProcessingLocal(true);
    try {
      // Simulate emotional signal collection
      const signals = generateSampleSignals();
      
      // Process locally (no network calls)
      const newMetrics = await processor.processEmotionalSignals(signals);
      setEqMetrics(newMetrics);
      
      // Detect patterns
      const detectedPatterns = await processor.detectPatterns(
        newMetrics,
        eqMetrics ? [eqMetrics] : []
      );
      setPatterns(prev => [...prev, ...detectedPatterns]);
      
      // Generate coaching insights
      const coaching = await processor.generateCoachingInsights(
        newMetrics,
        detectedPatterns,
        CoachingStyle.SUPPORTIVE_COMPANION
      );
      setCoach(coaching);
    } finally {
      setProcessingLocal(false);
    }
  };

  const generateSampleSignals = () => {
    // Sample emotional signals for demo
    return Array.from({ length: 20 }, (_, i) => ({
      type: ['self_reflection', 'regulation_success', 'emotional_challenge', 
              'goal_pursuit', 'emotional_resonance'][Math.floor(Math.random() * 5)],
      category: ['personal', 'social', 'professional'][Math.floor(Math.random() * 3)],
      intensity: Math.random(),
      timestamp: new Date(Date.now() - i * 3600000),
      authentic: Math.random() > 0.2,
      outcome: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
      quality: Math.random()
    }));
  };

  const handlePrivacyToggle = (setting: keyof EQPrivacyControls) => {
    setPrivacyControls(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleValueCreation = async (pattern: EQPattern) => {
    try {
      const result = await valueCreator.createValueFromPattern(pattern, {
        anonymousPatternId: pattern.patternId,
        marketplaceListingEnabled: true,
        revenueShare: {
          userPercentage: 70,
          platformPercentage: 30
        },
        insightValue: 85,
        rarityScore: 92,
        impactPotential: 78
      });

      if (result.success && result.userShare !== undefined) {
        setRevenue(prev => prev + result.userShare!);
      }
    } catch (error) {
      console.error('Value creation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                EQ Intelligence
              </h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Privacy First
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {showRawData ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="text-sm">{showRawData ? 'Hide' : 'Show'} Data</span>
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-800">
                  ${revenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Privacy Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-purple-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Privacy Controls</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PrivacyToggle
              label="Local Processing Only"
              description="All EQ analysis happens on your device"
              enabled={privacyControls.allowLocalProcessing}
              onToggle={() => handlePrivacyToggle('allowLocalProcessing')}
              icon={<Lock className="w-4 h-4" />}
            />
            
            <PrivacyToggle
              label="Anonymous Aggregation"
              description="Contribute to community insights anonymously"
              enabled={privacyControls.allowAnonymousAggregation}
              onToggle={() => handlePrivacyToggle('allowAnonymousAggregation')}
              icon={<Users className="w-4 h-4" />}
            />
            
            <PrivacyToggle
              label="Selective Sync"
              description="Choose specific patterns to sync"
              enabled={privacyControls.allowSelectiveSync}
              onToggle={() => handlePrivacyToggle('allowSelectiveSync')}
              icon={<Upload className="w-4 h-4" />}
            />
            
            <PrivacyToggle
              label="Research Participation"
              description="Contribute to EQ research with full consent"
              enabled={privacyControls.allowResearchParticipation}
              onToggle={() => handlePrivacyToggle('allowResearchParticipation')}
              icon={<Sparkles className="w-4 h-4" />}
            />
          </div>
          
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              <strong>Data Boundaries:</strong> Emotional depth limit: {privacyControls.dataBoundaries.emotionalDepthLimit}/10 | 
              Retention: {privacyControls.dataBoundaries.retentionPeriodDays} days | 
              Min aggregation: {privacyControls.dataBoundaries.aggregationThreshold} users
            </p>
          </div>
        </motion.div>

        {/* EQ Metrics */}
        {eqMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your EQ Metrics</h2>
              <button
                onClick={processNewSignals}
                disabled={processingLocal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {processingLocal ? 'Processing...' : 'Update Metrics'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard
                label="Self Awareness"
                value={eqMetrics.selfAwareness}
                color="purple"
              />
              <MetricCard
                label="Self Regulation"
                value={eqMetrics.selfRegulation}
                color="blue"
              />
              <MetricCard
                label="Motivation"
                value={eqMetrics.motivation}
                color="green"
              />
              <MetricCard
                label="Empathy"
                value={eqMetrics.empathy}
                color="pink"
              />
              <MetricCard
                label="Social Skills"
                value={eqMetrics.socialSkills}
                color="yellow"
              />
              <MetricCard
                label="Resilience"
                value={eqMetrics.emotionalResilience}
                color="indigo"
              />
            </div>
            
            {showRawData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify(eqMetrics, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}

        {/* Detected Patterns */}
        {patterns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-green-100"
          >
            <h2 className="text-xl font-semibold mb-4">Detected Patterns</h2>
            
            <div className="space-y-3">
              {patterns.slice(-3).map((pattern, index) => (
                <PatternCard
                  key={pattern.patternId}
                  pattern={pattern}
                  onMonetize={() => handleValueCreation(pattern)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Coaching Insights */}
        {coach && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-orange-100"
          >
            <h2 className="text-xl font-semibold mb-4">AI Coaching Insights</h2>
            
            <div className="space-y-3">
              {coach.personalizedInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
            
            {coach.growthMilestones.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Growth Milestones</h3>
                {coach.growthMilestones.map(milestone => (
                  <div key={milestone.milestoneId} className="p-3 bg-green-50 rounded-lg mb-2">
                    <p className="font-medium text-green-800">{milestone.insightGained}</p>
                    <p className="text-sm text-green-600 mt-1">
                      Next steps: {milestone.nextSteps.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Local Processing Indicator */}
        <AnimatePresence>
          {processingLocal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Processing locally on your device...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Component helpers
function PrivacyToggle({ label, description, enabled, onToggle, icon }) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onToggle}
        className={`mt-1 w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{label}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm mb-1">/ 100</span>
      </div>
      <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-current rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function PatternCard({ pattern, onMonetize }) {
  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-green-800">{pattern.patternType}</h3>
          <p className="text-sm text-gray-600 mt-1">{pattern.anonymizedInsight}</p>
          <p className="text-xs text-gray-500 mt-2">
            Confidence: {(pattern.confidence * 100).toFixed(0)}% | 
            Privacy: {pattern.privacyLevel}
          </p>
        </div>
        
        {pattern.privacyLevel !== 'DEVICE_ONLY' && (
          <button
            onClick={onMonetize}
            className="ml-4 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            Monetize
          </button>
        )}
      </div>
    </div>
  );
}