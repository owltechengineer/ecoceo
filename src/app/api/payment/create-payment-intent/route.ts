import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
}) : null;

export async function POST(request: NextRequest) {
  // Check if Stripe is properly configured
  if (!stripe) {
    console.warn('Stripe non configurato, payment intent non disponibile');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 400 }
    );
  }

  try {
    const { amount, currency = 'eur', metadata = {} } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
