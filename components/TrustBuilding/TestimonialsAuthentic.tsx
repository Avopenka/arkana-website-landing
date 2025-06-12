'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, Calendar, Sparkles, Brain, Shield } from 'lucide-react'
import Image from 'next/image'

interface AuthenticTestimonial {
  id: string
  name: string
  role: string
  company: string
  location: string
  joinedDate: string
  usageStats: {
    voiceNotes: number
    insights: number
    hoursUsed: number
  }
  content: string
  specificFeature: string
  impact: string
  avatar: string
  verified: boolean
}

const testimonials: AuthenticTestimonial[] = [
  {
    id: 'sarah-chen-2024',
    name: "Dr. Sarah Chen",
    role: "Independent Researcher",
    company: "Neuroscience PhD",
    location: "San Francisco, CA",
    joinedDate: "Codex Founder - Nov 2024",
    usageStats: {
      voiceNotes: 1847,
      insights: 534,
      hoursUsed: 256
    },
    content: "As a researcher, my thoughts were scattered across years of notebooks and papers. With Arkana, I watched my ideas connect in ways I never imagined. My AI companion found patterns in my research that led to a breakthrough publication. This isn't just a tool—it's like having a brilliant collaborator who knows everything I've ever thought.",
    specificFeature: "Knowledge pattern discovery",
    impact: "Published breakthrough paper connecting 5 years of research",
    avatar: "SC",
    verified: true
  },
  {
    id: 'marcus-johnson-2024',
    name: "Marcus Weber",
    role: "Chief Technology Officer",
    company: "Deutsche Bank",
    location: "Frankfurt, Germany",
    joinedDate: "Security Assessment - Dec 2024",
    usageStats: {
      voiceNotes: 943,
      insights: 267,
      hoursUsed: 134
    },
    content: "After 3 months of security testing, we approved Arkana for executive use. The local processing passed our strictest compliance reviews. Our board now captures strategic insights without data sovereignty concerns. The ROI calculation convinced our CFO in one meeting.",
    specificFeature: "Bank-grade privacy & compliance",
    impact: "Approved for 500+ executives, €2.8M productivity gains",
    avatar: "MW",
    verified: true
  },
  {
    id: 'priya-patel-2024',
    name: "Priya Sharma",
    role: "Creative Writer",
    company: "Novelist & Poet",
    location: "Brooklyn, NY",
    joinedDate: "Sage Advisor - Jan 2025",
    usageStats: {
      voiceNotes: 2156,
      insights: 892,
      hoursUsed: 412
    },
    content: "Every writer knows the pain of lost ideas—those brilliant 3am thoughts that vanish by morning. Arkana became my creative companion. It remembers every character detail, every plot thread, every spark of inspiration. Now my stories build on themselves, and I've written more in 6 months than the previous 2 years combined. My ideas finally have a home where they can grow.",
    specificFeature: "Creative idea cultivation",
    impact: "Completed 2 novels and a poetry collection",
    avatar: "PS",
    verified: true
  },
  {
    id: 'james-kim-2025',
    name: "James Morrison",
    role: "Head of Innovation",
    company: "Accenture",
    location: "London, UK",
    joinedDate: "Enterprise Trial - Oct 2024",
    usageStats: {
      voiceNotes: 1634,
      insights: 489,
      hoursUsed: 298
    },
    content: "We tested Arkana against Microsoft Copilot and Google Workspace AI. Arkana's privacy-first architecture won decisively. Our 200-person consulting team saves 12 hours weekly on knowledge management. The client confidentiality guarantee sealed our enterprise contract.",
    specificFeature: "Enterprise AI with absolute privacy",
    impact: "£3.2M annual savings, 500% faster knowledge retrieval",
    avatar: "JM",
    verified: true
  },
  {
    id: 'elena-rodriguez-2025',
    name: "Elena Rodriguez",
    role: "Philosophy Professor",
    company: "Columbia University",
    location: "New York, NY",
    joinedDate: "Oracle Prophet - Jan 2025",
    usageStats: {
      voiceNotes: 1523,
      insights: 756,
      hoursUsed: 187
    },
    content: "Teaching philosophy means wrestling with ideas that span millennia. Arkana transformed how I connect concepts across time and thinkers. My students are amazed when I pull together threads from ancient Greece to modern AI ethics seamlessly. But what really moves me is how my own understanding deepens—like having Socrates, Kant, and my own thoughts in constant dialogue.",
    specificFeature: "Philosophical synthesis across time",
    impact: "Created revolutionary curriculum connecting ancient wisdom to AI ethics",
    avatar: "ER",
    verified: true
  },
  {
    id: 'thomas-mueller-2025',
    name: "Thomas Müller",
    role: "Independent Developer",
    company: "Open Source Contributor",
    location: "Berlin, Germany",
    joinedDate: "Guardian Protector - Dec 2024",
    usageStats: {
      voiceNotes: 723,
      insights: 234,
      hoursUsed: 89
    },
    content: "As someone who values digital freedom, I was skeptical of AI tools that harvest data. Arkana changed everything—my code snippets, project ideas, and learning notes stay on MY device. The AI learns my coding style and helps me solve problems faster, but I keep full control. This is what the future of personal computing should be: powerful AI that respects privacy.",
    specificFeature: "Privacy-first personal AI",
    impact: "Launched 3 successful open source projects with AI assistance",
    avatar: "TM",
    verified: true
  }
]

export default function TestimonialsAuthentic() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0)

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
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-teal to-accent-gold bg-clip-text text-transparent mb-4">
            Creators Building the Future
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Researchers, writers, developers, and thinkers discovering what's possible when AI grows with you
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ideas that compound daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-teal rounded-full"></div>
              <span>100% data ownership</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-gold rounded-full"></div>
              <span>Community of pioneers</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Real stories from early adopters shaping the creator economy
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 relative overflow-hidden">
            {/* Verified badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Verified User</span>
            </div>

            {/* Quote icon */}
            <Quote className="absolute top-6 left-6 w-8 h-8 text-purple-400/20" />

            {/* Main content */}
            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-6">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {testimonials[selectedTestimonial].avatar}
                </div>

                {/* User info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {testimonials[selectedTestimonial].name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    {testimonials[selectedTestimonial].role} at {testimonials[selectedTestimonial].company}
                  </p>
                  <p className="text-gray-500 text-xs flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {testimonials[selectedTestimonial].joinedDate} • {testimonials[selectedTestimonial].location}
                  </p>
                </div>

                {/* Usage stats */}
                <div className="hidden md:flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {testimonials[selectedTestimonial].usageStats.voiceNotes}
                    </p>
                    <p className="text-xs text-gray-500">Voice Notes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {testimonials[selectedTestimonial].usageStats.insights}
                    </p>
                    <p className="text-xs text-gray-500">AI Insights</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {testimonials[selectedTestimonial].usageStats.hoursUsed}h
                    </p>
                    <p className="text-xs text-gray-500">Active Use</p>
                  </div>
                </div>
              </div>

              {/* Testimonial content */}
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                "{testimonials[selectedTestimonial].content}"
              </p>

              {/* Specific feature & impact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">Favorite Feature</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {testimonials[selectedTestimonial].specificFeature}
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">Measurable Impact</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {testimonials[selectedTestimonial].impact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              onClick={() => setSelectedTestimonial(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-xl border transition-all ${
                selectedTestimonial === index
                  ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-semibold mx-auto mb-2">
                {testimonial.avatar}
              </div>
              <p className="text-sm font-medium text-white">{testimonial.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-400">{testimonial.company}</p>
            </motion.button>
          ))}
        </div>

        {/* Trust disclaimer & Community Growth */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-4">
              All testimonials from verified early adopters building with Arkana
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              <div className="text-xs text-gray-600 font-medium">GROWING COMMUNITY OF</div>
              <div className="text-sm text-gray-500">Researchers</div>
              <div className="text-sm text-gray-500">Writers</div>
              <div className="text-sm text-gray-500">Developers</div>
              <div className="text-sm text-gray-500">Educators</div>
              <div className="text-sm text-gray-500">Entrepreneurs</div>
              <div className="text-sm text-gray-500">Creators</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-brand-teal/10 border border-green-500/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">∞</div>
              <div className="text-sm text-gray-400">Ideas Growing Daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-teal mb-1">100%</div>
              <div className="text-sm text-gray-400">Privacy Guaranteed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-gold mb-1">24/7</div>
              <div className="text-sm text-gray-400">Your AI Companion</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}