import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Clean username (remove @ symbol if present)
    const cleanUsername = username.replace('@', '').trim();

    if (!cleanUsername) {
      return NextResponse.json(
        { error: 'Invalid username format' },
        { status: 400 }
      );
    }

    const isValidUsername = await validateTikTokUsername(cleanUsername);
    
    if (!isValidUsername.exists) {
      return NextResponse.json(
        { 
          error: 'Username not found',
          message: `@${cleanUsername} does not exist on TikTok. Please check the username and try again.`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: cleanUsername,
      platform: 'tiktok',
      exists: true,
      followers: isValidUsername.followers,
      verified: isValidUsername.verified || false,
      display_name: isValidUsername.display_name || cleanUsername,
      profile_pic: isValidUsername.profile_pic || null,
      bio: isValidUsername.bio || null
    });

  } catch (error) {
    console.error('TikTok validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate TikTok username' },
      { status: 500 }
    );
  }
}

// Simulated TikTok validation function
async function validateTikTokUsername(username: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));

  // Mock validation logic - in production, use real TikTok API
  const mockUsers = {
    'sophiastyle': {
      exists: true,
      followers: 3200000,
      verified: true,
      display_name: 'Sophia Style',
      profile_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      bio: 'Fashion & lifestyle content ✨'
    },
    'michellifestyle': {
      exists: true,
      followers: 1800000,
      verified: false,
      display_name: 'Michael Chen',
      profile_pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      bio: 'Lifestyle & travel content'
    },
    'emmabeauty': {
      exists: true,
      followers: 4500000,
      verified: true,
      display_name: 'Emma Beauty',
      profile_pic: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      bio: 'Beauty tutorials & reviews 💄'
    },
    'testuser': {
      exists: true,
      followers: 75000,
      verified: false,
      display_name: 'Test User',
      profile_pic: null,
      bio: 'Test account'
    }
  };

  // Check if username exists in mock data
  if (mockUsers[username.toLowerCase() as keyof typeof mockUsers]) {
    return mockUsers[username.toLowerCase() as keyof typeof mockUsers];
  }

  // For demo purposes, randomly determine if username exists
  const randomExists = Math.random() > 0.4; // 60% chance of existing
  
  if (randomExists) {
    return {
      exists: true,
      followers: Math.floor(Math.random() * 10000000) + 10000,
      verified: Math.random() > 0.85,
      display_name: username,
      profile_pic: null,
      bio: null
    };
  }

  return { exists: false };
}
