export const DEVICE_OPTIONS = [
  // Ultra Tier (40 points)
  { value: 'mac_m4_max_128gb', label: 'M4 Max', ram: '128GB RAM', category: 'Ultra', tier: 'ultimate', score: 40 },
  { value: 'mac_m4_max_64gb', label: 'M4 Max', ram: '64GB RAM', category: 'Max', tier: 'premium', score: 35 },
  
  // Premium Tier (30 points)
  { value: 'mac_m4_pro', label: 'M4 Pro', ram: '48GB RAM', category: 'Pro', tier: 'premium', score: 30 },
  { value: 'mac_m3_max', label: 'M3 Max', ram: '64-96GB RAM', category: 'Max', tier: 'premium', score: 28 },
  { value: 'mac_m3_pro', label: 'M3 Pro', ram: '36GB RAM', category: 'Pro', tier: 'good', score: 25 },
  
  // Good Tier (20 points)
  { value: 'mac_m2_max', label: 'M2 Max', ram: '32-64GB RAM', category: 'Max', tier: 'good', score: 20 },
  { value: 'mac_m2_pro', label: 'M2 Pro', ram: '32GB RAM', category: 'Pro', tier: 'good', score: 18 },
  { value: 'mac_m1_max', label: 'M1 Max', ram: '32-64GB RAM', category: 'Max', tier: 'good', score: 18 },
  
  // Standard Tier (10 points)
  { value: 'mac_m4_air_16gb', label: 'M4 Air', ram: '16GB RAM', category: 'Air', tier: 'standard', score: 15 },
  { value: 'mac_m3_air_24gb', label: 'M3 Air', ram: '24GB RAM', category: 'Air', tier: 'standard', score: 12 },
  { value: 'mac_m2_air_16gb', label: 'M2 Air', ram: '16GB RAM', category: 'Air', tier: 'standard', score: 10 },
  { value: 'mac_m1_air_16gb', label: 'M1 Air', ram: '16GB RAM', category: 'Air', tier: 'standard', score: 10 },
  { value: 'mac_other', label: 'Other Mac', ram: 'Various', category: 'Other', tier: 'basic', score: 10 },
];

export const AI_AMBITIONS = [
  {
    value: 'local_only',
    label: 'Run Everything Locally',
    description: 'Maximum privacy & control. All AI processing on your device.',
    score: 15
  },
  {
    value: 'balanced',
    label: 'Balance Speed & Privacy',
    description: 'Smart mix of local and cloud AI for optimal performance.',
    score: 10
  },
  {
    value: 'speed_first',
    label: 'Fast Results Matter Most',
    description: 'Leverage cloud AI when needed for fastest responses.',
    score: 5
  }
];

export const WAVE_TIERS = [
  { tier: 'codex', number: 0, name: 'The Codex', seats: 10 },
  { tier: 'sages', number: 1, name: 'The Sages', seats: 50 },
  { tier: 'oracles', number: 2, name: 'The Oracles', seats: 100 },
  { tier: 'guardians', number: 3, name: 'The Guardians', seats: 200 },
  { tier: 'scholars', number: 4, name: 'The Scholars', seats: 500 },
  { tier: 'apprentices', number: 5, name: 'The Apprentices', seats: 1000 },
  { tier: 'seekers', number: 6, name: 'The Seekers', seats: 2500 },
  { tier: 'access', number: 7, name: 'General Access', seats: null }
];