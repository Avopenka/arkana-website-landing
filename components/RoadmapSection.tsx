'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export default function RoadmapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const roadmapItems = [
    {
      phase: "Alpha",
      quarter: "Q2 2024",
      title: "Genesis Awakening",
      description: "Founder's Alpha release. First 100 pioneers gain access to the core Arkana experience.",
      features: ["Voice-first interface", "Local LLM processing", "Basic memory graph"],
      status: "active",
      mysticalSymbol: "☽",
      color: "brand-teal"
    },
    {
      phase: "Beta", 
      quarter: "Q4 2024",
      title: "Digital Twin Emergence",
      description: "Public Beta launch. Digital Twin capabilities allow Arkana to mirror your digital essence.",
      features: ["Digital Twin system", "Enhanced memory connections", "Multi-persona support"],
      status: "upcoming",
      mysticalSymbol: "✦",
      color: "accent-gold"
    },
    {
      phase: "1.0",
      quarter: "Q1 2025",
      title: "Multi-lingual Awakening",
      description: "Arkana speaks all tongues. Full multi-language support across voice and text.",
      features: ["10+ languages", "Cultural context awareness", "Global knowledge base"],
      status: "future",
      mysticalSymbol: "◈",
      color: "brand-teal"
    },
    {
      phase: "2.0",
      quarter: "Q3 2025",
      title: "Plugin Universe",
      description: "Community-driven expansion. Open plugin ecosystem unleashes unlimited potential.",
      features: ["Plugin marketplace", "Developer SDK", "Custom AI models"],
      status: "future",
      mysticalSymbol: "✧",
      color: "accent-gold"
    },
    {
      phase: "Vision",
      quarter: "2025+",
      title: "Collective Intelligence",
      description: "The community owns the intelligence. Decentralized, privacy-preserving AI network.",
      features: ["Federated learning", "Community governance", "Shared knowledge graphs"],
      status: "vision",
      mysticalSymbol: "⟡",
      color: "brand-teal"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section 
      id="roadmap"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-deep-black to-pure-black overflow-hidden"
    >
      {/* Mystical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(22,255,225,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(212,175,55,0.03),transparent_70%)]" />
        
        {/* Timeline stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
            <span className="bg-gradient-to-br from-brand-teal via-accent-gold to-brand-teal bg-clip-text text-transparent">
              The Journey Ahead
            </span>
          </h2>
          <p className="text-neutral-gray text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From Alpha to collective intelligence. Each milestone brings us closer to a future where AI serves individuals, not corporations.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central timeline line - Desktop only */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px">
            <motion.div
              className="h-full bg-gradient-to-b from-brand-teal/20 via-accent-gold/20 to-brand-teal/20"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />
          </div>

          {/* Timeline items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8 lg:space-y-0"
          >
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative lg:flex ${
                  index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content card */}
                <div className={`lg:w-1/2 ${
                  index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12 lg:text-right'
                }`}>
                  <div className="relative group">
                    {/* Card */}
                    <div className={`relative p-6 lg:p-8 rounded-2xl backdrop-blur-xl bg-white/5 border transition-all duration-500 ${
                      item.status === 'active' 
                        ? 'border-brand-teal/30 bg-brand-teal/5' 
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                        item.color === 'brand-teal' 
                          ? 'from-brand-teal/10 to-transparent' 
                          : 'from-accent-gold/10 to-transparent'
                      }`} />
                      
                      <div className="relative z-10">
                        {/* Phase and quarter */}
                        <div className={`flex items-center gap-3 mb-4 ${
                          index % 2 === 0 ? '' : 'lg:justify-end'
                        }`}>
                          <span className={`text-4xl ${
                            item.color === 'brand-teal' ? 'text-brand-teal' : 'text-accent-gold'
                          }`}>
                            {item.mysticalSymbol}
                          </span>
                          <div>
                            <div className={`text-sm font-medium ${
                              item.color === 'brand-teal' ? 'text-brand-teal' : 'text-accent-gold'
                            }`}>
                              {item.phase}
                            </div>
                            <div className="text-xs text-neutral-gray">
                              {item.quarter}
                            </div>
                          </div>
                        </div>
                        
                        {/* Title and description */}
                        <h3 className={`text-xl lg:text-2xl font-serif mb-3 ${
                          item.status === 'active' ? 'text-white' : 'text-white/90'
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-neutral-gray mb-4 text-sm lg:text-base">
                          {item.description}
                        </p>
                        
                        {/* Features */}
                        <ul className={`space-y-2 ${
                          index % 2 === 0 ? '' : 'lg:text-left'
                        }`}>
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                item.color === 'brand-teal' ? 'bg-brand-teal' : 'bg-accent-gold'
                              }`} />
                              <span className="text-neutral-gray/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Status badge */}
                        {item.status === 'active' && (
                          <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full text-xs font-medium ${
                            'bg-brand-teal/20 text-brand-teal'
                          }`}>
                            <div className="w-2 h-2 bg-brand-teal rounded-full animate-pulse" />
                            In Progress
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline node - Desktop only */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`relative w-6 h-6 rounded-full ${
                      item.status === 'active' 
                        ? 'bg-brand-teal shadow-glow-teal' 
                        : item.status === 'upcoming'
                          ? 'bg-accent-gold shadow-glow-gold'
                          : 'bg-white/20'
                    }`}
                  >
                    {item.status === 'active' && (
                      <div className="absolute inset-0 rounded-full bg-brand-teal animate-ping opacity-30" />
                    )}
                  </motion.div>
                </div>

                {/* Empty space for alternating layout - Desktop only */}
                <div className="hidden lg:block lg:w-1/2" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 lg:mt-20"
        >
          <p className="text-neutral-gray/70 font-serif italic text-lg max-w-2xl mx-auto">
            "The path forward is clear: AI that amplifies human potential while preserving privacy and individual sovereignty."
          </p>
        </motion.div>
      </div>
    </section>
  );
}