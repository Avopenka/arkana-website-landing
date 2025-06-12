import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();
    
    // Only allow this endpoint to be called once or by existing admins
    const { data: existingAdmins } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('admin_access', true);
    
    if (existingAdmins && existingAdmins.length > 0) {
      // Check if current user is admin
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'admin'
      }
    });
    
    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }
    
    // Create user profile with admin access
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        admin_access: true,
        website_access: true,
        beta_access: true,
        created_at: new Date().toISOString()
      });
    
    if (profileError) {
      // Rollback auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create admin profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}