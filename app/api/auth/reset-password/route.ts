import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour
    
    // Store reset token in database
    const { error: updateError } = await supabase
      .from('password_resets')
      .upsert({
        email,
        token: resetToken,
        expires_at: resetExpires.toISOString(),
        created_at: new Date().toISOString()
      })
    
    if (updateError) {
      throw updateError
    }
    
    // Send reset email (implement with your email service)
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`
    
    // TODO: Send actual email
    console.log('Password reset link:', resetUrl)
    
    return NextResponse.json({
      message: 'If an account exists with this email, a reset link has been sent'
    })
    
  } catch (error: unknown) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    )
  }
}