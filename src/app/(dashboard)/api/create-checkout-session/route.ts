import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance, createLineItemsWithPackaging, createShippingOptions, validateStripeConfig, calculatePackagingFee } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  // Validate Stripe configuration
  const configValidation = validateStripeConfig();
  if (!configValidation.isValid) {
    console.error('Stripe configuration errors:', configValidation.errors);
    return NextResponse.json(
      { error: 'Stripe not configured', details: configValidation.errors },
      { status: 503 }
    );
  }

  const stripe = getStripeInstance();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Failed to initialize Stripe' },
      { status: 500 }
    );
  }

  try {
    const { items, customerEmail, orderNumber, country = 'IT' } = await request.json();
    console.log('Received checkout request:', { items: items?.length, customerEmail, orderNumber });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Calculate order total (before packaging fee)
    const orderTotal = items.reduce((total, item) => {
      const productPrice = typeof item.product.price === 'number' 
        ? item.product.price 
        : (item.product.price?.unit_amount || 0) / 100;
      return total + (productPrice * item.quantity);
    }, 0);

    // Create line items with packaging fees
    const lineItems = createLineItemsWithPackaging(items, orderTotal);

    // Use dynamic base URL
    const origin = request.headers.get('origin') || request.headers.get('host');
    const baseUrl = origin?.startsWith('http') ? origin : `http://${origin}`;
    
    console.log('Creating checkout session with base URL:', baseUrl);
    console.log('Order number:', orderNumber);

    // Prepare session data - only include customer_email if it's valid
    const sessionData: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${orderNumber}`,
      cancel_url: `${baseUrl}/shop/checkout`,
      metadata: {
        orderNumber,
        customerEmail: customerEmail || 'not_provided',
      },
      shipping_address_collection: {
        allowed_countries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES'],
      },
      shipping_options: createShippingOptions(items, orderTotal * 100, country), // Convert to cents
    };

    // Only add customer_email if it's a valid email
    if (customerEmail && customerEmail.trim() && customerEmail.includes('@')) {
      sessionData.customer_email = customerEmail.trim();
    }

    console.log('Customer email validation:', { 
      original: customerEmail, 
      isValid: !!(customerEmail && customerEmail.trim() && customerEmail.includes('@')),
      willInclude: !!(customerEmail && customerEmail.trim() && customerEmail.includes('@'))
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionData);

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
