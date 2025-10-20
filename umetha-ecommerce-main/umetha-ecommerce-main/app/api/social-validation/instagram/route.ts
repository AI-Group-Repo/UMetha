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

    // For demo purposes, we'll simulate API calls
    // In production, you would integrate with actual social media APIs
    // or use services like RapidAPI, Social Blade API, etc.
    
    const isValidUsername = await validateInstagramUsername(cleanUsername);
    
    if (!isValidUsername.exists) {
      return NextResponse.json(
        { 
          error: 'Username not found',
          message: `@${cleanUsername} does not exist on Instagram. Please check the username and try again.`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: cleanUsername,
      platform: 'instagram',
      exists: true,
      followers: isValidUsername.followers,
      verified: isValidUsername.verified || false,
      profile_pic: isValidUsername.profile_pic || null,
      bio: isValidUsername.bio || null
    });

  } catch (error) {
    console.error('Instagram validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate Instagram username' },
      { status: 500 }
    );
  }
}

// Simulated Instagram validation function
// In production, replace with actual API integration
async function validateInstagramUsername(username: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation logic - in production, use real Instagram API
  const mockUsers = {
    'sophiastyle': {
      exists: true,
      followers: 2400000,
      verified: true,
      profile_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      bio: 'Fashion enthusiast and style curator'
    },
    'michellifestyle': {
      exists: true,
      followers: 500000,
      verified: false,
      profile_pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      bio: 'Lifestyle content creator'
    },
    'emmabeauty': {
      exists: true,
      followers: 1800000,
      verified: true,
      profile_pic: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      bio: 'Beauty and skincare expert'
    },
    'testuser': {
      exists: true,
      followers: 50000,
      verified: false,
      profile_pic: null,
      bio: 'Test user account'
    }
  };

  // Check if username exists in mock data
  if (mockUsers[username.toLowerCase() as keyof typeof mockUsers]) {
    return mockUsers[username.toLowerCase() as keyof typeof mockUsers];
  }

  // For demo purposes, randomly determine if username exists
  // In production, this would be replaced with actual API call
  const randomExists = Math.random() > 0.4; // 60% chance of existing
  
  if (randomExists) {
    return {
      exists: true,
      followers: Math.floor(Math.random() * 5000000) + 10000,
      verified: Math.random() > 0.7,
      profile_pic: null,
      bio: null
    };
  }

  return { exists: false };
}
