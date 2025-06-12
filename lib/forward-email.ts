// Forward Email - Privacy-focused email automation ($3/month)
// Better than Resend for privacy-conscious brands like Arkana
interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}
class ForwardEmailClient {
  private apiKey: string;
  private baseUrl = 'https://api.forwardemail.net/v1';
  private defaultFrom = 'Arkana <noreply@arkana.chat>';
  private defaultReplyTo = 'hello@arkana.chat';
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  async send(options: EmailOptions): Promise<any> {
    const { 
      to, 
      subject, 
      html, 
      text, 
      from = this.defaultFrom,
      replyTo,
      cc,
      bcc,
      attachments 
    } = options;
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text: text || this.htmlToText(html || ''),
          reply_to: replyTo || this.defaultReplyTo,
          cc,
          bcc,
          attachments
        })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Email send failed: ${error}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  // Simple HTML to text converter
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
  // Batch send for campaigns
  async sendBatch(recipients: string[], options: Omit<EmailOptions, 'to'>): Promise<any[]> {
    const results: unknown[] = [];
    // Forward Email supports up to 50 recipients per call
    const chunks = this.chunkArray(recipients, 50);
    for (const chunk of chunks) {
      try {
        const result = await this.send({
          ...options,
          to: chunk.join(','),
          bcc: chunk // Use BCC for privacy
        });
        results.push(result);
      } catch (error) {
        results.push({ error, recipients: chunk });
      }
    }
    return results;
  }
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
// Initialize client
export const forwardEmail = new ForwardEmailClient(
  process.env.FORWARD_EMAIL_API_KEY || ''
);
// Email templates with your branding
export const emailTemplates = {
  // Welcome email when someone joins waitlist
  welcomeToWaitlist: (data: {
    name?: string;
    position: number;
    wave: string;
    score: number;
    referralCode: string;
  }) => ({
    subject: `✨ Welcome to Arkana #${data.position}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, system-ui, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #0D0E11 0%, #1a1b1e 100%); padding: 40px; text-align: center; }
          .content { background: #ffffff; padding: 40px; }
          .score-badge { display: inline-block; background: #00C8C8; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #00C8C8; margin: 0; font-weight: 300; font-size: 32px;">
              Welcome to Arkana
            </h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; color: #333;">
              ${data.name ? `Hi ${data.name},` : 'Welcome,'}
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #666;">
              You're <strong style="color: #00C8C8;">#${data.position}</strong> in line for ${data.wave}.
            </p>
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">Your Score:</p>
              <div class="score-badge">${data.score}/100</div>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                ${data.score >= 80 ? 'VIP Status - Expect special treatment 🌟' :
                  data.score >= 60 ? 'Priority Access - You\'re in great position!' :
                  'Keep engaging to improve your score!'}
              </p>
            </div>
            <div style="background: #e8f5f5; border-left: 4px solid #00C8C8; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">Share & Skip the Line:</p>
              <p style="margin: 0; color: #666;">
                Your referral link:<br>
                <code style="background: #f0f0f0; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px;">
                  https://arkana.chat?ref=${data.referralCode}
                </code>
              </p>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                Each friend who joins boosts your score by 2 points!
              </p>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #666;">
              We're building something special, and you're part of it from the beginning.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">
              <a href="https://arkana.chat/unsubscribe?code=${data.referralCode}" style="color: #999; text-decoration: none;">
                Unsubscribe
              </a>
            </p>
            <p style="margin: 0; font-size: 14px;">
              Arkana - Your private AI, entirely on-device
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),
  // VIP personal email from founder
  vipWelcome: (data: {
    name: string;
    device: string;
    score: number;
    position: number;
  }) => ({
    subject: `${data.name}, welcome to Arkana's inner circle`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 40px auto; padding: 20px;">
        <p style="font-size: 18px; line-height: 1.8; color: #333;">
          ${data.name},
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          I noticed you have ${data.device}. You're exactly who I built Arkana for.
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          Your score of ${data.score}/100 puts you in our VIP tier. This means:
        </p>
        <ul style="font-size: 16px; line-height: 1.8; color: #555;">
          <li>Direct access to me (Signal: +1-XXX-XXX-XXXX)</li>
          <li>First access to every feature we build</li>
          <li>Your name in our credits forever</li>
          <li>Input on our roadmap</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          I'd love to hear your story. What made you join so early?
        </p>
        <p style="font-size: 16px; line-height: 1.8; color: #555;">
          —Aristo
        </p>
        <p style="font-size: 14px; line-height: 1.8; color: #999; margin-top: 40px;">
          P.S. Your ${data.device} will run our most advanced models at full speed. 
          Can't wait to see what you build.
        </p>
      </div>
    `
  }),
  // Wave opening notification
  waveOpening: (data: {
    wave: string;
    spotsAvailable: number;
    userScore: number;
    claimUrl: string;
  }) => ({
    subject: `🔓 ${data.wave} is OPEN - ${data.spotsAvailable} spots available`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: system-ui;">
        <div style="background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); padding: 60px 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 36px; font-weight: 300;">
            Your Time Has Come
          </h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 20px; margin: 20px 0 0 0;">
            ${data.wave} is now accepting members
          </p>
        </div>
        <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px;">
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0; color: #92400e; font-weight: 600; font-size: 18px;">
              ⚡ Only ${data.spotsAvailable} spots available
            </p>
            <p style="margin: 10px 0 0 0; color: #92400e;">
              Your score of ${data.userScore} gives you priority access
            </p>
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${data.claimUrl}" style="display: inline-block; background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); color: white; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 600; font-size: 18px;">
              Claim Your Spot Now
            </a>
          </div>
          <p style="text-align: center; color: #999; font-size: 14px;">
            This link expires in 24 hours
          </p>
        </div>
      </div>
    `
  })
};
// Automated email workflows
export async function sendWaitlistWelcome(user: any) {
  try {
    const emailData = emailTemplates.welcomeToWaitlist({
      name: user.name,
      position: user.queue_position,
      wave: user.assigned_wave || 'the next wave',
      score: user.total_score,
      referralCode: user.referral_code
    });
    await forwardEmail.send({
      to: user.email,
      ...emailData
    });
    // If VIP, send personal email too
    if (user.total_score >= 80) {
      const vipData = emailTemplates.vipWelcome({
        name: user.name || 'Friend',
        device: user.device_type?.replace(/_/g, ' ') || 'powerful hardware',
        score: user.total_score,
        position: user.queue_position
      });
      await forwardEmail.send({
        to: user.email,
        from: 'Aristo Vopěnka <aristo@arkana.chat>',
        ...vipData
      });
    }
  } catch (error) {
  }
}
// Wave announcement campaign
export async function announceWaveOpening(wave: string, recipients: unknown[]) {
  const results: unknown[] = [];
  for (const recipient of recipients) {
    try {
      const emailData = emailTemplates.waveOpening({
        wave,
        spotsAvailable: recipient.spots_available,
        userScore: recipient.total_score,
        claimUrl: `https://arkana.chat/claim?token=${recipient.claim_token}`
      });
      await forwardEmail.send({
        to: recipient.email,
        ...emailData
      });
      results.push({ email: recipient.email, success: true });
    } catch (error) {
      results.push({ email: recipient.email, success: false, error });
    }
    // Rate limit: 3 emails per second
    await new Promise(resolve => setTimeout(resolve, 350));
  }
  return results;
}