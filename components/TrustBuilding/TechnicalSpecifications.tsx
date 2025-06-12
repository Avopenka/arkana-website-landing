'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Cpu, HardDrive, Zap, Shield, Code, 
  Database, Lock, Globe, Smartphone, 
  Monitor, Cloud, GitBranch, Package,
  CheckCircle, AlertCircle, Info
} from 'lucide-react'

interface TechSpec {
  category: string
  icon: React.ReactNode
  specs: {
    label: string
    value: string
    status: 'ready' | 'beta' | 'upcoming'
    details?: string
  }[]
}

const technicalSpecs: TechSpec[] = [
  {
    category: 'System Requirements',
    icon: <Monitor className="w-5 h-5" />,
    specs: [
      { label: 'macOS', value: '13.0+ (Ventura)', status: 'ready', details: 'Optimized for Apple Silicon' },
      { label: 'iOS', value: '16.0+', status: 'beta', details: 'TestFlight available' },
      { label: 'Memory', value: '8GB RAM minimum', status: 'ready', details: '16GB recommended' },
      { label: 'Storage', value: '4GB free space', status: 'ready', details: 'For models and data' },
      { label: 'Processor', value: 'Apple Silicon or Intel', status: 'ready', details: 'M1/M2/M3 optimized' }
    ]
  },
  {
    category: 'AI Models',
    icon: <Cpu className="w-5 h-5" />,
    specs: [
      { label: 'Speech Recognition', value: 'WhisperKit v0.5', status: 'ready', details: 'OpenAI Whisper optimized for CoreML' },
      { label: 'Language Model', value: 'Llama 3.2 3B Q4', status: 'ready', details: '4-bit quantized, 1.8GB model size' },
      { label: 'Emotion Detection', value: 'Custom CNN', status: 'ready', details: 'Trained on 100K+ voice samples' },
      { label: 'Embeddings', value: 'Local BERT', status: 'ready', details: 'Sentence transformers, 384 dimensions' },
      { label: 'Vision Model', value: 'CLIP variant', status: 'upcoming', details: 'For screenshot analysis' }
    ]
  },
  {
    category: 'Performance',
    icon: <Zap className="w-5 h-5" />,
    specs: [
      { label: 'Voice → Text', value: '0.3s average', status: 'ready', details: 'Real-time streaming' },
      { label: 'Text → Insight', value: '0.5s average', status: 'ready', details: 'Including context retrieval' },
      { label: 'Memory Search', value: '<50ms', status: 'ready', details: 'Vector similarity search' },
      { label: 'App Launch', value: '<1s cold start', status: 'ready', details: 'Progressive model loading' },
      { label: 'Battery Usage', value: '<5% per hour', status: 'ready', details: 'Continuous voice monitoring' }
    ]
  },
  {
    category: 'Privacy & Security',
    icon: <Shield className="w-5 h-5" />,
    specs: [
      { label: 'Processing', value: '100% Local', status: 'ready', details: 'No cloud dependencies' },
      { label: 'Encryption', value: 'AES-256', status: 'ready', details: 'At rest and in memory' },
      { label: 'Key Storage', value: 'Secure Enclave', status: 'ready', details: 'Hardware-backed security' },
      { label: 'Network', value: 'Offline-first', status: 'ready', details: 'Optional sync only' },
      { label: 'Analytics', value: 'Homomorphic', status: 'beta', details: 'Privacy-preserving insights' }
    ]
  },
  {
    category: 'Data Architecture',
    icon: <Database className="w-5 h-5" />,
    specs: [
      { label: 'Storage', value: 'CoreData + SQLite', status: 'ready', details: 'Efficient local database' },
      { label: 'Vectors', value: 'FAISS index', status: 'ready', details: 'Billion-scale similarity search' },
      { label: 'Graph', value: 'Custom GNN', status: 'ready', details: 'Dynamic memory connections' },
      { label: 'Sync', value: 'CRDTs', status: 'beta', details: 'Conflict-free replication' },
      { label: 'Backup', value: 'iCloud encrypted', status: 'ready', details: 'End-to-end encrypted' }
    ]
  },
  {
    category: 'Integration',
    icon: <Package className="w-5 h-5" />,
    specs: [
      { label: 'API', value: 'Swift + REST', status: 'ready', details: 'Local automation API' },
      { label: 'Shortcuts', value: 'Full support', status: 'ready', details: 'Apple Shortcuts integration' },
      { label: 'MCP', value: 'v1.0 compatible', status: 'beta', details: 'Model Context Protocol' },
      { label: 'Export', value: 'Markdown, JSON', status: 'ready', details: 'Open formats only' },
      { label: 'Plugins', value: 'SDK available', status: 'upcoming', details: 'Swift package manager' }
    ]
  }
]

export default function TechnicalSpecifications() {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [showAllSpecs, setShowAllSpecs] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'beta': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'upcoming': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'beta': return <AlertCircle className="w-4 h-4" />
      case 'upcoming': return <Info className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
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
            Built for Power Users
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-2">
            Complete technical specifications and architecture
          </p>
          <p className="text-sm text-gray-400">
            No black boxes - full transparency on how Arkana works
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {technicalSpecs.map((spec, index) => (
            <motion.button
              key={spec.category}
              onClick={() => setSelectedCategory(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                selectedCategory === index
                  ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {spec.icon}
              <span className="font-medium">{spec.category}</span>
            </motion.button>
          ))}
        </div>

        {/* Specifications grid */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(showAllSpecs ? technicalSpecs : [technicalSpecs[selectedCategory]]).map((category) => (
            category.specs.map((spec, index) => (
              <motion.div
                key={`${category.category}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white">{spec.label}</h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(spec.status)}`}>
                    {getStatusIcon(spec.status)}
                    <span>{spec.status}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-400 mb-2">{spec.value}</p>
                {spec.details && (
                  <p className="text-sm text-gray-400">{spec.details}</p>
                )}
              </motion.div>
            ))
          ))}
        </motion.div>

        {/* View toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAllSpecs(!showAllSpecs)}
            className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
          >
            {showAllSpecs ? 'Show Less' : 'View All Specifications'}
          </button>
        </div>

        {/* Architecture diagram placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            System Architecture
          </h3>
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <GitBranch className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-400">Interactive Architecture Diagram</p>
                <p className="text-sm text-gray-500 mt-2">Shows data flow and component interaction</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Open source commitment */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 bg-purple-500/10 rounded-xl p-6 border border-purple-500/20"
        >
          <div className="flex items-start gap-4">
            <Code className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Open Development Philosophy
              </h4>
              <p className="text-gray-300 mb-3">
                We believe in transparency. While our core consciousness algorithms are proprietary, 
                we open source key components and publish regular technical deep-dives.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  View GitHub Repository →
                </a>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Read Technical Blog →
                </a>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Join Discord Community →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}