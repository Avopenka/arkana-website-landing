// PACA V12 - Agent Epsilon: Security Configuration
// Production-grade security settings for Arkana

import crypto from 'crypto';

export const SecurityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    expiresIn: '7d',
    algorithm: 'HS256' as const,
  },

  // Encryption settings
  encryption: {
    algorithm: 'aes-256-gcm',
    key: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
    ivLength: 16,
    tagLength: 16,
    saltLength: 64,
  },

  // Rate limiting
  rateLimits: {
    api: {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // login attempts
    },
    beta: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // beta code validations
    },
    payment: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // payment attempts
    },
  },

  // Password requirements
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
  },

  // Session configuration
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    updateAge: 24 * 60 * 60 * 1000, // 1 day
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  },

  // CORS settings
  cors: {
    origins: [
      'https://arkana.chat',
      'https://www.arkana.chat',
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  },

  // Security headers
  headers: {
    hsts: {
      maxAge: 63072000, // 2 years
      includeSubDomains: true,
      preload: true,
    },
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://js.stripe.com',
          'https://vercel.live',
          'https://*.vercel-scripts.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: [
          "'self'",
          'https://api.stripe.com',
          'https://*.supabase.co',
          'wss://*.supabase.co',
          'https://api.forwardemail.net',
        ],
        frameSrc: [
          "'self'",
          'https://checkout.stripe.com',
          'https://js.stripe.com',
        ],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  },

  // Input validation
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    phoneNumber: /^\+?[1-9]\d{1,14}$/,
  },

  // Audit logging
  audit: {
    enabled: true,
    logLevel: 'info',
    sensitiveFields: [
      'password',
      'creditCard',
      'ssn',
      'apiKey',
      'token',
      'secret',
    ],
    retention: 90, // days
  },
};

// Encryption utilities
export class SecurityUtils {
  static encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(SecurityConfig.encryption.ivLength);
    const cipher = crypto.createCipheriv(
      SecurityConfig.encryption.algorithm,
      Buffer.from(SecurityConfig.encryption.key, 'hex'),
      iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = (cipher as any).getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  static decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      SecurityConfig.encryption.algorithm,
      Buffer.from(SecurityConfig.encryption.key, 'hex'),
      Buffer.from(iv, 'hex')
    );

    (decipher as any).setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(SecurityConfig.encryption.saltLength);
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return salt.toString('hex') + ':' + hash.toString('hex');
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(
      password,
      Buffer.from(salt, 'hex'),
      100000,
      64,
      'sha512'
    );
    return hash === verifyHash.toString('hex');
  }

  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
}

export default SecurityConfig;