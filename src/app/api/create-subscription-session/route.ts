import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
}) : null;

export async function POST(request: NextRequest) {
  // Check if Stripe is properly configured
  if (!stripe) {
    console.warn('Stripe non configurato, subscription session non disponibile');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 400 }
    );
  }

  try {
    const { lookup_key, customerEmail, metadata = {} } = await request.json();

    if (!lookup_key) {
      return NextResponse.json(
        { error: 'Lookup key is required' },
        { status: 400 }
      );
    }

    // Get the price from Stripe using the lookup key
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    if (!prices.data.length) {
      return NextResponse.json(
        { error: 'Price not found' },
        { status: 404 }
      );
    }

    // Create Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      customer_email: customerEmail,
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/subscription/cancel`,
      metadata,
      subscription_data: {
        metadata,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating subscription session:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription session' },
      { status: 500 }
    );
  }
}
