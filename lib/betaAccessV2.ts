// Beta Access Management V2 - Database-backed
// Handles beta code validation and access management with Supabase
interface BetaValidationResult {
  valid: boolean;
  tier?: string;
  message?: string;
  error?: string;
}
interface BetaAccessInfo {
  hasAccess: boolean;
  tier: string | null;
  code: string | null;
  email: string | null;
}
const BETA_ACCESS_KEY = 'arkana_beta_access_v2';
const BETA_INFO_KEY = 'arkana_beta_info_v2';
export async function validateBetaCode(
  code: string, 
  email: string, 
  name?: string
): Promise<BetaValidationResult> {
  try {
    const response = await fetch('/api/beta/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, email, name }),
    });
    const result = await response.json();
    if (!response.ok) {
      return {
        valid: false,
        message: result.error || 'Failed to validate beta code',
      };
    }
    if (result.valid) {
      // Store beta access info locally
      const betaInfo: BetaAccessInfo = {
        hasAccess: true,
        tier: result.tier,
        code: code.toUpperCase().trim(),
        email: email.toLowerCase().trim(),
      };
      localStorage.setItem(BETA_ACCESS_KEY, 'true');
      localStorage.setItem(BETA_INFO_KEY, JSON.stringify(betaInfo));
      return {
        valid: true,
        tier: result.tier,
        message: result.message || 'Welcome to the Arkana beta program!',
      };
    } else {
      // Handle specific error codes
      const errorMessages: Record<string, string> = {
        'INVALID_CODE': 'Invalid beta code',
        'CODE_DISABLED': 'This beta code has been disabled',
        'CODE_EXPIRED': 'This beta code has expired',
        'USAGE_LIMIT_REACHED': 'This beta code has reached its usage limit',
        'ALREADY_REDEEMED': 'You have already used this beta code',
        'BETA_FULL': 'Beta program is currently full (50 user limit reached)',
      };
      return {
        valid: false,
        message: errorMessages[result.code] || result.error || 'Invalid beta code',
        error: result.code,
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Network error. Please try again.',
      error: 'NETWORK_ERROR',
    };
  }
}
export function hasBetaAccess(): boolean {
  // Check localStorage for beta access
  return localStorage.getItem(BETA_ACCESS_KEY) === 'true';
}
export function getBetaInfo(): BetaAccessInfo | null {
  try {
    const infoStr = localStorage.getItem(BETA_INFO_KEY);
    if (!infoStr) return null;
    return JSON.parse(infoStr) as BetaAccessInfo;
  } catch {
    return null;
  }
}
export function getBetaTier(): string | null {
  const info = getBetaInfo();
  return info?.tier || null;
}
export function setBetaAccess(hasAccess: boolean, tier?: string, code?: string, email?: string): void {
  if (hasAccess) {
    const betaInfo: BetaAccessInfo = {
      hasAccess: true,
      tier: tier || null,
      code: code || null,
      email: email || null,
    };
    localStorage.setItem(BETA_ACCESS_KEY, 'true');
    localStorage.setItem(BETA_INFO_KEY, JSON.stringify(betaInfo));
  } else {
    revokeBetaAccess();
  }
}
export function revokeBetaAccess(): void {
  localStorage.removeItem(BETA_ACCESS_KEY);
  localStorage.removeItem(BETA_INFO_KEY);
  // Also clear old keys for backward compatibility
  localStorage.removeItem('arkana_beta_access');
  localStorage.removeItem('arkana_beta_tier');
  localStorage.removeItem('arkana_beta_code');
}
// Admin functions (require authentication)
export async function fetchBetaCodes(apiKey: string) {
  try {
    const response = await fetch('/api/beta/admin/codes', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch beta codes');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function createBetaCode(
  apiKey: string,
  data: {
    code?: string;
    tier?: string;
    maxUses?: number;
    assignedToName?: string;
    assignedToEmail?: string;
    expiresAt?: string;
  }
) {
  try {
    const response = await fetch('/api/beta/admin/codes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create beta code');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function updateBetaCode(
  apiKey: string,
  id: string,
  data: {
    active?: boolean;
    maxUses?: number;
    expiresAt?: string;
  }
) {
  try {
    const response = await fetch('/api/beta/admin/codes', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) {
      throw new Error('Failed to update beta code');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
export async function fetchBetaUsers(apiKey: string) {
  try {
    const response = await fetch('/api/beta/admin/users', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch beta users');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}