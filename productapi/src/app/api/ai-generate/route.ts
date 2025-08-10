import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, categories } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a WooCommerce product creation specialist. Your task is to generate comprehensive product information based on user prompts. 

Always respond with a JSON object containing the following structure:
{
  "name": "Product Name",
  "regular_price": "29.99",
  "sale_price": "24.99",
  "sku": "PROD-001",
  "description": "Detailed HTML product description",
  "short_description": "Brief product summary",
  "weight": "1.5",
  "length": "10",
  "width": "5",
  "height": "3",
  "stock_quantity": 100,
  "stock_status": "instock",
  "type": "simple",
  "status": "publish",
  "categories": [{"id": 1, "name": "Category Name"}],
  "seo": {
    "title": "SEO optimized title",
    "description": "Meta description for SEO",
    "keywords": "keyword1, keyword2, keyword3",
    "focus_keyword": "main keyword"
  }
}

Guidelines:
- Create realistic, marketable product information
- Use proper pricing strategies
- Generate compelling descriptions with HTML formatting
- Include relevant SEO metadata
- Suggest appropriate categories from: ${categories?.map((c: any) => c.name).join(', ') || 'Electronics, Clothing, Home & Garden, Sports, Books'}
- Make SKUs unique and meaningful
- Use realistic dimensions and weights
- Ensure descriptions are sales-focused and informative
- Focus keyword should be the main product keyword for SEO
- Meta description should be 150-160 characters`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const productData = JSON.parse(response);
      
      return NextResponse.json({
        success: true,
        data: productData,
        message: 'Product data generated successfully'
      });
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        raw_response: response
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error generating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate product data'
      },
      { status: 500 }
    );
  }
}
