'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.5,
        delayChildren: shouldReduceMotion ? 0 : 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const steps = [
    {
      number: "1",
      title: "Just Speak",
      description: "Talk like you're thinking out loud. No commands, no syntax. Just you.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <path d="M12 19v4"/>
          <path d="M8 23h8"/>
        </svg>
      ),
      color: "brand-teal",
      mysticalElement: "Voice waves ripple through space",
      delay: 0
    },
    {
      number: "2", 
      title: "It Remembers",
      description: "Every word becomes a thread in your tapestry of thoughts. Nothing lost, everything connected.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M8 12h8"/>
          <path d="M12 8v8"/>
        </svg>
      ),
      color: "accent-gold",
      mysticalElement: "Memory constellations form",
      delay: 1
    },
    {
      number: "3",
      title: "Wisdom Returns",
      description: "Like looking in a mirror that shows not just who you are, but who you're becoming.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11H1l4-4"/>
          <path d="M1 7l4 4"/>
          <path d="M20 4v7a4 4 0 0 1-4 4H8"/>
          <path d="M12 15l-3-3 3-3"/>
        </svg>
      ),
      color: "brand-teal",
      mysticalElement: "Wisdom flows back transformed",
      delay: 2
    }
  ];

  return (
    <section 
      id="how-it-works"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-pure-black to-deep-black overflow-hidden"
    >
      {/* Mystical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(22,255,225,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(212,175,55,0.03),transparent_70%)]" />
        
        {/* Floating mystical orbs */}
        <div className="absolute top-1/4 left-1/5 w-32 h-32 bg-brand-teal/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/5 w-40 h-40 bg-accent-gold/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
            <span className="bg-gradient-to-br from-brand-teal via-accent-gold to-brand-teal bg-clip-text text-transparent">
              The Magic in Three Steps
            </span>
          </h2>
          <p className="text-neutral-gray text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Speak your mind. Watch it remember. Feel it understand. 
            Three simple steps to a mind that never forgets.
          </p>
        </motion.div>

        <div className="relative">
          {/* Mystical connecting flow - Desktop only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
            <motion.div 
              className="relative h-px"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="h-full bg-gradient-to-r from-transparent via-brand-teal/30 via-accent-gold/30 to-transparent" />
              
              {/* Animated energy particles */}
              {!shouldReduceMotion && (
                <>
                  <motion.div 
                    className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-brand-teal transform -translate-y-1/2 blur-sm"
                    animate={{ 
                      x: ['0%', '50%', '100%'],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      times: [0, 0.5, 1]
                    }}
                  />
                  
                  <motion.div 
                    className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-accent-gold transform -translate-y-1/2 blur-sm"
                    animate={{ 
                      x: ['0%', '50%', '100%'],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 2,
                      times: [0, 0.5, 1]
                    }}
                  />
                </>
              )}
            </motion.div>
          </div>

          {/* Steps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Step number with mystical glow */}
                <motion.div 
                  className={`relative w-20 h-20 mb-6 rounded-full flex items-center justify-center text-2xl font-serif transition-all duration-500 ${
                    step.color === 'brand-teal' 
                      ? 'bg-brand-teal/10 text-brand-teal border-2 border-brand-teal/20 group-hover:bg-brand-teal/20 group-hover:border-brand-teal/40' 
                      : 'bg-accent-gold/10 text-accent-gold border-2 border-accent-gold/20 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="relative z-10">{step.number}</span>
                  
                  {/* Icon overlay that appears on hover */}
                  <div className={`absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    step.color === 'brand-teal' ? 'text-brand-teal' : 'text-accent-gold'
                  }`}>
                    {step.icon}
                  </div>
                  
                  {/* Mystical pulse effect */}
                  {!shouldReduceMotion && (
                    <motion.div 
                      className={`absolute inset-0 rounded-full ${
                        step.color === 'brand-teal' ? 'border-brand-teal' : 'border-accent-gold'
                      }`}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: step.delay
                      }}
                      style={{
                        border: `2px solid ${step.color === 'brand-teal' ? 'rgba(22, 255, 225, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`
                      }}
                    />
                  )}
                </motion.div>
                
                {/* Step content */}
                <div className="space-y-4">
                  <h3 className={`text-xl lg:text-2xl font-serif transition-colors duration-300 ${
                    step.color === 'brand-teal' 
                      ? 'text-brand-teal group-hover:text-white' 
                      : 'text-accent-gold group-hover:text-white'
                  }`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-neutral-gray group-hover:text-white/90 text-base leading-relaxed transition-colors duration-300 max-w-xs mx-auto">
                    {step.description}
                  </p>
                  
                  {/* Mystical element description */}
                  <p className={`text-sm font-serif italic opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${
                    step.color === 'brand-teal' ? 'text-brand-teal/70' : 'text-accent-gold/70'
                  }`}>
                    {step.mysticalElement}
                  </p>
                </div>

                {/* Connecting arrow for mobile */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="lg:hidden mt-8 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                  >
                    <svg className="w-6 h-6 text-accent-gold/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14"/>
                      <path d="M19 12l-7 7-7-7"/>
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom mystical quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 lg:mt-20"
        >
          <p className="text-neutral-gray/70 font-serif italic text-lg max-w-2xl mx-auto">
            "What if your thoughts had a perfect memory?"
          </p>
        </motion.div>
      </div>
    </section>
  );
}