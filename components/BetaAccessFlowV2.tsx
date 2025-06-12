'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateBetaCode } from '@/lib/betaAccessV2';

interface BetaAccessFlowProps {
  onSuccess: () => void;
  onProceedToWaitlist: () => void;
  referralCode?: string;
}

export function BetaAccessFlowV2({ onSuccess, onProceedToWaitlist, referralCode }: BetaAccessFlowProps) {
  const [code, setCode] = useState(referralCode || '');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [codeCharacters, setCodeCharacters] = useState<string[]>(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Convert code to character array for individual inputs
  useEffect(() => {
    const chars = code.toUpperCase().split('');
    const newChars = [...Array(20)].map((_, i) => chars[i] || '');
    setCodeCharacters(newChars);
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    try {
      const fullCode = codeCharacters.join('').trim();
      const validation = await validateBetaCode(fullCode, email, name);
      
      if (validation.valid) {
        // Success animation
        setTimeout(() => {
          onSuccess();
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

  const handleCharacterChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const chars = value.toUpperCase().split('');
      const newChars = [...codeCharacters];
      chars.forEach((char, i) => {
        if (index + i < 20 && /[A-Z0-9-]/.test(char)) {
          newChars[index + i] = char;
        }
      });
      setCodeCharacters(newChars);
      setCode(newChars.join(''));
      
      // Focus next empty field
      const nextEmpty = newChars.findIndex((c, i) => i >= index + chars.length && !c);
      if (nextEmpty !== -1) setFocusedIndex(nextEmpty);
    } else if (/^[A-Z0-9-]$/i.test(value) || value === '') {
      const newChars = [...codeCharacters];
      newChars[index] = value.toUpperCase();
      setCodeCharacters(newChars);
      setCode(newChars.join(''));
      
      // Auto-advance to next field
      if (value && index < 19) {
        setFocusedIndex(index + 1);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeCharacters[index] && index > 0) {
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 19) {
      setFocusedIndex(index + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dune-black via-dune-black/95 to-spice-orange/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Floating glass orbs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-desert-sand/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-spice-orange/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative max-w-3xl w-full"
      >
        {/* Main glass panel */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-desert-sand/50 to-transparent" />
          
          {/* Inner glass panel */}
          <div className="relative p-12">
            {/* Header section with glass effect */}
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-gradient-to-b from-desert-sand/10 to-transparent rounded-2xl blur-xl" />
              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-desert-sand/20 to-spice-orange/20 backdrop-blur-sm border border-desert-sand/20"
                >
                  <span className="text-4xl">🔑</span>
                </motion.div>
                
                <h2 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-desert-sand to-spice-orange mb-3">
                  Beta Access Portal
                </h2>
                <p className="text-sietch-stone/80 text-lg">
                  Enter your exclusive access code to unlock the Arkana experience
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Code input section with individual character boxes */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-desert-sand/80 text-center">
                  ACCESS CODE
                </label>
                <div className="flex justify-center gap-1 flex-wrap max-w-2xl mx-auto">
                  {codeCharacters.map((char, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <input
                        type="text"
                        value={char}
                        onChange={(e) => handleCharacterChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={() => setFocusedIndex(index)}
                        ref={(el) => {
                          if (el && focusedIndex === index) {
                            el.focus();
                          }
                        }}
                        className={`w-10 h-12 text-center font-mono text-lg backdrop-blur-sm transition-all ${
                          char
                            ? 'bg-desert-sand/10 border-desert-sand/40 text-desert-sand'
                            : 'bg-white/5 border-white/20 text-white'
                        } border rounded-lg focus:border-desert-sand/60 focus:bg-desert-sand/20 focus:outline-none focus:ring-2 focus:ring-desert-sand/20`}
                        maxLength={20}
                        disabled={isValidating}
                      />
                      {index === 5 || index === 11 || index === 16 ? (
                        <span className="inline-block w-2 text-center text-sietch-stone/40">-</span>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Email and name inputs with glass effect */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-desert-sand/80">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-sietch-stone/50 focus:border-desert-sand/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-desert-sand/20 transition-all"
                      placeholder="you@example.com"
                      required
                      disabled={isValidating}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-desert-sand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-desert-sand/80">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-sietch-stone/50 focus:border-desert-sand/60 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-desert-sand/20 transition-all"
                      placeholder="Your name (optional)"
                      disabled={isValidating}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-desert-sand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-red-500/10 rounded-xl blur-xl" />
                    <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                      <p className="text-red-400 text-center">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button with premium glass effect */}
              <motion.button
                type="submit"
                disabled={!code || !email || isValidating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-desert-sand to-spice-orange rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-desert-sand to-spice-orange rounded-xl blur group-hover:blur-md transition-all" />
                <div className="relative bg-gradient-to-r from-desert-sand to-spice-orange rounded-xl px-8 py-5 text-dune-black font-medium text-lg">
                  {isValidating ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.div
                        className="w-5 h-5 border-2 border-dune-black/30 border-t-dune-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Validating Access...
                    </span>
                  ) : (
                    'Enter the Inner Circle'
                  )}
                </div>
              </motion.button>
            </form>

            {/* Waitlist link with glass panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <div className="inline-block">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
                  <p className="text-sietch-stone/60 text-sm mb-2">
                    Don't have a code or having issues?
                  </p>
                  <button
                    onClick={onProceedToWaitlist}
                    className="text-desert-sand hover:text-spice-orange text-sm font-medium transition-colors"
                  >
                    Join the Exclusive Waitlist →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dev mode test codes */}
            {process.env.NODE_ENV === 'development' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-sietch-stone/50 mb-2">Dev Mode - Test Codes:</p>
                  <p className="text-xs font-mono text-desert-sand/50">
                    ARKANA-INSIDER-2025<br />
                    VIP-FOUNDER-ACCESS<br />
                    TEST-BETA-123
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}