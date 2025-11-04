import { NextRequest, NextResponse } from 'next/server';
import { stripeProductService } from '@/services/stripeProductService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let products;

    if (featured === 'true') {
      products = await stripeProductService.getFeaturedProducts();
    } else if (category) {
      products = await stripeProductService.getProductsByCategory(category);
    } else if (search) {
      products = await stripeProductService.searchProducts(search);
    } else {
      products = await stripeProductService.getAllProducts();
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    
    const product = await stripeProductService.createProduct(productData);
    
    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
