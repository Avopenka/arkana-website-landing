'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Mic, Brain, Sparkles, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function ThreeStepIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  
  // PACA v16.1: Enhanced Interactive Demo State
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0);

  // PACA v16.1: Consciousness-aware animations
  useEffect(() => {
    if (activePhase !== null) {
      const interval = setInterval(() => {
        setConsciousnessLevel(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activePhase]);

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
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.19, 1, 0.22, 1],
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  // PACA v16.1: Revolutionary 3-Phase System with Real Consciousness
  const phases = [
    {
      number: "01",
      title: "Tap & Capture",
      subtitle: "As Easy as Taking a Photo",
      description: "One tap starts recording. Speak naturally—share ideas, take notes, capture meetings. Arkana handles the rest with military-grade privacy.",
      detailedDescription: "Like having a photographic memory for your thoughts. Capture ideas during walks, meetings, or moments of inspiration. Everything stays private on your device until you choose to process it.",
      icon: <Mic className="w-10 h-10" />,
      color: "from-brand-teal via-cyan-400 to-brand-teal",
      demoText: "Recording your thoughts privately...",
      visualEffect: "ripple",
      consciousnessType: "capture"
    },
    {
      number: "02", 
      title: "AI Understands",
      subtitle: "Instant Intelligence Extraction",
      description: "State-of-the-art AI instantly transcribes, summarizes, and extracts key insights. Find action items, emotional context, and hidden connections automatically.",
      detailedDescription: "Imagine having a brilliant assistant who never forgets. Our AI identifies what matters: deadlines, ideas worth pursuing, patterns in your thinking, and connections between conversations weeks apart.",
      icon: <Brain className="w-10 h-10" />,
      color: "from-accent-gold via-amber-300 to-accent-gold",
      demoText: "Extracting insights and actions...",
      visualEffect: "neural",
      consciousnessType: "process"
    },
    {
      number: "03",
      title: "Search Everything",
      subtitle: "Google for Your Mind",
      description: "Search all your captured thoughts instantly. Find that brilliant idea from last month or what you promised in yesterday's meeting—in seconds.",
      detailedDescription: "Your personal knowledge base that grows smarter over time. Ask questions like 'What did I discuss with Sarah about the project?' or 'Show me all my startup ideas.' Get instant, accurate answers from your own thoughts.",
      icon: <Sparkles className="w-10 h-10" />,
      color: "from-purple-500 via-indigo-400 to-brand-teal",
      demoText: "Searching your memory instantly...",
      visualEffect: "constellation",
      consciousnessType: "expand"
    }
  ];

  const playPhaseDemo = (phaseIndex: number) => {
    setActivePhase(phaseIndex);
    setDemoPlaying(true);
    
    // Auto-stop after 3 seconds
    setTimeout(() => {
      setDemoPlaying(false);
      setActivePhase(null);
    }, 3000);
  };

  // PACA v16.1: Consciousness Visual Effects
  const renderConsciousnessEffect = (phase: { id: string; title: string; description: string; }, index: number) => {
    if (activePhase !== index) return null;
    
    const effects = {
      ripple: (
        <motion.div 
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-brand-teal/30 rounded-2xl"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ 
                scale: [0.8, 1.2, 1.5],
                opacity: [0.8, 0.3, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.6,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      ),
      neural: (
        <motion.div className="absolute inset-0 rounded-2xl overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={20 + (i % 3) * 30}
                cy={20 + Math.floor(i / 3) * 20}
                r="2"
                fill="currentColor"
                className="text-accent-gold"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </svg>
        </motion.div>
      ),
      constellation: (
        <motion.div className="absolute inset-0 rounded-2xl overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${10 + Math.floor(i / 4) * 25}%`
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0.3, 1, 0],
                scale: [0, 1, 0.5, 1.2, 0]
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity
              }}
            />
          ))}
        </motion.div>
      )
    };
    
    return effects[phase.visualEffect as keyof typeof effects];
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 lg:py-40 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
    >
      {/* PACA v16.1: Enhanced Background with Consciousness Field */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(22,255,225,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,186,17,0.02),transparent_50%)]" />
        
        {/* Consciousness grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(22,255,225,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(22,255,225,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* PACA v16.1: Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-20 lg:mb-28"
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-brand-teal text-sm font-medium tracking-wide uppercase">
              Consciousness Technology
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-8">
            <span className="bg-gradient-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              How Arkana Works
            </span>
            <br />
            <span className="bg-gradient-to-br from-brand-teal via-cyan-400 to-accent-gold bg-clip-text text-transparent">
              In 3 Simple Steps
            </span>
          </h2>
          
          <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
            Transform scattered thoughts into organized intelligence. Here's how Arkana becomes your most powerful thinking tool.
          </p>
          
          {/* Sound Control */}
          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Disable' : 'Enable'} Audio Feedback
          </motion.button>
        </motion.div>

        {/* PACA v16.1: Revolutionary Phase Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto mb-20"
        >
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Main Phase Card */}
              <motion.div 
                className={`relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer
                  ${activePhase === index 
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-white/30' 
                    : 'bg-gradient-to-b from-white/5 to-white/2 border-white/10 hover:from-white/8 hover:to-white/4 hover:border-white/20'
                  }`}
                onClick={() => playPhaseDemo(index)}
                whileHover={{ 
                  scale: 1.02,
                  y: -4
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Consciousness Effects */}
                <AnimatePresence>
                  {renderConsciousnessEffect(phase, index)}
                </AnimatePresence>
                
                <div className="relative p-8 lg:p-10">
                  {/* Phase Number Badge */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-2xl flex items-center justify-center text-black font-bold text-xl shadow-2xl">
                    {phase.number}
                  </div>
                  
                  {/* Demo Button */}
                  <motion.button
                    className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-brand-teal to-cyan-400 rounded-full flex items-center justify-center text-black hover:shadow-lg hover:shadow-brand-teal/25 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playPhaseDemo(index);
                    }}
                  >
                    {activePhase === index && demoPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </motion.button>
                  
                  {/* Icon */}
                  <motion.div 
                    className={`mb-8 w-20 h-20 rounded-2xl bg-gradient-to-br ${phase.color} p-5 text-black shadow-lg`}
                    animate={activePhase === index ? {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: activePhase === index ? Infinity : 0 }}
                  >
                    {phase.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-2xl lg:text-3xl font-serif mb-2 text-white">
                    {phase.title}
                  </h3>
                  
                  <h4 className="text-lg text-gray-400 mb-4 font-medium">
                    {phase.subtitle}
                  </h4>
                  
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    {phase.description}
                  </p>
                  
                  {/* Practical Examples */}
                  <div className="space-y-2 mb-6">
                    {index === 0 && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-teal rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">"Remember to call mom about dinner Sunday"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-teal rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">"Project idea: AI that learns user preferences"</span>
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-gold rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">AI finds: "3 action items, 2 decisions needed"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-gold rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">Links related ideas from last month</span>
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">"What did Sarah say about the budget?"</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-gray-400">"Show all my book recommendations"</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Demo Status */}
                  <AnimatePresence>
                    {activePhase === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-brand-teal text-sm font-medium"
                      >
                        {phase.demoText}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Detailed Description - Shown on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-sm p-8 lg:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                  >
                    <h3 className="text-xl lg:text-2xl font-serif mb-4 text-white">
                      {phase.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {phase.detailedDescription}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Consciousness Level Indicator */}
              {activePhase === index && (
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-teal to-accent-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: `${consciousnessLevel}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </motion.div>
              )}

              {/* Connecting Flow for desktop */}
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
                  <motion.div
                    className="w-16 h-0.5 bg-gradient-to-r from-brand-teal/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.3 }}
                  />
                  <motion.div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-brand-teal rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.3 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* PACA v16.1: Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <motion.div
            className="inline-block mb-8 p-6 rounded-2xl bg-gradient-to-br from-brand-teal/10 to-accent-gold/10 border border-brand-teal/20"
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/80 font-medium">100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/80 font-medium">Works Offline</span>
              </div>
            </div>
            <p className="text-gray-400 font-serif italic text-lg">
              "Like Notion + ChatGPT + Evernote, but actually works"
            </p>
            <p className="text-brand-teal text-sm font-medium mt-2">
              — Beta User, Fortune 500 Executive
            </p>
          </motion.div>
          
          <motion.button
            className="group relative px-12 py-6 bg-gradient-to-r from-brand-teal via-cyan-400 to-accent-gold text-black font-semibold text-lg rounded-full overflow-hidden shadow-2xl shadow-brand-teal/25"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(22, 255, 225, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const authButton = document.querySelector('[data-auth-trigger]');
              if (authButton instanceof HTMLElement) {
                authButton.click();
              }
            }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-gold via-brand-teal to-cyan-400"
              initial={{ x: '100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Get Early Access - Free
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}