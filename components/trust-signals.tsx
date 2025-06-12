'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Heart } from 'lucide-react'

// Agent Epsilon: Security Fortress - Thiel Monopoly + Brown Trust
export function TrustSignals() {
  const trustElements = [
    {
      icon: Shield,
      title: "Zero-Knowledge Architecture",
      description: "Your data never leaves your device. We can't see it, even if we wanted to.",
      detail: "Military-grade encryption ensures complete privacy"
    },
    {
      icon: Lock,
      title: "No Password, No Problem",
      description: "Passwordless authentication means no credentials to steal or forget.",
      detail: "Biometric and device-based security"
    },
    {
      icon: Eye,
      title: "Complete Transparency",
      description: "Open about how we work, what we collect (nothing), and why it matters.",
      detail: "Real-time system status available"
    },
    {
      icon: Heart,
      title: "Human-First Design",
      description: "Built by people who care about consciousness, not just conversion rates.",
      detail: "30-day no-questions-asked refund policy"
    }
  ]

  return (
    <section className="relative py-24 bg-surface-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-presence md:text-profound font-normal text-text-primary mb-6">
              Trust Through Transparency
            </h2>
            <p className="font-sans text-large-body text-text-secondary max-w-3xl mx-auto leading-relaxed">
              In a world where technology often betrays trust, we've built something different. 
              <span className="text-interactive font-medium"> Radical privacy by design</span>.
            </p>
          </motion.div>

          {/* Trust Elements Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {trustElements.map((element, index) => (
              <motion.div
                key={element.title}
                className="group p-8 bg-canvas-deep-navy/40 border border-luxury-platinum/10 rounded-large backdrop-blur-sm hover:border-interactive/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-interactive/10 rounded-xl flex items-center justify-center group-hover:bg-interactive/20 transition-colors duration-300">
                      <element.icon className="w-6 h-6 text-interactive" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-large-title font-normal text-text-primary mb-3">
                      {element.title}
                    </h3>
                    <p className="font-sans text-body text-text-secondary leading-relaxed mb-2">
                      {element.description}
                    </p>
                    <p className="font-sans text-callout text-luxury-platinum/70 italic">
                      {element.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Security Commitment */}
          <motion.div
            className="text-center p-12 bg-gradient-to-r from-interactive/5 to-luxury-platinum/5 border border-interactive/20 rounded-large backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="w-16 h-16 bg-interactive/20 rounded-full mx-auto mb-6 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Shield className="w-8 h-8 text-interactive" />
              </motion.div>
              <h3 className="font-serif text-presence font-normal text-text-primary mb-6">
                Our Privacy Promise
              </h3>
              <p className="font-sans text-large-body text-text-secondary leading-relaxed mb-8">
                We can't read your thoughts, access your memories, or sell your data because we designed 
                it that way from the beginning. Your consciousness journey is yours alone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/privacy"
                  className="font-sans px-6 py-3 bg-transparent border border-interactive text-interactive rounded-circular font-medium text-callout hover:bg-interactive hover:text-luxury-pristine-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read Our Privacy Policy
                </motion.a>
                <motion.a
                  href="/security"
                  className="font-sans px-6 py-3 text-luxury-platinum/70 hover:text-text-primary transition-colors duration-200 font-medium text-callout"
                  whileHover={{ scale: 1.05 }}
                >
                  Security Architecture →
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-sans text-callout text-text-secondary">All Systems Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-interactive rounded-full" />
              <span className="font-sans text-callout text-text-secondary">99.99% Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-luxury-platinum rounded-full" />
              <span className="font-sans text-callout text-text-secondary">Zero Data Breaches</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}