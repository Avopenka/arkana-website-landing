'use client'

import { Command } from 'cmdk'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import { Search, Zap, Brain, Settings, FileText } from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search or type a command...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed top-[20%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-white rounded-lg shadow-2xl border">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="What do you need?"
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              <Command.Empty className="py-6 text-center text-sm">
                No results found.
              </Command.Empty>
              
              <Command.Group heading="Quick Actions">
                <Command.Item
                  onSelect={() => runCommand(() => window.location.href = '/dashboard')}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Open Dashboard</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => window.location.href = '/consciousness')}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  <span>Consciousness Analysis</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => window.location.href = '/settings')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Command.Item>
              </Command.Group>
              
              <Command.Group heading="Documentation">
                <Command.Item
                  onSelect={() => runCommand(() => window.location.href = '/docs')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Documentation</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
