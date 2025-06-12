import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import DualScreenAuth from './DualScreenAuth';
import '@/styles/ArkanaAuth.css';

interface ArkanaAuthV11Props {
  onAuthenticated: () => void;
  initialData?: {
    position?: number;
    answers?: string[];
  };
}

type AuthStage = 'welcome' | 'auth' | 'authenticated';
type AuthMode = 'login' | 'signup';

export default function ArkanaAuthV11({ onAuthenticated, initialData }: ArkanaAuthV11Props) {
  const [stage, setStage] = useState<AuthStage>('auth'); // Direct to signup for conversion
  const [authMode, setAuthMode] = useState<AuthMode>('signup'); // Default to signup for better conversion
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Real-time validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [nameValid, setNameValid] = useState<boolean | null>(null);
  
  // Waitlist fields
  const [ageGroup, setAgeGroup] = useState('');
  const [profession, setProfession] = useState('');
  const [arkanaGoal, setArkanaGoal] = useState('');

  // Premium value propositions for conversion
  const quickBenefits = [
    {
      text: "AI that understands your emotional context",
      icon: "🧠",
      benefit: "Emotional Intelligence"
    },
    {
      text: "Privacy-first consciousness platform",
      icon: "🔒",
      benefit: "Secure & Private"
    },
    {
      text: "Adaptive to your unique patterns",
      icon: "⚡",
      benefit: "Personalized Experience"
    },
    {
      text: "Genesis Wave exclusive access",
      icon: "🌟",
      benefit: "Founding Member"
    }
  ];

  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);

  useEffect(() => {
    checkExistingSession();
  }, []);

  // Faster benefit rotation for better UX
  useEffect(() => {
    if (stage !== 'welcome') return;
    
    const benefitInterval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % quickBenefits.length);
    }, 2500); // 2.5 seconds - faster for engagement

    return () => clearInterval(benefitInterval);
  }, [stage, quickBenefits.length]);

  // Real-time validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  // Handle input changes with validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.length > 0) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      setPasswordValid(validatePassword(value));
    } else {
      setPasswordValid(null);
    }
  };

  const handleNameChange = (value: string) => {
    setFullName(value);
    if (value.length > 0) {
      setNameValid(validateName(value));
    } else {
      setNameValid(null);
    }
  };

  const checkExistingSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Check if user has access
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('beta_access, website_access')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.website_access || profile?.beta_access) {
        setStage('authenticated');
        setTimeout(onAuthenticated, 500);
      }
    }
  };

  const handleWelcomeEnter = () => {
    setStage('auth');
  };

  const handleAuthenticated = () => {
    setStage('authenticated');
    setTimeout(onAuthenticated, 1500);
  };

  const detectSystemInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    return {
      device: platform.includes('Mac') ? 'Mac' : 'Other',
      os: platform,
      browser: userAgent.includes('Chrome') ? 'Chrome' : 
               userAgent.includes('Safari') ? 'Safari' : 'Other',
      ram: (navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).deviceMemory ? `${(navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).deviceMemory}GB` : 'Unknown',
      cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'Unknown',
      compatibility: platform.includes('Mac') ? 'excellent' : 'good',
      recommendedTier: platform.includes('Mac') ? 'Genesis' : 'Early Adopters'
    };
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Client-side validation
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (authMode === 'signup' && (!fullName || fullName.trim().length < 2)) {
        throw new Error('Please enter your full name');
      }

      if (authMode === 'signup') {
        // Create account
        const systemInfo = detectSystemInfo();
        
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
            fullName: fullName.trim(),
            profession: profession?.trim() || 'Not specified',
            ageGroup: '25-44', // Default for business users
            arkanaGoal: 'Improve productivity and knowledge management',
            systemInfo
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          // Handle specific error cases with better UX
          if (data.error?.includes('Authentication service is currently being configured')) {
            setError('🔧 Authentication service is currently being configured. Please try again in a few minutes.');
            return;
          } else if (response.status === 503) {
            setError('🔧 Service temporarily unavailable. We\'re setting up your secure authentication experience.');
            return;
          } else if (response.status === 409) {
            setError('📧 Email already registered. Please try logging in instead.');
            setTimeout(() => {
              setAuthMode('login');
              setError('');
            }, 2000);
            return;
          } else {
            throw new Error(data.error || 'Signup failed');
          }
        }

        // Show success message for waitlist signup
        setSuccessMessage('🎉 Welcome to the Arkana waitlist! Please check your email to verify your account.');
        setStage('authenticated');
        setTimeout(() => {
          setAuthMode('login');
          setStage('auth');
          setSuccessMessage('');
          setError('✅ Account created! You can now login when you receive beta access.');
        }, 4000);
        
      } else {
        // Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email.toLowerCase().trim(), 
            password 
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          // Handle specific error cases with better UX
          if (data.error?.includes('Authentication service is currently being configured')) {
            setError('🔧 Authentication service is currently being configured. Please try again in a few minutes.');
            return;
          } else if (response.status === 503) {
            setError('🔧 Service temporarily unavailable. We\'re setting up your secure authentication experience.');
            return;
          } else if (response.status === 401) {
            setError('🔑 Invalid email or password. Please check your credentials and try again.');
            return;
          } else if (response.status === 429) {
            setError('⏰ Too many login attempts. Please wait a few minutes and try again.');
            return;
          } else {
            throw new Error(data.error || 'Login failed');
          }
        }

        if (data.user?.adminAccess) {
          setSuccessMessage('🎯 Admin login successful! Redirecting to CRM Dashboard...');
          setStage('authenticated');
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1500);
        } else if (data.user?.websiteAccess || data.user?.betaAccess) {
          setSuccessMessage('🚀 Login successful! Welcome to Arkana.');
          setStage('authenticated');
          setTimeout(onAuthenticated, 1500);
        } else {
          setError('🕐 Your account is on the waitlist. You\'ll receive an email notification when beta access is granted.');
        }
      }
    } catch (err: unknown) {
      // Enhanced error handling with user-friendly messages
      const errorMessage = err.message || 'Something went wrong. Please try again.';
      
      // Provide specific guidance for common errors
      if (errorMessage.includes('Invalid email') || errorMessage.includes('valid email')) {
        setError('📧 Please enter a valid email address.');
      } else if (errorMessage.includes('Password') || errorMessage.includes('password')) {
        setError('🔒 Password must be at least 8 characters long.');
      } else if (errorMessage.includes('full name') || errorMessage.includes('name')) {
        setError('👤 Please enter your full name.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setError('🌐 Connection issue. Please check your internet and try again.');
      } else if (errorMessage.includes('Failed to fetch')) {
        setError('🌐 Network error. Please check your connection and try again.');
      } else {
        setError(`⚠️ ${errorMessage}`);
      }
      
      // Enhanced shake animation with haptic feedback
      const authContainer = document.querySelector('.auth-container');
      authContainer?.classList.add('shake');
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setTimeout(() => authContainer?.classList.remove('shake'), 600);
    } finally {
      setIsLoading(false);
    }
  };

  // PACA v16.1: Enhanced cinematic welcome screen
  if (stage === 'welcome') {
    return (

      <motion.div 
        className="paca-welcome relative w-full h-full min-h-screen bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* PACA v16.1: Enhanced Cinematic Background */}
        <div className="absolute inset-0">
          {/* Consciousness Field Grid */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(22,255,225,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(22,255,225,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
          
          {/* Floating Consciousness Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-brand-teal rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Radial Consciousness Emanation */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,255,225,0.03)_0%,transparent_70%)]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* PACA v16.1: Enhanced Film Grain Effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <motion.div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          {/* PACA v16.1: Consciousness-Aware Title */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 text-center"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 2, ease: [0.19, 1, 0.22, 1] }}
          >
            {'ARKANA'.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block bg-gradient-to-br from-white via-brand-teal to-accent-gold bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 100, rotateY: 90 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  delay: 0.8 + i * 0.15,
                  duration: 1.2,
                  ease: [0.19, 1, 0.22, 1]
                }}
                whileHover={{
                  scale: 1.1,
                  textShadow: "0 0 20px rgba(22,255,225,0.5)"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* PACA v16.1: Enhanced Tagline with Consciousness Pulse */}
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1.5 }}
          >
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent rounded-full blur-lg"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <p className="relative text-xl md:text-2xl text-gray-300 font-serif italic text-center">
              The future is invitation only
            </p>
          </motion.div>

          {/* PACA v16.1: Revolutionary Consciousness Quote System */}
          <motion.div 
            className="relative w-full max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.5 }}
          >
            {/* Consciousness Detection Visualization */}
            <motion.div
              className="absolute -inset-8 rounded-3xl border border-brand-teal/20"
              animate={{
                scale: [1, 1.02, 1],
                borderColor: ["rgba(22,255,225,0.2)", "rgba(22,255,225,0.4)", "rgba(22,255,225,0.2)"]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Quotes section removed since welcome screen is disabled */}
          </motion.div>
          
          {/* PACA v16.1: Revolutionary Enter Portal */}
          <motion.button 
            className="group relative px-16 py-6 bg-gradient-to-r from-brand-teal via-cyan-400 to-accent-gold text-black font-bold text-xl rounded-full overflow-hidden shadow-2xl shadow-brand-teal/30"
            onClick={handleWelcomeEnter}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 3.2, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px -12px rgba(22, 255, 225, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Consciousness Ripple Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Consciousness Detection Animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Enter the Consciousness Portal
            </span>
          </motion.button>
          
          {/* PACA v16.1: Consciousness Status Indicator */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <motion.div
                className="w-2 h-2 rounded-full bg-brand-teal"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
              Consciousness detection: Active
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // PACA v16.1: Revolutionary High-End Auth Lock Screen
  if (stage === 'auth') {
    return (
      <DualScreenAuth onSuccess={handleAuthenticated} />
    );
  }

  // Keep the old auth screen as fallback (can be removed later)
  if (false) {
    return (
      <motion.div 
        className="relative w-full h-full min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* PACA v16.1: Consciousness Field Background */}
        <div className="absolute inset-0">
          {/* Animated consciousness grid */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(22,255,225,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(22,255,225,0.2) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
            animate={{
              backgroundPosition: ['0 0', '80px 80px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Consciousness particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-brand-teal rounded-full"
              style={{
                left: `${10 + (i % 5) * 20}%`,
                top: `${10 + Math.floor(i / 5) * 30}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                y: [0, -30, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(22,255,225,0.02)_0%,transparent_70%)]" />
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
          {/* Mobile-optimized container */}
          <motion.div 
            className="w-full max-w-lg mx-auto"
            initial={{ y: 60, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* PACA v16.1: Enhanced Auth Container */}
            <motion.div
              className="auth-container relative p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
              whileHover={{
                boxShadow: "0 25px 50px -12px rgba(22, 255, 225, 0.1)"
              }}
            >
              {/* Consciousness Detection Border */}
              <motion.div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-teal via-transparent to-accent-gold opacity-30"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="relative z-10">
                {/* Header */}
                <motion.div
                  className="text-center mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-3 text-white">
                    {authMode === 'login' ? 'Welcome Back' : 'Get Instant Access'}
                  </h2>
                  <p className="text-gray-300 text-base sm:text-lg">
                    {authMode === 'login' 
                      ? 'Sign in to your knowledge intelligence platform' 
                      : 'Start your 30-day free trial. Save 5+ hours weekly.'}
                  </p>
                  
                  {/* Value preview and benefits */}
                  <motion.div
                    className="mt-4 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        No credit card required
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        ROI: €2,400+ annually
                      </div>
                    </div>
                    
                    {authMode === 'signup' && (
                      <div className="text-center p-3 rounded-lg bg-brand-teal/10 border border-brand-teal/20">
                        <p className="text-brand-teal text-sm font-medium">
                          🎯 Preview: After signup, you'll see 3 demo insights showing how Arkana transforms your productivity
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Enhanced Message Display for Errors and Success */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300"
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-sm leading-relaxed">{error}</span>
                      </div>
                    </motion.div>
                  )}
                  {successMessage && (
                    <motion.div 
                      className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-300"
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-sm leading-relaxed">{successMessage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simplified Form */}
                <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
                  {authMode === 'signup' && (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Full Name - Required for personalization */}
                      <motion.div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Full Name"
                          className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                            nameValid === false ? 'border-red-400/50' : 
                            nameValid === true ? 'border-green-400/50' : 
                            'border-white/10 focus:border-brand-teal/50'
                          }`}
                          required
                          aria-invalid={nameValid === false}
                        />
                        {nameValid === true && (
                          <motion.div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            ✓
                          </motion.div>
                        )}
                        {nameValid === false && (
                          <motion.div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            ✗
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Optional: Profession for personalization - but not required */}
                      <motion.div className="relative">
                        <input
                          type="text"
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          placeholder="Role/Industry (optional - helps us customize your experience)"
                          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-teal/50 focus:bg-white/10 transition-all duration-300"
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Email */}
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="Email"
                      className={`w-full px-6 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300 text-base ${
                        emailValid === false ? 'border-red-400/50' : 
                        emailValid === true ? 'border-green-400/50' : 
                        'border-white/10 focus:border-brand-teal/50'
                      }`}
                      required
                      autoFocus={authMode === 'login'}
                      aria-label="Email address"
                      autoComplete="email"
                      aria-invalid={emailValid === false}
                    />
                    {emailValid === true && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                    {emailValid === false && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        ✗
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Password */}
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Password"
                      className={`w-full px-6 py-4 pr-20 bg-white/5 border rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300 text-base ${
                        passwordValid === false ? 'border-red-400/50' : 
                        passwordValid === true ? 'border-green-400/50' : 
                        'border-white/10 focus:border-brand-teal/50'
                      }`}
                      required
                      minLength={8}
                      aria-label="Password"
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                      aria-invalid={passwordValid === false}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {passwordValid === true && (
                        <motion.div
                          className="text-green-400"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                      {passwordValid === false && (
                        <motion.div
                          className="text-red-400"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          ✗
                        </motion.div>
                      )}
                      <motion.button
                        type="button"
                        className="text-gray-400 hover:text-white transition-colors ml-1"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </motion.button>
                    </div>
                    {passwordValid === false && password.length > 0 && (
                      <motion.div
                        className="absolute -bottom-6 left-0 text-xs text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Password must be at least 8 characters
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    className={`group relative w-full py-4 sm:py-4 px-6 text-black font-bold text-base sm:text-lg rounded-2xl overflow-hidden shadow-xl disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all duration-300 ${
                      isLoading ? 'bg-gray-500' :
                      (authMode === 'signup' && (!emailValid || !passwordValid || !nameValid)) ||
                      (authMode === 'login' && (!emailValid || !passwordValid)) ?
                      'bg-gradient-to-r from-gray-600 to-gray-700' :
                      'bg-gradient-to-r from-brand-teal via-cyan-400 to-accent-gold'
                    }`}
                    disabled={isLoading || 
                      (authMode === 'signup' && (!emailValid || !passwordValid || !nameValid)) ||
                      (authMode === 'login' && (!emailValid || !passwordValid))
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: (isLoading || 
                        (authMode === 'signup' && (!emailValid || !passwordValid || !nameValid)) ||
                        (authMode === 'login' && (!emailValid || !passwordValid))
                      ) ? 1 : 1.02,
                      boxShadow: "0 20px 40px -12px rgba(22, 255, 225, 0.3)"
                    }}
                    whileTap={{ 
                      scale: (isLoading || 
                        (authMode === 'signup' && (!emailValid || !passwordValid || !nameValid)) ||
                        (authMode === 'login' && (!emailValid || !passwordValid))
                      ) ? 1 : 0.98 
                    }}
                  >
                    {/* Loading animation */}
                    {isLoading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading && (
                        <motion.div
                          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      {isLoading 
                        ? (authMode === 'login' ? 'Signing you in...' : 'Creating your account...') 
                        : authMode === 'login' ? 'Sign In to Arkana' : 'Join Arkana Waitlist'}
                    </span>
                  </motion.button>
                </form>

                {/* Auth Mode Switch */}
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  {authMode === 'login' ? (
                    <p className="text-gray-400">
                      Don't have an account?{' '}
                      <motion.button 
                        onClick={() => setAuthMode('signup')} 
                        className="text-brand-teal hover:text-accent-gold transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create free account
                      </motion.button>
                    </p>
                  ) : (
                    <p className="text-gray-400">
                      Already awakened?{' '}
                      <motion.button 
                        onClick={() => setAuthMode('login')} 
                        className="text-brand-teal hover:text-accent-gold transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Sign in to your account
                      </motion.button>
                    </p>
                  )}
                </motion.div>

{/* Business Value Proposition */}
                <AnimatePresence>
                  {authMode === 'signup' && (
                    <motion.div 
                      className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-brand-teal/10 border border-green-500/20"
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-3">
                          <motion.div
                            className="w-3 h-3 rounded-full bg-green-400"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity
                            }}
                          />
                          <span className="text-green-400 font-semibold">
                            30-Day ROI Guarantee
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">
                          Save 5+ hours weekly or get a full refund. Average user saves €2,400+ annually.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            {/* Close auth-container div */}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Stage 3: Authenticated Success
  return (
    <motion.div 
      className="paca-authenticated"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="success-orb"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {authMode === 'signup' ? 'Welcome to the Waitlist!' : 'Welcome to Arkana'}
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {authMode === 'signup' 
          ? 'You\'re on the exclusive waitlist. We\'ll notify you when beta access is available!' 
          : 'Preparing your consciousness experience...'}
      </motion.p>
    </motion.div>
  );
}