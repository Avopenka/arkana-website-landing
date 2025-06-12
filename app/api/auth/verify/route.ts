import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '../../../../lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ 
      user,
      verified: true 
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Email verified successfully',
      user: data.user
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}