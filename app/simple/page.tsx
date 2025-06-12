'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function SimplePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Image
              src="/MainLogoENoNameNoBackGround.png"
              alt="Arkana"
              width={200}
              height={80}
              className="mx-auto"
              priority
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-light mb-6"
          >
            Your AI. Your Data.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
              Your Wealth.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Meet Arkana — your AI that runs entirely on your Mac.
            <br />
            <span className="text-amber-400">Genesis Wave: €25/month locked for 100 years.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#waitlist"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Join Genesis Wave
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">
            Why Arkana?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Private",
                description: "Your AI runs entirely on your Mac. No cloud, no data collection.",
                icon: "🔒"
              },
              {
                title: "Behavioral Analytics",
                description: "Adapts to your mood, energy, and working style in real-time using AI.",
                icon: "🧠"
              },
              {
                title: "Wealth Creation",
                description: "Turn your unique knowledge into passive income streams.",
                icon: "💎"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-light mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-16">
            Genesis Wave Pricing
          </h2>
          
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-8 md:p-12">
            <div className="text-6xl mb-4">🌅</div>
            <h3 className="text-3xl font-light mb-4 text-amber-400">Genesis Wave</h3>
            <div className="text-5xl font-light mb-2">€25<span className="text-2xl">/month</span></div>
            <p className="text-gray-400 mb-8">Locked for 100 years • Only 93 spots left</p>
            
            <ul className="text-left max-w-md mx-auto mb-8 space-y-3">
              {[
                "First access to every feature",
                "Direct WhatsApp access to founder",
                "Genesis NFT certificate #1-100",
                "10x voting weight on features",
                "Gift 3 memberships per year"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="#waitlist"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-medium rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              Secure Your Spot
            </Link>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-light mb-8">
            Join the Revolution
          </h2>
          <p className="text-gray-400 mb-8">
            Be among the first 100 to shape the future of AI.
          </p>
          
          <form className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Join Genesis Wave
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© 2025 Arkana. Advanced AI intelligence platform.</p>
        </div>
      </footer>
    </main>
  )
}