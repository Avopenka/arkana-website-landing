import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export function ResponsiveNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
        <a href="/features" className="text-gray-700 hover:text-gray-900">Features</a>
        <a href="/pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
        <a href="/auth/login" className="text-gray-700 hover:text-gray-900">Login</a>
      </div>
      
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="sr-only">Open main menu</span>
        {mobileMenuOpen ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 md:hidden">
          <div className="py-1">
            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</a>
            <a href="/features" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Features</a>
            <a href="/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Pricing</a>
            <a href="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</a>
          </div>
        </div>
      )}
    </nav>
  )
}