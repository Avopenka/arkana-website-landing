'use client'

import { useEffect } from 'react'
import { getMysteryEngine } from '@/lib/mystery-engine'

export default function MysteryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the mystery engine
    const engine = getMysteryEngine()
    
    // Add console easter eggs
    if (typeof window !== 'undefined') {
      // Custom console styling
      // console.log(
        // '%c🌌 Welcome to Arkana\'s Hidden Realm',
        // 'color: #8b5cf6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(139, 92, 246, 0.5);'
      // )
      // 
      // console.log(
        // '%cThe mysteries await those who seek...',
        // 'color: #a78bfa; font-style: italic; font-size: 14px;'
      // )
      
      // Hidden console commands
      ;(window as any).arkana = {
        mysteries: () => {
          const state = engine.getState()
          // console.log('%c🔮 Your Consciousness State:', 'color: #8b5cf6; font-weight: bold;')
          // console.table({
          //   'Level': state.level + '/7',
          //   'Discoveries': state.discoveries.length,
          //   'Synchronicities': state.synchronicities,
          //   'Secret Path': state.secretPathUnlocked ? 'Unlocked ✓' : 'Locked 🔒',
          //   'Quantum State': state.quantumEntangled ? 'Entangled ∞' : 'Classical'
          // })
          
          if (state.discoveries.length > 0) {
            // console.log('%c🎯 Discoveries Made:', 'color: #8b5cf6; font-weight: bold;')
            // state.discoveries.forEach(d => console.log(`  • ${d}`))
          }
          
          // console.log('\n%cHints:', 'color: #7c3aed; font-style: italic;')
          if (state.level < 3) {
            // console.log('  • Try the Konami code...')
            // console.log('  • Watch for special times like 11:11')
            // console.log('  • Draw patterns with your mouse')
          } else if (state.level < 5) {
            // console.log('  • Type "consciousness" to unlock deeper mysteries')
            // console.log('  • Shake your device (mobile) or draw infinity')
            // console.log('  • The moon phase affects available powers')
          } else {
            // console.log('  • You have mastered many mysteries')
            // console.log('  • Explore /mysteries and /quantum')
            // console.log('  • The ultimate secret awaits at level 7')
          }
        },
        
        unlock: (code: string) => {
          const validCodes = {
            'consciousness': () => {
              // console.log('%c✨ Consciousness mode activated!', 'color: #f59e0b; font-size: 16px;')
              window.location.href = '/mysteries'
            },
            'quantum': () => {
              // console.log('%c🌀 Quantum realm accessed!', 'color: #3b82f6; font-size: 16px;')
              window.location.href = '/quantum'
            },
            'vopěnka': () => {
              // console.log('%c👁️ The master acknowledges you', 'color: #dc2626; font-size: 16px;')
              engine.unlockConsciousnessMode()
            },
            'arkana': () => {
              // console.log('%c🎭 Welcome home, seeker', 'color: #8b5cf6; font-size: 16px;')
              document.body.classList.add('arkana-master-mode')
            }
          }
          
          if (validCodes[code.toLowerCase()]) {
            validCodes[code.toLowerCase()]()
          } else {
            // console.log('%c❌ Unknown code. Keep exploring...', 'color: #ef4444;')
          }
        },
        
        help: () => {
          // console.log('%c📖 Arkana Console Commands:', 'color: #8b5cf6; font-weight: bold; font-size: 16px;')
          // console.log('\n%cAvailable commands:', 'color: #a78bfa;')
          // console.log('  arkana.mysteries()    - View your consciousness state')
          // console.log('  arkana.unlock(code)   - Enter secret codes')
          // console.log('  arkana.frequencies()  - Play sacred frequencies')
          // console.log('  arkana.sacred()       - Draw sacred geometry')
          // console.log('  arkana.time()         - View temporal mysteries')
          // console.log('\n%cKeyboard shortcuts:', 'color: #a78bfa;')
          // console.log('  Konami Code          - Ancient gaming wisdom')
          // console.log('  Type "fibonacci"     - 1,1,2,3,5,8...')
          // console.log('  Type "consciousness" - The ultimate key')
        },
        
        frequencies: () => {
          // console.log('%c🎵 Sacred Frequencies:', 'color: #8b5cf6; font-weight: bold;')
          const frequencies = {
            '111 Hz': 'Cell regeneration',
            '174 Hz': 'Pain relief',
            '285 Hz': 'Tissue healing',
            '396 Hz': 'Liberation from fear',
            '417 Hz': 'Facilitating change',
            '528 Hz': 'Love frequency',
            '639 Hz': 'Harmonious relationships',
            '741 Hz': 'Awakening intuition',
            '852 Hz': 'Returning to spiritual order',
            '963 Hz': 'Divine consciousness'
          }
          
          Object.entries(frequencies).forEach(([freq, desc]) => {
            // console.log(`  ${freq} - ${desc}`)
          })
          
          // console.log('\n%cPlay a frequency: engine.playFrequency(528)', 'color: #7c3aed; font-style: italic;')
        },
        
        sacred: () => {
          // console.log('%c⭐ Sacred Geometry Activated', 'color: #8b5cf6; font-size: 18px;')
          
          // ASCII art sacred geometry
          // console.log(`%c
    // ✦     ✦     ✦
  // ✦   ╱◊╲   ╱◊╲   ✦
// ✦   ◊────◊────◊   ✦
  // ✦   ╲◊╱   ╲◊╱   ✦
    // ✦     ✦     ✦
          // `, 'color: #a78bfa; font-family: monospace;')
          // 
          // console.log('%cThe pattern is everywhere. You just need to see it.', 'color: #7c3aed; font-style: italic;')
        },
        
        time: () => {
          const now = new Date()
          const timeStr = now.toLocaleTimeString('en-US', { hour12: false })
          const moonPhase = engine.calculateMoonPhase()
          
          // console.log('%c🕐 Temporal Mysteries:', 'color: #8b5cf6; font-weight: bold;')
          // console.log(`Current time: ${timeStr}`)
          // console.log(`Moon phase: ${moonPhase.phase} (${moonPhase.percentage}%)`)
          // console.log(`Power level: ${moonPhase.power}/10`)
          
          if (timeStr.includes('11:11') || timeStr.includes('3:33')) {
            // console.log('%c✨ PORTAL MOMENT ACTIVE!', 'color: #f59e0b; font-size: 16px; animation: pulse 2s infinite;')
          }
        }
      }
      
      // Make engine available globally for advanced users
      ;(window as any).getMysteryEngine = () => engine
      
      // Add CSS for console animations
      const style = document.createElement('style')
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .arkana-master-mode {
          animation: masterGlow 10s ease-in-out infinite;
        }
        
        @keyframes masterGlow {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          25% { filter: hue-rotate(90deg) brightness(1.1); }
          50% { filter: hue-rotate(180deg) brightness(1.05); }
          75% { filter: hue-rotate(270deg) brightness(1.1); }
        }
      `
      document.head.appendChild(style)
      
      // Easter egg: Typing "xyzzy" (classic adventure game reference)
      let xyzzyBuffer = ''
      document.addEventListener('keypress', (e) => {
        xyzzyBuffer += e.key
        if (xyzzyBuffer.length > 5) xyzzyBuffer = xyzzyBuffer.slice(-5)
        
        if (xyzzyBuffer === 'xyzzy') {
          // console.log('%c🏰 A hollow voice says "Plugh"', 'color: #10b981; font-size: 16px;')
          document.body.style.transition = 'transform 0.5s'
          document.body.style.transform = 'rotateY(360deg)'
          setTimeout(() => {
            document.body.style.transform = ''
          }, 500)
        }
      })
    }
  }, [])
  
  return <>{children}</>
}
