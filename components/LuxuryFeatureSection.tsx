'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import DimensionalCard from './effects/DimensionalCard';

export default function LuxuryFeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const features = [
    {
      icon: "/ui-elements/LockIcon.svg",
      title: "Zero-Knowledge Architecture",
      description: "Your consciousness data never leaves your device. Built on military-grade encryption with quantum-resistant protocols.",
      gradient: "from-cyan-400 to-cyan-600",
      glow: "#00ffff",
      details: [
        "End-to-end encryption",
        "Local data processing",
        "No cloud dependencies",
        "NSA-grade security"
      ]
    },
    {
      icon: "/ui-elements/agent-control-placeholder.svg",
      title: "Neural Interface Engine",
      description: "Seamless integration between human consciousness and artificial intelligence through advanced neural pattern recognition.",
      gradient: "from-amber-400 to-amber-600",
      glow: "#ffb000",
      details: [
        "Real-time thought processing",
        "Context-aware responses",
        "Emotional intelligence",
        "Adaptive learning"
      ]
    },
    {
      icon: "/icons/mirror-placeholder.svg",
      title: "Consciousness Mirroring",
      description: "Create a digital twin of your cognitive patterns that learns, grows, and evolves alongside your natural intelligence.",
      gradient: "from-purple-400 to-purple-600",
      glow: "#8b5cf6",
      details: [
        "Personality modeling",
        "Memory synthesis",
        "Decision prediction",
        "Cognitive enhancement"
      ]
    },
    {
      icon: "/ui-elements/LockIcon.png", // Using available icon for now
      title: "Quantum Processing Core",
      description: "Leverage quantum-inspired algorithms for exponentially faster processing of complex consciousness patterns.",
      gradient: "from-emerald-400 to-emerald-600",
      glow: "#10b981",
      details: [
        "Quantum algorithms",
        "Parallel processing",
        "Ultra-low latency",
        "Energy efficient"
      ]
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative py-48 md:py-54 lg:py-62 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(0, 255, 255, 0.01) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(255, 176, 0, 0.01) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)
        `
      }}
    >
      {/* Minimal background texture - reduced opacity */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Neural connections */}
          {[...Array(12)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${10 + (i % 4) * 25}%`}
              y1={`${20 + Math.floor(i / 4) * 30}%`}
              x2={`${35 + (i % 3) * 20}%`}
              y2={`${40 + Math.floor(i / 3) * 25}%`}
              stroke="url(#connectionGlow)"
              strokeWidth="1"
              animate={{
                strokeOpacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
          
          {/* Neural nodes */}
          {[...Array(16)].map((_, i) => (
            <motion.circle
              key={i}
              cx={`${15 + (i % 4) * 25}%`}
              cy={`${25 + Math.floor(i / 4) * 25}%`}
              r="3"
              fill="url(#nodeGlow)"
              animate={{
                r: [2, 4, 2],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 3 + (i % 2),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Floating consciousness particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400/40 to-amber-400/40 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="text-center mb-20"
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block relative mb-6"
          >
            <div className="w-16 h-16 mx-auto relative">
              <Image
                src="/ui-elements/AgentControle.png"
                alt="Neural Interface"
                fill
                className="object-contain filter brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 to-transparent blur-xl" />
            </div>
          </motion.div>

          <motion.h2 
            className="text-5xl lg:text-6xl font-extralight text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block">Consciousness</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-purple-400">
              Technology
            </span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the next evolution of human-AI interaction through advanced neural architectures 
            that understand, adapt, and enhance your cognitive patterns.
          </motion.p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 * index }}
            >
              <DimensionalCard
                glowColor={feature.glow}
                className="h-full group"
              >
                <div className="p-8 lg:p-10">
                  {/* Feature icon */}
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 bg-gradient-radial from-current/20 to-transparent blur-xl" 
                         style={{ color: feature.glow }} />
                    <div className={`relative w-full h-full bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center p-4`}>
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={32}
                        height={32}
                        className="object-contain filter brightness-0 invert"
                      />
                    </div>
                    
                    {/* Orbital ring */}
                    <motion.div
                      className="absolute inset-0 border border-current/30 rounded-2xl"
                      style={{ color: feature.glow }}
                      animate={{ rotateZ: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  {/* Feature content */}
                  <h3 className="text-2xl font-light text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-current transition-all duration-300"
                      style={{ '--tw-gradient-to': feature.glow } as React.CSSProperties}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature details */}
                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detail}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.6 + (index * 0.2) + (detailIndex * 0.1) 
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-current" 
                             style={{ color: feature.glow }}>
                          <motion.div
                            className="w-full h-full rounded-full bg-current"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.7, 1, 0.7] 
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              delay: detailIndex * 0.5 
                            }}
                          />
                        </div>
                        <span className="text-gray-300 text-sm font-light">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </DimensionalCard>
            </motion.div>
          ))}
        </div>

        {/* Consciousness visualization */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="text-6xl lg:text-8xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-purple-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              ∞
            </motion.div>
            <div className="absolute inset-0 bg-gradient-radial from-cyan-400/10 to-transparent blur-3xl" />
          </div>
          <p className="mt-4 text-gray-400 font-light">
            Infinite possibilities. Amplified consciousness.
          </p>
        </motion.div>
      </div>
    </section>
  );
}