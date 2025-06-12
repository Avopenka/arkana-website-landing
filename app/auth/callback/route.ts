// Email confirmation callback route
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const error_description = url.searchParams.get('error_description');

  // Handle error cases
  if (error) {
    console.error('Email confirmation error:', error, error_description);
    const redirectUrl = new URL('/auth/error', url.origin);
    redirectUrl.searchParams.set('error', error);
    redirectUrl.searchParams.set('description', error_description || 'Email confirmation failed');
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Handle success case
  if (code) {
    try {
      // Exchange the code for a session
      const { data: { user, session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        throw exchangeError;
      }

      if (user && session) {
        // Update user profile to mark email as confirmed
        await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            email: user.email,
            beta_access: false, // Still on waitlist by default
            website_access: false,
            wave_tier: 'waitlist',
            waitlist_status: 'confirmed', // Email confirmed
            updated_at: new Date().toISOString()
          });

        // Log successful email confirmation
        await supabase
          .from('access_logs')
          .insert({
            user_id: user.id,
            action: 'email_confirmed',
            resource: 'auth',
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            user_agent: request.headers.get('user-agent'),
            success: true,
            metadata: { confirmation_code: code.substring(0, 8) }
          });

        // Redirect to success page
        const redirectUrl = new URL('/auth/confirmed', url.origin);
        const response = NextResponse.redirect(redirectUrl.toString());
        
        // Set session cookie
        response.cookies.set('arkana-session', session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
      }
    } catch (error: unknown) {
      console.error('Email confirmation processing error:', error);
      const redirectUrl = new URL('/auth/error', url.origin);
      redirectUrl.searchParams.set('error', 'confirmation_failed');
      redirectUrl.searchParams.set('description', 'Failed to process email confirmation');
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  // Default fallback - redirect to home
  return NextResponse.redirect(new URL('/', url.origin).toString());
}