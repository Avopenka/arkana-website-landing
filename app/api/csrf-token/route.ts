import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken, setCSRFToken } from '@/lib/middleware/csrf'

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  return setCSRFToken(response)
}