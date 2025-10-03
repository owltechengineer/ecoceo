import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if API key is available
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
  });
}

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  try {
    // Debug: Check if Stripe key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not defined');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

    const { items, customerEmail, orderNumber } = await request.json();
    console.log('Received checkout request:', { items: items?.length, customerEmail, orderNumber });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.title,
          images: item.product.mainImage ? [item.product.mainImage] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping cost
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Spese di spedizione',
        },
        unit_amount: 500, // €5.00 in cents
      },
      quantity: 1,
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/shop/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${orderNumber}`,
      cancel_url: `${request.headers.get('origin')}/shop/checkout`,
      customer_email: customerEmail,
      metadata: {
        orderNumber,
        customerEmail,
      },
      shipping_address_collection: {
        allowed_countries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500,
              currency: 'eur',
            },
            display_name: 'Spedizione Standard',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
    });

    console.log('Checkout session created successfully:', session.id);
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url // Return the direct URL
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
