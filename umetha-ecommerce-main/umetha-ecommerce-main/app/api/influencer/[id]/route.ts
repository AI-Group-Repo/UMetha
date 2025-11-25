import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // initialized client

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch influencer profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, username, avatar_url, role, business_models, created_at, updated_at, last_seen_at')
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
      name: profile.full_name || profile.username || 'Influencer',
      avatar_url: profile.avatar_url || null,
      email: profile.email || null,
      role: profile.role || 'INFLUENCER',
      business_models: profile.business_models || [],
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      last_seen_at: profile.last_seen_at,
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
