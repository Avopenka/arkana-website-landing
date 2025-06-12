'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Cpu, HardDrive, Zap, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react' // Added Sparkles

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function SystemRequirements() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-canvas-deep-navy text-text-primary">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-canvas-deep-navy via-surface-dark to-canvas-deep-navy" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-voice md:p-statement">
          <motion.button
            onClick={() => router.push('/arkana')}
            className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-body flex items-center gap-whisper"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Arkana
          </motion.button>
        </header>

        {/* Main content */}
        <main className="px-voice py-presence max-w-6xl mx-auto">
          {/* Title section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            transition={{ duration: 0.8 }}
            className="text-center mb-sanctuary"
          >
            <h1 className="font-luxury-serif text-large-title md:text-profound font-bold text-luxury-pristine-white mb-voice">
              Optimizing Your Arkana Journey
            </h1>
            <p className="font-body text-title3 md:text-title2 text-text-secondary max-w-3xl mx-auto">
              Arkana is engineered to deliver a deeply responsive, intelligent, and personalized experience by leveraging the remarkable power of your Apple hardware. This guide explains how different system configurations—particularly Unified RAM and Apple's M-series chips—unlock varying levels of Arkana's capabilities. Understanding this will help you anticipate the kind of Arkana experience your current or future Mac can provide, especially for our advanced on-device AI features.
            </p>
          </motion.div>

          {/* Arkana Philosophy Section */}
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUpVariants} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="my-sanctuary p-statement bg-surface-dark rounded-luxury shadow-subtle-glow text-center"
          >
            <div className="inline-block p-paragraph bg-surface-light rounded-full mb-voice">
              <Zap className="w-6 h-6 text-accent-violet" /> {/* Placeholder icon, consider custom */}
            </div>
            <h2 className="font-luxury-serif text-title2 md:text-display3 font-semibold text-luxury-pristine-white mb-paragraph">
              Arkana's Philosophy: The Power of On-Device Intelligence
            </h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              At Arkana, we believe the future of personal computing lies in powerful, on-device intelligence. By processing information locally on your Mac, Arkana ensures unparalleled privacy, operates at the speed of your thought, and delivers a deeply personalized experience, all while reducing reliance on the cloud.
            </p>
          </motion.section>

          {/* Hardware Deep Dive Section */}
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUpVariants} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="my-sanctuary"
          >
            <h2 className="font-luxury-serif text-display1 md:text-display2 font-bold text-luxury-pristine-white text-center mb-statement">
              Hardware That Shapes Your Experience
            </h2>
            <div className="grid md:grid-cols-2 gap-statement">
              <div className="bg-surface-dark p-statement rounded-luxury shadow-subtle-glow">
                <div className="flex items-center gap-paragraph mb-paragraph">
                  <Cpu className="w-8 h-8 text-accent-cyan" />
                  <h3 className="font-precision-sans text-title1 font-semibold text-luxury-pristine-white">Apple M-Series Chips: The Engine of Arkana</h3>
                </div>
                <p className="text-body text-text-secondary mb-paragraph">
                  Apple's M-series chips (M1, M2, M3, M4, and their Pro/Max/Ultra variants) are foundational to Arkana. Their integrated architecture, featuring powerful CPU cores, high-performance GPU cores, and the Neural Engine, allows Arkana to perform complex AI computations directly on your device. This means faster responses, enhanced privacy, and the ability for Arkana to learn and adapt to your unique patterns without sending sensitive data to the cloud.
                </p>
                <p className="text-body text-text-secondary">
                  The more advanced the chip (e.g., M3 Max vs. M3) and the higher the core counts, the more sophisticated the AI models Arkana can run locally, leading to deeper insights, more nuanced interactions, and a richer overall experience.
                </p>
              </div>
              <div className="bg-surface-dark p-statement rounded-luxury shadow-subtle-glow">
                <div className="flex items-center gap-paragraph mb-paragraph">
                  <HardDrive className="w-8 h-8 text-accent-amber" /> {/* Consider a RAM-specific icon */}
                  <h3 className="font-precision-sans text-title1 font-semibold text-luxury-pristine-white">Unified RAM: The Canvas for Arkana's Thought</h3>
                </div>
                <p className="text-body text-text-secondary mb-paragraph">
                  Unified RAM is critical. It's not just memory; it's a high-bandwidth, low-latency pool accessible to the CPU, GPU, and Neural Engine simultaneously. This allows Arkana to efficiently manage and process vast amounts of contextual information—your notes, documents, conversations, and learned preferences—that form the basis of its intelligence.
                </p>
                <p className="text-body text-text-secondary">
                  More Unified RAM means Arkana can hold a larger 'working memory' of your world, enabling it to understand more complex queries, maintain longer conversational context, and access a broader range of your information to provide truly insightful and relevant assistance. For demanding AI tasks and a fluid experience, ample Unified RAM is key.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Experience Tiers Section */}
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUpVariants} 
            transition={{ duration: 0.8, delay: 0.6 }}
            className="my-sanctuary"
          >
            <h2 className="font-luxury-serif text-display1 md:text-display2 font-bold text-luxury-pristine-white text-center mb-statement">
              Tailor Your Arkana Experience
            </h2>
            <div className="grid md:grid-cols-3 gap-statement">
              {/* Zenith Tier */}
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-surface-dark p-statement rounded-luxury shadow-subtle-glow border border-accent-zenith/20"
              >
                <div className="flex items-center gap-paragraph mb-paragraph">
                  <Sparkles className="w-6 h-6 text-accent-zenith" />
                  <h3 className="font-luxury-serif text-title1 font-semibold text-luxury-pristine-white">
                    The Zenith Arkana Experience
                  </h3>
                </div>
                <p className="text-body text-text-secondary mb-statement">
                  Pinnacle on-device intelligence, foresight, and creative partnership. For those who demand the most profound and anticipatory AI experience.
                </p>
                <div className="space-y-voice">
                  <div>
                    <h4 className="font-precision-sans text-body-emphasized font-medium text-text-primary mb-whisper">Recommended Hardware:</h4>
                    <ul className="list-disc list-inside text-body text-text-secondary space-y-atom">
                      <li>MacBook Pro / Mac Studio / Mac Pro with M2/M3/M4 Max or Ultra, 64GB+ RAM (128GB recommended for Ultra).</li>
                      <li>Future-generation high-end M-series chips with substantial RAM.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-precision-sans text-body-emphasized font-medium text-text-primary mb-whisper">Key Capabilities Unlocked:</h4>
                    <ul className="list-disc list-inside text-body text-text-secondary space-y-atom">
                      <li>Deep contextual understanding across all your integrated information.</li>
                      <li>Proactive insights and complex problem-solving.</li>
                      <li>Advanced creative content generation and co-creation.</li>
                      <li>Full personalization of Arkana's emergent behaviors.</li>
                      <li>Access to the most powerful local AI models Arkana offers.</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Tier */}
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-surface-dark p-statement rounded-luxury shadow-subtle-glow border border-accent-enhanced/20"  // Added border
              >
                <div className="flex items-center gap-paragraph mb-paragraph">
                  <Cpu className="w-6 h-6 text-accent-cyan" />
                  <h3 className="font-luxury-serif text-title1 font-semibold text-luxury-pristine-white"> {/* Changed font */}
                    The Enhanced Arkana Experience
                  </h3>
                </div>
                <p className="text-body text-text-secondary mb-statement"> {/* Adjusted margin */}
                  A significant leap in intelligent assistance, contextual awareness, and streamlined workflows. For professionals and creators seeking a powerful AI companion.
                </p>
                <div className="space-y-voice">
                  <div>
                    <h4 className="font-precision-sans text-body-emphasized font-medium text-text-primary mb-whisper">Recommended Hardware:</h4>
                    <ul className="list-disc list-inside text-body text-text-secondary space-y-atom">
                      <li>MacBook Pro / Mac Studio with M1/M2/M3 Pro or Max, 32GB+ RAM (64GB recommended for Max).</li>
                      <li>Mac mini with M2 Pro / M4 Pro, 32GB RAM.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-precision-sans text-body-emphasized font-medium text-text-primary mb-whisper">Key Capabilities Unlocked:</h4>
                    <ul className="list-disc list-inside text-body text-text-secondary space-y-atom">
                      <li>Comprehensive information retrieval and synthesis.</li>
                      <li>Intelligent task automation and workflow optimization.</li>
                      <li>Robust contextual memory for ongoing projects.</li>
                      <li>Enhanced creative assistance and idea generation.</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Core Tier */}
              <motion.div 
                variants={fadeInUpVariants}
                className="bg-surface-dark p-statement rounded-luxury shadow-subtle-glow border border-accent-core/20" // Added border
              >
                <div className="flex items-center gap-paragraph mb-paragraph">
                  <HardDrive className="w-6 h-6 text-accent-amber" />
                  <h3 className="font-luxury-serif text-title1 font-semibold text-luxury-pristine-white"> {/* Changed font */}
                    The Core Arkana Experience
                  </h3>
                </div>
                <p className="text-body text-text-secondary mb-statement"> {/* Adjusted margin */}
                  Foundation for enhanced productivity and flow. For individuals seeking intelligent focus assistance and a taste of Arkana's unique interaction model.
                </p>
                <div className="space-y-voice">
                  <div>
                    <h4 className="font-precision-sans text-body-emphasized font-medium text-text-primary mb-whisper">Recommended Hardware:</h4>
                    <ul className="list-disc list-inside text-body text-text-secondary space-y-atom">
                      <li>MacBook Air / iMac / Mac mini with M1/M2/M3/M4, 16GB+ RAM (24GB strongly recommended).</li>
                      <li>iPad Pro with M-series chip (M1/M2/M4), 16GB RAM.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-precision-sans text-body-emphasized font-medium text-text-primary mb-whisper">Key Capabilities Unlocked:</h4>
                    <ul className="list-disc list-inside text-body text-text-secondary space-y-atom">
                      <li>Smart organization and information access.</li>
                      <li>Focused work session support.</li>
                      <li>Basic contextual assistance for daily tasks.</li>
                      <li>Introduction to Arkana's adaptive interface.</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
            <p className="text-body text-text-secondary text-center mt-statement max-w-3xl mx-auto">
              <strong>Important Note on Minimums:</strong> While Arkana may operate on systems with 8GB of RAM (common in some base model configurations), the experience, particularly with on-device AI features and extensive contextual memory, will be significantly limited. We recommend <strong>16GB of Unified RAM as a comfortable starting point</strong> for a meaningful and responsive Arkana experience.
            </p>
          </motion.section>

          {/* Future-Proofing Section */}
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUpVariants} 
            transition={{ duration: 0.8, delay: 0.8 }}
            className="my-sanctuary p-statement bg-surface-dark rounded-luxury shadow-subtle-glow text-center"
          >
            <h2 className="font-luxury-serif text-title2 md:text-display3 font-semibold text-luxury-pristine-white mb-paragraph">
              Future-Proofing Your Arkana Journey
            </h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              Arkana is an evolving intelligence. Investing in higher RAM capacities and the latest M-series chips not only enhances your current Arkana experience but also prepares you for exciting future capabilities as on-device AI models become more sophisticated and Arkana's own understanding deepens.
            </p>
          </motion.section>

          {/* Call to Action Section */}
          <motion.section 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUpVariants} 
            transition={{ duration: 0.8, delay: 1.0 }}
            className="my-sanctuary text-center"
          >
            <h2 className="font-luxury-serif text-display1 md:text-display2 font-bold text-luxury-pristine-white mb-statement">
              Ready to Begin?
            </h2>
            <div className="flex flex-col sm:flex-row gap-voice justify-center">
              <Link href="/prelude" className="group">
                <motion.div
                  className="px-presence py-voice bg-violet-pulse text-luxury-pristine-white 
                           hover:bg-violet-pulse/90 rounded-luxury font-precision-sans text-body 
                           font-medium transition-all duration-300 flex items-center justify-center gap-whisper"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Return to The Prelude
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
              
              <Link href="/arkana">
                <motion.div
                  className="px-presence py-voice bg-transparent text-text-secondary hover:text-text-primary 
                           border border-white/10 hover:border-white/20 rounded-luxury font-precision-sans 
                           text-body transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore the Arkana Homepage
                </motion.div>
              </Link>
            </div>
          </motion.section>

          {/* Disclaimer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-sanctuary text-center"
          >
            <p className="text-caption1 text-text-disabled max-w-4xl mx-auto">
              Hardware recommendations are based on currently available information from Apple and Arkana's evolving capabilities. Apple, Mac, MacBook Pro, Mac Studio, Mac Pro, iMac, Mac mini, iPad Pro, and M-series chip names are trademarks of Apple Inc. Arkana is an independent software product.
            </p>
          </motion.footer>
        </main>
      </div>
    </div>
  )
}
