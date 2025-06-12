'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface LuxuryNavigationProps {
  onShowAuth?: () => void;
}

export default function LuxuryNavigation({ onShowAuth }: LuxuryNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#demo', label: 'Demo' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/20 backdrop-blur-xl border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            {/* Arkana orb */}
            <div className="relative w-12 h-12">
              <motion.div
                animate={{ rotateZ: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Image
                  src="/OrbRefined.png"
                  alt="Arkana Orb"
                  fill
                  className="object-contain opacity-90"
                  unoptimized
                  style={{background: 'transparent'}}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 to-transparent blur-lg" />
            </div>

            {/* Logo text */}
            <div className="relative">
              <Image
                src="/MainLogoENoNameNoBackGround.png"
                alt="Arkana"
                width={120}
                height={40}
                className="object-contain opacity-95 drop-shadow-[0_2px_8px_rgba(22,255,225,0.3)]"
                unoptimized
                style={{background: 'transparent'}}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-amber-400/10 mix-blend-overlay" />
            </div>
          </motion.div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  href={item.href}
                  className="group relative px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Holographic hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{
                      background: [
                        'linear-gradient(90deg, rgba(0,255,255,0) 0%, rgba(0,255,255,0) 100%)',
                        'linear-gradient(90deg, rgba(0,255,255,0) 0%, rgba(0,255,255,0.1) 50%, rgba(0,255,255,0) 100%)',
                        'linear-gradient(90deg, rgba(0,255,255,0) 0%, rgba(0,255,255,0) 100%)'
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  
                  {/* Neural connection line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Consciousness status indicator */}
          <div className="hidden lg:flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
              animate={{
                borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,255,255,0.3)', 'rgba(255,255,255,0.1)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-full bg-cyan-400 rounded-full"
                />
              </div>
              <span className="text-xs text-gray-400 font-mono">ONLINE</span>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={onShowAuth}
                data-auth-trigger
                className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 backdrop-blur-sm text-black font-medium rounded-full overflow-hidden transition-all hover:shadow-cyan-500/25 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Get Early Access</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                
                {/* Neural circuit background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-500 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
              className="w-5 h-5 relative"
            >
              <motion.span
                animate={{ 
                  rotateZ: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 0 : -6 
                }}
                className="absolute w-full h-0.5 bg-white left-0 top-1/2 origin-center"
              />
              <motion.span
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                className="absolute w-full h-0.5 bg-white left-0 top-1/2"
              />
              <motion.span
                animate={{ 
                  rotateZ: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? 0 : 6 
                }}
                className="absolute w-full h-0.5 bg-white left-0 top-1/2 origin-center"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile CTA */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-white/10"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onShowAuth?.();
                  }}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-lg text-center"
                >
                  Begin Your Journey
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}