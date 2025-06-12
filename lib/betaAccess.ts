// Beta Access Management
// Handles referral codes and beta access validation

interface BetaCode {
  code: string;
  maxUses: number;
  currentUses: number;
  expiresAt?: Date;
  tier: 'insider' | 'early' | 'vip';
}

// In production, these would be stored in Supabase
const VALID_BETA_CODES: Record<string, BetaCode> = {
  'ARKANA-INSIDER-2025': {
    code: 'ARKANA-INSIDER-2025',
    maxUses: 100,
    currentUses: 0,
    tier: 'insider'
  },
  'EARLY-BIRD-BETA': {
    code: 'EARLY-BIRD-BETA',
    maxUses: 500,
    currentUses: 0,
    tier: 'early'
  },
  'VIP-FOUNDER-ACCESS': {
    code: 'VIP-FOUNDER-ACCESS',
    maxUses: 50,
    currentUses: 0,
    tier: 'vip'
  },
  // Test codes
  'TEST-BETA-123': {
    code: 'TEST-BETA-123',
    maxUses: 1000,
    currentUses: 0,
    tier: 'early'
  }
};

export function validateBetaCode(code: string): { valid: boolean; tier?: string; message?: string } {
  const upperCode = code.toUpperCase().trim();
  const betaCode = VALID_BETA_CODES[upperCode];
  
  if (!betaCode) {
    return { valid: false, message: 'Invalid referral code' };
  }
  
  if (betaCode.expiresAt && new Date() > betaCode.expiresAt) {
    return { valid: false, message: 'This code has expired' };
  }
  
  if (betaCode.currentUses >= betaCode.maxUses) {
    return { valid: false, message: 'This code has reached its usage limit' };
  }
  
  return { valid: true, tier: betaCode.tier };
}

export function grantBetaAccess(code: string): boolean {
  const validation = validateBetaCode(code);
  
  if (validation.valid) {
    // In production, this would update Supabase
    localStorage.setItem('arkana_beta_access', 'true');
    localStorage.setItem('arkana_beta_tier', validation.tier || 'early');
    localStorage.setItem('arkana_beta_code', code.toUpperCase().trim());
    
    // Increment usage count (in production, this would be in database)
    const upperCode = code.toUpperCase().trim();
    if (VALID_BETA_CODES[upperCode]) {
      VALID_BETA_CODES[upperCode].currentUses++;
    }
    
    return true;
  }
  
  return false;
}

export function hasBetaAccess(): boolean {
  return localStorage.getItem('arkana_beta_access') === 'true';
}

export function getBetaTier(): string | null {
  return localStorage.getItem('arkana_beta_tier');
}

export function revokeBetaAccess(): void {
  localStorage.removeItem('arkana_beta_access');
  localStorage.removeItem('arkana_beta_tier');
  localStorage.removeItem('arkana_beta_code');
}