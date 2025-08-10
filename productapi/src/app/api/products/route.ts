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
    const productData: any = {
      name: body.name,
      type: body.type || 'simple',
      regular_price: body.regular_price.toString(),
      status: body.status || 'publish'
    };

    // Add optional fields if provided
    if (body.sale_price) productData.sale_price = body.sale_price.toString();
    if (body.description) productData.description = body.description;
    if (body.short_description) productData.short_description = body.short_description;
    if (body.sku) productData.sku = body.sku;
    if (body.weight) productData.weight = body.weight.toString();
    
    // Handle stock management
    if (body.manage_stock !== undefined) {
      productData.manage_stock = body.manage_stock;
      if (body.manage_stock && body.stock_quantity !== undefined) {
        productData.stock_quantity = body.stock_quantity;
      }
    }
    
    if (body.stock_status) productData.stock_status = body.stock_status;

    // Handle dimensions
    const dimensions: any = {};
    if (body.length) dimensions.length = body.length.toString();
    if (body.width) dimensions.width = body.width.toString();
    if (body.height) dimensions.height = body.height.toString();
    
    if (Object.keys(dimensions).length > 0) {
      productData.dimensions = dimensions;
    }

    // Handle categories and images if provided
    if (body.categories) productData.categories = body.categories;
    if (body.images) productData.images = body.images;

    // Handle SEO/RankMath metadata
    const meta_data = [];
    if (body.seo) {
      if (body.seo.title) {
        meta_data.push({
          key: 'rank_math_title',
          value: body.seo.title
        });
      }
      if (body.seo.description) {
        meta_data.push({
          key: 'rank_math_description',
          value: body.seo.description
        });
      }
      if (body.seo.focus_keyword) {
        meta_data.push({
          key: 'rank_math_focus_keyword',
          value: body.seo.focus_keyword
        });
      }
      if (body.seo.keywords) {
        meta_data.push({
          key: 'rank_math_keywords',
          value: body.seo.keywords
        });
      }
    }

    if (meta_data.length > 0) {
      productData.meta_data = meta_data;
    }

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
