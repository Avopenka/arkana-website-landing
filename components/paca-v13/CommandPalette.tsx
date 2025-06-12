'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRightIcon, CommandLineIcon } from '@heroicons/react/24/outline'

interface Command {
  id: string
  title: string
  description: string
  shortcut?: string
  category: 'navigation' | 'actions' | 'consciousness'
  action: () => void
  icon?: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onShowAuth: () => void
}

export function CommandPalette({ isOpen, onClose, onShowAuth }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = [
    {
      id: 'get-started',
      title: 'Get Started',
      description: 'Begin your consciousness journey',
      category: 'actions',
      action: onShowAuth,
      icon: '🚀'
    },
    {
      id: 'features',
      title: 'View Features',
      description: 'Explore what Arkana can do',
      category: 'navigation',
      action: () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
      icon: '✨'
    },
    {
      id: 'pricing',
      title: 'See Pricing',
      description: 'View plans and pricing',
      category: 'navigation',
      action: () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
      icon: '💎'
    },
    {
      id: 'consciousness-test',
      title: 'Consciousness Test',
      description: 'Test your consciousness level',
      category: 'consciousness',
      action: () => {
        // This would open a consciousness assessment
        onShowAuth()
      },
      icon: '🧠'
    },
    {
      id: 'sacred-seven',
      title: 'Sacred Seven Dimensions',
      description: 'Explore the seven dimensions of consciousness',
      category: 'consciousness',
      action: () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
      icon: '🔮'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Learn about our privacy approach',
      category: 'navigation',
      action: () => {
        document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' })
        onClose()
      },
      icon: '🔒'
    }
  ]

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
            onClose()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg mx-4 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700/50">
            <CommandLineIcon className="w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="What would you like to do?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-zinc-400 outline-none text-sm"
              autoFocus
            />
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">⌘</span>
              <span className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">K</span>
            </div>
          </div>

          {/* Commands */}
          <div className="max-h-80 overflow-y-auto py-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-zinc-500">
                <CommandLineIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
              </div>
            ) : (
              filteredCommands.map((command, index) => (
                <motion.button
                  key={command.id}
                  onClick={() => {
                    command.action()
                    onClose()
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-zinc-800/50 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800/30'
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  <span className="text-lg">{command.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{command.title}</div>
                    <div className="text-xs text-zinc-500 truncate">{command.description}</div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-zinc-600" />
                </motion.button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-700/50 text-xs text-zinc-500">
            <div className="flex items-center justify-between">
              <span>Navigate with ↑↓, select with ↵</span>
              <span className="text-zinc-600">ESC to close</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}