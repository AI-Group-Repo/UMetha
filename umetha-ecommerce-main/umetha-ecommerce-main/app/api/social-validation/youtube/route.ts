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

    const isValidUsername = await validateYouTubeUsername(cleanUsername);
    
    if (!isValidUsername.exists) {
      return NextResponse.json(
        { 
          error: 'Channel not found',
          message: `@${cleanUsername} does not exist on YouTube. Please check the channel name and try again.`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: cleanUsername,
      platform: 'youtube',
      exists: true,
      subscribers: isValidUsername.subscribers,
      verified: isValidUsername.verified || false,
      channel_name: isValidUsername.channel_name || cleanUsername,
      profile_pic: isValidUsername.profile_pic || null,
      description: isValidUsername.description || null
    });

  } catch (error) {
    console.error('YouTube validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate YouTube channel' },
      { status: 500 }
    );
  }
}

// Simulated YouTube validation function
async function validateYouTubeUsername(username: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Mock validation logic - in production, use real YouTube API
  const mockChannels = {
    'sophiastyleofficial': {
      exists: true,
      subscribers: 850000,
      verified: true,
      channel_name: 'Sophia Style Official',
      profile_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      description: 'Fashion and lifestyle content'
    },
    'michellifestyle': {
      exists: true,
      subscribers: 320000,
      verified: false,
      channel_name: 'Michael Lifestyle',
      profile_pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      description: 'Lifestyle and travel vlogs'
    },
    'emmabeauty': {
      exists: true,
      subscribers: 1200000,
      verified: true,
      channel_name: 'Emma Beauty',
      profile_pic: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      description: 'Beauty tutorials and reviews'
    },
    'testchannel': {
      exists: true,
      subscribers: 25000,
      verified: false,
      channel_name: 'Test Channel',
      profile_pic: null,
      description: 'Test channel for demo'
    }
  };

  // Check if username exists in mock data
  if (mockChannels[username.toLowerCase() as keyof typeof mockChannels]) {
    return mockChannels[username.toLowerCase() as keyof typeof mockChannels];
  }

  // For demo purposes, randomly determine if channel exists
  const randomExists = Math.random() > 0.4; // 60% chance of existing
  
  if (randomExists) {
    return {
      exists: true,
      subscribers: Math.floor(Math.random() * 2000000) + 1000,
      verified: Math.random() > 0.8,
      channel_name: username,
      profile_pic: null,
      description: null
    };
  }

  return { exists: false };
}
