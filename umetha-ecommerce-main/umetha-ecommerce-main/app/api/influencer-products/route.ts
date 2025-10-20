import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get('influencerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('influencer_products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (influencerId) {
      query = query.eq('influencer_id', influencerId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching influencer products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      total: products?.length || 0,
      hasMore: products?.length === limit
    });

  } catch (error) {
    console.error('Error in influencer products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      category_id, 
      stock, 
      sku, 
      images, 
      featured, 
      status, 
      tags, 
      weight, 
      dimensions, 
      seo_title, 
      seo_description, 
      influencer_id 
    } = body;

    // Validation
    if (!name || !description || !price || !influencer_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category_id,
      stock: parseInt(stock) || 0,
      sku: sku || `PROD-${Date.now()}`,
      images: images || [],
      featured: featured || false,
      status: status || 'draft',
      tags: tags || [],
      weight: weight ? parseFloat(weight) : null,
      dimensions: dimensions || {},
      seo_title: seo_title || '',
      seo_description: seo_description || '',
      influencer_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: product, error } = await supabase
      .from('influencer_products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating influencer product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });

  } catch (error) {
    console.error('Error in influencer products POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
