import { NextResponse } from 'next/server';
import { getStripeInstance, validateStripeConfig } from '@/lib/stripe';

export async function GET() {
  try {
    // Validate Stripe configuration
    const configValidation = validateStripeConfig();
    
    if (!configValidation.isValid) {
      return NextResponse.json({
        status: 'error',
        message: 'Stripe configuration errors',
        errors: configValidation.errors,
        config: configValidation.config
      }, { status: 500 });
    }

    // Test Stripe connection
    const stripe = getStripeInstance();
    if (!stripe) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to initialize Stripe',
        config: configValidation.config
      }, { status: 500 });
    }

    // Try to list products to test connection
    const products = await stripe.products.list({ limit: 1 });

    return NextResponse.json({
      status: 'success',
      message: 'Stripe is configured correctly',
      config: configValidation.config,
      test: {
        products: products.data.map(p => ({ id: p.id, name: p.name })),
        productsCount: products.data.length,
      }
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    const configValidation = validateStripeConfig();
    return NextResponse.json({
      status: 'error',
      message: 'Stripe connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: configValidation.config
    }, { status: 500 });
  }
}
