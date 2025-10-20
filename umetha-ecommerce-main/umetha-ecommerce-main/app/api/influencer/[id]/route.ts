import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch influencer profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .eq('role', 'INFLUENCER')
      .single();

    if (profileError) {
      console.error('Error fetching influencer profile:', profileError);
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }

    // Transform the profile data
    const influencer = {
      id: profile.id,
      name: profile.full_name || `${profile.first_name} ${profile.last_name}`,
      bio: profile.bio || 'Fashion influencer passionate about sustainable fashion.',
      avatar_url: profile.avatar_url || null,
      social_links: profile.social_links || {},
      followers_count: profile.followers_count || 0,
      verified: profile.verified || false,
      store_theme: profile.store_theme || {
        primary_color: '#6366F1',
        secondary_color: '#8B5CF6',
        font_family: 'Inter'
      }
    };

    return NextResponse.json({ influencer });

  } catch (error) {
    console.error('Error in influencer API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
