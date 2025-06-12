// Enhanced API Response Handler for Developer Experience
import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
  requestId: string
  metadata?: {
    version: string
    environment: string
    duration?: number
    rateLimit?: {
      remaining: number
      reset: number
    }
  }
}

export class ApiResponseBuilder<T = any> {
  private response: Partial<ApiResponse<T>> = {}
  private startTime: number

  constructor() {
    this.startTime = Date.now()
    this.response.timestamp = new Date().toISOString()
    this.response.requestId = generateRequestId()
    this.response.metadata = {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  }

  success(data: T, message?: string): ApiResponse<T> {
    return {
      ...this.response,
      success: true,
      data,
      message,
      metadata: {
        ...this.response.metadata!,
        duration: Date.now() - this.startTime
      }
    } as ApiResponse<T>
  }

  error(error: string, statusCode?: number): ApiResponse<never> {
    return {
      ...this.response,
      success: false,
      error,
      metadata: {
        ...this.response.metadata!,
        duration: Date.now() - this.startTime
      }
    } as ApiResponse<never>
  }

  withRateLimit(remaining: number, reset: number): this {
    this.response.metadata!.rateLimit = { remaining, reset }
    return this
  }
}

export function createApiResponse<T = any>(): ApiResponseBuilder<T> {
  return new ApiResponseBuilder<T>()
}

export function sendSuccess<T>(data: T, message?: string, status = 200): NextResponse {
  const response = createApiResponse<T>().success(data, message)
  return NextResponse.json(response, { status })
}

export function sendError(error: string, status = 400): NextResponse {
  const response = createApiResponse().error(error, status)
  return NextResponse.json(response, { status })
}

export function sendValidationError(errors: Record<string, string>): NextResponse {
  const response = createApiResponse().error('Validation failed', 422)
  return NextResponse.json({
    ...response,
    validationErrors: errors
  }, { status: 422 })
}

export function sendUnauthorized(message = 'Unauthorized'): NextResponse {
  const response = createApiResponse().error(message, 401)
  return NextResponse.json(response, { status: 401 })
}

export function sendNotFound(resource = 'Resource'): NextResponse {
  const response = createApiResponse().error(`${resource} not found`, 404)
  return NextResponse.json(response, { status: 404 })
}

export function sendServerError(error?: string): NextResponse {
  const response = createApiResponse().error(
    error || 'Internal server error', 
    500
  )
  return NextResponse.json(response, { status: 500 })
}

// Utility functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Enhanced logging for developer experience
export function logApiCall(
  method: string, 
  path: string, 
  requestId: string, 
  duration: number,
  statusCode: number
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${method} ${path} - ${statusCode} (${duration}ms) [${requestId}]`)
  }
}

// Type-safe API error handling
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return sendError(error.message, error.statusCode)
  }
  
  if (error instanceof Error) {
    console.error('[API Error]', error)
    return sendServerError(
      process.env.NODE_ENV === 'development' ? error.message : undefined
    )
  }
  
  return sendServerError()
}