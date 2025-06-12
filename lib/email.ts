// Email service using Forward Email (privacy-focused, affordable)
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, from = 'Arkana <hello@arkana.chat>', replyTo } = options;
  try {
    const response = await fetch('https://api.forwardemail.net/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.FORWARD_EMAIL_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        replyTo: replyTo || from
      })
    });
    if (!response.ok) {
      throw new Error(`Email send failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
// Email templates
export const emailTemplates = {
  welcomeToWaitlist: (position: number, waveName: string) => ({
    subject: '✨ Welcome to the Arkana Constellation',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0D0E11 0%, #1a1b1e 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #00C8C8; margin: 0; font-size: 32px; font-weight: 300;">Welcome to Arkana</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 18px; line-height: 1.6;">
            You're <strong style="color: #00C8C8;">#${position}</strong> in line for the ${waveName} wave.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your place in the constellation is secured. We'll notify you the moment your wave opens.
          </p>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="color: #333; margin: 0; font-size: 14px;">
              <strong>Your referral link:</strong><br>
              <code style="background: #e9ecef; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px;">
                https://arkana.chat?ref=${position}
              </code>
            </p>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 40px;">
            — The Arkana Team
          </p>
        </div>
      </div>
    `
  }),
  waveOpening: (waveName: string, spotsRemaining: number, claimUrl: string) => ({
    subject: `🔓 ${waveName} is NOW OPEN - Claim Your Spot`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300;">Your Wave is Open!</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 20px; line-height: 1.6; text-align: center;">
            <strong>${waveName}</strong> is now accepting members
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center;">
            Only <strong style="color: #e11d48;">${spotsRemaining} spots</strong> remaining
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${claimUrl}" style="background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; display: inline-block; font-weight: 500; font-size: 18px;">
              Claim Your Spot Now
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            This link expires in 24 hours
          </p>
        </div>
      </div>
    `
  }),
  purchaseConfirmation: (tier: string, benefits: string[]) => ({
    subject: `🎉 Welcome to Arkana - You're In!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300;">You're Officially ${tier}!</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px;">
          <p style="color: #333; font-size: 18px; line-height: 1.6;">
            Congratulations! You've secured your place in the Arkana ${tier} tier.
          </p>
          <h3 style="color: #333; margin-top: 30px;">Your Benefits:</h3>
          <ul style="color: #666; font-size: 16px; line-height: 1.8;">
            ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
          </ul>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="color: #333; margin: 0; font-size: 14px;">
              <strong>Next Steps:</strong><br>
              1. Download Arkana from your account dashboard<br>
              2. Use your license key to activate<br>
              3. Join our private Discord community
            </p>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 40px;">
            Questions? Reply to this email or visit support.arkana.chat
          </p>
        </div>
      </div>
    `
  })
};