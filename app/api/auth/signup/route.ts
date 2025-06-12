import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, wave_tier = 'waitlist' } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get('origin')}/auth/callback`
      }
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Create user profile
    if (data.user) {
      await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          wave_tier,
          waitlist_status: 'pending',
          beta_access: false,
          website_access: false,
          created_at: new Date().toISOString()
        });
      
      // Log signup
      await supabase
        .from('access_logs')
        .insert({
          user_id: data.user.id,
          action: 'signup',
          resource: 'auth',
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent'),
          success: true,
          metadata: { wave_tier }
        });
    }
    
    return NextResponse.json({
      message: 'Check your email to confirm your account',
      user: data.user
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}