import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Since we don't have a categories table in the actual database,
    // we'll create some default categories based on common product types
    const defaultCategories = [
      { id: 'fashion', name: 'Fashion', slug: 'fashion' },
      { id: 'electronics', name: 'Electronics', slug: 'electronics' },
      { id: 'home', name: 'Home & Garden', slug: 'home' },
      { id: 'beauty', name: 'Beauty & Health', slug: 'beauty' },
      { id: 'sports', name: 'Sports & Fitness', slug: 'sports' },
      { id: 'books', name: 'Books & Media', slug: 'books' },
      { id: 'toys', name: 'Toys & Games', slug: 'toys' },
      { id: 'automotive', name: 'Automotive', slug: 'automotive' },
    ];

    // Try to get categories from the database if they exist
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .range(offset, offset + limit - 1);

      if (!error && categories && categories.length > 0) {
        return NextResponse.json({
          status: 'success',
          data: {
            categories: categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug
            }))
          }
        });
      }
    } catch (dbError) {
      console.log('Categories table not found, using default categories');
    }

    // Return default categories
    return NextResponse.json({
      status: 'success',
      data: {
        categories: defaultCategories.slice(offset, offset + limit)
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to fetch categories' 
      },
      { status: 500 }
    );
  }
}