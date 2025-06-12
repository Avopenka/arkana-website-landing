import Stripe from 'stripe';
// Initialize Stripe with proper error handling for build time
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
      typescript: true,
    })
  : null as any;
// Story-driven 8-wave system with proper tier names
export const STRIPE_PRICES = {
  'Codex Founders': process.env.STRIPE_PRICE_CODEX || '',
  'Sage Advisors': process.env.STRIPE_PRICE_SAGES || '',
  'Oracle Prophets': process.env.STRIPE_PRICE_ORACLES || '',
  'Guardian Protectors': process.env.STRIPE_PRICE_GUARDIANS || '',
  'Scholar Researchers': process.env.STRIPE_PRICE_SCHOLARS || '',
  'Apprentice Learners': process.env.STRIPE_PRICE_APPRENTICES || '',
  'Seeker Explorers': process.env.STRIPE_PRICE_SEEKERS || '',
  'Access Members': process.env.STRIPE_PRICE_ACCESS || '',
} as const;
// Legacy exports for backward compatibility
export const LEGACY_STRIPE_PRICES = {
  CODEX: process.env.STRIPE_PRICE_CODEX || '',
  SAGES: process.env.STRIPE_PRICE_SAGES || '',
  ORACLES: process.env.STRIPE_PRICE_ORACLES || '',
  GUARDIANS: process.env.STRIPE_PRICE_GUARDIANS || '',
  SCHOLARS: process.env.STRIPE_PRICE_SCHOLARS || '',
  APPRENTICES: process.env.STRIPE_PRICE_APPRENTICES || '',
  SEEKERS: process.env.STRIPE_PRICE_SEEKERS || '',
  ACCESS: process.env.STRIPE_PRICE_ACCESS || '',
} as const;
export const FOUNDERS_SEAT_LIMIT = parseInt(process.env.FOUNDERS_SEAT_LIMIT || '500');
export async function getFoundersSeatCount(): Promise<number> {
  try {
    // Get count for Codex (first wave) as this is our primary early access tier
    const subscriptions = await stripe.subscriptions.list({
      price: STRIPE_PRICES['Codex Founders'],
      status: 'active',
      limit: 1000,
    });
    return subscriptions.data.length;
  } catch (error) {
    return 0;
  }
}
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}