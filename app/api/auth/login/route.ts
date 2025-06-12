import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withRateLimit } from '@/lib/middleware/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await withRateLimit(request, 'login')
  if (rateLimitResponse) return rateLimitResponse
  
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    // Get user profile to check access levels
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('admin_access, beta_access, website_access')
      .eq('id', data.user?.id)
      .single();

    // Log successful login
    await supabase
      .from('access_logs')
      .insert({
        user_id: data.user?.id,
        action: 'login',
        resource: 'auth',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent'),
        success: true
      });
    
    const response = NextResponse.json({ 
      user: {
        ...data.user,
        adminAccess: profile?.admin_access || false,
        betaAccess: profile?.beta_access || false,
        websiteAccess: profile?.website_access || false
      },
      session: data.session
    });
    
    // Set session cookie
    if (data.session) {
      response.cookies.set('arkana-session', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }
    
    return response;
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}