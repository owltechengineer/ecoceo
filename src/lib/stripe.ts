import Stripe from 'stripe';
import {
  createDynamicShippingOptions,
  calculateOrderWeight,
} from './dynamicShipping';

// Stripe configuration
export const stripeConfig = {
  apiVersion: '2024-06-20' as const,
  currency: 'eur',
  allowedCountries: ['IT', 'US', 'CA', 'GB', 'DE', 'FR', 'ES'],
  freeShippingThreshold: 50, // €50 for free shipping
};

// Initialize Stripe instance
let stripeInstance: Stripe | null = null;

export const getStripeInstance = (): Stripe | null => {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is not defined');
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: stripeConfig.apiVersion,
    });
  }

  return stripeInstance;
};

// Helper function to convert euros to cents
export const eurosToCents = (euros: number): number => {
  return Math.round(euros * 100);
};

// Helper function to convert cents to euros
export const centsToEuros = (cents: number): number => {
  return cents / 100;
};

// Helper function to format price for display
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

// Helper function to create packaging fees (0.5% of order total, minimum €2)
export const calculatePackagingFee = (orderTotal: number): number => {
  const packagingPercentage = 0.005; // 0.5%
  const minimumFee = 2.00; // €2.00 minimum
  
  const calculatedFee = orderTotal * packagingPercentage;
  return Math.max(calculatedFee, minimumFee);
};

// Helper function to create line items with packaging fees
export const createLineItemsWithPackaging = (items: any[], orderTotal: number) => {
  const lineItems = items.map((item: any) => {
    // Safely get image URL - support both Sanity and Stripe products
    let imageUrl = '';
    try {
      if (item.product.mainImage) {
        // Sanity product - using Sanity CDN
        imageUrl = item.product.mainImage;
        // Validate that it's a proper URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = '';
        }
      } else if (item.product.images && item.product.images.length > 0) {
        // Stripe product
        imageUrl = item.product.images[0];
        // Validate that it's a proper URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = '';
        }
      }
    } catch (error) {
      console.error('Error processing image for product:', item.product.name || item.product.title, error);
      imageUrl = '';
    }

    // Support both Sanity and Stripe product formats
    const productName = item.product.name || item.product.title;
    const productPrice = item.product.price?.unit_amount || item.product.price;

    return {
      price_data: {
        currency: stripeConfig.currency,
        product_data: {
          name: productName,
          images: imageUrl ? [imageUrl] : [],
        },
        unit_amount: typeof productPrice === 'number' ? productPrice : eurosToCents(productPrice),
      },
      quantity: item.quantity,
    };
  });

  // Add packaging fee
  const packagingFee = calculatePackagingFee(orderTotal);
  lineItems.push({
    price_data: {
      currency: stripeConfig.currency,
      product_data: {
        name: 'Spese di Imballo',
        description: `0.5% del valore ordine (minimo €2.00)`,
      },
      unit_amount: eurosToCents(packagingFee),
    },
    quantity: 1,
  });

  return lineItems;
};

// Helper function to create shipping options with dynamic calculation
export const createShippingOptions = (items: any[] = [], orderTotal: number = 0, country: string = 'IT') => {
  // Use dynamic shipping calculation based on weight and country
  return createDynamicShippingOptions(items, country, orderTotal);
};

// Helper function to validate Stripe configuration
export const validateStripeConfig = () => {
  const errors: string[] = [];
  
  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is not defined');
  }
  
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config: {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    }
  };
};
