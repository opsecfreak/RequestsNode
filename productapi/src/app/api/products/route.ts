import { NextRequest, NextResponse } from 'next/server';

// WooCommerce API configuration
const WOOCOMMERCE_BASE_URL = 'https://mobiletechspecialists.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || 'your_consumer_key';
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || 'your_consumer_secret';

// Create Basic Auth header
const createAuthHeader = () => {
  const credentials = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

// GET request - Fetch products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';

    const response = await fetch(
      `${WOOCOMMERCE_BASE_URL}/products?page=${page}&per_page=${per_page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': createAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    
    return NextResponse.json({
      success: true,
      data: products,
      message: 'Products fetched successfully'
    });

  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
        data: []
      },
      { status: 500 }
    );
  }
}

// POST request - Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.regular_price) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and regular_price are required fields'
        },
        { status: 400 }
      );
    }

    // Prepare product data for WooCommerce
    const productData = {
      name: body.name,
      type: body.type || 'simple',
      regular_price: body.regular_price.toString(),
      description: body.description || '',
      short_description: body.short_description || '',
      categories: body.categories || [],
      images: body.images || [],
      status: body.status || 'publish'
    };

    const response = await fetch(`${WOOCOMMERCE_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WooCommerce API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const newProduct = await response.json();
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: `Product '${newProduct.name}' created successfully`
    });

  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product'
      },
      { status: 500 }
    );
  }
}
