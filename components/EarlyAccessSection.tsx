'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function EarlyAccessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [seatsAvailable, setSeatsAvailable] = useState<boolean | null>(null);
  // Check seat availability on mount
  useEffect(() => {
    fetch('/api/waves/current')
      .then(r => r.json())
      .then(data => {
        setSeatsAvailable(data.spots_remaining > 0);
      })
      .catch(() => setSeatsAvailable(false));
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      // Check current wave availability
      const waveResponse = await fetch('/api/waves/current');
      const waveData = await waveResponse.json();
      if (waveData.spots_remaining <= 0) {
        // No seats available - add to waitlist
        const waitlistResponse = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (waitlistResponse.ok) {
          setMessage({ 
            type: 'success', 
            text: "You've been added to the waitlist! We'll notify you when seats become available." 
          });
          setEmail('');
        } else {
          throw new Error('Failed to add to waitlist');
        }
      } else {
        // Seats available - create checkout session
        const checkoutResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID // This should be dynamically set based on current wave
          })
        });
        if (!checkoutResponse.ok) {
          throw new Error('Failed to create checkout session');
        }
        const { sessionId } = await checkoutResponse.json();
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load');
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again or contact support.' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section 
      id="early-access"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-b from-pure-black to-deep-black overflow-hidden"
    >
      {/* Simple placeholder content for now */}
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Early Access</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : seatsAvailable ? 'Claim Your Seat' : 'Join Waitlist'}
          </button>
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}