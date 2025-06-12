// Enhanced error handling and logging for authentication system
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  requestId: string;
}

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Generate unique request ID for tracking
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// Enhanced error logger
export async function logError(
  error: Error | AuthError,
  request: NextRequest,
  context: {
    endpoint: string;
    userId?: string;
    email?: string;
    action?: string;
  }
): Promise<void> {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();
  
  const errorLog = {
    request_id: requestId,
    timestamp,
    error_type: error.name,
    error_code: error instanceof AuthError ? error.code : 'UNKNOWN_ERROR',
    error_message: error.message,
    status_code: error instanceof AuthError ? error.statusCode : 500,
    endpoint: context.endpoint,
    user_id: context.userId || null,
    email: context.email || null,
    action: context.action || null,
    ip_address: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown',
    user_agent: request.headers.get('user-agent') || 'unknown',
    stack_trace: error.stack || null,
    details: error instanceof AuthError ? error.details : null
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Auth Error:', errorLog);
  }

  // Try to log to database
  try {
    await supabase
      .from('access_logs')
      .insert({
        user_id: context.userId,
        action: `error_${context.action || 'unknown'}`,
        resource: context.endpoint.replace('/api/', ''),
        ip_address: errorLog.ip_address,
        user_agent: errorLog.user_agent,
        success: false,
        error_message: error.message,
        metadata: {
          request_id: requestId,
          error_code: errorLog.error_code,
          endpoint: context.endpoint,
          details: errorLog.details
        }
      });
  } catch (logError) {
    console.warn('Failed to log error to database:', logError);
  }
}

// Error response formatter
export function formatErrorResponse(
  error: Error | AuthError,
  requestId: string
): NextResponse {
  const timestamp = new Date().toISOString();
  
  if (error instanceof AuthError) {
    const response: ApiError = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp,
      requestId
    };

    // Don't expose sensitive details in production
    if (process.env.NODE_ENV === 'production' && error.statusCode >= 500) {
      response.message = 'Internal server error';
      response.details = undefined;
    }

    return NextResponse.json({ error: response }, { 
      status: error.statusCode,
      headers: {
        'X-Request-ID': requestId,
        'X-Error-Code': error.code
      }
    });
  }

  // Generic error
  const response: ApiError = {
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message,
    statusCode: 500,
    timestamp,
    requestId
  };

  return NextResponse.json({ error: response }, { 
    status: 500,
    headers: {
      'X-Request-ID': requestId,
      'X-Error-Code': 'INTERNAL_ERROR'
    }
  });
}

// Wrapper for API route handlers with automatic error handling
export function withErrorHandling(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>,
  endpoint: string
) {
  return async (request: NextRequest, context: any = {}): Promise<NextResponse> => {
    const requestId = generateRequestId();
    
    try {
      // Add request ID to headers for tracking
      const response = await handler(request, context);
      response.headers.set('X-Request-ID', requestId);
      return response;
    } catch (error: unknown) {
      // Log the error
      await logError(error, request, {
        endpoint,
        userId: context.userId,
        email: context.email,
        action: context.action || request.method?.toLowerCase()
      });

      // Return formatted error response
      return formatErrorResponse(error, requestId);
    }
  };
}

// Predefined auth errors
export const AuthErrors = {
  INVALID_CREDENTIALS: (details?: any) => new AuthError(
    'INVALID_CREDENTIALS',
    'Invalid email or password',
    401,
    details
  ),
  
  EMAIL_ALREADY_EXISTS: (email: string) => new AuthError(
    'EMAIL_ALREADY_EXISTS',
    'Email already registered',
    409,
    { email }
  ),
  
  RATE_LIMITED: (details?: any) => new AuthError(
    'RATE_LIMITED',
    'Too many requests. Please try again later.',
    429,
    details
  ),
  
  SERVICE_UNAVAILABLE: (service: string) => new AuthError(
    'SERVICE_UNAVAILABLE',
    `${service} service is currently unavailable`,
    503,
    { service }
  ),
  
  VALIDATION_ERROR: (field: string, message: string) => new AuthError(
    'VALIDATION_ERROR',
    `Validation failed: ${message}`,
    400,
    { field, validation_message: message }
  ),
  
  DATABASE_ERROR: (operation: string) => new AuthError(
    'DATABASE_ERROR',
    'Database operation failed',
    500,
    { operation }
  ),
  
  PERMISSION_DENIED: (resource: string) => new AuthError(
    'PERMISSION_DENIED',
    'Insufficient permissions',
    403,
    { resource }
  )
};

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateRequired(value: any, fieldName: string): void {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    throw AuthErrors.VALIDATION_ERROR(fieldName, `${fieldName} is required`);
  }
}

export function validateEmailFormat(email: string): void {
  if (!validateEmail(email)) {
    throw AuthErrors.VALIDATION_ERROR('email', 'Invalid email format');
  }
}

export function validatePasswordStrength(password: string): void {
  if (!validatePassword(password)) {
    throw AuthErrors.VALIDATION_ERROR('password', 'Password must be at least 8 characters');
  }
}