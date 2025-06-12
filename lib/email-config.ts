// Enhanced Email Configuration for Arkana
// Using noreply@ as sender with hello@ for support

export const EMAIL_CONFIG = {
  // Sender configurations
  senders: {
    // Primary noreply sender for automated emails
    noreply: {
      address: 'noreply@arkana.chat',
      name: 'Arkana',
      replyTo: 'hello@arkana.chat' // All replies go to hello@
    },
    
    // Personal sender for VIP/high-touch emails
    founder: {
      address: 'av@arkana.chat',
      name: 'AV (Arkana Founder)',
      replyTo: 'av@arkana.chat'
    },
    
    // Support email for direct communication
    support: {
      address: 'hello@arkana.chat',
      name: 'Arkana Support',
      replyTo: 'hello@arkana.chat'
    }
  },
  
  // Email footer configurations
  footers: {
    standard: `
      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">
          Questions? Reach us at <a href="mailto:hello@arkana.chat" style="color: #00C8C8; text-decoration: none;">hello@arkana.chat</a>
        </p>
        <p style="margin: 0 0 10px 0;">
          <a href="{unsubscribe_url}" style="color: #9ca3af; text-decoration: none;">Unsubscribe</a> · 
          <a href="https://arkana.chat/privacy" style="color: #9ca3af; text-decoration: none;">Privacy</a>
        </p>
        <p style="margin: 0; font-size: 12px;">
          © 2025 Arkana · Your AI, on your device, forever private
        </p>
      </div>
    `,
    
    minimal: `
      <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
        Arkana · <a href="mailto:hello@arkana.chat" style="color: #9ca3af;">hello@arkana.chat</a> · 
        <a href="{unsubscribe_url}" style="color: #9ca3af;">Unsubscribe</a>
      </p>
    `,
    
    vip: `
      <div style="margin-top: 60px; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 0;">
          You're receiving this because you're in our VIP tier.<br>
          Direct line: <a href="mailto:av@arkana.chat" style="color: #00C8C8;">av@arkana.chat</a>
        </p>
      </div>
    `
  },
  
  // Email categories for unsubscribe management
  categories: {
    waitlist: 'Waitlist updates and launch announcements',
    product: 'Product updates and new features',
    marketing: 'Tips, stories, and Arkana news',
    vip: 'VIP-only communications',
    transactional: 'Account and purchase confirmations'
  }
};

// Updated email template wrapper
export function wrapEmailTemplate(content: string, options: {
  footer?: 'standard' | 'minimal' | 'vip';
  unsubscribeUrl?: string;
  category?: keyof typeof EMAIL_CONFIG.categories;
} = {}) {
  const { 
    footer = 'standard', 
    unsubscribeUrl = 'https://arkana.chat/unsubscribe',
    category = 'waitlist'
  } = options;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 0;
          background-color: #f9fafb;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto;
          background-color: #ffffff;
        }
        @media (max-width: 640px) {
          .container { width: 100% !important; }
          .content { padding: 20px !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
        ${EMAIL_CONFIG.footers[footer].replace('{unsubscribe_url}', `${unsubscribeUrl}?category=${category}`)}
      </div>
    </body>
    </html>
  `;
}

// Enhanced email templates using noreply
export const enhancedEmailTemplates = {
  // Welcome email from noreply with hello@ support
  welcomeToWaitlist: (data: {
    name?: string;
    position: number;
    wave: string;
    score: number;
    referralCode: string;
  }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.noreply.replyTo,
    subject: `Welcome to Arkana - You're #${data.position} 🌙`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #0D0E11 0%, #1a1b1e 100%);">
        <h1 style="color: #00C8C8; margin: 0; font-weight: 300; font-size: 36px;">
          Welcome to the Mystery
        </h1>
      </div>
      
      <div style="padding: 40px;">
        <p style="font-size: 18px; color: #1f2937; margin-bottom: 30px;">
          ${data.name ? `Hello ${data.name},` : 'Welcome, seeker,'}
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          You're <strong style="color: #00C8C8;">#${data.position}</strong> in line for something unprecedented.
        </p>
        
        <div style="background: #f0fdfa; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #99f6e4;">
          <h3 style="margin: 0 0 16px 0; color: #0f766e;">Your Access Score: ${data.score}/100</h3>
          <div style="background: #e6fffa; border-radius: 50px; height: 12px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #00C8C8 0%, #0891b2 100%); height: 100%; width: ${data.score}%;"></div>
          </div>
          <p style="margin: 16px 0 0 0; color: #0f766e; font-size: 14px;">
            ${data.score >= 80 ? '🌟 VIP Status - First access to everything' :
              data.score >= 60 ? '⚡ Priority Access - Great position!' :
              '📈 Keep engaging to improve your score'}
          </p>
        </div>
        
        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 16px 0; color: #1f2937;">Share the Mystery</h3>
          <p style="margin: 0 0 16px 0; color: #4b5563;">
            Each soul you bring into the fold increases your score:
          </p>
          <div style="background: #ffffff; border: 2px dashed #d1d5db; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; word-break: break-all;">
            https://arkana.chat?ref=${data.referralCode}
          </div>
          <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px;">
            +2 points per referral · Unlimited sharing
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
          <p style="color: #6b7280; font-style: italic; font-size: 16px;">
            "The future remembers. The past computes. The present? That's where the magic happens."
          </p>
        </div>
      </div>
    `, { 
      unsubscribeUrl: `https://arkana.chat/unsubscribe?code=${data.referralCode}`,
      category: 'waitlist'
    })
  }),

  // Weekly update email (for your av@ request)
  weeklyThreadUpdate: (data: {
    threadTitle: string;
    threadUrl: string;
    highlights: string[];
    nextWeekHint: string;
  }) => ({
    from: `${EMAIL_CONFIG.senders.founder.name} <${EMAIL_CONFIG.senders.founder.address}>`,
    replyTo: EMAIL_CONFIG.senders.founder.replyTo,
    subject: `This week's mystery: "${data.threadTitle}"`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <p style="font-size: 18px; color: #1f2937; line-height: 1.6;">
          Fellow seekers,
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          This week's thread explored <strong>"${data.threadTitle}"</strong>.
        </p>
        
        <div style="background: #f9fafb; border-left: 4px solid #00C8C8; padding: 20px; margin: 30px 0;">
          <p style="margin: 0 0 16px 0; color: #1f2937; font-weight: 600;">Key revelations:</p>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            ${data.highlights.map(h => `<li style="margin-bottom: 8px;">${h}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.threadUrl}" style="display: inline-block; background: #0D0E11; color: #00C8C8; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600;">
            Read the Full Thread
          </a>
        </div>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Next week: <em>${data.nextWeekHint}</em>
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-top: 40px;">
          Until the next revelation,<br>
          —AV
        </p>
      </div>
    `, { 
      footer: 'vip',
      category: 'marketing'
    })
  }),

  // Transactional purchase confirmation
  purchaseConfirmation: (data: {
    name: string;
    tier: string;
    amount: string;
    accessUrl: string;
  }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.support.replyTo,
    subject: `Welcome to ${data.tier}, ${data.name} ✨`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #00C8C8; margin: 0; font-size: 32px; font-weight: 300;">
            Transaction Complete
          </h1>
        </div>
        
        <div style="background: #f0fdfa; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; color: #0f766e;">Order Details</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #4b5563;">Tier:</span>
            <strong style="color: #1f2937;">${data.tier}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #4b5563;">Amount:</span>
            <strong style="color: #1f2937;">${data.amount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #4b5563;">Status:</span>
            <strong style="color: #059669;">Active</strong>
          </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.accessUrl}" style="display: inline-block; background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); color: white; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: 600; font-size: 18px;">
            Access Arkana Now
          </a>
        </div>
        
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          Need help? Reach us at <a href="mailto:hello@arkana.chat" style="color: #00C8C8;">hello@arkana.chat</a>
        </p>
      </div>
    `, { 
      footer: 'minimal',
      category: 'transactional'
    })
  })
};