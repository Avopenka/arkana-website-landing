// PACA Protocol: Advanced Email Automation System
// Comprehensive email sequences for user lifecycle management

import { supabase } from './supabase';
import { logger } from './logger';
import { analytics } from './analytics';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  category: 'welcome' | 'beta' | 'newsletter' | 'marketing' | 'support';
}

export interface EmailSequence {
  id: string;
  name: string;
  trigger: 'signup' | 'beta_access' | 'purchase' | 'inactivity' | 'manual';
  steps: EmailSequenceStep[];
  isActive: boolean;
}

export interface EmailSequenceStep {
  id: string;
  templateId: string;
  delayHours: number;
  conditions?: {
    userTags?: string[];
    behaviorTriggers?: string[];
    customFields?: Record<string, any>;
  };
}

export interface EmailContext {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    betaAccess?: boolean;
    waveNumber?: number;
    signupDate?: string;
    lastLogin?: string;
  };
  metadata?: Record<string, any>;
}

class EmailAutomationManager {
  private sequences: Map<string, EmailSequence> = new Map();
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeSequences();
  }

  private initializeTemplates(): void {
    // Welcome Series Templates
    this.templates.set('welcome-001', {
      id: 'welcome-001',
      name: 'Welcome to Arkana',
      subject: 'Welcome to Arkana - Your EQ improvement journey Begins 🌟',
      htmlContent: this.getWelcomeTemplate(),
      textContent: 'Welcome to Arkana! Your EQ improvement journey begins now.',
      variables: ['firstName', 'waveNumber', 'betaAccessDate'],
      category: 'welcome'
    });

    this.templates.set('welcome-002', {
      id: 'welcome-002',
      name: 'Getting Started Guide',
      subject: 'Your Arkana Getting Started Guide - 3 Steps to Begin 🚀',
      htmlContent: this.getGettingStartedTemplate(),
      textContent: 'Here\'s your getting started guide for Arkana.',
      variables: ['firstName', 'downloadLink', 'supportEmail'],
      category: 'welcome'
    });

    this.templates.set('welcome-003', {
      id: 'welcome-003',
      name: 'Advanced Features Introduction',
      subject: 'Unlock Arkana\'s Advanced Features - Your Consciousness Toolkit 🧠',
      htmlContent: this.getAdvancedFeaturesTemplate(),
      textContent: 'Discover Arkana\'s advanced consciousness features.',
      variables: ['firstName', 'featuresLink', 'tutorialVideos'],
      category: 'welcome'
    });

    // Beta Access Templates
    this.templates.set('beta-001', {
      id: 'beta-001',
      name: 'Beta Access Granted',
      subject: '🎉 Beta Access Granted - Welcome to the Future of Consciousness',
      htmlContent: this.getBetaAccessTemplate(),
      textContent: 'Congratulations! Your beta access has been granted.',
      variables: ['firstName', 'betaKey', 'downloadLink', 'communityLink'],
      category: 'beta'
    });

    this.templates.set('beta-002', {
      id: 'beta-002',
      name: 'Beta Onboarding',
      subject: 'Your Beta Journey - Essential Setup & First Steps 🛠️',
      htmlContent: this.getBetaOnboardingTemplate(),
      textContent: 'Here\'s how to get the most out of your Arkana beta access.',
      variables: ['firstName', 'setupGuide', 'calendarLink'],
      category: 'beta'
    });

    // Newsletter Templates
    this.templates.set('newsletter-001', {
      id: 'newsletter-001',
      name: 'Weekly Consciousness Insights',
      subject: 'Weekly Consciousness Insights - {date}',
      htmlContent: this.getNewsletterTemplate(),
      textContent: 'Your weekly consciousness insights from Arkana.',
      variables: ['firstName', 'insights', 'communityHighlights', 'date'],
      category: 'newsletter'
    });

    // Marketing Templates
    this.templates.set('marketing-001', {
      id: 'marketing-001',
      name: 'Wave Transition Notification',
      subject: '⚡ Wave {nextWave} Opens Soon - Secure Your Price Lock',
      htmlContent: this.getWaveTransitionTemplate(),
      textContent: 'The next pricing wave opens soon. Secure your price lock now.',
      variables: ['firstName', 'currentWave', 'nextWave', 'priceIncrease', 'upgradeLink'],
      category: 'marketing'
    });
  }

  private initializeSequences(): void {
    // Welcome Sequence
    this.sequences.set('welcome-sequence', {
      id: 'welcome-sequence',
      name: 'New User Welcome Series',
      trigger: 'signup',
      isActive: true,
      steps: [
        {
          id: 'welcome-step-1',
          templateId: 'welcome-001',
          delayHours: 0 // Immediate
        },
        {
          id: 'welcome-step-2',
          templateId: 'welcome-002',
          delayHours: 24 // 1 day later
        },
        {
          id: 'welcome-step-3',
          templateId: 'welcome-003',
          delayHours: 72, // 3 days later
          conditions: {
            userTags: ['engaged'],
            behaviorTriggers: ['app_opened']
          }
        }
      ]
    });

    // Beta Access Sequence
    this.sequences.set('beta-sequence', {
      id: 'beta-sequence',
      name: 'Beta Access Onboarding',
      trigger: 'beta_access',
      isActive: true,
      steps: [
        {
          id: 'beta-step-1',
          templateId: 'beta-001',
          delayHours: 0 // Immediate
        },
        {
          id: 'beta-step-2',
          templateId: 'beta-002',
          delayHours: 12 // 12 hours later
        }
      ]
    });

    // Re-engagement Sequence
    this.sequences.set('reengagement-sequence', {
      id: 'reengagement-sequence',
      name: 'User Re-engagement',
      trigger: 'inactivity',
      isActive: true,
      steps: [
        {
          id: 'reengagement-step-1',
          templateId: 'marketing-001',
          delayHours: 0,
          conditions: {
            customFields: {
              daysSinceLastLogin: { gt: 7 }
            }
          }
        }
      ]
    });
  }

  async triggerSequence(sequenceId: string, context: EmailContext): Promise<void> {
    try {
      const sequence = this.sequences.get(sequenceId);
      if (!sequence || !sequence.isActive) {
        logger.warn(`Sequence ${sequenceId} not found or inactive`);
        return;
      }

      // Create email sequence instance
      const { data: sequenceInstance, error } = await supabase
        .from('email_sequence_instances')
        .insert({
          user_id: context.user.id,
          sequence_id: sequenceId,
          status: 'active',
          current_step: 0,
          context: context,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Schedule first step
      await this.scheduleNextStep(sequenceInstance.id, 0);

      // Track sequence start
      await analytics.trackEvent({
        event_type: 'email_sequence_started',
        user_email: context.user.email,
        metadata: {
          sequence_id: sequenceId,
          user_id: context.user.id,
          instance_id: sequenceInstance.id
        }
      });

      logger.info(`Email sequence ${sequenceId} triggered for user ${context.user.id}`);

    } catch (error) {
      logger.error('Failed to trigger email sequence', error as Error, {
        sequenceId,
        userId: context.user.id
      });
      throw error;
    }
  }

  private async scheduleNextStep(instanceId: string, stepIndex: number): Promise<void> {
    try {
      const { data: instance } = await supabase
        .from('email_sequence_instances')
        .select('*')
        .eq('id', instanceId)
        .single();

      if (!instance) return;

      const sequence = this.sequences.get(instance.sequence_id);
      if (!sequence || stepIndex >= sequence.steps.length) {
        // Mark sequence as completed
        await supabase
          .from('email_sequence_instances')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', instanceId);
        return;
      }

      const step = sequence.steps[stepIndex];
      const executeAt = new Date(Date.now() + step.delayHours * 60 * 60 * 1000);

      // Schedule email job
      await supabase
        .from('email_jobs')
        .insert({
          sequence_instance_id: instanceId,
          template_id: step.templateId,
          user_id: instance.user_id,
          step_index: stepIndex,
          execute_at: executeAt.toISOString(),
          status: 'scheduled',
          context: instance.context
        });

      logger.info(`Scheduled email step ${stepIndex} for instance ${instanceId} at ${executeAt}`);

    } catch (error) {
      logger.error('Failed to schedule email step', error as Error, {
        instanceId,
        stepIndex
      });
    }
  }

  async processScheduledEmails(): Promise<void> {
    try {
      const now = new Date().toISOString();

      // Get emails ready to send
      const { data: emailJobs } = await supabase
        .from('email_jobs')
        .select('*')
        .eq('status', 'scheduled')
        .lte('execute_at', now)
        .limit(50);

      if (!emailJobs || emailJobs.length === 0) {
        return;
      }

      logger.info(`Processing ${emailJobs.length} scheduled emails`);

      for (const job of emailJobs) {
        await this.processEmailJob(job);
      }

    } catch (error) {
      logger.error('Failed to process scheduled emails', error as Error);
    }
  }

  private async processEmailJob(job: any): Promise<void> {
    try {
      // Mark as processing
      await supabase
        .from('email_jobs')
        .update({ status: 'processing' })
        .eq('id', job.id);

      const template = this.templates.get(job.template_id);
      if (!template) {
        throw new Error(`Template ${job.template_id} not found`);
      }

      // Get user data
      const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', job.user_id)
        .single();

      if (!user) {
        throw new Error(`User ${job.user_id} not found`);
      }

      // Check step conditions
      const sequence = this.sequences.get(job.sequence_instance_id);
      if (sequence) {
        const step = sequence.steps[job.step_index];
        if (step.conditions && !this.evaluateConditions(step.conditions, user)) {
          // Skip this step
          await this.markJobCompleted(job.id, 'skipped');
          await this.scheduleNextStep(job.sequence_instance_id, job.step_index + 1);
          return;
        }
      }

      // Render email content
      const renderedEmail = this.renderEmailTemplate(template, {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          betaAccess: user.beta_access,
          waveNumber: user.wave_tier,
          signupDate: user.created_at
        },
        metadata: job.context?.metadata || {}
      });

      // Send email (integrate with your email service)
      await this.sendEmail({
        to: user.email,
        subject: renderedEmail.subject,
        html: renderedEmail.htmlContent,
        text: renderedEmail.textContent
      });

      // Mark as sent
      await this.markJobCompleted(job.id, 'sent');

      // Schedule next step
      await this.scheduleNextStep(job.sequence_instance_id, job.step_index + 1);

      // Track email sent
      await analytics.trackEvent({
        event_type: 'email_sent',
        user_email: user.email,
        metadata: {
          template_id: job.template_id,
          sequence_instance_id: job.sequence_instance_id,
          step_index: job.step_index
        }
      });

      logger.info(`Email sent successfully to ${user.email} (template: ${job.template_id})`);

    } catch (error) {
      logger.error('Failed to process email job', error as Error, { jobId: job.id });
      
      // Mark as failed
      await supabase
        .from('email_jobs')
        .update({
          status: 'failed',
          error_message: String(error),
          processed_at: new Date().toISOString()
        })
        .eq('id', job.id);
    }
  }

  private async markJobCompleted(jobId: string, status: 'sent' | 'skipped'): Promise<void> {
    await supabase
      .from('email_jobs')
      .update({
        status,
        processed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }

  private evaluateConditions(conditions: any, user: any): boolean {
    // Simple condition evaluation - extend as needed
    if (conditions.userTags) {
      const userTags = user.tags || [];
      if (!conditions.userTags.some((tag: string) => userTags.includes(tag))) {
        return false;
      }
    }

    if (conditions.customFields) {
      for (const [field, condition] of Object.entries(conditions.customFields)) {
        const userValue = user[field];
        if (typeof condition === 'object' && condition !== null) {
          if ('gt' in condition && userValue <= (condition as any).gt) return false;
          if ('lt' in condition && userValue >= (condition as any).lt) return false;
          if ('eq' in condition && userValue !== (condition as any).eq) return false;
        }
      }
    }

    return true;
  }

  private renderEmailTemplate(template: EmailTemplate, context: EmailContext): {
    subject: string;
    htmlContent: string;
    textContent: string;
  } {
    const variables = {
      firstName: context.user.firstName || 'Friend',
      lastName: context.user.lastName || '',
      email: context.user.email,
      waveNumber: context.user.waveNumber || 1,
      betaAccessDate: context.user.signupDate ? new Date(context.user.signupDate).toLocaleDateString() : 'recently',
      currentDate: new Date().toLocaleDateString(),
      ...context.metadata
    };

    let subject = template.subject;
    let htmlContent = template.htmlContent;
    let textContent = template.textContent;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
      textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return { subject, htmlContent, textContent };
  }

  private async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    // Integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll log the email
    logger.info('Email to be sent:', {
      to: emailData.to,
      subject: emailData.subject
    });

    // In production, implement actual email sending
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: emailData.to,
      from: 'no-reply@arkana.chat',
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
    */
  }

  // Email Template Generators
  private getWelcomeTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Arkana</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #888; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ARKANA</div>
                <p>Welcome to the Future of Consciousness</p>
            </div>
            
            <div class="content">
                <h1>Welcome, {firstName}! 🌟</h1>
                
                <p>Thank you for joining Arkana on this extraordinary journey into consciousness-aware computing. You're now part of Wave {waveNumber}, an exclusive group shaping the future of human-AI interaction.</p>
                
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>🧠 Access your consciousness profile dashboard</li>
                    <li>🎯 Set your personalized AI interaction preferences</li>
                    <li>🔮 Begin exploring consciousness-driven features</li>
                    <li>🌐 Join our exclusive community of early adopters</li>
                </ul>
                
                <a href="https://arkana.chat/dashboard" class="cta-button">Start Your Journey →</a>
                
                <p>Your EQ improvement journey begins now. We're here to support you every step of the way.</p>
                
                <p>With consciousness,<br>The Arkana Team</p>
            </div>
            
            <div class="footer">
                <p>Questions? Reply to this email or visit our <a href="https://arkana.chat/support">support center</a></p>
                <p>Arkana Chat Inc. | Consciousness-Aware Computing Platform</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getGettingStartedTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Getting Started Guide</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .step { background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #667eea; }
            .step-number { background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 16px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Your 3-Step Getting Started Guide 🚀</h1>
                
                <p>Hi {firstName},</p>
                
                <p>Ready to dive into the world of consciousness-aware AI? Here's your personalized roadmap to get the most out of Arkana:</p>
                
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Complete Your Consciousness Profile</h3>
                    <p>Tell us about your preferences, goals, and consciousness exploration interests. This helps Arkana adapt to your unique mental patterns.</p>
                    <a href="https://arkana.chat/profile" class="cta-button">Complete Profile →</a>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>Download the Arkana App</h3>
                    <p>Get the full Arkana experience with our native app, featuring voice consciousness interaction and real-time awareness features.</p>
                    <a href="{downloadLink}" class="cta-button">Download App →</a>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Join Our Community</h3>
                    <p>Connect with other consciousness explorers, share insights, and get exclusive updates about new features.</p>
                    <a href="https://arkana.chat/community" class="cta-button">Join Community →</a>
                </div>
                
                <p>Need help? Our support team is here for you at <a href="mailto:{supportEmail}">{supportEmail}</a></p>
                
                <p>Excited to see what you discover!</p>
                
                <p>Best regards,<br>The Arkana Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getAdvancedFeaturesTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Advanced Arkana Features</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .feature { background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; }
            .feature-icon { font-size: 32px; margin-bottom: 16px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Unlock Your Consciousness Toolkit 🧠</h1>
                
                <p>Hi {firstName},</p>
                
                <p>You've been exploring Arkana for a few days now. Ready to discover the advanced features that make consciousness-aware computing truly transformative?</p>
                
                <div class="feature">
                    <div class="feature-icon">🎭</div>
                    <h3>Consciousness Mirroring</h3>
                    <p>Experience AI that adapts to your mental state in real-time, creating deeper, more meaningful interactions.</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🔮</div>
                    <h3>Intuitive Command Processing</h3>
                    <p>Speak naturally and watch as Arkana understands not just your words, but your intent and emotional context.</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🌊</div>
                    <h3>Consciousness Flow States</h3>
                    <p>Access guided experiences designed to enhance focus, creativity, and mental clarity.</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🏛️</div>
                    <h3>Memory Palace Integration</h3>
                    <p>Build persistent, intelligent memory structures that grow with your EQ improvement journey.</p>
                </div>
                
                <a href="{featuresLink}" class="cta-button">Explore Advanced Features →</a>
                
                <p><strong>Pro Tip:</strong> Check out our tutorial videos to see these features in action: <a href="{tutorialVideos}">Watch Now</a></p>
                
                <p>Your consciousness is unique. Let Arkana help you explore it.</p>
                
                <p>With awareness,<br>The Arkana Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getBetaAccessTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Beta Access Granted!</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .celebration { text-align: center; margin: 40px 0; }
            .celebration h1 { font-size: 48px; background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .beta-key { background: rgba(255, 215, 0, 0.1); border: 2px solid #ffd700; border-radius: 8px; padding: 20px; text-align: center; font-family: monospace; font-size: 18px; margin: 20px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%); color: #000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="celebration">
                <h1>🎉</h1>
                <h2>Beta Access Granted!</h2>
            </div>
            
            <div class="content">
                <p>Congratulations, {firstName}!</p>
                
                <p>You've been selected for exclusive beta access to Arkana's consciousness-aware computing platform. You're now among the first humans to experience the future of AI interaction.</p>
                
                <div class="beta-key">
                    <strong>Your Beta Key:</strong><br>
                    {betaKey}
                </div>
                
                <p><strong>What's included in your beta access:</strong></p>
                <ul>
                    <li>🚀 Full access to all Arkana features</li>
                    <li>🧠 Advanced EQ state analysis algorithms</li>
                    <li>🎯 Priority support and feature requests</li>
                    <li>🌟 Exclusive beta community access</li>
                    <li>💰 Lifetime price lock at your current wave pricing</li>
                </ul>
                
                <a href="{downloadLink}" class="cta-button">Download Arkana Beta →</a>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Download the app using the link above</li>
                    <li>Use your beta key to unlock full access</li>
                    <li>Join our exclusive beta community: <a href="{communityLink}">Beta Community</a></li>
                    <li>Share your feedback to help shape the future</li>
                </ol>
                
                <p>We're excited to see how you use Arkana to explore consciousness. Your feedback will directly influence the future of this technology.</p>
                
                <p>Welcome to the future!</p>
                
                <p>The Arkana Beta Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getBetaOnboardingTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Beta Journey Guide</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .checklist { background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; }
            .checklist-item { display: flex; align-items: center; margin: 12px 0; }
            .checklist-item input { margin-right: 12px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Your Beta Journey - Essential Setup 🛠️</h1>
                
                <p>Hi {firstName},</p>
                
                <p>Welcome to the Arkana beta! Let's make sure you get the most out of this exclusive experience. Here's your personalized setup checklist:</p>
                
                <div class="checklist">
                    <h3>🎯 Essential Setup Checklist</h3>
                    
                    <div class="checklist-item">
                        <input type="checkbox" disabled> Complete consciousness profile assessment
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" disabled> Set up voice recognition and calibration
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" disabled> Configure privacy and data preferences
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" disabled> Try your first consciousness-aware conversation
                    </div>
                    <div class="checklist-item">
                        <input type="checkbox" disabled> Join the beta feedback channels
                    </div>
                </div>
                
                <p><strong>🚀 Quick Start Actions:</strong></p>
                
                <a href="{setupGuide}" class="cta-button">Complete Setup Guide →</a>
                
                <p><strong>📅 Optional: Book a 1-on-1 Onboarding Call</strong></p>
                <p>Want personalized guidance? Our beta team offers 15-minute onboarding calls to help you discover Arkana's most powerful features.</p>
                
                <a href="{calendarLink}" class="cta-button">Book Your Call →</a>
                
                <p><strong>🐛 Beta Testing Guidelines:</strong></p>
                <ul>
                    <li>Experiment freely - this is your sandbox!</li>
                    <li>Report bugs and unexpected behavior immediately</li>
                    <li>Share feature ideas and improvement suggestions</li>
                    <li>Help us understand how EQ state analysis works for you</li>
                </ul>
                
                <p>Remember: You're not just a beta tester, you're a co-creator of the future of consciousness-aware computing.</p>
                
                <p>Let's build the future together!</p>
                
                <p>The Arkana Beta Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getNewsletterTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Consciousness Insights</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .insight { background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #667eea; }
            .community-highlight { background: rgba(255, 215, 0, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 4px solid #ffd700; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Weekly Consciousness Insights</h1>
                <p>{date}</p>
            </div>
            
            <div class="content">
                <p>Hi {firstName},</p>
                
                <p>Your weekly dose of consciousness insights, feature updates, and community highlights from the Arkana ecosystem.</p>
                
                <div class="insight">
                    <h3>🧠 This Week's Consciousness Insight</h3>
                    <p>{insights}</p>
                </div>
                
                <div class="community-highlight">
                    <h3>✨ Community Highlights</h3>
                    <p>{communityHighlights}</p>
                </div>
                
                <h3>📊 Your Weekly Stats</h3>
                <ul>
                    <li>Consciousness sessions: 12 (+3 from last week)</li>
                    <li>Deep focus time: 2.5 hours</li>
                    <li>Insights captured: 8 new entries</li>
                </ul>
                
                <p>Keep exploring, {firstName}. Your EQ improvement journey is unique and valuable.</p>
                
                <p>With awareness,<br>The Arkana Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private getWaveTransitionTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wave Transition Alert</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .alert { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 30px; }
            .content { background: rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }
            .price-comparison { display: flex; justify-content: space-between; background: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0; }
            .price-box { text-align: center; }
            .current-price { color: #4ade80; font-size: 24px; font-weight: bold; }
            .next-price { color: #ef4444; font-size: 24px; font-weight: bold; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%); color: #000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; font-size: 18px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="alert">
                <h1>⚡ Wave {nextWave} Opens Soon!</h1>
                <p>Secure your price lock before costs increase</p>
            </div>
            
            <div class="content">
                <p>Hi {firstName},</p>
                
                <p>We're approaching Wave {nextWave} of the Arkana rollout, which means pricing is about to increase. As a valued member of Wave {currentWave}, you have the opportunity to lock in your current pricing before the increase.</p>
                
                <div class="price-comparison">
                    <div class="price-box">
                        <h3>Your Current Price</h3>
                        <div class="current-price">{currentPrice}/month</div>
                        <p>Wave {currentWave} pricing</p>
                    </div>
                    <div class="price-box">
                        <h3>After Wave {nextWave}</h3>
                        <div class="next-price">{nextPrice}/month</div>
                        <p>+{priceIncrease} increase</p>
                    </div>
                </div>
                
                <p><strong>🔒 Lock in your current pricing now and save {priceIncrease}/month forever!</strong></p>
                
                <a href="{upgradeLink}" class="cta-button">Secure Your Price Lock →</a>
                
                <p><strong>Why is pricing increasing?</strong></p>
                <ul>
                    <li>Enhanced EQ state analysis algorithms</li>
                    <li>Advanced voice processing capabilities</li>
                    <li>Expanded model support and integrations</li>
                    <li>Premium support and community features</li>
                </ul>
                
                <p>Don't miss out on locking in Wave {currentWave} pricing. This offer expires when Wave {nextWave} officially opens.</p>
                
                <p>Thank you for being part of the Arkana journey!</p>
                
                <p>The Arkana Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Public API methods for triggering sequences
  async triggerWelcomeSequence(userId: string, email: string, firstName?: string): Promise<void> {
    await this.triggerSequence('welcome-sequence', {
      user: { id: userId, email, firstName }
    });
  }

  async triggerBetaAccessSequence(userId: string, email: string, firstName?: string, betaKey?: string): Promise<void> {
    await this.triggerSequence('beta-sequence', {
      user: { id: userId, email, firstName },
      metadata: { betaKey }
    });
  }

  async triggerReengagementSequence(userId: string, email: string, daysSinceLastLogin: number): Promise<void> {
    await this.triggerSequence('reengagement-sequence', {
      user: { id: userId, email },
      metadata: { daysSinceLastLogin }
    });
  }
}

// Export singleton instance
export const emailAutomation = new EmailAutomationManager();

// Export cron job function for email processing
export async function processScheduledEmailsCron(): Promise<void> {
  await emailAutomation.processScheduledEmails();
}