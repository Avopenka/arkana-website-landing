import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

// Initialize Stripe only if credentials are available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil',
  })
}

const getWebhookSecret = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook secret not configured')
  }
  return process.env.STRIPE_WEBHOOK_SECRET
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    const stripe = getStripe()
    const webhookSecret = getWebhookSecret()
    
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }
    
    let event: Stripe.Event
    
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', (err as Error)?.message || err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.Invoice)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    // Log webhook event
    await logWebhookEvent(event)
    
    return NextResponse.json({ received: true })
    
  } catch (error: unknown) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
  
  } catch (configError: unknown) {
    console.error('Stripe configuration error:', configError)
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Implementation
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // Implementation
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  // Implementation
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  // Implementation
}

async function logWebhookEvent(event: Stripe.Event) {
  const { supabase } = await import('@/lib/supabase')
  
  await supabase.from('webhook_logs').insert({
    service: 'stripe',
    event_type: event.type,
    event_id: event.id,
    payload: event,
    processed_at: new Date().toISOString()
  })
}