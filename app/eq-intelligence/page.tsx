/**
 * EQ Intelligence Landing Page
 * Showcase privacy-first emotional intelligence
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  DollarSign, 
  Users, 
  Sparkles,
  Lock,
  TrendingUp,
  Heart,
  Eye,
  Database
} from 'lucide-react';
import { EQDashboard } from '@/components/eq-intelligence/EQDashboard';

export default function EQIntelligencePage() {
  const [showDashboard, setShowDashboard] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {!showDashboard ? (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  Privacy-First
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {' '}EQ Intelligence
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Your emotional intelligence stays on your device. 
                  Create value from your insights without compromising privacy.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Try Live Demo
                  </button>
                  
                  <button className="px-8 py-4 bg-white text-purple-600 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors font-medium">
                    Learn More
                  </button>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <TrustBadge
                  icon={<Lock />}
                  label="Zero Data Leakage"
                  value="100%"
                />
                <TrustBadge
                  icon={<Shield />}
                  label="E2E Encrypted"
                  value="Always"
                />
                <TrustBadge
                  icon={<Database />}
                  label="Local Processing"
                  value="Device Only"
                />
                <TrustBadge
                  icon={<Users />}
                  label="Anonymous Sharing"
                  value="Optional"
                />
              </motion.div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-white/50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                How Privacy-First EQ Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <ProcessStep
                  number={1}
                  title="Local Processing"
                  description="All EQ analysis happens on your device. No data sent to servers unless you explicitly choose."
                  icon={<Brain className="w-8 h-8" />}
                />
                
                <ProcessStep
                  number={2}
                  title="Selective Sharing"
                  description="Choose exactly what patterns to share. Everything is anonymized with zero-knowledge proofs."
                  icon={<Eye className="w-8 h-8" />}
                />
                
                <ProcessStep
                  number={3}
                  title="Value Creation"
                  description="Monetize insights, join research, or help others - all while maintaining complete privacy."
                  icon={<DollarSign className="w-8 h-8" />}
                />
              </div>
            </div>
          </section>

          {/* Value Propositions */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Create Value, Keep Privacy
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <ValueProp
                  icon={<DollarSign className="w-12 h-12 text-green-600" />}
                  title="Monetize Your Patterns"
                  description="Sell anonymized EQ insights in our marketplace. You keep 70% of revenue."
                  benefits={[
                    'Anonymous listings',
                    'Zero personal data exposed',
                    'Instant payments',
                    'Full control over what you share'
                  ]}
                />
                
                <ValueProp
                  icon={<Sparkles className="w-12 h-12 text-purple-600" />}
                  title="Contribute to Research"
                  description="Help advance EQ science with guaranteed privacy. Get compensated fairly."
                  benefits={[
                    'Explicit consent required',
                    'Withdraw anytime',
                    'Keep all compensation',
                    'Your data stays anonymous'
                  ]}
                />
                
                <ValueProp
                  icon={<Users className="w-12 h-12 text-blue-600" />}
                  title="Community Insights"
                  description="Learn from collective patterns without exposing individual data."
                  benefits={[
                    'K-anonymity guaranteed',
                    'Differential privacy applied',
                    'No individual tracking',
                    'Opt-in aggregation only'
                  ]}
                />
                
                <ValueProp
                  icon={<Heart className="w-12 h-12 text-pink-600" />}
                  title="Personal Growth"
                  description="AI coaching that never leaves your device. Pure privacy, pure growth."
                  benefits={[
                    'Local AI processing',
                    'Personalized insights',
                    'No cloud dependencies',
                    'Your journey, your data'
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Privacy Guarantees */}
          <section className="py-20 bg-purple-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Privacy Guarantees
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Guarantee
                  title="Your Data, Your Control"
                  points={[
                    'Delete everything with one click',
                    'Export all data anytime',
                    'No vendor lock-in',
                    'Open source verification'
                  ]}
                />
                
                <Guarantee
                  title="Technical Safeguards"
                  points={[
                    'AES-256 encryption',
                    'Zero-knowledge proofs',
                    'Differential privacy',
                    'Regular security audits'
                  ]}
                />
                
                <Guarantee
                  title="Business Ethics"
                  points={[
                    'No data sales ever',
                    'No behavioral advertising',
                    'No third-party sharing',
                    'Privacy-first business model'
                  ]}
                />
                
                <Guarantee
                  title="User Rights"
                  points={[
                    'Withdraw consent anytime',
                    'Compensation continues',
                    'Full transparency',
                    'Regular privacy reports'
                  ]}
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">
                Experience Privacy-First EQ Intelligence
              </h2>
              
              <p className="text-xl mb-8 text-purple-100">
                Join thousands who are growing emotionally while maintaining complete privacy.
              </p>
              
              <button
                onClick={() => setShowDashboard(true)}
                className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-lg"
              >
                Start Your Private Journey
              </button>
              
              <p className="mt-4 text-sm text-purple-200">
                No signup required for demo • No data leaves your device
              </p>
            </div>
          </section>
        </>
      ) : (
        <EQDashboard />
      )}
    </div>
  );
}

// Component helpers
function TrustBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 bg-white rounded-lg shadow-md border border-purple-100"
    >
      <div className="flex items-center justify-center text-purple-600 mb-2">
        {icon}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-bold text-purple-800">{value}</p>
    </motion.div>
  );
}

function ProcessStep({ number, title, description, icon }: { number: number; title: string; description: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.1 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        {number}
      </div>
      <div className="mb-4 text-purple-600">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function ValueProp({ icon, title, description, benefits }: { icon: React.ReactNode; title: string; description: string; benefits: string[] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-500 mt-1">✓</span>
            <span className="text-sm text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Guarantee({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-purple-800">{title}</h3>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}