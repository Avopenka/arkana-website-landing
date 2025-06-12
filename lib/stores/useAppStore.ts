import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // User preferences
  theme: 'light' | 'dark' | 'auto'
  commandPaletteHistory: string[]
  
  // EQ state (stealth mode)
  consciousnessLevel?: number
  lastInteraction?: Date
  personalizedFeatures: string[]
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  addToCommandHistory: (command: string) => void
  updateConsciousnessLevel: (level: number) => void
  addPersonalizedFeature: (feature: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      commandPaletteHistory: [],
      personalizedFeatures: [],
      
      setTheme: (theme) => set({ theme }),
      
      addToCommandHistory: (command) => {
        const { commandPaletteHistory } = get()
        const updatedHistory = [command, ...commandPaletteHistory.slice(0, 9)] // Keep last 10
        set({ commandPaletteHistory: updatedHistory })
      },
      
      updateConsciousnessLevel: (level) => {
        set({ 
          consciousnessLevel: level, 
          lastInteraction: new Date() 
        })
      },
      
      addPersonalizedFeature: (feature) => {
        const { personalizedFeatures } = get()
        if (!personalizedFeatures.includes(feature)) {
          set({ 
            personalizedFeatures: [...personalizedFeatures, feature] 
          })
        }
      },
    }),
    {
      name: 'arkana-app-storage',
    }
  )
)
