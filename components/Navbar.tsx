'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[800ms] ${
          isScrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <div className="container-luxury">
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/MainLogoENoNameNoBackGround.png" 
                  alt="Arkana Logo" 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 object-contain drop-shadow-[0_2px_8px_rgba(22,255,225,0.3)]" 
                  priority
                  unoptimized // Force Next.js to serve original PNG without optimization for true transparency
                />
                <span className="text-2xl font-serif text-white hidden sm:block">Arkana</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:flex items-center space-x-8"
            >
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#privacy">Privacy</NavLink>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden sm:block"
            >
              <Link 
                href="#waitlist" 
                className="btn btn-primary text-sm md:text-base"
              >
                Start Your Journey
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative w-11 h-11 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded-lg"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-white transform transition duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-full bg-white transition duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-full bg-white transform transition duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-black/95 backdrop-blur-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <Link href="/" onClick={closeMobileMenu} className="text-2xl font-serif text-white">
                    Arkana
                  </Link>
                  <button
                    onClick={closeMobileMenu}
                    className="w-10 h-10 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded-lg"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Links */}
                <nav className="flex-1 px-6 py-8 overflow-y-auto">
                  <div className="space-y-6">
                    <MobileNavLink href="#features" onClick={closeMobileMenu}>Features</MobileNavLink>
                    <MobileNavLink href="#how-it-works" onClick={closeMobileMenu}>How It Works</MobileNavLink>
                    <MobileNavLink href="#pricing" onClick={closeMobileMenu}>Pricing</MobileNavLink>
                    <MobileNavLink href="#about" onClick={closeMobileMenu}>About</MobileNavLink>
                    <MobileNavLink href="#privacy" onClick={closeMobileMenu}>Privacy</MobileNavLink>
                  </div>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-white/10">
                  <Link 
                    href="#waitlist" 
                    onClick={closeMobileMenu}
                    className="btn btn-primary w-full text-center"
                  >
                    Start Your Journey
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-white/90 hover:text-white transition-colors duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] text-sm font-medium relative group focus:outline-none focus:text-brand-teal"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-teal transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({ 
  href, 
  children, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode; 
  onClick: () => void;
}) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="block text-2xl font-medium text-white/90 hover:text-brand-teal transition-colors duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:text-brand-teal"
    >
      {children}
    </Link>
  );
}