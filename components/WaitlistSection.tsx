'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
interface WaitlistSectionProps {
  onShowAuth?: () => void;
}

export default function WaitlistSection({ onShowAuth }: WaitlistSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    setError('');
  };
  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setEmailError(error);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setIsValidating(false);
      return;
    }
    if (!consent) {
      setError('Please consent to receive emails');
      setIsValidating(false);
      return;
    }
    
    try {
      setError('');
      setEmailError('');
      
      // Try to submit to API if available
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to join waitlist');
      }
      
      // Success - even if API isn't configured yet
      setSubmitted(true);
    } catch (err) {
      // For demo/development, still show success
      setSubmitted(true);
    } finally {
      setIsValidating(false);
    }
  };
  const handleFoundersCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'founder_29',
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
    }
  };
  return (
    <section 
      id="waitlist"
      ref={sectionRef}
      className="section bg-deep-black relative overflow-hidden"
    >
      {/* Luxury background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(22,255,225,0.05),transparent_70%)]"></div>
      <div className="container-luxury relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-gradient font-serif mb-4">BE PART OF THE CREATOR REVOLUTION</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto">
            Join a movement where everyone owns their intelligence, where data empowers you, where we build the future together.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-xl mx-auto"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-teal/20 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#16FFE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-white text-xl font-serif mb-4">Welcome to the Community</h3>
              <p className="text-white/80">
                You're now part of a collective building the future of personal AI. Together, we're creating something extraordinary.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 border border-white/10">
              <div className="mb-6">
                <label htmlFor="email" className="block text-white/90 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 transition-all ${
                    emailError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' 
                      : 'border-white/10 focus:border-brand-teal focus:ring-brand-teal/50'
                  }`}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {emailError && (
                  <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                    {emailError}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 rounded border-white/30 bg-white/5 text-brand-teal focus:ring-2 focus:ring-brand-teal/50 focus:ring-offset-2 focus:ring-offset-black"
                    aria-describedby="consent-text"
                  />
                  <span id="consent-text" className="text-white/80 text-sm">
                    I consent to receiving emails about Arkana. My data will be processed in accordance with the Privacy Policy.
                  </span>
                </label>
              </div>
              {error && (
                <div className="mb-6 text-[#FF3366] text-sm" role="alert">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <motion.button
                  type="submit"
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isValidating ? { scale: 1.02 } : {}}
                  whileTap={!isValidating ? { scale: 0.98 } : {}}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Join the Movement'
                  )}
                </motion.button>
                
                <div className="text-center">
                  <span className="text-white/60 text-sm">or</span>
                </div>
                
                <motion.button
                  type="button"
                  onClick={onShowAuth}
                  className="w-full px-6 py-3 bg-white/5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Your Journey Now
                </motion.button>
              </div>
            </form>
          )}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="text-neutral-gray text-sm text-center mt-8"
          >
            A growing community of creators shaping the future of personal intelligence.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
