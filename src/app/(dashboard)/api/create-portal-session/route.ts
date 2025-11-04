import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeInstance } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripeInstance();
  
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
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

    // Get origin for return URL
    const origin = request.headers.get('origin') || request.headers.get('host');
    const baseUrl = origin?.startsWith('http') ? origin : `http://${origin}`;

    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: `${baseUrl}/shop/success`,
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
