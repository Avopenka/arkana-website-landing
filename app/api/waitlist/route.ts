// Waitlist API with Email Automation Excellence
// Email Marketing Council: Professional automation sequences
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { emailService } from '@/lib/email-service';
import { createComponentLogger } from '@/lib/logger';

const logger = createComponentLogger('WaitlistAPI');
interface WaitlistEntry {
  firstName: string;
  lastName: string;
  email: string;
  ageGroup?: string;
  profession?: string;
  arkanaGoal?: string;
  waitlistPosition?: number;
  questionAnswers?: string[];
}
// POST /api/waitlist - Account creation with waitlist positioning
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, ageGroup, profession, arkanaGoal, waitlistPosition, questionAnswers } = body;
    // Input validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }
    // Check if email already exists in user_profiles or waitlist
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id, waitlist_position')
      .eq('email', email.toLowerCase())
      .single();

    const { data: existingWaitlist } = await supabase
      .from('waitlist')
      .select('id, waitlist_position')
      .eq('email', email.toLowerCase())
      .single();

    if (existingProfile || existingWaitlist) {
      const position = existingProfile?.waitlist_position || existingWaitlist?.waitlist_position || 0;
      return NextResponse.json({
        success: true,
        message: 'You\'re already on the waitlist!',
        waitlistPosition: position,
        email: email.toLowerCase()
      });
    }
    // Use provided waitlist position or calculate next position
    let finalPosition = waitlistPosition;
    
    if (!finalPosition) {
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      finalPosition = (totalUsers || 0) + 1;
    }

    // Create user profile directly (skip auth for waitlist-only signups)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        email: email.toLowerCase(),
        full_name: `${firstName} ${lastName}`,
        age_group: ageGroup || '25-44',
        profession: profession || 'Not specified',
        arkana_goal: arkanaGoal || 'Improve productivity and knowledge management',
        question_answers: questionAnswers || [],
        beta_access: false,
        website_access: false,
        wave_tier: 'genesis',
        waitlist_status: 'pending',
        waitlist_position: finalPosition,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, waitlist_position')
      .single();

    if (profileError) {
      logger.warn('Could not create user profile, falling back to waitlist only', { 
        error: profileError.message,
        email: email.substring(0, 3) + '...' // Partial email for privacy
      });
      // Fall back to creating waitlist entry only
    }

    // Also create entry in waitlist table for backward compatibility
    const { data: waitlistData, error: waitlistError } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        age_group: ageGroup || '25-44',
        profession: profession || 'Not specified',
        arkana_goal: arkanaGoal || 'Improve productivity and knowledge management',
        question_answers: questionAnswers || [],
        waitlist_position: finalPosition,
        total_score: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, waitlist_position')
      .single();

    const position = profileData?.waitlist_position || waitlistData?.waitlist_position || nextPosition;

    // Send welcome email
    try {
      await sendWelcomeEmail({
        firstName,
        lastName,
        email: email.toLowerCase(),
        position: position
      });
    } catch (emailError) {
      logger.error('Failed to send welcome email', emailError as Error, { 
        email: email.substring(0, 3) + '...',
        position 
      });
      // Don't fail the signup if email fails
    }

    // Log the signup
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    try {
      await supabase
        .from('access_logs')
        .insert({
          user_id: profileData?.id || null,
          action: 'waitlist_signup',
          resource: 'waitlist',
          ip_address: clientIP,
          user_agent: request.headers.get('user-agent'),
          success: true,
          metadata: { 
            first_name: firstName,
            last_name: lastName,
            waitlist_position: position,
            question_answers: questionAnswers
          }
        });
    } catch (logError) {
      logger.warn('Could not log waitlist signup', { 
        error: (logError as Error).message,
        email: email.substring(0, 3) + '...'
      });
      // Continue with signup even if logging fails
    }
    
    // Also try with emailService as backup
    try {
      await emailService.sendWelcomeEmail({
        email: email.toLowerCase(),
        firstName,
        waitlistPosition: position
      });
    } catch (emailError) {
      logger.warn('EmailService backup also failed', { 
        error: (emailError as Error).message,
        email: email.substring(0, 3) + '...'
      });
      // Continue with signup even if both email services fail
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      waitlistPosition: position,
      email: email.toLowerCase()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// GET /api/waitlist/stats - Get waitlist statistics
export async function GET(request: NextRequest) {
  try {
    // Get total waitlist count from user_profiles
    const { count: profileCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    // Get total from waitlist table as fallback
    const { count: waitlistCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    const totalCount = Math.max(profileCount || 0, waitlistCount || 0);

    // Get recent signups (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentProfileCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo);

    const { count: recentWaitlistCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo);

    const recentCount = Math.max(recentProfileCount || 0, recentWaitlistCount || 0);

    // Get users with access granted
    const { count: accessGrantedCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .or('beta_access.eq.true,website_access.eq.true,admin_access.eq.true');

    return NextResponse.json({
      totalUsers: totalCount,
      recentSignups: recentCount,
      accessGranted: accessGrantedCount || 0,
      pendingApproval: totalCount - (accessGrantedCount || 0),
      genesisSpots: Math.max(0, 100 - totalCount), // 100 genesis spots
      status: 'active'
    });
  } catch (error) {
    logger.error('Failed to fetch waitlist stats', error as Error);
    return NextResponse.json({
      totalUsers: 0,
      recentSignups: 0,
      accessGranted: 0,
      pendingApproval: 0,
      genesisSpots: 100,
      status: 'error',
      error: 'Failed to fetch stats'
    }, { status: 500 });
  }
}
// Email Marketing Council: Professional welcome sequence
async function sendWelcomeEmail(params: {
  firstName: string;
  lastName: string;
  email: string;
  position: number;
}) {
  const { firstName, lastName, email, position } = params;
  // Email template with emotional AI theme
  const emailContent = {
    to: email,
    subject: `Welcome to Arkana, ${firstName} • Position #${position}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Arkana</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%); color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(45deg, #00f5ff, #8b5cf6); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px;">🧠</span>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">ARKANA</h1>
            <p style="margin: 10px 0 0; color: #a0a0a0; font-size: 16px;">Emotional Intelligence. Evolved.</p>
          </div>
          <!-- Welcome Message -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 400;">Welcome, ${firstName}</h2>
            <p style="margin: 0 0 15px; line-height: 1.6; color: #e0e0e0;">
              You are now <strong>Position #${position}</strong> in the emotional AI revolution. 
              Your journey toward technological awakening begins here.
            </p>
            <p style="margin: 0; line-height: 1.6; color: #e0e0e0;">
              Based on your responses, you're an excellent candidate for 
              <strong style="color: #8b5cf6;">Genesis Wave</strong> early access when we launch.
            </p>
          </div>
          <!-- Access Level -->
          <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px; font-size: 18px; color: #8b5cf6;">Your Access Level</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #a0a0a0;">Position:</span>
              <span style="color: #ffffff;">#${position}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #a0a0a0;">Access Tier:</span>
              <span style="color: #10b981;">Genesis Wave</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #a0a0a0;">Status:</span>
              <span style="color: #8b5cf6;">Priority Access</span>
            </div>
          </div>
          <!-- What's Next -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px; font-size: 18px; color: #00f5ff;">What Happens Next</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #e0e0e0;">
              <li>We'll keep you updated on development progress</li>
              <li>You'll receive early access when your wave opens</li>
              <li>Exclusive insights into emotional AI technology</li>
              <li>First priority for Genesis Wave positions</li>
            </ul>
          </div>
          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0 0 10px; color: #a0a0a0; font-size: 14px;">
              Welcome to the future of emotional AI technology
            </p>
            <p style="margin: 0; color: #666; font-size: 12px;">
              Arkana • Berlin, 2025 • hello@arkana.chat
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Arkana, ${firstName}!
      You are now Position #${position} in the emotional AI revolution.
      Access Details:
      - Position: #${position}
      - Access Tier: Genesis Wave
      - Status: Priority Access
      What's Next:
      - Development progress updates
      - Early access when your wave opens
      - Exclusive emotional AI technology insights
      - Priority for Genesis Wave positions
      Welcome to the future.
      Arkana Team
      hello@arkana.chat
    `
  };
  // PACAR Protocol: Integrated email service
  try {
    const { emailService } = await import('@/lib/email-service');
    
    const emailSent = await emailService.sendWelcomeEmail({
      email: emailContent.to,
      firstName: firstName,
      waitlistPosition: position
    });
    
    if (emailSent) {
      logger.info('Welcome email sent successfully', { 
        email: emailContent.to.substring(0, 3) + '...',
        position 
      });
    } else {
      logger.warn('Failed to send welcome email', { 
        email: emailContent.to.substring(0, 3) + '...',
        position 
      });
    }
  } catch (emailError) {
    logger.error('Email service error', emailError as Error, { 
      email: emailContent.to.substring(0, 3) + '...',
      position 
    });
    // Don't fail the entire request if email fails
  }
}
// SQL to create waitlist_entries table:
/*
CREATE TABLE waitlist_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age_group TEXT NOT NULL,
  profession TEXT NOT NULL,
  arkana_goal TEXT,
  system_info JSONB NOT NULL,
  waitlist_position INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Indexes
CREATE INDEX idx_waitlist_email ON waitlist_entries(email);
CREATE INDEX idx_waitlist_position ON waitlist_entries(waitlist_position);
CREATE INDEX idx_waitlist_status ON waitlist_entries(status);
-- RLS policies
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert waitlist entries" ON waitlist_entries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read waitlist stats" ON waitlist_entries
  FOR SELECT USING (true);
*/