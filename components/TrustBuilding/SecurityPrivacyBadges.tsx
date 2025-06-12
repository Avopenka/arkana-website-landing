'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, Lock, Eye, Database, Cloud, 
  UserCheck, Key, FileCheck, AlertTriangle,
  CheckCircle, XCircle, Server, Wifi
} from 'lucide-react'

interface SecurityBadge {
  title: string
  icon: React.ReactNode
  status: 'verified' | 'certified' | 'audited'
  description: string
  details: string[]
  color: string
}

const securityBadges: SecurityBadge[] = [
  {
    title: 'Zero-Knowledge Architecture',
    icon: <Eye className="w-8 h-8" />,
    status: 'verified',
    description: 'Your data never leaves your device',
    details: [
      'No cloud processing of personal data',
      'Local-first computation',
      'No telemetry without consent',
      'Verified by independent audit'
    ],
    color: 'purple'
  },
  {
    title: 'Military-Grade Encryption',
    icon: <Lock className="w-8 h-8" />,
    status: 'certified',
    description: 'AES-256 + Secure Enclave protection',
    details: [
      'Hardware-backed key storage',
      'End-to-end encryption for sync',
      'Quantum-resistant algorithms',
      'FIPS 140-2 compliant'
    ],
    color: 'blue'
  },
  {
    title: 'GDPR+ Compliant',
    icon: <Shield className="w-8 h-8" />,
    status: 'certified',
    description: 'Exceeds global privacy standards',
    details: [
      'Right to deletion guaranteed',
      'Data portability built-in',
      'Consent-based processing',
      'Privacy by design'
    ],
    color: 'green'
  },
  {
    title: 'Open Source Audited',
    icon: <FileCheck className="w-8 h-8" />,
    status: 'audited',
    description: 'Security reviewed by community',
    details: [
      'Public security audits',
      'Bug bounty program',
      'Transparent development',
      'Regular penetration testing'
    ],
    color: 'yellow'
  }
]

interface PrivacyPrinciple {
  principle: string
  implementation: string
  icon: React.ReactNode
  verified: boolean
}

const privacyPrinciples: PrivacyPrinciple[] = [
  {
    principle: 'Your Device, Your Data',
    implementation: 'All AI processing happens locally. No exceptions.',
    icon: <Database className="w-5 h-5" />,
    verified: true
  },
  {
    principle: 'No Surveillance Capitalism',
    implementation: 'We never sell data. Our business model is software, not ads.',
    icon: <XCircle className="w-5 h-5" />,
    verified: true
  },
  {
    principle: 'Collective Learning, Individual Privacy',
    implementation: 'Homomorphic encryption allows pattern learning without data exposure.',
    icon: <UserCheck className="w-5 h-5" />,
    verified: true
  },
  {
    principle: 'You Own Your Insights',
    implementation: 'Export everything anytime. Delete everything instantly.',
    icon: <Key className="w-5 h-5" />,
    verified: true
  },
  {
    principle: 'Offline-First Always',
    implementation: 'Full functionality without internet. Network is optional.',
    icon: <Wifi className="w-5 h-5" />,
    verified: true
  },
  {
    principle: 'Transparent Security',
    implementation: 'Regular audits published publicly. No security through obscurity.',
    icon: <AlertTriangle className="w-5 h-5" />,
    verified: true
  }
]

export default function SecurityPrivacyBadges() {
  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
      blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
      green: 'from-green-500 to-green-600 shadow-green-500/30',
      yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-500/30'
    }
    return colors[color as keyof typeof colors] || colors.purple
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Isn't A Feature, It's The Foundation
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built from the ground up with security and privacy at the core
          </p>
        </motion.div>

        {/* Security badges grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {securityBadges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all h-full">
                {/* Badge icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getColorClasses(badge.color)} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {badge.icon}
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${badge.color}-500/20 text-${badge.color}-400 border border-${badge.color}-500/30`}>
                    {badge.status.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{badge.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{badge.description}</p>

                {/* Details on hover */}
                <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {badge.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-300">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Privacy principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Our Privacy Principles
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  {principle.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{principle.principle}</h4>
                    {principle.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{principle.implementation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            <div className="text-center">
              <Server className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">0 servers</p>
              <p className="text-sm text-gray-400">No cloud infrastructure</p>
            </div>
            <div className="text-center">
              <Cloud className="w-8 h-8 text-red-400 mx-auto mb-2 relative">
                <XCircle className="w-4 h-4 text-red-500 absolute -bottom-1 -right-1" />
              </Cloud>
              <p className="text-2xl font-bold text-white">0 bytes</p>
              <p className="text-sm text-gray-400">Uploaded to cloud</p>
            </div>
            <div className="text-center">
              <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-sm text-gray-400">Local processing</p>
            </div>
            <div className="text-center">
              <UserCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">You</p>
              <p className="text-sm text-gray-400">Own everything</p>
            </div>
          </div>
        </motion.div>

        {/* Security audit CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Don't just trust us. Verify our claims.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors">
              Read Security Whitepaper
            </button>
            <button className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors border border-gray-700">
              View Audit Reports
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}