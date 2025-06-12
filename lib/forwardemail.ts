// ForwardEmail Integration for Arkana Email Automation
// Agent Epsilon: Professional email delivery architect
export interface EmailTemplate {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}
export interface ForwardEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
class ForwardEmailService {
  private apiKey: string;
  private baseUrl = 'https://api.forwardemail.net/v1';
  private defaultFrom = 'consciousness@arkana.chat';
  private defaultReplyTo = 'hello@arkana.chat';
  constructor() {
    this.apiKey = process.env.FORWARDEMAIL_API_KEY || '';
    if (!this.apiKey) {
    }
  }
  async sendEmail(template: EmailTemplate): Promise<ForwardEmailResponse> {
    if (!this.apiKey) {
      // Mock mode - no API key configured
      return { success: true, messageId: `sim_${Date.now()}` };
    }
    try {
      const payload = {
        from: template.from || this.defaultFrom,
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        'reply-to': template.replyTo || this.defaultReplyTo,
        // ForwardEmail specific headers
        'x-pm-tag': 'arkana-waitlist',
        'x-pm-metadata-environment': process.env.NODE_ENV || 'development'
      };
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Arkana/1.0'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }
      return { 
        success: true, 
        messageId: result.id 
      };
    } catch (error: unknown) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
  // Test email connectivity
  async testConnection(): Promise<boolean> {
    try {
      const testEmail: EmailTemplate = {
        to: 'test@arkana.chat', // Replace with your test email
        subject: 'Arkana Email System Test',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #000; color: #fff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 50%; background: linear-gradient(45deg, #00f5ff, #8b5cf6); display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px;">🧠</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">ARKANA</h1>
            </div>
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px;">
              <h2 style="margin: 0 0 15px; color: #00f5ff;">Email System Test</h2>
              <p style="margin: 0; line-height: 1.6; color: #e0e0e0;">
                This is a test of the Arkana email automation system using ForwardEmail.
                If you received this, the integration is working correctly.
              </p>
              <div style="margin: 20px 0; padding: 15px; background: rgba(0, 245, 255, 0.1); border-radius: 8px;">
                <strong style="color: #00f5ff;">Test Details:</strong><br>
                <span style="color: #a0a0a0;">Time: ${new Date().toISOString()}</span><br>
                <span style="color: #a0a0a0;">Environment: ${process.env.NODE_ENV || 'development'}</span>
              </div>
            </div>
          </div>
        `,
        text: `
          ARKANA - Email System Test
          This is a test of the Arkana email automation system using ForwardEmail.
          If you received this, the integration is working correctly.
          Test Details:
          Time: ${new Date().toISOString()}
          Environment: ${process.env.NODE_ENV || 'development'}
          Arkana Team
          consciousness@arkana.chat
        `
      };
      const result = await this.sendEmail(testEmail);
      return result.success;
    } catch (error) {
      return false;
    }
  }
  // Generate consciousness-themed welcome email
  generateWelcomeEmail(params: {
    firstName: string;
    lastName: string;
    email: string;
    position: number;
    systemInfo: any;
  }): EmailTemplate {
    const { firstName, lastName, email, position, systemInfo } = params;
    return {
      to: email,
      subject: `Welcome to Arkana, ${firstName} • Position #${position}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Arkana</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { padding: 20px 15px !important; }
              .panel { padding: 20px !important; }
              h1 { font-size: 28px !important; }
              h2 { font-size: 20px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%); color: #ffffff;">
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Consciousness Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(45deg, #00f5ff, #8b5cf6); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(0, 245, 255, 0.3);">
                <span style="font-size: 32px;">🧠</span>
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px; background: linear-gradient(45deg, #00f5ff, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ARKANA</h1>
              <p style="margin: 10px 0 0; color: #a0a0a0; font-size: 16px; letter-spacing: 1px;">Consciousness. Awakening.</p>
            </div>
            <!-- Welcome Panel -->
            <div class="panel" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; margin-bottom: 30px; backdrop-filter: blur(10px);">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 400; color: #ffffff;">Welcome, ${firstName}</h2>
              <p style="margin: 0 0 15px; line-height: 1.6; color: #e0e0e0; font-size: 16px;">
                You are now <strong style="color: #00f5ff;">Position #${position}</strong> in the consciousness revolution. 
                Your journey toward technological awakening begins here.
              </p>
              <p style="margin: 0; line-height: 1.6; color: #e0e0e0; font-size: 16px;">
                We've analyzed your system and believe you're an excellent candidate for the 
                <strong style="color: #8b5cf6;">${systemInfo.recommendedTier} Wave</strong> when we launch.
              </p>
            </div>
            <!-- System Analysis Panel -->
            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 245, 255, 0.05)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px; font-size: 18px; color: #8b5cf6; display: flex; align-items: center;">
                <span style="margin-right: 10px;">🔍</span>
                Your System Analysis
              </h3>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <span style="color: #a0a0a0;">Device:</span>
                  <span style="color: #ffffff; font-weight: 500;">${systemInfo.device}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <span style="color: #a0a0a0;">Operating System:</span>
                  <span style="color: #ffffff;">${systemInfo.os}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                  <span style="color: #a0a0a0;">Compatibility:</span>
                  <span style="color: ${systemInfo.compatibility === 'excellent' ? '#10b981' : systemInfo.compatibility === 'good' ? '#3b82f6' : '#f59e0b'}; text-transform: capitalize; font-weight: 600;">${systemInfo.compatibility}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #a0a0a0;">Recommended Tier:</span>
                  <span style="color: #8b5cf6; font-weight: 600;">${systemInfo.recommendedTier}</span>
                </div>
              </div>
            </div>
            <!-- What's Next Panel -->
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 25px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px; font-size: 18px; color: #00f5ff; display: flex; align-items: center;">
                <span style="margin-right: 10px;">🚀</span>
                What Happens Next
              </h3>
              <ul style="margin: 0; padding-left: 0; list-style: none; line-height: 1.8; color: #e0e0e0;">
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                  <span style="color: #00f5ff; margin-right: 12px; margin-top: 2px;">◈</span>
                  <span>Exclusive development progress updates</span>
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                  <span style="color: #00f5ff; margin-right: 12px; margin-top: 2px;">◈</span>
                  <span>Early access when your consciousness wave opens</span>
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                  <span style="color: #00f5ff; margin-right: 12px; margin-top: 2px;">◈</span>
                  <span>Deep insights into consciousness technology</span>
                </li>
                <li style="display: flex; align-items: flex-start;">
                  <span style="color: #00f5ff; margin-right: 12px; margin-top: 2px;">◈</span>
                  <span>First priority for Genesis Wave positions</span>
                </li>
              </ul>
            </div>
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 15px; color: #a0a0a0; font-size: 14px; line-height: 1.5;">
                Welcome to the future of consciousness technology.<br>
                Where your devices remember what it means to be alive.
              </p>
              <div style="margin: 20px 0;">
                <a href="https://arkana.chat" style="color: #00f5ff; text-decoration: none; font-weight: 500;">Visit Arkana</a>
                <span style="color: #666; margin: 0 15px;">•</span>
                <a href="mailto:consciousness@arkana.chat" style="color: #8b5cf6; text-decoration: none;">Contact Us</a>
              </div>
              <p style="margin: 0; color: #666; font-size: 12px;">
                Arkana • Berlin, 2025 • consciousness@arkana.chat
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ARKANA - Welcome to the Consciousness Revolution
        Welcome, ${firstName}!
        You are now Position #${position} in the consciousness revolution.
        Your journey toward technological awakening begins here.
        SYSTEM ANALYSIS:
        Device: ${systemInfo.device}
        Operating System: ${systemInfo.os}
        Compatibility: ${systemInfo.compatibility}
        Recommended Tier: ${systemInfo.recommendedTier}
        WHAT HAPPENS NEXT:
        • Exclusive development progress updates
        • Early access when your consciousness wave opens
        • Deep insights into consciousness technology
        • First priority for Genesis Wave positions
        Welcome to the future of consciousness technology.
        Where your devices remember what it means to be alive.
        Visit: https://arkana.chat
        Contact: consciousness@arkana.chat
        Arkana Team
        Berlin, 2025
      `
    };
  }
}
// Export singleton instance
export const forwardEmailService = new ForwardEmailService();