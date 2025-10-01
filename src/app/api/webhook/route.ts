import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
}) : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Check if Stripe is properly configured
  if (!stripe) {
    console.warn('Stripe non configurato, webhook ignorato');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (endpointSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      // For testing without webhook signature verification
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', checkoutSession.id);
      
      // Handle successful payment
      if (checkoutSession.mode === 'payment') {
        // One-time payment
        await handleSuccessfulPayment(checkoutSession);
      } else if (checkoutSession.mode === 'subscription') {
        // Subscription payment
        await handleSuccessfulSubscription(checkoutSession);
      }
      break;

    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object as Stripe.Subscription;
      console.log('Subscription created:', subscriptionCreated.id);
      await handleSubscriptionCreated(subscriptionCreated);
      break;

    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscriptionUpdated.id);
      await handleSubscriptionUpdated(subscriptionUpdated);
      break;

    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object as Stripe.Subscription;
      console.log('Subscription deleted:', subscriptionDeleted.id);
      await handleSubscriptionDeleted(subscriptionDeleted);
      break;

    case 'customer.subscription.trial_will_end':
      const trialEnding = event.data.object as Stripe.Subscription;
      console.log('Subscription trial ending:', trialEnding.id);
      await handleTrialEnding(trialEnding);
      break;

    case 'invoice.payment_succeeded':
      const invoiceSucceeded = event.data.object as Stripe.Invoice;
      console.log('Invoice payment succeeded:', invoiceSucceeded.id);
      await handleInvoicePaymentSucceeded(invoiceSucceeded);
      break;

    case 'invoice.payment_failed':
      const invoiceFailed = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', invoiceFailed.id);
      await handleInvoicePaymentFailed(invoiceFailed);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Handler functions for different events
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Update order status in your database
    console.log('Processing successful payment for session:', session.id);
    
    // You can access session data like:
    // - session.customer_email
    // - session.metadata (your custom data)
    // - session.amount_total
    // - session.payment_status
    
    // Example: Update order in database
    // await updateOrderStatus(session.metadata.orderNumber, 'paid');
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleSuccessfulSubscription(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing successful subscription for session:', session.id);
    
    // Handle new subscription
    // - Create subscription record in your database
    // - Send welcome email
    // - Grant access to subscription features
    
  } catch (error) {
    console.error('Error handling successful subscription:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('New subscription created:', subscription.id);
    
    // Handle new subscription
    // - Update user subscription status
    // - Grant access to features
    // - Send welcome email
    
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription updated:', subscription.id);
    
    // Handle subscription updates
    // - Update subscription status in database
    // - Handle plan changes
    // - Update user access
    
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('Subscription deleted:', subscription.id);
    
    // Handle subscription cancellation
    // - Update subscription status
    // - Revoke access to features
    // - Send cancellation email
    
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleTrialEnding(subscription: Stripe.Subscription) {
  try {
    console.log('Trial ending for subscription:', subscription.id);
    
    // Handle trial ending
    // - Send reminder email
    // - Update trial status
    
  } catch (error) {
    console.error('Error handling trial ending:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment succeeded:', invoice.id);
    
    // Handle successful recurring payment
    // - Update subscription status
    // - Send payment confirmation
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Invoice payment failed:', invoice.id);
    
    // Handle failed payment
    // - Send payment failure notification
    // - Update subscription status
    // - Implement retry logic
    
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}
