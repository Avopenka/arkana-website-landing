import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear session cookie
    response.cookies.set('arkana-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}