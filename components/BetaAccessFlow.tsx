'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateBetaCode } from '@/lib/betaAccessV2';

interface BetaAccessFlowProps {
  onSuccess: () => void;
  onProceedToWaitlist: () => void; // New prop
  referralCode?: string;
}

export function BetaAccessFlow({ onSuccess, onProceedToWaitlist, referralCode }: BetaAccessFlowProps) {
  const [code, setCode] = useState(referralCode || '');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    try {
      // Validate the beta code with email
      const validation = await validateBetaCode(code, email, name);
      
      if (validation.valid) {
        // Success animation
        setTimeout(() => {
          onSuccess(); // Call onSuccess to proceed to main content
        }, 1000);
      } else {
        setError(validation.message || 'Invalid code. Please try again or join the waitlist.');
        setIsValidating(false);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dune-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="dune-glass-dark rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-desert-sand mb-4">
              Beta Access Portal
            </h2>
            <p className="text-sietch-stone">
              Enter your exclusive access code to unlock the full Arkana experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter beta code"
                className="w-full px-6 py-4 bg-transparent border border-desert-sand/30 rounded-xl text-white placeholder-sietch-stone/50 focus:border-desert-sand/60 focus:outline-none transition-all text-center font-mono tracking-wider"
                required
                disabled={isValidating}
              />
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-6 py-4 bg-transparent border border-desert-sand/30 rounded-xl text-white placeholder-sietch-stone/50 focus:border-desert-sand/60 focus:outline-none transition-all"
                required
                disabled={isValidating}
              />
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-6 py-4 bg-transparent border border-desert-sand/30 rounded-xl text-white placeholder-sietch-stone/50 focus:border-desert-sand/60 focus:outline-none transition-all"
                disabled={isValidating}
              />
              
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-spice-orange text-sm mt-2 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={!code || !email || isValidating}
              className="dune-button w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-dune-black/30 border-t-dune-black rounded-full animate-spin" />
                  Validating Access...
                </span>
              ) : (
                'Enter the Inner Circle'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sietch-stone/60 text-sm">
              Don't have a code or your code is invalid?
            </p>
            <button
              onClick={onProceedToWaitlist} // Use the new prop to go to the waitlist screen
              className="text-desert-sand/80 hover:text-desert-sand text-sm underline"
            >
              Join the Waitlist
            </button>
          </div>

          {/* Sample codes for testing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-sietch-stone/50 mb-2">Dev Mode - Test Codes:</p>
              <p className="text-xs font-mono text-desert-sand/50">
                ARKANA-INSIDER-2025<br />
                VIP-FOUNDER-ACCESS<br />
                TEST-BETA-123
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}