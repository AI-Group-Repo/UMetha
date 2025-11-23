import { NextRequest, NextResponse } from 'next/server';

// TikTok API URL and API key from RapidAPI
const API_KEY = process.env.RAPIDAPI_TIKTOK_KEY!; // Ensure you have the correct TikTok API key in .env
const API_HOST = 'tiktok-api23.p.rapidapi.com'; // RapidAPI Host for TikTok

export async function POST(request: NextRequest) {
  try {
    // Parse the username from the request body
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Clean the username by removing @ symbol
    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    // Construct the API URL to fetch user data from TikTok
    const url = `https://${API_HOST}/api/search/account?keyword=${encodeURIComponent(cleanUsername)}&cursor=0&search_id=0`;

    // Fetch user data from the TikTok API via RapidAPI
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,  // Your RapidAPI key for TikTok
        'X-RapidAPI-Host': API_HOST, // API host for TikTok
      },
    });

    // Parse the response from TikTok API
    const data = await response.json();

    // Check if no user is found or the response is invalid
    if (!data || data.status !== 'ok' || !data.data || data.data.length === 0) {
      return NextResponse.json({ error: `@${cleanUsername} not found on TikTok` }, { status: 404 });
    }

    // Extract the first user from the search results (if multiple results)
    const user = data.data[0];

    // Return the user's data
    return NextResponse.json({
      username: user.username,
      platform: 'tiktok',
      exists: true,
      followers: user.followers_count,
      avatar: user.profile_pic_url,
      verified: user.is_verified,
      link: `https://www.tiktok.com/@${user.username}`,
    });

  } catch (err) {
    // Log and handle errors
    console.error('TikTok validation error:', err);
    return NextResponse.json({ error: 'Failed to validate TikTok username' }, { status: 500 });
  }
}
