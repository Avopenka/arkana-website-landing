// Arkana 8-Wave Launch System with Proper Seat Management

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
  requirements?: string[];
}

// Your 8 waves with carefully planned seat distribution
// Total: 10 + 50 + 100 + 200 + 500 + 1000 + 2500 + ∞ = 4,360+ users
export const WAVES: Wave[] = [
  {
    number: 0,
    tier: 'codex',
    name: 'The Codex',
    description: 'First 10 believers — lifetime founders of Arkana',
    maxSeats: 10, // Ultra exclusive
    priceAnnual: 499,
    priceMonthly: 49,
    lockYears: 3,
    benefits: [
      'Lifetime founder status',
      'Direct WhatsApp/Signal access to founder',
      'All future features forever at no extra cost',
      'Genesis NFT certificate #1-10',
      'Private Discord channel with founder',
      'Your name permanently in app credits',
      'Annual dinner with founder',
      'First access to every feature we ever build',
      'Ability to gift 3 memberships per year'
    ],
    stripePriceId: process.env.STRIPE_PRICE_CODEX!,
    color: 'from-purple-600 via-pink-600 to-purple-600',
    icon: '📜',
    requirements: ['M3 Pro or better recommended', 'Strong commitment to privacy']
  },
  {
    number: 1,
    tier: 'sages',
    name: 'The Sages',
    description: 'Deep thinkers shaping our philosophy',
    maxSeats: 50, // 5x growth
    priceAnnual: 599,
    priceMonthly: 59,
    lockYears: 3,
    benefits: [
      'Early believer badge & NFT #11-60',
      'Quarterly video calls with founder',
      'Feature voting rights (2x weight)',
      'Beta access to all features',
      'Sage-only Discord channel',
      'Priority support response',
      'Annual Arkana swag package',
      'Referral bonuses'
    ],
    stripePriceId: process.env.STRIPE_PRICE_SAGES!,
    color: 'from-blue-600 via-purple-600 to-blue-600',
    icon: '🔮'
  },
  {
    number: 2,
    tier: 'oracles',
    name: 'The Oracles',
    description: 'Visionaries seeing the future of AI',
    maxSeats: 100, // 2x growth
    priceAnnual: 699,
    priceMonthly: 69,
    lockYears: 2,
    benefits: [
      'Oracle status & NFT #61-160',
      'Beta features before public release',
      'Monthly office hours with team',
      'Community leadership opportunities',
      'Oracle Discord channel',
      'Enhanced privacy features first',
      'Quarterly swag shipments'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ORACLES!,
    color: 'from-teal-500 via-blue-600 to-teal-500',
    icon: '👁️'
  },
  {
    number: 3,
    tier: 'guardians',
    name: 'The Guardians',
    description: 'Protectors of privacy and ethics',
    maxSeats: 200, // 2x growth
    priceAnnual: 799,
    priceMonthly: 79,
    lockYears: 2,
    benefits: [
      'Guardian badge & certificate',
      'Security & privacy features early',
      'Bi-monthly community events',
      'Privacy council membership',
      'Guardian Discord access',
      'Advanced encryption options',
      'Influence security roadmap'
    ],
    stripePriceId: process.env.STRIPE_PRICE_GUARDIANS!,
    color: 'from-green-600 via-emerald-600 to-green-600',
    icon: '🛡️'
  },
  {
    number: 4,
    tier: 'scholars',
    name: 'The Scholars',
    description: 'Knowledge seekers and researchers',
    maxSeats: 500, // 2.5x growth
    priceAnnual: 899,
    priceMonthly: 89,
    lockYears: 1,
    benefits: [
      'Scholar access & badge',
      'Educational content library',
      'Community workshops',
      'Research participation opportunities',
      'Knowledge base early access',
      'Scholar study groups',
      'Academic license options'
    ],
    stripePriceId: process.env.STRIPE_PRICE_SCHOLARS!,
    color: 'from-yellow-500 via-orange-500 to-yellow-500',
    icon: '📚'
  },
  {
    number: 5,
    tier: 'apprentices',
    name: 'The Apprentices',
    description: 'Eager learners joining the journey',
    maxSeats: 1000, // 2x growth
    priceAnnual: 999,
    priceMonthly: 99,
    lockYears: 1,
    benefits: [
      'Apprentice tier access',
      'Structured learning paths',
      'Group learning sessions',
      'Community forum access',
      'Standard support',
      'Monthly webinars',
      'Completion certificates'
    ],
    stripePriceId: process.env.STRIPE_PRICE_APPRENTICES!,
    color: 'from-orange-500 via-red-500 to-orange-500',
    icon: '🎓'
  },
  {
    number: 6,
    tier: 'seekers',
    name: 'The Seekers',
    description: 'Explorers of AI possibilities',
    maxSeats: 2500, // 2.5x growth
    priceAnnual: 1199,
    priceMonthly: 119,
    lockYears: 0,
    benefits: [
      'Full Arkana access',
      'Seeker community benefits',
      'Regular feature updates',
      'Community support',
      'Public Discord access',
      'Standard features',
      'Mobile app access'
    ],
    stripePriceId: process.env.STRIPE_PRICE_SEEKERS!,
    color: 'from-indigo-500 via-purple-500 to-indigo-500',
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
      'Full Arkana features',
      'Community access',
      'Regular updates',
      'Standard support',
      'Public forums',
      'Mobile & desktop apps'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ACCESS!,
    color: 'from-gray-600 via-gray-500 to-gray-600',
    icon: '🌍'
  }
];

// Calculate total exclusive seats before general access
export const TOTAL_EXCLUSIVE_SEATS = WAVES
  .filter(w => w.maxSeats !== null)
  .reduce((sum, w) => sum + w.maxSeats!, 0); // 4,360 total

// Get wave by tier name
export function getWaveByTier(tier: string): Wave | undefined {
  return WAVES.find(w => w.tier === tier);
}

// Get current available wave (first with open seats)
export function getCurrentAvailableWave(seatsClaimed: Record<string, number>): Wave | null {
  for (const wave of WAVES) {
    if (wave.maxSeats === null) return wave; // General access always available
    
    const claimed = seatsClaimed[wave.tier] || 0;
    if (claimed < wave.maxSeats) {
      return wave;
    }
  }
  return null;
}

// Calculate savings for annual vs monthly
export function calculateAnnualSavings(wave: Wave): {
  monthlyTotal: number;
  savings: number;
  savingsPercent: number;
} {
  const monthlyTotal = wave.priceMonthly * 12;
  const savings = monthlyTotal - wave.priceAnnual;
  const savingsPercent = Math.round((savings / monthlyTotal) * 100);
  
  return { monthlyTotal, savings, savingsPercent };
}

// Get wave progress (how full it is)
export function getWaveProgress(wave: Wave, seatsClaimed: number): {
  claimed: number;
  total: number | null;
  percentage: number;
  remaining: number | null;
  status: 'available' | 'limited' | 'closing' | 'full';
} {
  const total = wave.maxSeats;
  const percentage = total ? Math.round((seatsClaimed / total) * 100) : 0;
  const remaining = total ? total - seatsClaimed : null;
  
  let status: 'available' | 'limited' | 'closing' | 'full' = 'available';
  if (total) {
    if (percentage >= 100) status = 'full';
    else if (percentage >= 90) status = 'closing';
    else if (percentage >= 70) status = 'limited';
  }
  
  return { claimed: seatsClaimed, total, percentage, remaining, status };
}

// Format price for display
export function formatPrice(amount: number, interval: 'month' | 'year' = 'month'): string {
  if (interval === 'year') {
    return `$${amount.toLocaleString()}/year`;
  }
  return `$${amount}/mo`;
}

// Check if user qualifies for a wave based on hardware
export function checkHardwareQualification(deviceType: string, wave: Wave): {
  qualified: boolean;
  recommendation: string;
} {
  // Codex and Sages really benefit from high-end hardware
  if (wave.number <= 1) {
    if (deviceType.includes('m4_max') || deviceType.includes('m3_max')) {
      return { 
        qualified: true, 
        recommendation: 'Perfect match! Your hardware will run Arkana at maximum performance.' 
      };
    }
    return { 
      qualified: true, 
      recommendation: 'Consider upgrading to M3 Max or better for optimal experience.' 
    };
  }
  
  // All waves are accessible, but with different experiences
  return { 
    qualified: true, 
    recommendation: 'Your device will run Arkana smoothly.' 
  };
}

// Generate a wave announcement message
export function generateWaveAnnouncement(wave: Wave, progress: ReturnType<typeof getWaveProgress>): string {
  if (progress.status === 'full') {
    return `${wave.name} is now FULL! ${WAVES[wave.number + 1]?.name || 'General Access'} opening soon.`;
  }
  
  if (progress.status === 'closing') {
    return `🚨 FINAL CALL: Only ${progress.remaining} spots left in ${wave.name}!`;
  }
  
  if (progress.status === 'limited') {
    return `⚡ ${wave.name} is ${progress.percentage}% full. ${progress.remaining} spots remaining.`;
  }
  
  return `${wave.name} is now open with ${progress.remaining} exclusive spots available.`;
}