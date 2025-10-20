import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    let query = supabase
      .from('products')
      .select('*')
      .order('date_created', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      console.log('Supabase connection failed, returning sample data');
    }

    // If no products found or Supabase error, return sample data for demo
    let productsToTransform = products;
    if (!products || products.length === 0 || error) {
      productsToTransform = [
        {
          products_id: 1,
          name: "Classic White T-Shirt",
          description: "Comfortable cotton t-shirt perfect for everyday wear",
          price: 29.99,
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          sku: "TSH001",
          date_created: new Date().toISOString(),
          category_id: "fashion"
        },
        {
          products_id: 2,
          name: "Blue Denim Jeans",
          description: "Classic blue denim jeans with a comfortable fit",
          price: 79.99,
          url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
          sku: "JNS001",
          date_created: new Date().toISOString(),
          category_id: "fashion"
        },
        {
          products_id: 3,
          name: "Running Shoes",
          description: "High-performance running shoes for athletes",
          price: 129.99,
          url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
          sku: "SHO001",
          date_created: new Date().toISOString(),
          category_id: "sports"
        },
        {
          products_id: 4,
          name: "Smartphone",
          description: "Latest smartphone with advanced features",
          price: 699.99,
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
          sku: "PHN001",
          date_created: new Date().toISOString(),
          category_id: "electronics"
        },
        {
          products_id: 5,
          name: "Laptop Computer",
          description: "High-performance laptop for work and gaming",
          price: 1299.99,
          url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
          sku: "LPT001",
          date_created: new Date().toISOString(),
          category_id: "electronics"
        },
        {
          products_id: 6,
          name: "Wireless Headphones",
          description: "Premium wireless headphones with noise cancellation",
          price: 199.99,
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          sku: "HDP001",
          date_created: new Date().toISOString(),
          category_id: "electronics"
        }
      ];
    }

    // Transform the data to match our Product interface
    const transformedProducts = productsToTransform?.map(product => ({
      id: product.products_id.toString(),
      name: product.name,
      description: product.description || '',
      price: product.price,
      images: product.url ? [product.url] : ['/placeholder-product.jpg'],
      category: {
        id: product.category_id || 'default',
        name: product.category_id ? product.category_id.charAt(0).toUpperCase() + product.category_id.slice(1) : 'General',
        slug: product.category_id || 'general'
      },
      stock: 10, // Default stock since not in your schema
      sku: product.sku || '',
      createdAt: product.date_created,
      updatedAt: product.date_created,
    })) || [];

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      hasMore: transformedProducts.length === limit
    });

  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, images, categoryId, stock, translations } = body;

    // Insert the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price,
        images: images || [],
        category_id: categoryId,
        stock: stock || 0
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    // Insert translations if provided
    if (translations && translations.length > 0) {
      const translationData = translations.map((translation: any) => ({
        product_id: product.id,
        language: translation.language,
        name: translation.name,
        description: translation.description
      }));

      const { error: translationError } = await supabase
        .from('product_translations')
        .insert(translationData);

      if (translationError) {
        console.error('Error creating translations:', translationError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ product }, { status: 201 });

  } catch (error) {
    console.error('Error in products POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}