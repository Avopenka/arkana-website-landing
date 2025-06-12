// Missing Email Templates for Arkana
// These templates need to be implemented and integrated

import { EMAIL_CONFIG, wrapEmailTemplate } from './email-config';

export const missingEmailTemplates = {
  // Authentication & Security Templates
  passwordReset: (data: { name: string; resetUrl: string; expiryHours: number }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.support.replyTo,
    subject: 'Reset Your Arkana Password',
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <h1 style="color: #1f2937; margin-bottom: 30px;">Password Reset Request</h1>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Hi ${data.name || 'there'},
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          We received a request to reset your Arkana password. Click the button below to choose a new password:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.resetUrl}" style="background: #00C8C8; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          This link expires in ${data.expiryHours} hours. If you didn't request this reset, you can safely ignore this email.
        </p>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          If the button doesn't work, copy and paste this link: ${data.resetUrl}
        </p>
      </div>
    `, { category: 'transactional' })
  }),

  emailVerification: (data: { name: string; verifyUrl: string }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.support.replyTo,
    subject: 'Verify Your Arkana Email Address',
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <h1 style="color: #1f2937; margin-bottom: 30px;">Verify Your Email</h1>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Welcome to Arkana, ${data.name || 'seeker'}!
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Please verify your email address to complete your account setup:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.verifyUrl}" style="background: #00C8C8; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          If the button doesn't work, copy and paste this link: ${data.verifyUrl}
        </p>
      </div>
    `, { category: 'transactional' })
  }),

  // Payment & Subscription Templates
  paymentConfirmation: (data: {
    name: string;
    amount: string;
    currency: string;
    tier: string;
    transactionId: string;
    invoiceUrl: string;
  }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.support.replyTo,
    subject: `Payment Confirmed - Welcome to ${data.tier}!`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #059669; margin: 0; font-size: 32px;">Payment Confirmed ✓</h1>
        </div>
        
        <p style="font-size: 18px; color: #1f2937;">
          Hi ${data.name},
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Your payment has been successfully processed. Welcome to ${data.tier}!
        </p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <h3 style="margin: 0 0 16px 0; color: #166534;">Payment Details</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #4b5563;">Amount:</span>
            <strong style="color: #1f2937;">${data.currency}${data.amount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #4b5563;">Tier:</span>
            <strong style="color: #1f2937;">${data.tier}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #4b5563;">Transaction ID:</span>
            <code style="color: #1f2937; font-size: 12px;">${data.transactionId}</code>
          </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.invoiceUrl}" style="background: #00C8C8; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 16px;">
            Download Invoice
          </a>
          <a href="https://app.arkana.chat" style="background: #f3f4f6; color: #1f2937; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Open Arkana
          </a>
        </div>
      </div>
    `, { category: 'transactional' })
  }),

  subscriptionRenewal: (data: {
    name: string;
    tier: string;
    renewalDate: string;
    amount: string;
    manageUrl: string;
  }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.support.replyTo,
    subject: `Your ${data.tier} subscription renews tomorrow`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <h1 style="color: #1f2937; margin-bottom: 30px;">Subscription Renewal Notice</h1>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Hi ${data.name},
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Your ${data.tier} subscription will automatically renew on ${data.renewalDate} for ${data.amount}.
        </p>
        
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; color: #92400e; font-weight: 600;">
            💡 No action needed - we'll charge your saved payment method
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.manageUrl}" style="background: #00C8C8; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Manage Subscription
          </a>
        </div>
      </div>
    `, { category: 'product' })
  }),

  // Wave System Templates
  waveOpening: (data: {
    name: string;
    waveName: string;
    spotsLeft: number;
    claimUrl: string;
    expiryHours: number;
  }) => ({
    from: `${EMAIL_CONFIG.senders.noreply.name} <${EMAIL_CONFIG.senders.noreply.address}>`,
    replyTo: EMAIL_CONFIG.senders.noreply.replyTo,
    subject: `🚀 ${data.waveName} is NOW OPEN - ${data.spotsLeft} spots left`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #00C8C8; margin: 0; font-size: 36px; font-weight: 300;">
            ${data.waveName} is Open!
          </h1>
          <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 50px; display: inline-block; padding: 12px 24px; margin-top: 20px;">
            <span style="color: #dc2626; font-weight: 600; font-size: 18px;">
              ⚡ Only ${data.spotsLeft} spots remaining
            </span>
          </div>
        </div>
        
        <p style="font-size: 18px; color: #1f2937; text-align: center;">
          ${data.name}, your moment has arrived.
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6; text-align: center;">
          You've been selected for ${data.waveName} based on your waitlist position and score. 
          This opportunity expires in ${data.expiryHours} hours.
        </p>
        
        <div style="text-align: center; margin: 50px 0;">
          <a href="${data.claimUrl}" style="background: linear-gradient(135deg, #00C8C8 0%, #0891b2 100%); color: white; text-decoration: none; padding: 20px 50px; border-radius: 50px; font-weight: 600; font-size: 20px; display: inline-block; box-shadow: 0 10px 25px rgba(0, 200, 200, 0.3);">
            Claim Your Spot Now →
          </a>
        </div>
        
        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 30px 0;">
          <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
            ⏰ This exclusive access expires at: ${new Date(Date.now() + data.expiryHours * 60 * 60 * 1000).toLocaleString()}
          </p>
        </div>
      </div>
    `, { category: 'product' })
  }),

  // Beta Management Templates
  betaAccessGranted: (data: {
    name: string;
    betaCode: string;
    downloadUrl: string;
    communityUrl: string;
  }) => ({
    from: `${EMAIL_CONFIG.senders.founder.name} <${EMAIL_CONFIG.senders.founder.address}>`,
    replyTo: EMAIL_CONFIG.senders.founder.replyTo,
    subject: `🎉 You're in! Arkana Beta Access Granted`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 32px;">Welcome to Arkana Beta!</h1>
          <div style="background: #7c3aed; color: white; border-radius: 8px; display: inline-block; padding: 16px 32px; margin-top: 20px; font-family: monospace; font-size: 18px; letter-spacing: 2px;">
            ${data.betaCode}
          </div>
        </div>
        
        <p style="font-size: 18px; color: #1f2937;">
          ${data.name}, you're officially part of the inner circle.
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Your beta access code is above. Here's how to get started:
        </p>
        
        <ol style="font-size: 16px; color: #4b5563; line-height: 1.8; padding-left: 20px;">
          <li>Download Arkana using the link below</li>
          <li>Enter your beta code: <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${data.betaCode}</code></li>
          <li>Complete the EQ calibration</li>
          <li>Join our private beta community</li>
        </ol>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.downloadUrl}" style="background: #7c3aed; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; margin-right: 16px;">
            Download Arkana
          </a>
          <a href="${data.communityUrl}" style="background: #f3f4f6; color: #1f2937; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Join Beta Community
          </a>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>Remember:</strong> As a beta tester, your feedback shapes Arkana's future. We're counting on your insights.
          </p>
        </div>
      </div>
    `, { 
      footer: 'vip',
      category: 'vip'
    })
  }),

  // Support Templates
  supportTicketConfirmation: (data: {
    name: string;
    ticketId: string;
    subject: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }) => ({
    from: `${EMAIL_CONFIG.senders.support.name} <${EMAIL_CONFIG.senders.support.address}>`,
    replyTo: EMAIL_CONFIG.senders.support.replyTo,
    subject: `Support Ticket #${data.ticketId} - ${data.subject}`,
    html: wrapEmailTemplate(`
      <div style="padding: 40px;">
        <h1 style="color: #1f2937; margin-bottom: 30px;">Support Ticket Created</h1>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Hi ${data.name},
        </p>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          We've received your support request and created ticket #${data.ticketId}.
        </p>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #6b7280;">Ticket ID:</span>
            <code style="color: #1f2937;">#${data.ticketId}</code>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #6b7280;">Subject:</span>
            <span style="color: #1f2937;">${data.subject}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">Priority:</span>
            <span style="color: ${data.priority === 'urgent' ? '#dc2626' : data.priority === 'high' ? '#ea580c' : data.priority === 'medium' ? '#ca8a04' : '#16a34a'}; text-transform: capitalize; font-weight: 600;">
              ${data.priority}
            </span>
          </div>
        </div>
        
        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
          Expected response time: ${data.priority === 'urgent' ? '2 hours' : data.priority === 'high' ? '8 hours' : '24 hours'}
        </p>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 30px;">
          To add more information to this ticket, simply reply to this email.
        </p>
      </div>
    `, { category: 'transactional' })
  })
};

// Automation Sequence Templates
export const automationSequences = {
  onboarding: [
    {
      day: 0,
      template: 'welcomeToWaitlist',
      trigger: 'signup'
    },
    {
      day: 3,
      template: 'gettingStarted',
      trigger: 'time_based'
    },
    {
      day: 7,
      template: 'advancedFeatures',
      trigger: 'time_based'
    },
    {
      day: 14,
      template: 'communityInvitation',
      trigger: 'time_based'
    },
    {
      day: 30,
      template: 'feedbackRequest',
      trigger: 'time_based'
    }
  ],
  retention: [
    {
      day: 30,
      template: 'checkIn',
      trigger: 'inactivity'
    },
    {
      day: 60,
      template: 'winBack',
      trigger: 'inactivity'
    },
    {
      day: 90,
      template: 'finalAttempt',
      trigger: 'inactivity'
    }
  ]
};