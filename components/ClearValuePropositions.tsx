'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'

// COUNCIL OF 11 MASTERS: CRYSTAL-CLEAR VALUE PROPOSITIONS
// Agent Alpha Report Fix: Users understand Arkana in 10 seconds

export const ValuePropositions = {
  // 1. ONE-LINER THAT INSTANTLY COMMUNICATES CORE VALUE
  heroText: "AI that actually gets you.",
  
  // Subheading that clarifies the category
  subheading: "A personal AI assistant that learns how you think, remembers what matters, and helps you work naturally—just by talking.",

  // 2. THREE CONCRETE BENEFITS (EVERYDAY LANGUAGE)
  benefits: [
    {
      title: "Talk instead of type",
      description: "Just speak your thoughts. Arkana captures, organizes, and helps you find everything later—in any language.",
      icon: "🎙️"
    },
    {
      title: "Remembers like you do",
      description: "Your ideas connect automatically. Ask about something from last week or last year—Arkana knows the context.",
      icon: "🧠"
    },
    {
      title: "Works with your favorite apps",
      description: "Connects to Notion, Todoist, Calendar, and more. Everything syncs seamlessly across your Mac, iPhone, and iPad.",
      icon: "🔗"
    }
  ],

  // 3. BEFORE/AFTER COMPARISON
  transformation: {
    before: {
      title: "Without Arkana",
      points: [
        "Switching between 10 different apps",
        "Forgetting brilliant ideas from meetings",
        "Searching endlessly for that one note",
        "Copy-pasting between AI tools",
        "Starting from scratch with every prompt"
      ]
    },
    after: {
      title: "With Arkana",
      points: [
        "One AI that lives on your desktop",
        "Every thought captured and connected",
        "Ask naturally, find instantly",
        "Your AI that knows your context",
        "Builds on everything you've shared"
      ]
    }
  },

  // SUPPORTING DETAILS (TECH AS POWER, NOT PITCH)
  powerFeatures: {
    title: "Powered by breakthrough technology",
    subtitle: "Built for the Apple ecosystem with privacy at its core",
    points: [
      "Runs entirely on your device—your data never leaves",
      "Apple Silicon optimization for instant responses",
      "Military-grade encryption for complete privacy"
    ]
  }
}

// COMPONENT: Clear Hero Section
export function ClearHeroSection() {
  return (
    <section className="relative min-h-screen bg-black text-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            {ValuePropositions.heroText}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            {ValuePropositions.subheading}
          </p>
        </motion.div>

        {/* Three Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {ValuePropositions.benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform">
            Get Early Access
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
          <p className="mt-4 text-gray-500">
            Join 2,847 professionals already on the waitlist
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// COMPONENT: Before/After Transformation
export function TransformationSection() {
  const { before, after } = ValuePropositions.transformation

  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
          See the difference Arkana makes
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Before Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 rounded-2xl p-8 border border-red-900/20"
          >
            <h3 className="text-2xl font-semibold text-red-400 mb-6">
              {before.title}
            </h3>
            <ul className="space-y-4">
              {before.points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-3">✗</span>
                  <span className="text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 rounded-2xl p-8 border border-green-900/20"
          >
            <h3 className="text-2xl font-semibold text-green-400 mb-6">
              {after.title}
            </h3>
            <ul className="space-y-4">
              {after.points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <Check className="text-green-500 mr-3 w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// COMPONENT: Power Features (Tech as underlying power)
export function PowerFeaturesBar() {
  const { points } = ValuePropositions.powerFeatures

  return (
    <div className="bg-gray-900 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          {points.map((point, index) => (
            <div key={index} className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// EXPORT: Alternative headline options for A/B testing
export const AlternativeHeadlines = [
  {
    hero: "Your AI assistant that actually understands you.",
    sub: "Talk naturally. Arkana remembers everything and helps you work smarter across all your devices."
  },
  {
    hero: "The AI that thinks like you do.",
    sub: "Personal AI that learns your patterns, remembers your context, and helps you work naturally—just by talking."
  },
  {
    hero: "Finally, AI that works the way you do.",
    sub: "Speak your mind. Arkana captures, connects, and helps you find everything—while keeping it all private."
  }
]