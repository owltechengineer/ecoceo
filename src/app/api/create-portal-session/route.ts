import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
}) : null;

export async function POST(request: NextRequest) {
  // Check if Stripe is properly configured
  if (!stripe) {
    console.warn('Stripe non configurato, portal session non disponibile');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 400 }
    );
  }

  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session to get the customer ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession.customer) {
      return NextResponse.json(
        { error: 'No customer found for this session' },
        { status: 400 }
      );
    }

    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${request.headers.get('origin')}/shop/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
