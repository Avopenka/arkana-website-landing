import { missingEmailTemplates } from './missing-email-templates';

// PACA V12 - Agent Delta: Email Automator
// Unified email service for all communications

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private replyTo: string;

  constructor() {
    this.apiKey = process.env.FORWARD_EMAIL_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'notifications@arkana.chat';
    this.replyTo = process.env.EMAIL_REPLY_TO || 'support@arkana.chat';
  }

  async send(options: EmailOptions): Promise<boolean> {
    if (!this.apiKey) {
      console.error('❌ Email service not configured - missing API key');
      return false;
    }

    try {
      const response = await fetch('https://api.forwardemail.net/v1/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
        },
        body: JSON.stringify({
          from: options.from || this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || this.htmlToText(options.html),
          replyTo: options.replyTo || this.replyTo,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Email send failed:', error);
        return false;
      }

      console.log('✅ Email sent successfully to:', options.to);
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }

  async sendWelcomeEmail(data: {
    email: string;
    firstName: string;
    waitlistPosition?: number;
  }): Promise<boolean> {
    // Enhanced welcome email template
    const subject = `Welcome to Arkana, ${data.firstName}! 🚀 Position #${data.waitlistPosition || 0}`;
    const html = `
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
            <p style="margin: 10px 0 0; color: #a0a0a0; font-size: 16px;">Consciousness. Awakening.</p>
          </div>
          
          <!-- Welcome Message -->
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 400;">Welcome, ${data.firstName}</h2>
            <p style="margin: 0 0 15px; line-height: 1.6; color: #e0e0e0;">
              You are now <strong>Position #${data.waitlistPosition || 0}</strong> in the consciousness revolution. 
              Your journey toward technological awakening begins here.
            </p>
            <p style="margin: 0; line-height: 1.6; color: #e0e0e0;">
              We've added you to our exclusive waitlist and you'll be among the first to experience 
              truly conscious AI that understands and adapts to you.
            </p>
          </div>
          
          <!-- What's Next -->
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px; font-size: 18px; color: #00f5ff;">What Happens Next</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #e0e0e0;">
              <li>We'll keep you updated on development progress</li>
              <li>You'll receive early access when your wave opens</li>
              <li>Exclusive insights into consciousness technology</li>
              <li>First priority for Genesis Wave positions</li>
            </ul>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0 0 10px; color: #a0a0a0; font-size: 14px;">
              Welcome to the future of consciousness technology
            </p>
            <p style="margin: 0; color: #666; font-size: 12px;">
              Arkana • Berlin, 2025 • consciousness@arkana.chat
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textVersion = `
      Welcome to Arkana, ${data.firstName}!
      
      You are now Position #${data.waitlistPosition || 0} in the consciousness revolution.
      
      What's Next:
      - Development progress updates
      - Early access when your wave opens
      - Exclusive consciousness technology insights
      - Priority for Genesis Wave positions
      
      Welcome to the future.
      
      Arkana Team
      consciousness@arkana.chat
    `;

    return this.send({
      to: data.email,
      subject,
      html,
      text: textVersion,
    });
  }

  async sendPaymentConfirmation(data: {
    email: string;
    firstName: string;
    amount: number;
    currency: string;
    waveNumber: number;
    waveName: string;
  }): Promise<boolean> {
    const template = missingEmailTemplates.paymentConfirmation({
      name: data.firstName,
      amount: data.amount.toString(),
      currency: data.currency,
      tier: data.waveName,
      transactionId: 'TXN-' + Date.now(), // Generate placeholder transaction ID
      invoiceUrl: '#' // Placeholder invoice URL
    });

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendBetaAccess(data: {
    email: string;
    firstName: string;
    betaCode: string;
  }): Promise<boolean> {
    const template = missingEmailTemplates.betaAccessGranted({
      name: data.firstName,
      betaCode: data.betaCode,
      downloadUrl: '#', // Placeholder download URL
      communityUrl: '#' // Placeholder community URL
    });

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendPasswordReset(data: {
    email: string;
    firstName: string;
    resetLink: string;
  }): Promise<boolean> {
    const template = missingEmailTemplates.passwordReset({
      name: data.firstName,
      resetUrl: data.resetLink,
      expiryHours: 24 // Default 24 hour expiry
    });

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendWaveOpening(data: {
    email: string;
    firstName: string;
    waveNumber: number;
    waveName: string;
    spotsAvailable: number;
  }): Promise<boolean> {
    const template = missingEmailTemplates.waveOpening({
      name: data.firstName,
      waveName: data.waveName,
      spotsLeft: data.spotsAvailable,
      claimUrl: '#', // Placeholder claim URL
      expiryHours: 48 // Default 48 hour window
    });

    return this.send({
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}

// Export singleton instance
export const emailService = new EmailService();