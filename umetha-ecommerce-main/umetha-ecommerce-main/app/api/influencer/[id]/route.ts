import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import the initialized supabase client
import { Database } from '@/types/supabase'; // Import the types from your supabase types

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch influencer profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from<Database['profiles']>('profiles') // Ensure we're querying the correct table with the right type
      .select('*')
      .eq('id', params.id) // Filter by the 'id' parameter in the URL
      .eq('role', 'INFLUENCER') // Ensure the role is 'INFLUENCER'
      .single(); // Get one record

    if (profileError) {
      console.error('Error fetching influencer profile:', profileError);
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }

    // Transform the profile data into a more usable format
    const influencer = {
      id: profile.id,
      name: profile.full_name || `${profile.first_name} ${profile.last_name}`,
      bio: profile.bio || 'Fashion influencer passionate about sustainable fashion.',
      avatar_url: profile.avatar_url || null,
      social_links: profile.social_links || {},
      followers_count: profile.followers_count || 0,
      verified: profile.verified || false,
      store_theme: profile.store_theme || {
        primary_color: '#6366F1', // Default primary color
        secondary_color: '#8B5CF6', // Default secondary color
        font_family: 'Inter' // Default font family
      }
    };

    return NextResponse.json({ influencer }); // Return the transformed influencer data

  } catch (error) {
    console.error('Error in influencer API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
