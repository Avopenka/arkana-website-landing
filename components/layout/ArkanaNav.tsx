'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export const ArkanaNav = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Experience', href: '#experience' },
    { name: 'Technology', href: '#technology' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <motion.nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-surface-dark/90 backdrop-blur-md py-3' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-luxury-serif text-white">
            Arkana
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/prelude"
              className="ml-6 px-6 py-2 bg-violet-pulse text-white rounded-full text-sm font-medium hover:bg-violet-pulse/90 transition-colors"
            >
              Join Waitlist
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 bg-surface-dark/95 backdrop-blur-lg md:hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-2xl text-gray-300 hover:text-white py-3 border-b border-gray-800"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/prelude"
                className="mt-8 px-8 py-4 bg-violet-pulse text-white rounded-full text-lg font-medium text-center"
                onClick={() => setMobileOpen(false)}
              >
                Join Waitlist
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
