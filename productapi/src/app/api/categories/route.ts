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

// GET request - Fetch categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get('per_page') || '100';
    const orderby = searchParams.get('orderby') || 'name';
    const order = searchParams.get('order') || 'asc';

    const response = await fetch(
      `${WOOCOMMERCE_BASE_URL}/products/categories?per_page=${per_page}&orderby=${orderby}&order=${order}`,
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

    const categories = await response.json();
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch categories',
        data: []
      },
      { status: 500 }
    );
  }
}

// POST request - Create category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category name is required'
        },
        { status: 400 }
      );
    }

    // Prepare category data for WooCommerce
    const categoryData: any = {
      name: body.name,
    };

    // Add optional fields if provided
    if (body.description) categoryData.description = body.description;
    if (body.slug) categoryData.slug = body.slug;
    if (body.parent) categoryData.parent = body.parent;

    const response = await fetch(`${WOOCOMMERCE_BASE_URL}/products/categories`, {
      method: 'POST',
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WooCommerce API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const newCategory = await response.json();
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: `Category '${newCategory.name}' created successfully`
    });

  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create category'
      },
      { status: 500 }
    );
  }
}
