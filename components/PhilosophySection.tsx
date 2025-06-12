'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const principles = [
    {
      title: "A Mind Truly Yours",
      description: "Like a garden only you can tend. Plant your thoughts, nurture your patterns, and watch a unique intelligence bloom.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
          <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"/>
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
        </svg>
      ),
      gradient: "from-brand-teal to-accent-gold"
    },
    {
      title: "Together We Rise", 
      description: "Not alone, but together. Share wisdom, learn from others, and help create something no single mind could imagine.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      gradient: "from-accent-gold to-brand-teal"
    },
    {
      title: "Sacred Privacy",
      description: "Your thoughts stay where they belong - with you. No clouds, no servers, no strangers. Just you and your digital companion.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      gradient: "from-brand-teal via-accent-gold to-brand-teal"
    }
  ];

  return (
    <section 
      id="philosophy"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-deep-black to-pure-black overflow-hidden"
    >
      {/* Mystical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-accent-gold/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-brand-teal/5 to-transparent rounded-full animate-float" />
        </div>
        
        {/* Floating mystical particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent-gold rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
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
              Our Philosophy
            </span>
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            We believe in AI that serves souls, not systems. Where privacy is sacred, 
            community is strength, and every mind matters.
          </p>
        </motion.div>

        {/* Philosophy Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20"
        >
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Main card */}
              <div className="relative h-full p-8 lg:p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-white/10">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] bg-gradient-to-br ${principle.gradient} bg-opacity-10`} />
                
                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${principle.gradient} p-0.5 group-hover:scale-110 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]`}>
                    <div className="w-full h-full bg-deep-black rounded-2xl flex items-center justify-center text-white">
                      {principle.icon}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-serif mb-4 text-white group-hover:text-white transition-colors duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                    {principle.title}
                  </h3>
                  <p className="text-white/70 group-hover:text-white/90 text-base lg:text-lg leading-relaxed transition-colors duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                    {principle.description}
                  </p>
                </div>
                
                {/* Mystical corner effects */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <div className={`w-full h-full bg-gradient-to-br ${principle.gradient} opacity-20`} style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                    borderRadius: '0 24px 0 0'
                  }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center relative"
        >
          {/* Mystical background glow */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-teal/10 via-accent-gold/5 to-transparent rounded-3xl blur-2xl" />
          
          <div className="relative z-10 p-8 lg:p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-serif mb-6 bg-gradient-to-r from-brand-teal to-accent-gold bg-clip-text text-transparent">
              The Future Is Human
            </h3>
            <p className="text-white/80 text-lg lg:text-xl mb-8 leading-relaxed">
              Join those who believe technology should amplify humanity, not replace it. 
              Together, we're writing the next chapter of human potential.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#waitlist" 
                className="group relative px-8 py-4 bg-gradient-to-r from-brand-teal to-accent-gold rounded-full text-black font-semibold hover:shadow-2xl transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105"
              >
                <span className="relative z-10">Begin Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-brand-teal rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </a>
              
              <a 
                href="#community"
                className="text-brand-teal hover:text-accent-gold transition-colors duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] font-medium"
              >
                Discover Our Story →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center justify-center mt-16"
        >
          <div className="flex items-center space-x-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-brand-teal to-transparent" />
            <div className="w-3 h-3 bg-gradient-to-br from-brand-teal to-accent-gold rounded-full animate-pulse" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent via-accent-gold to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}