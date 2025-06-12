/**
 * Genesis Wave Configuration
 * First 100 believers get €25/month locked for 100 years
 */
export const GENESIS_WAVE_CONFIG = {
  // Pricing
  pricing: {
    monthly: {
      amount: 2500, // €25.00 in cents
      currency: 'eur',
      displayPrice: '€25',
      stripePriceId: process.env.STRIPE_PRICE_GENESIS_MONTHLY
    },
    annual: {
      amount: 25000, // €250.00 in cents (2 months free)
      currency: 'eur',
      displayPrice: '€250',
      stripePriceId: process.env.STRIPE_PRICE_GENESIS_ANNUAL,
      savings: '€50', // Save €50 per year
      savingsPercent: 17 // ~17% savings
    }
  },
  // Wave details
  wave: {
    number: 0,
    tier: 'genesis', // Special tier for first 100
    name: 'Genesis Wave',
    description: 'First 100 believers — locked pricing for 100 years',
    maxSeats: 100,
    lockYears: 100, // 100-year price lock!
    launchDate: new Date('2025-01-15'), // Target launch date
  },
  // Benefits
  benefits: [
    '🔒 €25/month locked for 100 years',
    '🚀 First access to every feature we ever build',
    '💎 Genesis NFT certificate #1-100',
    '📱 Direct WhatsApp/Signal access to founder',
    '🎯 Lifetime founder status',
    '🗳️ 10x voting weight on feature decisions',
    '🎁 Annual dinner with founder (first 10 only)',
    '💝 Gift 3 memberships per year',
    '🏆 Your name permanently in app credits',
    '🔮 Access to experimental features',
    '🛡️ Premium support forever',
    '🌟 Genesis-only Discord channel'
  ],
  // Requirements
  requirements: [
    'Mac with M3 Pro or better recommended',
    'Strong commitment to privacy',
    'Belief in AI-augmented consciousness',
    'Early adopter mindset'
  ],
  // Stripe configuration
  stripe: {
    // These should be created in Stripe dashboard
    productId: process.env.STRIPE_PRODUCT_GENESIS,
    monthlyPriceId: process.env.STRIPE_PRICE_GENESIS_MONTHLY,
    annualPriceId: process.env.STRIPE_PRICE_GENESIS_ANNUAL,
    // Metadata for webhooks
    metadata: {
      wave: 'genesis',
      wave_number: '0',
      lock_years: '100',
      max_seats: '100'
    }
  },
  // Visual styling
  style: {
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    icon: '🌅', // Sunrise - new beginning
    badgeText: 'GENESIS',
    urgencyColor: 'text-orange-500'
  }
};
// Helper functions
/**
 * Check if Genesis Wave is still available
 */
export async function isGenesisWaveAvailable(currentSeatsClaimed: number): Promise<boolean> {
  return currentSeatsClaimed < GENESIS_WAVE_CONFIG.wave.maxSeats;
}
/**
 * Calculate remaining Genesis seats
 */
export function getRemainingGenesisSeats(currentSeatsClaimed: number): number {
  return Math.max(0, GENESIS_WAVE_CONFIG.wave.maxSeats - currentSeatsClaimed);
}
/**
 * Format Genesis pricing for display
 */
export function formatGenesisPricing(billingCycle: 'monthly' | 'annual'): string {
  const pricing = GENESIS_WAVE_CONFIG.pricing[billingCycle];
  if (billingCycle === 'annual') {
    return `${pricing.displayPrice}/year (save ${(pricing as any).savings})`;
  }
  return `${pricing.displayPrice}/month`;
}
/**
 * Get urgency message based on remaining seats
 */
export function getGenesisUrgencyMessage(remainingSeats: number): string | null {
  if (remainingSeats === 0) {
    return '🚫 Genesis Wave is FULL - Join waitlist for next wave';
  }
  if (remainingSeats <= 5) {
    return `🔥 FINAL ${remainingSeats} SPOTS - Genesis Wave closing NOW!`;
  }
  if (remainingSeats <= 10) {
    return `⚡ Only ${remainingSeats} Genesis spots left!`;
  }
  if (remainingSeats <= 25) {
    return `🚀 ${remainingSeats} spots remaining in Genesis Wave`;
  }
  return null;
}
/**
 * Calculate 100-year lock expiry date
 */
export function calculateGenesisLockExpiry(): Date {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + GENESIS_WAVE_CONFIG.wave.lockYears);
  return expiryDate;
}
/**
 * Validate if user qualifies for Genesis Wave
 */
export function validateGenesisEligibility(data: {
  email: string;
  deviceType?: string;
  referralCode?: string;
}): { eligible: boolean; reason?: string } {
  // Email validation
  if (!data.email || !data.email.includes('@')) {
    return { eligible: false, reason: 'Valid email required' };
  }
  // Device recommendation (not a hard requirement)
  if (data.deviceType && !data.deviceType.includes('m3') && !data.deviceType.includes('m4')) {
  }
  return { eligible: true };
}