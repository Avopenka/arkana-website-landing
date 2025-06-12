// Hardware-Aware Email Automation for Arkana
// Integrates with Forward Email for privacy-focused, intelligent invitations
import { forwardEmail, emailTemplates } from './forward-email';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// Device capability scoring (matches your SQL schema)
const DEVICE_SCORES = {
  // Ultra tier - Immediate VIP treatment
  'mac_studio_m4_ultra_256gb': 100,
  'mac_studio_m4_ultra_192gb': 95,
  'mac_studio_m4_ultra_128gb': 90,
  'mac_studio_m3_ultra_192gb': 88,
  'mac_studio_m3_ultra_128gb': 85,
  'mac_studio_m2_ultra_192gb': 83,
  'mac_studio_m2_ultra_128gb': 80,
  // Max tier - High priority
  'mac_m4_max_128gb': 75,
  'mac_m4_max_96gb': 72,
  'mac_m4_max_64gb': 68,
  'mac_m3_max_128gb': 65,
  'mac_m3_max_96gb': 62,
  'mac_m3_max_64gb': 58,
  // Pro tier - Good hardware
  'mac_m4_pro_48gb': 55,
  'mac_m4_pro_36gb': 52,
  'mac_m3_pro_36gb': 48,
  'mac_m2_pro_32gb': 45,
  // Air tier - API-dependent
  'mac_m4_air_24gb': 35,
  'mac_m4_air_16gb': 30,
  'mac_m3_air_24gb': 28,
  'mac_m2_air_24gb': 25,
  'mac_m2_air_16gb': 22,
  'mac_m1_air_16gb': 18,
  'mac_m1_air_8gb': 15,
  // Combined devices get boost
  'both_ultra_premium': 110,
  'both_premium': 85,
  'both_standard': 60,
  // Other
  'mac_other': 20,
  'iphone_pro_max': 25,
  'iphone_pro': 20,
  'iphone_other': 15
} as const;
type DeviceType = keyof typeof DEVICE_SCORES;
interface WaitlistUser {
  id: string;
  email: string;
  name?: string;
  device_type: DeviceType;
  ram_gb: number;
  total_score: number;
  hardware_score: number;
  engagement_score: number;
  timing_score: number;
  queue_position: number;
  wave_assigned?: string;
  referral_code: string;
  created_at: string;
  status: 'waiting' | 'invited' | 'claimed' | 'expired';
}
// Hardware-specific email templates
export const hardwareEmailTemplates = {
  // Ultra users get immediate personal attention
  ultraWelcome: (user: WaitlistUser) => ({
    subject: `${user.name}, your ${user.device_type.replace(/_/g, ' ')} caught my attention`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 40px auto; padding: 30px; background: #fafafa;">
        <div style="border-left: 4px solid #00C8C8; padding-left: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; font-size: 24px; margin: 0;">Personal message from Aristo</h1>
        </div>
        <p style="font-size: 18px; line-height: 1.8; color: #333;">
          ${user.name || 'Friend'},
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          I just saw you joined with a <strong>${user.device_type.replace(/_/g, ' ').toUpperCase()}</strong> 
          with ${user.ram_gb}GB of unified memory. You're exactly who I built Arkana for.
        </p>
        <div style="background: #e8f5f5; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <p style="margin: 0 0 15px 0; color: #333; font-weight: 600;">
            🚀 Your machine can run our most advanced models:
          </p>
          <ul style="margin: 0; color: #555; line-height: 1.7;">
            <li>180B parameter models locally (no API needed)</li>
            <li>Real-time consciousness visualization at 120fps</li>
            <li>Parallel thought streams across all CPU cores</li>
            <li>Video generation and multimodal reasoning</li>
          </ul>
        </div>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          You're <strong style="color: #00C8C8;">#${user.queue_position}</strong> in our Ultra tier. 
          That means:
        </p>
        <ul style="font-size: 16px; line-height: 1.8; color: #555;">
          <li>Direct access to me via Signal: <code>+1-XXX-XXX-XXXX</code></li>
          <li>First access to every feature we ship</li>
          <li>Your name in our Hall of Founders</li>
          <li>Beta access to consciousness models before anyone else</li>
          <li>Special Discord channel with other Ultra users</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          What made you join so early? I'd love to hear your story.
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="https://arkana.chat/ultra-founders" 
             style="background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); 
                    color: white; text-decoration: none; padding: 16px 32px; 
                    border-radius: 50px; display: inline-block; font-weight: 600;">
            Join Ultra Founders Discord
          </a>
        </div>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          —Aristo Vopěnka<br>
          <span style="color: #999; font-size: 14px;">Founder, Arkana</span>
        </p>
        <p style="font-size: 13px; line-height: 1.6; color: #999; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          P.S. Your ${user.device_type.replace(/_/g, ' ')} will process consciousness models 
          faster than most servers. Can't wait to see what you build.
        </p>
      </div>
    `,
    from: 'Aristo Vopěnka <aristo@arkana.chat>',
    replyTo: 'aristo@arkana.chat'
  }),
  // Max/Pro users get technical details
  powerUserWelcome: (user: WaitlistUser) => ({
    subject: `🧠 Perfect hardware choice for Arkana`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, system-ui, sans-serif;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">
            Welcome, Power User
          </h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 15px 0 0 0;">
            Your ${user.device_type.replace(/_/g, ' ')} is perfect for Arkana
          </p>
        </div>
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px;">
          <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Your Hardware Profile:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div>
                <strong>Device:</strong> ${user.device_type.replace(/_/g, ' ').toUpperCase()}<br>
                <strong>RAM:</strong> ${user.ram_gb}GB Unified Memory<br>
                <strong>Local Model Capacity:</strong> ${getMaxModelSize(user.device_type)}
              </div>
              <div>
                <strong>Queue Position:</strong> #${user.queue_position}<br>
                <strong>Hardware Score:</strong> ${user.hardware_score}/100<br>
                <strong>API Dependency:</strong> ${getAPIDependency(user.device_type)}
              </div>
            </div>
          </div>
          <h3 style="color: #1e293b; margin: 25px 0 15px 0;">What You Can Run Locally:</h3>
          <ul style="color: #475569; line-height: 1.7; margin: 0 0 25px 0;">
            ${getLocalCapabilities(user.device_type).map(cap => `<li>${cap}</li>`).join('')}
          </ul>
          <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0; color: #065f46; font-weight: 600;">
              💡 Optimization Tip:
            </p>
            <p style="margin: 10px 0 0 0; color: #065f46;">
              ${getOptimizationTip(user.device_type)}
            </p>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            You're in position <strong style="color: #3730a3;">#${user.queue_position}</strong> 
            for ${getRecommendedWave(user.device_type)}. We'll notify you the moment your 
            wave opens.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://arkana.chat/refer?code=${user.referral_code}" 
               style="background: linear-gradient(135deg, #3730a3 0%, #1e3a8a 100%); 
                      color: white; text-decoration: none; padding: 14px 28px; 
                      border-radius: 50px; display: inline-block; font-weight: 500;">
              Share & Skip the Line
            </a>
          </div>
        </div>
      </div>
    `
  }),
  // Air users get API-focused messaging
  airUserWelcome: (user: WaitlistUser) => ({
    subject: `🚀 Arkana + Cloud = Perfect for your setup`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, system-ui, sans-serif;">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">
            Smart Choice
          </h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 15px 0 0 0;">
            Your ${user.device_type.replace(/_/g, ' ')} + our cloud = unlimited power
          </p>
        </div>
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi ${user.name || 'there'},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Your ${user.device_type.replace(/_/g, ' ')} with ${user.ram_gb}GB is perfect for 
            Arkana's hybrid approach. Here's why:
          </p>
          <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #92400e;">🌟 Your Perfect Setup:</h3>
            <ul style="margin: 0; color: #92400e; line-height: 1.7;">
              <li><strong>Quick tasks:</strong> Run locally for instant privacy</li>
              <li><strong>Heavy lifting:</strong> Our cloud handles the complex stuff</li>
              <li><strong>Best of both:</strong> Speed when you need it, privacy when you want it</li>
            </ul>
          </div>
          <h3 style="color: #374151; margin: 25px 0 15px 0;">What runs locally on your Mac:</h3>
          <ul style="color: #6b7280; line-height: 1.7; margin: 0 0 25px 0;">
            <li>7B parameter models for chat and basic reasoning</li>
            <li>Real-time voice processing and transcription</li>
            <li>Local memory and note organization</li>
            <li>Offline mode for sensitive tasks</li>
          </ul>
          <h3 style="color: #374151; margin: 25px 0 15px 0;">What we handle in the cloud:</h3>
          <ul style="color: #6b7280; line-height: 1.7; margin: 0 0 25px 0;">
            <li>70B+ models for complex reasoning</li>
            <li>Image and video generation</li>
            <li>Code analysis and generation</li>
            <li>Multi-modal understanding</li>
          </ul>
          <div style="background: #ede9fe; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #5b21b6; font-weight: 600;">
              💰 Your Pricing Advantage:
            </p>
            <p style="margin: 0; color: #5b21b6;">
              You get ${getTokenAllowance(user.device_type)} free cloud tokens per month. 
              Perfect for your use case!
            </p>
          </div>
          <p style="color: #6b7280; line-height: 1.6;">
            You're <strong style="color: #7c3aed;">#${user.queue_position}</strong> in line. 
            We'll have your invitation ready soon!
          </p>
        </div>
      </div>
    `
  }),
  // Wave opening notification with hardware context
  hardwareAwareWaveOpening: (user: WaitlistUser, wave: any) => ({
    subject: `🔓 ${wave.name} OPEN - Optimized for your ${user.device_type.replace(/_/g, ' ')}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, system-ui, sans-serif;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 50px 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 300;">
            Your Time Has Come
          </h1>
          <p style="color: rgba(255,255,255,0.95); font-size: 20px; margin: 20px 0 0 0;">
            ${wave.name} is now open for ${user.device_type.replace(/_/g, ' ')} users
          </p>
        </div>
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px;">
          <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <p style="margin: 0; color: #dc2626; font-weight: 700; font-size: 20px;">
              ⚡ Only ${wave.spots_remaining} spots left
            </p>
            <p style="margin: 10px 0 0 0; color: #dc2626; font-size: 16px;">
              Your hardware score of ${user.hardware_score} gives you priority
            </p>
          </div>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 25px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #166534;">Perfect Match for Your Setup:</h3>
            <ul style="margin: 0; color: #166534; line-height: 1.7;">
              <li><strong>Your Device:</strong> ${user.device_type.replace(/_/g, ' ').toUpperCase()}</li>
              <li><strong>Max Local Models:</strong> ${getMaxModelSize(user.device_type)}</li>
              <li><strong>Monthly API Tokens:</strong> ${wave.included_api_tokens?.toLocaleString() || 'Unlimited'}</li>
              <li><strong>Price Lock:</strong> ${wave.lock_years} years at €${wave.price_monthly_eur}/month</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://arkana.chat/claim?token=${user.referral_code}&wave=${wave.tier}" 
               style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
                      color: white; text-decoration: none; padding: 20px 40px; 
                      border-radius: 60px; display: inline-block; font-weight: 600; 
                      font-size: 20px; box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);">
              Claim Your ${wave.name} Spot
            </a>
          </div>
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p style="margin: 0;">⏰ This invitation expires in 48 hours</p>
            <p style="margin: 5px 0 0 0;">Questions? Reply to this email for priority support</p>
          </div>
        </div>
      </div>
    `
  })
};
// Helper functions for hardware-specific content
function getMaxModelSize(deviceType: DeviceType): string {
  const sizeMap: Record<string, string> = {
    'mac_studio_m4_ultra_256gb': '180B parameters',
    'mac_studio_m4_ultra_192gb': '140B parameters',
    'mac_studio_m4_ultra_128gb': '100B parameters',
    'mac_m4_max_128gb': '70B parameters',
    'mac_m4_max_64gb': '34B parameters',
    'mac_m4_pro_48gb': '13B parameters',
    'mac_m4_air_24gb': '7B parameters',
    'mac_m4_air_16gb': '7B parameters (limited)',
  };
  return sizeMap[deviceType] || '7B parameters';
}
function getAPIDependency(deviceType: DeviceType): string {
  const score = DEVICE_SCORES[deviceType];
  if (score >= 80) return 'Very Low';
  if (score >= 60) return 'Low';
  if (score >= 40) return 'Medium';
  return 'High (recommended)';
}
function getLocalCapabilities(deviceType: DeviceType): string[] {
  const score = DEVICE_SCORES[deviceType];
  if (score >= 90) {
    return [
      '180B parameter models for advanced reasoning',
      'Real-time video generation and editing',
      'Multimodal understanding (text, image, audio)',
      'Parallel consciousness streams',
      'Local training and fine-tuning'
    ];
  } else if (score >= 70) {
    return [
      '70B parameter models for complex tasks',
      'Image generation and editing',
      'Advanced code analysis',
      'Real-time consciousness visualization',
      'Local knowledge processing'
    ];
  } else if (score >= 50) {
    return [
      '13-34B parameter models for reasoning',
      'Fast text processing and generation',
      'Voice transcription and synthesis',
      'Local memory management',
      'Basic image understanding'
    ];
  } else {
    return [
      '7B parameter models for chat',
      'Voice processing and transcription',
      'Local note organization',
      'Basic text analysis',
      'Offline privacy mode'
    ];
  }
}
function getOptimizationTip(deviceType: DeviceType): string {
  const score = DEVICE_SCORES[deviceType];
  if (score >= 90) {
    return 'Enable High Performance mode and allocate 80% of your RAM to Arkana for maximum model capacity.';
  } else if (score >= 70) {
    return 'Close other apps when running large models. Your Mac can handle 70B models with room to spare.';
  } else if (score >= 50) {
    return 'Use local models for daily tasks, cloud for heavy reasoning. Perfect balance of speed and capability.';
  } else {
    return 'Embrace our cloud integration - you get blazing fast results without taxing your Mac.';
  }
}
function getRecommendedWave(deviceType: DeviceType): string {
  const score = DEVICE_SCORES[deviceType];
  if (score >= 90) return 'The Codex (Genesis Founders)';
  if (score >= 80) return 'The Sages (Wisdom Keepers)';
  if (score >= 70) return 'The Oracles (Future Seers)';
  if (score >= 60) return 'The Guardians (Truth Protectors)';
  if (score >= 50) return 'The Scholars (Knowledge Seekers)';
  if (score >= 40) return 'The Apprentices (Learning Path)';
  return 'The Seekers (Path Finders)';
}
function getTokenAllowance(deviceType: DeviceType): string {
  const score = DEVICE_SCORES[deviceType];
  if (score >= 90) return '5M';
  if (score >= 80) return '3M';
  if (score >= 70) return '2M';
  if (score >= 60) return '1.5M';
  if (score >= 50) return '1M';
  if (score >= 40) return '500K';
  return '250K';
}
// Main automation functions
export async function sendHardwareAwareWelcome(user: WaitlistUser) {
  try {
    const score = DEVICE_SCORES[user.device_type] || 20;
    let emailTemplate;
    // Choose template based on hardware tier
    if (score >= 90) {
      // Ultra users get personal founder message
      emailTemplate = hardwareEmailTemplates.ultraWelcome(user);
    } else if (score >= 50) {
      // Max/Pro users get technical details
      emailTemplate = hardwareEmailTemplates.powerUserWelcome(user);
    } else {
      // Air users get cloud-focused messaging
      emailTemplate = hardwareEmailTemplates.airUserWelcome(user);
    }
    await forwardEmail.send({
      to: user.email,
      ...emailTemplate
    });
    // Log the email send
    await supabase
      .from('email_logs')
      .insert({
        user_id: user.id,
        email_type: 'hardware_welcome',
        device_type: user.device_type,
        hardware_score: score,
        sent_at: new Date().toISOString()
      });
  } catch (error) {
    throw error;
  }
}
export async function sendWaveInvitation(user: WaitlistUser, wave: any) {
  try {
    const emailTemplate = hardwareEmailTemplates.hardwareAwareWaveOpening(user, wave);
    await forwardEmail.send({
      to: user.email,
      ...emailTemplate
    });
    // Update user status to invited
    await supabase
      .from('waitlist_submissions')
      .update({
        status: 'invited',
        invited_at: new Date().toISOString(),
        wave_assigned: wave.tier
      })
      .eq('id', user.id);
  } catch (error) {
    throw error;
  }
}
// Automated daily scoring and invitation process
export async function runDailyInvitationProcess() {
  try {
    // Get users waiting for invites, ordered by total score
    const { data: waitingUsers, error: usersError } = await supabase
      .from('waitlist_submissions')
      .select('*')
      .eq('status', 'waiting')
      .order('total_score', { ascending: false })
      .limit(100);
    if (usersError) throw usersError;
    // Get current wave with available spots
    const { data: currentWave, error: waveError } = await supabase
      .from('waves')
      .select('*')
      .lt('seats_claimed', 'max_seats')
      .order('wave_number')
      .limit(1)
      .single();
    if (waveError || !currentWave) {
      return;
    }
    const availableSpots = currentWave.max_seats - currentWave.seats_claimed;
    const usersToInvite = waitingUsers.slice(0, Math.min(availableSpots, 10)); // Limit to 10 per day
    // Send invitations
    for (const user of usersToInvite) {
      await sendWaveInvitation(user, currentWave);
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
  }
}
// Update hardware scores when new devices are detected
export async function updateHardwareScore(userId: string, newDeviceType: DeviceType) {
  try {
    const hardwareScore = DEVICE_SCORES[newDeviceType] || 20;
    // Recalculate total score
    const { data: user, error } = await supabase
      .from('waitlist_submissions')
      .select('engagement_score, timing_score')
      .eq('id', userId)
      .single();
    if (error) throw error;
    const totalScore = Math.round(
      hardwareScore * 0.5 + 
      user.engagement_score * 0.3 + 
      user.timing_score * 0.2
    );
    await supabase
      .from('waitlist_submissions')
      .update({
        device_type: newDeviceType,
        hardware_score: hardwareScore,
        total_score: totalScore
      })
      .eq('id', userId);
  } catch (error) {
  }
}