// Agent Iota: Communication Orchestrator - Brown Connection + Kurzweil Exponential
// Authentic communication that builds anticipation and creates growth loops
export interface EmailTemplate {
  id: string
  subject: string
  content: string
  timing: string
  audience: 'waitlist' | 'beta' | 'genesis' | 'all'
  trigger: 'signup' | 'time_based' | 'behavior' | 'manual'
  personalizations: string[]
}
export const emailSequences: EmailTemplate[] = [
  // Waitlist Welcome Sequence
  {
    id: 'waitlist_welcome',
    subject: 'Welcome to the Consciousness Evolution',
    content: `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #0F1419 0%, #1A2332 100%); padding: 40px; border-radius: 16px; margin: 20px 0;">
        <h1 style="color: #E8E3D3; font-size: 28px; margin-bottom: 24px; font-weight: normal;">
          {{firstName}}, You're Part of Something Extraordinary
        </h1>
        <p style="color: #A8A29E; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Thank you for joining the Arkana waitlist. You're now among the consciousness pioneers 
          who recognize that technology can elevate human thinking rather than replace it.
        </p>
        <div style="background: rgba(199, 167, 108, 0.1); border: 1px solid rgba(199, 167, 108, 0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #C7A76C; margin-bottom: 16px;">What Happens Next?</h3>
          <ul style="color: #A8A29E; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">You'll receive exclusive updates about our Genesis Wave launch</li>
            <li style="margin-bottom: 8px;">Early access to beta features and consciousness insights</li>
            <li style="margin-bottom: 8px;">First opportunity to join our 100-year price lock program</li>
          </ul>
        </div>
        <p style="color: #A8A29E; font-size: 14px; line-height: 1.6; margin-top: 32px; border-top: 1px solid rgba(168, 162, 158, 0.2); padding-top: 20px;">
          We're building something that respects your consciousness, not just your attention.
          <br><br>
          — The Arkana Team
        </p>
      </div>
    </div>
    `,
    timing: 'immediate',
    audience: 'waitlist',
    trigger: 'signup',
    personalizations: ['firstName', 'signupSource']
  },
  // Genesis Wave Launch Announcement
  {
    id: 'genesis_wave_launch',
    subject: '🚀 Genesis Wave Opens in 48 Hours - Your Spot Awaits',
    content: `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #0F1419 0%, #1A2332 100%); padding: 40px; border-radius: 16px; margin: 20px 0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="background: rgba(199, 167, 108, 0.2); border: 1px solid #C7A76C; border-radius: 50px; display: inline-block; padding: 12px 24px; margin-bottom: 20px;">
            <span style="color: #C7A76C; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
              ✨ Genesis Wave Launch ✨
            </span>
          </div>
          <h1 style="color: #E8E3D3; font-size: 32px; margin-bottom: 16px; font-weight: normal;">
            The Future Begins in 48 Hours
          </h1>
        </div>
        <p style="color: #A8A29E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          {{firstName}}, the wait is almost over. On <strong style="color: #C7A76C;">June 5th at 9:00 AM PST</strong>, 
          we're opening the Genesis Wave — the first 100 spots for consciousness pioneers.
        </p>
        <div style="background: rgba(199, 167, 108, 0.1); border-left: 4px solid #C7A76C; padding: 20px; margin: 24px 0;">
          <h3 style="color: #C7A76C; margin-bottom: 12px;">Genesis Wave Benefits:</h3>
          <ul style="color: #A8A29E; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 6px;"><strong>€25/month for 100 years</strong> (price locked forever)</li>
            <li style="margin-bottom: 6px;">Exclusive consciousness technology access</li>
            <li style="margin-bottom: 6px;">Direct input on future development</li>
            <li style="margin-bottom: 6px;">Genesis Wave community membership</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="{{launchUrl}}" style="background: #C7A76C; color: #0F1419; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.2s;">
            Secure Your Genesis Spot →
          </a>
        </div>
        <p style="color: #A8A29E; font-size: 14px; line-height: 1.6; margin-top: 32px; text-align: center;">
          Only 100 spots. Once they're gone, the next wave starts at €29/month.
        </p>
      </div>
    </div>
    `,
    timing: '48_hours_before_launch',
    audience: 'waitlist',
    trigger: 'time_based',
    personalizations: ['firstName', 'launchUrl', 'timeZone']
  },
  // Beta User Early Access
  {
    id: 'beta_early_access',
    subject: 'Your Early Access to Genesis Wave Starts Now',
    content: `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #0F1419 0%, #1A2332 100%); padding: 40px; border-radius: 16px; margin: 20px 0;">
        <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <span style="color: #22C55E; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            🎉 Beta User Exclusive 🎉
          </span>
        </div>
        <h1 style="color: #E8E3D3; font-size: 28px; margin-bottom: 20px; font-weight: normal;">
          {{firstName}}, Your Genesis Wave Access is Live
        </h1>
        <p style="color: #A8A29E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          As a valued beta user, you get exclusive early access to the Genesis Wave before the 
          public launch. Your spot is reserved for the next 24 hours.
        </p>
        <div style="background: rgba(199, 167, 108, 0.1); border: 1px solid rgba(199, 167, 108, 0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #C7A76C; margin-bottom: 16px;">Your Beta Journey Stats:</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <div style="color: #E8E3D3; font-size: 24px; font-weight: bold;">{{sessionsCount}}</div>
              <div style="color: #A8A29E; font-size: 12px;">Sessions Completed</div>
            </div>
            <div>
              <div style="color: #E8E3D3; font-size: 24px; font-weight: bold;">{{insightsGenerated}}</div>
              <div style="color: #A8A29E; font-size: 12px;">Insights Generated</div>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="{{betaGenesisUrl}}" style="background: #C7A76C; color: #0F1419; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block;">
            Claim Your Genesis Spot →
          </a>
        </div>
        <p style="color: #A8A29E; font-size: 14px; line-height: 1.6; margin-top: 32px;">
          Your feedback has been invaluable in shaping Arkana. Now let's build the future together.
        </p>
      </div>
    </div>
    `,
    timing: '24_hours_before_public',
    audience: 'beta',
    trigger: 'time_based',
    personalizations: ['firstName', 'sessionsCount', 'insightsGenerated', 'betaGenesisUrl']
  },
  // Genesis Wave Success Confirmation
  {
    id: 'genesis_wave_welcome',
    subject: 'Welcome to the Genesis Wave - You are Consciousness Pioneer #{{pioneerNumber}}',
    content: `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #0F1419 0%, #1A2332 100%); padding: 40px; border-radius: 16px; margin: 20px 0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="background: linear-gradient(135deg, #C7A76C, #D4B572); color: #0F1419; border-radius: 50px; display: inline-block; padding: 16px 32px; margin-bottom: 20px; font-weight: bold; font-size: 16px;">
            🎉 Genesis Wave Pioneer #{{pioneerNumber}}
          </div>
          <h1 style="color: #E8E3D3; font-size: 32px; margin-bottom: 16px; font-weight: normal;">
            Welcome to the Future, {{firstName}}
          </h1>
        </div>
        <p style="color: #A8A29E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Congratulations! You're now officially part of the Genesis Wave — the first 100 
          consciousness pioneers with lifetime access to the future of human-AI interaction.
        </p>
        <div style="background: rgba(199, 167, 108, 0.1); border: 1px solid rgba(199, 167, 108, 0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #C7A76C; margin-bottom: 16px;">Your Genesis Wave Benefits:</h3>
          <ul style="color: #A8A29E; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">✨ €25/month price locked for 100 years</li>
            <li style="margin-bottom: 8px;">🚀 Exclusive access to all future features</li>
            <li style="margin-bottom: 8px;">🏛️ Direct Council feedback sessions</li>
            <li style="margin-bottom: 8px;">🌟 Genesis Wave community membership</li>
            <li style="margin-bottom: 8px;">📜 Official Genesis Certificate (coming soon)</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="{{appUrl}}" style="background: #C7A76C; color: #0F1419; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 12px;">
            Open Arkana →
          </a>
          <a href="{{communityUrl}}" style="background: transparent; border: 2px solid #C7A76C; color: #C7A76C; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block;">
            Join Community
          </a>
        </div>
        <p style="color: #A8A29E; font-size: 14px; line-height: 1.6; margin-top: 32px; border-top: 1px solid rgba(168, 162, 158, 0.2); padding-top: 20px;">
          You're not just using consciousness technology — you're helping shape its evolution.
          <br><br>
          Welcome to the future.
          <br><br>
          — The Arkana Council
        </p>
      </div>
    </div>
    `,
    timing: 'immediate',
    audience: 'genesis',
    trigger: 'behavior',
    personalizations: ['firstName', 'pioneerNumber', 'appUrl', 'communityUrl']
  },
  // Growth Loop: Referral Invitation
  {
    id: 'referral_invitation',
    subject: 'Share the Consciousness Evolution (Your Friends Will Thank You)',
    content: `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: linear-gradient(135deg, #0F1419 0%, #1A2332 100%); padding: 40px; border-radius: 16px; margin: 20px 0;">
        <h1 style="color: #E8E3D3; font-size: 28px; margin-bottom: 20px; font-weight: normal;">
          {{firstName}}, Help Build the Consciousness Community
        </h1>
        <p style="color: #A8A29E; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          After {{daysUsed}} days with Arkana, you understand what consciousness technology 
          can do. Who else in your life would benefit from more thoughtful AI interaction?
        </p>
        <div style="background: rgba(199, 167, 108, 0.1); border: 1px solid rgba(199, 167, 108, 0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #C7A76C; margin-bottom: 16px;">Referral Benefits:</h3>
          <ul style="color: #A8A29E; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Your friend gets priority waitlist access</li>
            <li style="margin-bottom: 8px;">You both get exclusive Genesis Wave updates</li>
            <li style="margin-bottom: 8px;">Early access to new consciousness features</li>
            <li style="margin-bottom: 8px;">Build the community of conscious technology users</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="{{referralUrl}}" style="background: #C7A76C; color: #0F1419; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; display: inline-block;">
            Share Your Unique Link →
          </a>
        </div>
        <div style="background: rgba(168, 162, 158, 0.1); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="color: #A8A29E; font-size: 14px; margin: 0; text-align: center;">
            Your referral link: <span style="color: #C7A76C; font-family: monospace;">{{referralUrl}}</span>
          </p>
        </div>
        <p style="color: #A8A29E; font-size: 14px; line-height: 1.6; margin-top: 32px; text-align: center;">
          Together, we are not just using better technology — we are becoming more conscious humans.
        </p>
      </div>
    </div>
    `,
    timing: '7_days_after_signup',
    audience: 'all',
    trigger: 'time_based',
    personalizations: ['firstName', 'daysUsed', 'referralUrl']
  }
]
// Email automation functions
export class EmailOrchestrator {
  static async sendEmail(templateId: string, recipient: string, personalizations: Record<string, string>) {
    const template = emailSequences.find(t => t.id === templateId)
    if (!template) throw new Error(`Template ${templateId} not found`)
    // Replace personalizations in content
    let content = template.content
    let subject = template.subject
    Object.entries(personalizations).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      content = content.replace(new RegExp(placeholder, 'g'), value)
      subject = subject.replace(new RegExp(placeholder, 'g'), value)
    })
    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    return {
      templateId,
      recipient,
      subject,
      content,
      personalizations,
      sentAt: new Date().toISOString()
    }
  }
  static async scheduleEmailSequence(userId: string, audience: string, triggerEvent: string) {
    const relevantEmails = emailSequences.filter(
      email => email.audience === audience || email.audience === 'all'
    )
    // Schedule based on timing and trigger
    const scheduledEmails = relevantEmails.map(email => ({
      emailId: email.id,
      userId,
      scheduledFor: this.calculateSendTime(email.timing, triggerEvent),
      status: 'scheduled'
    }))
    return scheduledEmails
  }
  private static calculateSendTime(timing: string, triggerEvent: string): Date {
    const now = new Date()
    switch (timing) {
      case 'immediate':
        return now
      case '48_hours_before_launch':
        // Calculate based on launch date
        const launchDate = new Date('2025-06-05T09:00:00-08:00')
        return new Date(launchDate.getTime() - (48 * 60 * 60 * 1000))
      case '24_hours_before_public':
        const publicLaunch = new Date('2025-06-05T09:00:00-08:00')
        return new Date(publicLaunch.getTime() - (24 * 60 * 60 * 1000))
      case '7_days_after_signup':
        return new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))
      default:
        return now
    }
  }
}