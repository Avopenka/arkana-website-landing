'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FounderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="section bg-deep-black relative overflow-hidden"
    >
      {/* Luxury background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_70%)]"></div>
      
      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Founder Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-teal/10 to-accent-gold/10 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Placeholder for founder image - would be replaced with actual photo */}
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-brand-teal/20 to-accent-gold/20 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-brand-teal/10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            <motion.div 
              className="absolute top-10 right-10 w-16 h-16 rounded-full bg-accent-gold/10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
          
          {/* Founder Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 className="text-gradient font-serif mb-4">ARISTO VOPĚNKA</h2>
            <h3 className="text-white/80 text-xl mb-6">Founder & Chief Technology Officer</h3>
            
            <p className="text-white/90 mb-4">
              After a decade building AI for corporations, I realized something profound: <strong>the most powerful intelligence isn't in corporate servers—it's in individual minds waiting to be unleashed.</strong>
            </p>
            
            <p className="text-white/90 mb-4">
              I've seen how AI transforms organizations. Now I'm dedicated to something bigger: <strong>giving every person their own AI companion that grows with them,</strong> learns their unique perspective, and helps their ideas compound over time.
            </p>
            
            <p className="text-white/90 mb-6">
              This isn't about productivity metrics or ROI calculations. <strong>It's about democratizing intelligence itself.</strong> Imagine a world where your thoughts become building blocks, where everyone can create with AI, where knowledge truly belongs to those who generate it.
            </p>
            
            <div className="mb-6 p-4 rounded-lg bg-brand-teal/10 border border-brand-teal/20">
              <p className="text-brand-teal text-sm font-medium">
                🌟 "We're not just building software. We're creating a future where everyone becomes a creator, where your data empowers you, where AI amplifies human potential—not corporate profits."
              </p>
            </div>
            
            {/* Vision Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-brand-teal">∞</div>
                <div className="text-xs text-white/60">Knowledge Potential</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-accent-gold">100%</div>
                <div className="text-xs text-white/60">Data Ownership</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-purple-400">1:1</div>
                <div className="text-xs text-white/60">Personal AI</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-green-400">∀</div>
                <div className="text-xs text-white/60">For Everyone</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="text-brand-teal hover:text-white transition-colors" title="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              
              <a href="#" className="text-brand-teal hover:text-white transition-colors" title="Research Gate">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              
              <a href="#" className="text-brand-teal hover:text-white transition-colors" title="TED Talks">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            
            {/* Signature */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="h-12 w-40 bg-gradient-to-r from-brand-teal to-accent-gold opacity-80 mask-image-signature"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
