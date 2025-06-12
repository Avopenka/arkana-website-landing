'use client'

import { useEffect } from 'react'

// ELITE PACAR: Touch Layer Debug Component
// Identifies and fixes pointer-events conflicts

export default function TouchDebugger() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const debugTouch = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      const computedStyle = window.getComputedStyle(target)
      
      // Check for pointer-events issues
      if (computedStyle.pointerEvents === 'none') {
        console.warn('[TOUCH DEBUG] Element with pointer-events: none clicked:', {
          element: target.tagName,
          className: target.className,
          id: target.id,
          zIndex: computedStyle.zIndex
        })
      }
      
      // Check for z-index conflicts
      const zIndex = parseInt(computedStyle.zIndex) || 0
      if (zIndex > 9000) {
        console.log('[TOUCH DEBUG] High z-index element:', {
          element: target.tagName,
          className: target.className,
          zIndex: zIndex
        })
      }
    }

    // Add touch debugging listeners
    document.addEventListener('click', debugTouch, true)
    document.addEventListener('touchstart', debugTouch, true)

    // Add visual indicator for high z-index elements
    const addVisualDebug = () => {
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        const style = window.getComputedStyle(el)
        const zIndex = parseInt(style.zIndex) || 0
        
        if (zIndex > 9000) {
          const htmlEl = el as HTMLElement
          htmlEl.style.outline = '2px solid red'
          htmlEl.title = `Z-Index: ${zIndex}`
        }
      })
    }

    // Run visual debug in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(addVisualDebug, 1000)
    }

    return () => {
      document.removeEventListener('click', debugTouch, true)
      document.removeEventListener('touchstart', debugTouch, true)
    }
  }, [])

  return null // This component doesn't render anything
}