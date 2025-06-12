import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(({ key, metaKey, ctrlKey, shiftKey, altKey, callback }) => {
        if (
          e.key.toLowerCase() === key.toLowerCase() &&
          !!e.metaKey === !!metaKey &&
          !!e.ctrlKey === !!ctrlKey &&
          !!e.shiftKey === !!shiftKey &&
          !!e.altKey === !!altKey
        ) {
          e.preventDefault()
          callback()
        }
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
