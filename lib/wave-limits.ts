import { supabase } from '@/lib/supabase'

export const WAVE_LIMITS = {
  genesis: { max: 100, price: 25 },
  ultra_early: { max: 1000, price: 29 },
  early_adopters: { max: 2500, price: 34 },
  founders: { max: 10000, price: 39 },
  early_majority: { max: 25000, price: 44 },
  growth: { max: 100000, price: 49 },
  scale: { max: 1000000, price: 54 },
  mass_market: { max: Infinity, price: 59 }
}

export async function getCurrentWaveStatus() {
  const { count, error } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  
  if (error) {
    console.error('Error getting user count:', error)
    return null
  }
  
  // Determine current wave based on user count
  for (const [wave, limits] of Object.entries(WAVE_LIMITS)) {
    if (count! < limits.max) {
      return {
        currentWave: wave,
        userCount: count!,
        remainingSpots: limits.max - count!,
        price: limits.price,
        nextWavePrice: Object.values(WAVE_LIMITS)[Object.keys(WAVE_LIMITS).indexOf(wave) + 1]?.price || limits.price
      }
    }
  }
  
  return null
}

export async function canJoinWave(wave: string): Promise<boolean> {
  const status = await getCurrentWaveStatus()
  if (!status) return false
  
  return status.currentWave === wave && status.remainingSpots > 0
}

export async function enforceWaveLimit(email: string, requestedWave: string) {
  // Check if wave is still available
  const canJoin = await canJoinWave(requestedWave)
  
  if (!canJoin) {
    // Get current wave
    const status = await getCurrentWaveStatus()
    
    throw new Error(
      `The ${requestedWave} wave is full. Current wave is ${status?.currentWave} at €${status?.price}/month`
    )
  }
  
  // Double-check with database constraint
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      email,
      wave_tier: requestedWave,
      status: 'pending',
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Email already registered')
    }
    throw error
  }
  
  return data
}