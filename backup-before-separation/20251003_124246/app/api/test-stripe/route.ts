import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    // Check if Stripe key is available
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        status: 'error',
        message: 'STRIPE_SECRET_KEY is not defined',
        config: {
          hasSecretKey: false,
          hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        }
      }, { status: 500 });
    }

    // Test Stripe connection
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });

    // Try to list products to test connection
    const products = await stripe.products.list({ limit: 1 });

    return NextResponse.json({
      status: 'success',
      message: 'Stripe is configured correctly',
      config: {
        hasSecretKey: true,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        apiVersion: '2025-07-30.basil',
        productsCount: products.data.length,
      },
      test: {
        products: products.data.map(p => ({ id: p.id, name: p.name }))
      }
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Stripe connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      }
    }, { status: 500 });
  }
}
