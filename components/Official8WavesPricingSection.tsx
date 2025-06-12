'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface WaveInfo {
  current_wave: number;
  wave_name: string;
  total_users: number;
  users_in_wave: number;
  spots_remaining: number;
  current_price: number;
  current_annual: number;
  lock_years: number;
  next_price: number;
  next_wave_name: string;
}

interface Official8WavesPricingSectionProps {
  onShowAuth?: () => void;
}

export default function Official8WavesPricingSection({ onShowAuth }: Official8WavesPricingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  
  const [waveInfo, setWaveInfo] = useState<WaveInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingToggle, setBillingToggle] = useState<'monthly' | 'yearly'>('yearly');
  
  // ROI Calculator State
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursSearching, setHoursSearching] = useState(2.5);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    fetch('/api/waves/current')
      .then(r => r.json())
      .then(data => {
        setWaveInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allWaves = [
    { number: 0, name: 'Codex Founders', price: 25, lock: 100, max: 100, mysticalDesc: 'The first 100 creators shaping our collective future' },
    { number: 1, name: 'Sage Advisors', price: 29, lock: 50, max: 1000, mysticalDesc: 'Early believers helping build the vision' },
    { number: 2, name: 'Oracle Prophets', price: 34, lock: 25, max: 2500, mysticalDesc: 'Visionaries seeing the creative potential' },
    { number: 3, name: 'Guardian Protectors', price: 39, lock: 10, max: 10000, mysticalDesc: 'Champions of data ownership and freedom' },
    { number: 4, name: 'Scholar Researchers', price: 44, lock: 5, max: 25000, mysticalDesc: 'Knowledge builders expanding possibilities' },
    { number: 5, name: 'Apprentice Learners', price: 49, lock: 2, max: 100000, mysticalDesc: 'Creators discovering their AI companion' },
    { number: 6, name: 'Seeker Explorers', price: 54, lock: 1, max: 1000000, mysticalDesc: 'Adventurers in the new creative space' },
    { number: 7, name: 'Access Members', price: 59, lock: 0, max: 10000000, mysticalDesc: 'Welcome to your creative journey' },
  ];

  if (loading || !waveInfo) {
    return (
      <section className="relative py-20 lg:py-32 bg-deep-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-12 w-64 mx-auto mb-4 animate-pulse bg-white/10 rounded-lg" />
            <div className="h-6 w-96 mx-auto animate-pulse bg-white/10 rounded-lg" />
          </div>
          <div className="h-96 animate-pulse bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10">
            <div className="p-8 space-y-4">
              <div className="h-8 w-48 animate-pulse bg-white/10 rounded-lg" />
              <div className="h-24 w-full animate-pulse bg-white/10 rounded-lg" />
              <div className="h-12 w-32 animate-pulse bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentWave = allWaves[waveInfo.current_wave] || allWaves[0]; // Fallback to first wave if undefined
  const progressPercentage = currentWave && waveInfo.current_wave > 0 ? 
    (waveInfo.users_in_wave / (currentWave.max - (allWaves[waveInfo.current_wave - 1]?.max || 0))) * 100 : 0;

  const annualPrice = Math.round(waveInfo.current_price * 12 * 0.8); // 20% discount
  const annualSavings = (waveInfo.current_price * 12) - annualPrice;
  
  // ROI Calculations
  const dailyTimeLoss = hoursSearching;
  const weeklyTimeLoss = dailyTimeLoss * 5;
  const monthlyTimeLoss = weeklyTimeLoss * 4.33;
  const annualTimeLoss = monthlyTimeLoss * 12;
  
  const dailyCost = dailyTimeLoss * hourlyRate;
  const weeklyCost = weeklyTimeLoss * hourlyRate;
  const monthlyCost = monthlyTimeLoss * hourlyRate;
  const annualCost = annualTimeLoss * hourlyRate;
  
  const arkanaAnnualCost = billingToggle === 'yearly' ? annualPrice : (waveInfo.current_price * 12);
  const annualROI = annualCost - arkanaAnnualCost;
  const roiMultiplier = Math.round(annualCost / arkanaAnnualCost);

  return (
    <section 
      id="pricing"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-deep-black to-pure-black overflow-hidden"
    >
      {/* Mystical background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(22,255,225,0.04),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.04),transparent_70%)]" />
        
        {/* Floating pricing orbs */}
        <div className="absolute top-1/6 left-1/12 w-48 h-48 bg-brand-teal/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/6 right-1/12 w-64 h-64 bg-accent-gold/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Sacred geometry */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '60s' }}>
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="url(#mysticalGradient)" strokeWidth="0.5"/>
            <defs>
              <linearGradient id="mysticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(22,255,225,0.3)" />
                <stop offset="100%" stopColor="rgba(212,175,55,0.3)" />
              </linearGradient>
            </defs>
          </svg>
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
              Join the Creator Movement
            </span>
          </h2>
          <p className="text-neutral-gray text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Be part of the first wave building a future where everyone owns their intelligence.
            Your journey starts here, with a community of pioneers.
          </p>
        </motion.div>

        {/* Creator's Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-brand-teal/10 via-purple-500/10 to-accent-gold/10 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-serif mb-4 text-white">
                What Happens When Everyone Can Create?
              </h3>
              <p className="text-neutral-gray max-w-2xl mx-auto">
                In a world where your data works for you, where your AI grows with your unique perspective,
                where knowledge compounds like interest—everyone becomes a creator.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="text-lg font-semibold text-white mb-2">Your Mind, Amplified</h4>
                <p className="text-sm text-white/70">
                  Every thought becomes a building block. Watch your ideas evolve and connect in ways you never imagined.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl mb-3">🌍</div>
                <h4 className="text-lg font-semibold text-white mb-2">Collective Intelligence</h4>
                <p className="text-sm text-white/70">
                  Join a community where everyone's growth lifts the whole. Share insights while keeping your data private.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl mb-3">✨</div>
                <h4 className="text-lg font-semibold text-white mb-2">True Ownership</h4>
                <p className="text-sm text-white/70">
                  Your thoughts, your data, your AI. No corporate surveillance, just pure creation and growth.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/20">
              <p className="text-brand-teal font-medium">
                🚀 "The future isn't about saving time—it's about creating intelligence that's uniquely yours."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-1">
            <div className="flex">
              <button
                onClick={() => setBillingToggle('monthly')}
                className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingToggle === 'monthly' 
                    ? 'text-black bg-brand-teal shadow-glow-teal' 
                    : 'text-neutral-gray hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingToggle('yearly')}
                className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingToggle === 'yearly' 
                    ? 'text-black bg-accent-gold shadow-glow-gold' 
                    : 'text-neutral-gray hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Current Wave Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/* Main pricing card */}
          <div className="relative p-8 lg:p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 group">
            {/* Mystical glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-teal/10 via-transparent to-accent-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Scarcity indicator */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-brand-teal to-accent-gold px-6 py-2 rounded-full text-black text-sm font-semibold">
                Only {waveInfo.spots_remaining || 0} seats left in {currentWave?.name || 'this wave'}
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              {/* Wave name and mystical description */}
              <div className="mb-8">
                <h3 className="text-3xl lg:text-4xl font-serif mb-2 bg-gradient-to-r from-brand-teal to-accent-gold bg-clip-text text-transparent">
                  {currentWave?.name || 'Wave ' + waveInfo.current_wave}
                </h3>
                <p className="text-neutral-gray font-serif italic">
                  {currentWave?.mysticalDesc || 'Join the Arkana journey'}
                </p>
              </div>
              
              {/* Pricing display */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl lg:text-6xl font-serif text-white">
                    €{billingToggle === 'yearly' ? Math.round(annualPrice / 12) : waveInfo.current_price}
                  </span>
                  <span className="text-neutral-gray ml-2">
                    /{billingToggle === 'yearly' ? 'month' : 'month'}
                  </span>
                </div>
                
                {billingToggle === 'yearly' && (
                  <div className="text-accent-gold font-medium">
                    €{annualPrice}/year • Save €{annualSavings} annually
                  </div>
                )}
                
                <p className="text-neutral-gray text-sm mt-2">
                  Lock this price for {currentWave.lock} years
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="mb-8">
                <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-brand-teal to-accent-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${progressPercentage}%` } : { width: 0 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                  
                  {/* Mystical particles along progress bar */}
                  {!shouldReduceMotion && (
                    <motion.div 
                      className="absolute top-1/2 left-0 w-2 h-2 bg-white rounded-full transform -translate-y-1/2 blur-sm"
                      animate={{ 
                        x: [`0%`, `${progressPercentage}%`],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-sm text-neutral-gray mt-2">
                  <span>{waveInfo.total_users} founders joined</span>
                  <span>{waveInfo.spots_remaining} seats remaining</span>
                </div>
              </div>
              
              {/* Feature Highlights */}
              <div className="mb-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">Personal AI that learns your unique perspective</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">Your data stays yours—100% private, always</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">Watch your knowledge compound like interest</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80">Join a community of creators building together</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={onShowAuth}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-teal to-accent-gold rounded-full text-black font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full justify-center"
              >
                <span className="relative z-10">
                  Begin Your Creator Journey • €{billingToggle === 'yearly' ? Math.round(annualPrice / 12) : waveInfo.current_price}/month
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-gold to-brand-teal rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-white/60">
                  💳 No credit card required • Cancel anytime • 30-day money-back guarantee
                </p>
              </div>
              
              {/* Urgency message */}
              {waveInfo.spots_remaining < 20 && (
                <motion.p 
                  className="text-brand-teal text-sm mt-4 animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ⚡ When we hit {waveInfo.total_users + waveInfo.spots_remaining + 1} users, price increases to €{waveInfo.next_price}/month
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* All Waves Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12"
        >
          <h3 className="text-2xl lg:text-3xl font-serif mb-8 text-center bg-gradient-to-r from-brand-teal to-accent-gold bg-clip-text text-transparent">
            The Complete Journey
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allWaves.map((wave, index) => {
              const isCurrent = wave.number === waveInfo.current_wave;
              const isPast = wave.number < waveInfo.current_wave;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className={`arkana-glass-panel relative p-6 transition-all duration-300 ease-in-out group ${
                    isCurrent 
                      ? 'scale-105 ring-2 ring-brand-teal shadow-brand-teal/30' 
                      : isPast 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:scale-[1.02] hover:shadow-brand-teal/10'
                  }`}
                >
                  <div className="text-center">
                    <h4 className={`font-serif text-base mb-1 ${ /* Increased font size */
                      isCurrent ? 'text-brand-teal' : isPast ? 'text-neutral-gray' : 'text-white'
                    }`}>
                      {wave.name}
                    </h4>
                    <p className={`text-sm mb-3 font-serif italic ${ /* Increased font size and margin */
                      isCurrent ? 'text-brand-teal/70' : 'text-neutral-gray/70'
                    }`}>
                      {wave.mysticalDesc}
                    </p>
                    <p className={`text-xl font-semibold mb-1 ${ /* Increased font size */
                      isCurrent ? 'text-white' : isPast ? 'text-neutral-gray' : 'text-white'
                    }`}>
                      €{wave.price}/mo
                    </p>
                    <p className={`text-sm ${ /* Increased font size */
                      isCurrent ? 'text-brand-teal/70' : 'text-neutral-gray/70'
                    }`}>
                      {wave.lock === 0 ? 'Monthly' : `${wave.lock}yr lock`}
                    </p>
                    
                    {/* Status indicator & Spots Remaining */}
                    <div className="mt-4 text-xs space-y-1"> {/* Increased margin and added space-y */}
                      {isPast ? (
                        <span className="font-medium text-neutral-gray/60">Sold Out</span>
                      ) : isCurrent ? (
                        <span className="font-semibold text-brand-teal">Available Now</span>
                      ) : (
                        <span className="font-medium text-neutral-gray/70">Coming Soon</span>
                      )}
                      {isCurrent && waveInfo && waveInfo.spots_remaining !== null && (
                        <p className="text-brand-teal/90">
                          <span className="font-semibold">{waveInfo.spots_remaining}</span> spots remaining
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Current wave indicator - subtle glow at the top edge */}
                  {isCurrent && (
                    <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-2/3 h-1 bg-brand-teal/70 rounded-full blur-md" />
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Explanation */}
          <div className="mt-8 text-center space-y-3 text-sm text-neutral-gray">
            <p>
              <span className="text-white font-semibold">Mystical Economics:</span> Each wave rewards the faithful with deeper locks and lower prices.
            </p>
            <p>
              <span className="text-white font-semibold">Sacred Commitment:</span> Your price remains locked for the entire period. Cancel and return at current rates.
            </p>
            <p>
              <span className="text-white font-semibold">Honest Scarcity:</span> No fake timers. When user limits are reached, prices automatically advance.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}