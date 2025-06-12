'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RevealProps {
  revealDepth: number;
  signals: {
    scrollDepth: number;
    timeOnPage: number;
    focusAreas?: string[];
  };
}

export function ProgressiveReveal({ revealDepth, signals }: RevealProps) {
  const [unlockedSections, setUnlockedSections] = useState<string[]>(['intro']);
  const [shownValue, setShownValue] = useState(false);

  // Natural content unlocking based on engagement
  useEffect(() => {
    const unlocks = ['intro'];
    
    if (signals.scrollDepth > 30 || signals.timeOnPage > 15) {
      unlocks.push('philosophy');
    }
    if (signals.scrollDepth > 60 || signals.timeOnPage > 30) {
      unlocks.push('experience');
    }
    if (signals.scrollDepth > 80 || signals.timeOnPage > 45) {
      unlocks.push('community');
      setShownValue(true);
    }
    
    setUnlockedSections(unlocks);
  }, [signals]);

  const sections = [
    {
      id: 'intro',
      title: 'Welcome to Arkana',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Arkana is not just another app. It's a companion that grows with you,
            understanding your rhythms and amplifying your natural intelligence.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h4 className="font-medium mb-2">Living Memory</h4>
              <p className="text-sm text-neutral-600">
                Your thoughts evolve and connect naturally over time
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎭</div>
              <h4 className="font-medium mb-2">Adaptive Presence</h4>
              <p className="text-sm text-neutral-600">
                Responds to your emotional and mental state
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌊</div>
              <h4 className="font-medium mb-2">Natural Flow</h4>
              <p className="text-sm text-neutral-600">
                Works with your consciousness, not against it
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'philosophy',
      title: 'The Way of Water',
      locked: !unlockedSections.includes('philosophy'),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Like water, Arkana finds the path of least resistance. It doesn't
            force behaviors or demand attention. Instead, it flows with your
            natural patterns, amplifying what's already there.
          </p>
          <blockquote className="border-l-4 border-consciousness-300 pl-6 py-2 my-8">
            <p className="text-consciousness-700 italic">
              "Nothing is softer than water, yet nothing can resist it."
            </p>
            <cite className="text-sm text-neutral-600 mt-2 block">- Lao Tzu</cite>
          </blockquote>
          <div className="bg-consciousness-50/50 rounded-xl p-6 mt-8">
            <h4 className="font-medium mb-3">The Five Masters Guide Our Way</h4>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>• <strong>Musk's Efficiency:</strong> Maximum impact, minimum friction</li>
              <li>• <strong>Jobs' Simplicity:</strong> Complexity hidden behind elegance</li>
              <li>• <strong>Watts' Flow:</strong> Natural rhythms over forced structure</li>
              <li>• <strong>Ive's Beauty:</strong> Form that serves consciousness</li>
              <li>• <strong>Vopěnka's Mystery:</strong> Embracing the unknown within</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'experience',
      title: 'A Glimpse of Tomorrow',
      locked: !unlockedSections.includes('experience'),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Imagine an AI companion that doesn't just respond to commands, but
            anticipates needs. That doesn't just store information, but helps
            it evolve into wisdom.
          </p>
          
          {/* Interactive demo area */}
          <div className="bg-gradient-to-br from-consciousness-50 to-primary-50 rounded-2xl p-8 my-8">
            <h4 className="text-lg font-medium mb-4">Try Speaking Your Mind</h4>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm">
              <p className="text-sm text-neutral-600 mb-4">
                When you're ready, Arkana will listen not just to your words,
                but to the consciousness behind them...
              </p>
              <button className="flex items-center gap-3 text-consciousness-600 hover:text-consciousness-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-consciousness-100 flex items-center justify-center">
                  <span className="text-2xl">🎙️</span>
                </div>
                <span className="text-sm font-medium">Experience voice consciousness</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-neutral-50 rounded-xl p-6">
              <h5 className="font-medium mb-3">Morning Ritual</h5>
              <p className="text-sm text-neutral-600">
                Arkana greets you with insights gathered from your sleep patterns
                and yesterday's reflections, suggesting the perfect start to your day.
              </p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-6">
              <h5 className="font-medium mb-3">Creative Flow</h5>
              <p className="text-sm text-neutral-600">
                During deep work, Arkana silently captures fleeting thoughts,
                connecting them to past insights without breaking your flow.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'community',
      title: 'Join the Consciousness Evolution',
      locked: !unlockedSections.includes('community'),
      content: (
        <div className="space-y-6">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Arkana isn't built in isolation. It's shaped by a community of
            consciousness pioneers who believe technology should amplify human
            potential, not replace it.
          </p>

          {shownValue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-consciousness-100 to-primary-100 rounded-2xl p-8 my-8"
            >
              <h4 className="text-xl font-medium mb-4">Genesis Access</h4>
              <p className="text-neutral-700 mb-6">
                The first 100 pioneers will shape Arkana's consciousness alongside us.
                This isn't just early access—it's co-creation at the deepest level.
              </p>
              <ul className="space-y-3 text-sm text-neutral-700 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-consciousness-500 text-lg">✓</span>
                  <span>Direct input on consciousness algorithms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-consciousness-500 text-lg">✓</span>
                  <span>Weekly sessions with the Five Masters council</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-consciousness-500 text-lg">✓</span>
                  <span>Your consciousness patterns help train the system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-consciousness-500 text-lg">✓</span>
                  <span>Lifetime access to all future evolutions</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-light">$99/month</span>
                <button className="px-6 py-3 bg-consciousness-600 text-white rounded-xl hover:bg-consciousness-700 transition-colors">
                  Reserve Your Spot
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20">
      <AnimatePresence>
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: section.locked ? 0.3 : 1, 
              y: 0,
              filter: section.locked ? 'blur(4px)' : 'none'
            }}
            transition={{ delay: index * 0.2 }}
            className="mb-20 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-light mb-8 text-neutral-800">
              {section.title}
            </h3>
            
            {section.locked ? (
              <div className="text-center py-12">
                <p className="text-neutral-500 text-sm">
                  This wisdom reveals itself through patient exploration...
                </p>
              </div>
            ) : (
              section.content
            )}
          </motion.section>
        ))}
      </AnimatePresence>

      {/* Ambient scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: signals.scrollDepth < 80 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-neutral-400 text-sm"
        >
          ↓ More awaits below ↓
        </motion.div>
      </motion.div>
    </div>
  );
}