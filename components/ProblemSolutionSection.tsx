'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp, Clock, Search, Users } from 'lucide-react'

export default function ProblemSolutionSection() {
  const painPoints = [
    { 
      icon: <Clock className="w-5 h-5" />, 
      stat: "Scattered Thoughts", 
      description: "Your brilliant ideas are trapped in different apps, notebooks, and forgotten conversations" 
    },
    { 
      icon: <Search className="w-5 h-5" />, 
      stat: "Lost Connections", 
      description: "The patterns between your thoughts remain hidden, unable to spark new insights" 
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      stat: "Individual Islands", 
      description: "We all learn alone when we could be building knowledge together" 
    }
  ]

  const solutions = [
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      stat: "Your Thoughts Compound", 
      description: "Watch as your ideas connect, multiply, and evolve into deeper understanding" 
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      stat: "AI That Learns You", 
      description: "A companion that grows with your unique perspective and creative process" 
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      stat: "Create Together", 
      description: "Join a community where everyone's intelligence lifts the collective higher" 
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 bg-gradient-to-r from-brand-teal to-accent-gold bg-clip-text text-transparent">
            Imagine a World Where Your Data Works for You
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            What if every thought, every insight, every moment of inspiration could build upon itself?
            Where your knowledge compounds like interest, creating something uniquely yours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-red-950/20 border border-red-900/30 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Today's Challenge</h3>
              </div>
              
              <div className="space-y-4">
                {painPoints.map((pain, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-red-950/10 border border-red-900/20"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex-shrink-0 mt-0.5">
                      {pain.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-red-300 mb-1">{pain.stat}</p>
                      <p className="text-white/80 text-sm leading-relaxed">{pain.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-red-950/30 border border-red-900/40">
                <p className="text-red-200 text-sm font-medium">
                  💭 <strong>The Truth:</strong> Your most valuable ideas remain disconnected and unrealized
                </p>
              </div>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="p-8 rounded-2xl bg-green-950/20 border border-green-900/30 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Tomorrow's Possibility</h3>
              </div>
              
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-green-950/10 border border-green-900/20"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex-shrink-0 mt-0.5">
                      {solution.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">{solution.stat}</p>
                      <p className="text-white/80 text-sm leading-relaxed">{solution.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-green-950/30 border border-green-900/40">
                <p className="text-green-200 text-sm font-medium">
                  ✨ <strong>The Vision:</strong> Everyone becomes a creator with their own AI companion
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transformation Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-2xl bg-gradient-to-r from-brand-teal/10 via-purple-500/10 to-accent-gold/10 border border-white/10 backdrop-blur-xl"
        >
          <h4 className="text-xl font-semibold text-white mb-4">
            Join the Movement to Democratize Intelligence
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal mb-2">∞</div>
              <div className="text-white/70 text-sm">Your Knowledge Compounds Forever</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">100%</div>
              <div className="text-white/70 text-sm">Your Data, Your Control</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">1:1</div>
              <div className="text-white/70 text-sm">Personal AI That Grows With You</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}