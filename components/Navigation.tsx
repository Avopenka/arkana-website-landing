'use client'

// PACA v12 Simplified Navigation - Consolidated from LuxuryNavigation
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  onShowAuth: () => void
}

export default function Navigation({ onShowAuth }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/MainLogoENoNameNoBackGround.png"
            alt="Arkana"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xl font-light text-white">Arkana</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-white/70 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#about" className="text-white/70 hover:text-white transition-colors">
            About
          </Link>
        </div>

        {/* CTA Button */}
        <button
          onClick={onShowAuth}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          Join Genesis
        </button>
      </div>
    </nav>
  )
}