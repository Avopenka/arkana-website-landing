'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('description');
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Wait a moment for UX
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  const getErrorTitle = () => {
    switch (error) {
      case 'confirmation_failed':
        return 'Email Confirmation Failed';
      case 'expired_token':
        return 'Confirmation Link Expired';
      case 'invalid_token':
        return 'Invalid Confirmation Link';
      default:
        return 'Authentication Error';
    }
  };

  const getErrorMessage = () => {
    if (description) return description;
    
    switch (error) {
      case 'confirmation_failed':
        return 'We were unable to confirm your email address. The confirmation link may be invalid or expired.';
      case 'expired_token':
        return 'Your email confirmation link has expired. Please request a new confirmation email.';
      case 'invalid_token':
        return 'The confirmation link appears to be invalid. Please check the link in your email or request a new one.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Error Animation */}
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.7)',
              '0 0 0 20px rgba(239, 68, 68, 0)',
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
            ⚠️
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {getErrorTitle()}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {getErrorMessage()}
        </motion.p>

        {/* Error Details */}
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-sm font-medium mb-2 text-red-400">Error Details</h3>
            <p className="text-xs text-gray-400 font-mono">
              {error.replace(/_/g, ' ').toUpperCase()}
            </p>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-lg font-medium mb-3 text-blue-400">What You Can Do</h3>
          <ul className="text-left text-gray-300 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Check your email for the latest confirmation link
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Try signing up again if you haven't received an email
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              Contact support if the problem persists
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full px-6 py-3 bg-brand-teal text-black font-medium rounded-lg hover:bg-brand-teal/80 transition-colors disabled:opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: isRetrying ? 1 : 1.02 }}
            whileTap={{ scale: isRetrying ? 1 : 0.98 }}
          >
            {isRetrying ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Going Home...
              </span>
            ) : (
              'Return to Home'
            )}
          </motion.button>

          <motion.button
            onClick={() => router.push('mailto:support@arkana.chat')}
            className="w-full px-6 py-2 bg-white/5 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}