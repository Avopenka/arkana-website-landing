// Arkana 8-Wave Launch System Configuration

export interface Wave {
  number: number;
  tier: string;
  name: string;
  description: string;
  maxSeats: number;
  priceAnnual: number;
  priceMonthly: number;
  lockYears: number;
  benefits: string[];
  stripePriceId: string;
  color: string;
  icon: string;
}

export const WAVES: Wave[] = [
  {
    number: 0,
    tier: 'codex',
    name: 'The Codex',
    description: 'First 10 believers — lifetime founders of Arkana',
    maxSeats: 10,
    priceAnnual: 499,
    priceMonthly: 49,
    lockYears: 3,
    benefits: [
      'Lifetime founder status',
      'Direct access to founder',
      'All future features forever',
      'Genesis NFT certificate',
      'Private Discord channel',
      'Name in app credits'
    ],
    stripePriceId: process.env.STRIPE_PRICE_CODEX!,
    color: 'from-purple-600 to-pink-600',
    icon: '📜'
  },
  {
    number: 1,
    tier: 'sages',
    name: 'The Sages',
    description: 'Deep thinkers shaping our philosophy',
    maxSeats: 50,
    priceAnnual: 599,
    priceMonthly: 59,
    lockYears: 3,
    benefits: [
      'Early believer badge',
      'Quarterly calls with founder',
      'Feature voting rights',
      'Sage NFT certificate',
      'Beta access to all features'
    ],
    stripePriceId: process.env.STRIPE_PRICE_SAGES!,
    color: 'from-blue-600 to-purple-600',
    icon: '🔮'
  },
  {
    number: 2,
    tier: 'oracles',
    name: 'The Oracles',
    description: 'Visionaries seeing the future',
    maxSeats: 100,
    priceAnnual: 699,
    priceMonthly: 69,
    lockYears: 2,
    benefits: [
      'Oracle status',
      'Beta features first',
      'Monthly office hours',
      'Oracle NFT certificate',
      'Community leadership role'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ORACLES!,
    color: 'from-teal-600 to-blue-600',
    icon: '👁️'
  },
  {
    number: 3,
    tier: 'guardians',
    name: 'The Guardians',
    description: 'Protectors of privacy and ethics',
    maxSeats: 200,
    priceAnnual: 799,
    priceMonthly: 79,
    lockYears: 2,
    benefits: [
      'Guardian badge',
      'Security features early',
      'Bi-monthly events',
      'Guardian certificate',
      'Privacy council membership'
    ],
    stripePriceId: process.env.STRIPE_PRICE_GUARDIANS!,
    color: 'from-green-600 to-teal-600',
    icon: '🛡️'
  },
  {
    number: 4,
    tier: 'scholars',
    name: 'The Scholars',
    description: 'Knowledge seekers and researchers',
    maxSeats: 500,
    priceAnnual: 899,
    priceMonthly: 89,
    lockYears: 1,
    benefits: [
      'Scholar access',
      'Educational content',
      'Community workshops',
      'Research participation',
      'Knowledge base access'
    ],
    stripePriceId: process.env.STRIPE_PRICE_SCHOLARS!,
    color: 'from-yellow-600 to-orange-600',
    icon: '📚'
  },
  {
    number: 5,
    tier: 'apprentices',
    name: 'The Apprentices',
    description: 'Eager learners joining the journey',
    maxSeats: 1000,
    priceAnnual: 999,
    priceMonthly: 99,
    lockYears: 1,
    benefits: [
      'Apprentice tier',
      'Learning paths',
      'Group sessions',
      'Community access',
      'Standard support'
    ],
    stripePriceId: process.env.STRIPE_PRICE_APPRENTICES!,
    color: 'from-orange-600 to-red-600',
    icon: '🎓'
  },
  {
    number: 6,
    tier: 'seekers',
    name: 'The Seekers',
    description: 'Explorers of AI possibilities',
    maxSeats: 2500,
    priceAnnual: 1199,
    priceMonthly: 119,
    lockYears: 0,
    benefits: [
      'Seeker benefits',
      'Community access',
      'Standard support',
      'Regular updates',
      'Feature access'
    ],
    stripePriceId: process.env.STRIPE_PRICE_SEEKERS!,
    color: 'from-indigo-600 to-purple-600',
    icon: '🧭'
  },
  {
    number: 7,
    tier: 'access',
    name: 'General Access',
    description: 'Public launch — join the revolution',
    maxSeats: 10000000, // Very large number for "unlimited"
    priceAnnual: 1499,
    priceMonthly: 149,
    lockYears: 0,
    benefits: [
      'Full Arkana access',
      'Community features',
      'Regular updates',
      'Standard support'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ACCESS!,
    color: 'from-gray-600 to-gray-700',
    icon: '🌍'
  }
];

// Get current available wave
export function getCurrentWave(): Wave | null {
  // In production, this would check against Supabase
  // For now, return the first wave with available seats
  return WAVES.find(wave => wave.maxSeats === null || wave.maxSeats > 0) || null;
}

// Calculate savings for annual vs monthly
export function calculateSavings(wave: Wave): number {
  const monthlyTotal = wave.priceMonthly * 12;
  const savings = monthlyTotal - wave.priceAnnual;
  return Math.round((savings / monthlyTotal) * 100);
}

// Format price for display
export function formatPrice(price: number, interval: 'monthly' | 'annual' = 'monthly'): string {
  if (interval === 'annual') {
    return `$${price}/year`;
  }
  return `$${price}/mo`;
}