'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Animation */}
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(34, 197, 94, 0.7)',
              '0 0 0 20px rgba(34, 197, 94, 0)',
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <motion.span
            className="text-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            ✓
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Email Confirmed!
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Your email has been successfully confirmed. You're now on the Arkana waitlist 
          and will be notified when beta access becomes available.
        </motion.p>

        {/* Status Card */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-medium mb-4 text-green-400">Your Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email Status:</span>
              <span className="text-green-400 font-medium">Confirmed ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Waitlist Status:</span>
              <span className="text-blue-400 font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Next Step:</span>
              <span className="text-white">Await beta invitation</span>
            </div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-lg font-medium mb-3 text-blue-400">What Happens Next?</h3>
          <ul className="text-left text-gray-300 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              We'll email you when beta access opens for your wave
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              You'll receive exclusive updates on Arkana's development
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Early access to emotional intelligence features
            </li>
          </ul>
        </motion.div>

        {/* Auto-redirect countdown */}
        <motion.div
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Redirecting to home page in {countdown} seconds...
        </motion.div>

        {/* Manual navigation */}
        <motion.button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-brand-teal text-black font-medium rounded-lg hover:bg-brand-teal/80 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to Home Now
        </motion.button>
      </motion.div>
    </div>
  );
}