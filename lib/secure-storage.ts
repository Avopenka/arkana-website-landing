// Secure Storage Helper
// Agent Sigma: Encrypted localStorage replacement for sensitive data
interface EncryptedStorageItem {
  data: string
  timestamp: number
  expires?: number
}
class SecureStorage {
  private static instance: SecureStorage
  private encryptionKey: string
  constructor() {
    // Generate or retrieve encryption key
    this.encryptionKey = this.getOrCreateEncryptionKey()
  }
  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage()
    }
    return SecureStorage.instance
  }
  private getOrCreateEncryptionKey(): string {
    const storageKey = 'arkana_secure_key'
    let key = localStorage.getItem(storageKey)
    if (!key) {
      // Generate a new key
      key = this.generateSecureKey()
      localStorage.setItem(storageKey, key)
    }
    return key
  }
  private generateSecureKey(): string {
    // Generate a cryptographically secure random key
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  private simpleEncrypt(text: string, key: string): string {
    // Simple XOR encryption for browser compatibility
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return btoa(result) // Base64 encode
  }
  private simpleDecrypt(encryptedText: string, key: string): string {
    try {
      const decoded = atob(encryptedText) // Base64 decode
      let result = ''
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        result += String.fromCharCode(charCode)
      }
      return result
    } catch (error) {
      return ''
    }
  }
  setItem(key: string, value: any, expirationMinutes?: number): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      const encrypted = this.simpleEncrypt(stringValue, this.encryptionKey)
      const item: EncryptedStorageItem = {
        data: encrypted,
        timestamp: Date.now(),
        expires: expirationMinutes ? Date.now() + (expirationMinutes * 60 * 1000) : undefined
      }
      localStorage.setItem(`secure_${key}`, JSON.stringify(item))
    } catch (error) {
      // Fallback to regular localStorage
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    }
  }
  getItem<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(`secure_${key}`)
      if (!item) return null
      const parsed: EncryptedStorageItem = JSON.parse(item)
      // Check expiration
      if (parsed.expires && Date.now() > parsed.expires) {
        this.removeItem(key)
        return null
      }
      const decrypted = this.simpleDecrypt(parsed.data, this.encryptionKey)
      if (!decrypted) return null
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(decrypted)
      } catch {
        return decrypted as T
      }
    } catch (error) {
      // Fallback to regular localStorage
      const fallback = localStorage.getItem(key)
      if (!fallback) return null
      try {
        return JSON.parse(fallback)
      } catch {
        return fallback as T
      }
    }
  }
  removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`)
    localStorage.removeItem(key) // Also remove fallback
  }
  clear(): void {
    // Remove all secure storage items
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('secure_') || key.startsWith('arkana_')) {
        localStorage.removeItem(key)
      }
    })
  }
  // Beta-specific helpers
  setBetaAccess(hasAccess: boolean, tier?: string, code?: string, email?: string): void {
    if (hasAccess) {
      const betaInfo = {
        hasAccess: true,
        tier: tier || null,
        code: code || null,
        email: email || null,
        timestamp: Date.now()
      }
      this.setItem('arkana_beta_access_v2', 'true', 60 * 24 * 7) // 1 week expiration
      this.setItem('arkana_beta_info_v2', betaInfo, 60 * 24 * 7)
    } else {
      this.removeItem('arkana_beta_access_v2')
      this.removeItem('arkana_beta_info_v2')
    }
  }
  getBetaAccess(): boolean {
    return this.getItem<string>('arkana_beta_access_v2') === 'true'
  }
  getBetaInfo(): { hasAccess: boolean; tier: string | null; code: string | null; email: string | null } | null {
    return this.getItem('arkana_beta_info_v2')
  }
  revokeBetaAccess(): void {
    this.removeItem('arkana_beta_access_v2')
    this.removeItem('arkana_beta_info_v2')
    // Also clear legacy keys
    localStorage.removeItem('arkana_beta_access')
    localStorage.removeItem('arkana_beta_tier')
    localStorage.removeItem('arkana_beta_code')
  }
}
// Export singleton instance
export const secureStorage = SecureStorage.getInstance()
// Export for legacy compatibility
export default secureStorage