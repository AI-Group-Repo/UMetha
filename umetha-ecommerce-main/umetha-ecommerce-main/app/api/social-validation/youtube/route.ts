import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY!;
const API_HOST = 'youtube138.p.rapidapi.com';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Accept username or full YouTube URL
    const cleanInput = username.replace('@', '').trim();

    // Extract channel query from URL or handle
    const query = extractYouTubeQuery(cleanInput);

    if (!query) {
      return NextResponse.json({ error: 'Invalid YouTube username/URL' }, { status: 400 });
    }

    // 🔹 YouTube (RapidAPI) Search Endpoint
    const url = `https://${API_HOST}/channel/search/?id=UCJ5v_MCY6GNUBTO8-D3XoAg&q=${encodeURIComponent(
      query
    )}&hl=en&gl=US`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    const data = await response.json();

    // If the response is bad or empty
    if (!response.ok || !data || !data.contents || data.contents.length === 0) {
      return NextResponse.json(
        {
          exists: false,
          error: 'Channel not found',
          message: `YouTube channel "${query}" could not be found.`,
        },
        { status: 404 }
      );
    }

    // Preferred objects (channel or author)
    const channelData =
      data.contents[0]?.channel ||
      data.contents[0]?.video?.author ||
      null;

    if (!channelData) {
      return NextResponse.json(
        {
          exists: false,
          error: 'No valid channel returned',
          message: `No valid YouTube channel found for "${query}".`,
        },
        { status: 404 }
      );
    }

    const subscribersRaw =
      channelData.stats?.subscribersText ||
      channelData.subscriberCountText ||
      '';

    const subscribers = parseSubscriberCount(subscribersRaw);

    return NextResponse.json({
      platform: 'youtube',
      exists: true,
      username: query,
      channel_name: channelData.title || query,
      verified: Array.isArray(channelData.badges)
        ? channelData.badges.some((b: any) => b.text?.toLowerCase().includes('verified'))
        : false,
      subscribers,
      // No profile image needed for your frontend
      link: channelData.channelId
        ? `https://www.youtube.com/channel/${channelData.channelId}`
        : `https://www.youtube.com/@${query}`,
    });
  } catch (error) {
    console.error('YouTube validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate YouTube channel' },
      { status: 500 }
    );
  }
}

/* ---------------------------------------------------------------------- */
/* 🔧 Helper: Clean input (username, URL, or handle → "channelName")      */
/* ---------------------------------------------------------------------- */
function extractYouTubeQuery(input: string): string | null {
  try {
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      const url = new URL(
        input.startsWith('http') ? input : 'https://' + input
      );

      // Handle @username URL
      if (url.pathname.startsWith('/@')) {
        return url.pathname.replace('/@', '').trim();
      }

      // Example: /channel/UC12345
      if (url.pathname.includes('/channel/')) {
        return url.pathname.split('/channel/')[1];
      }

      // Example: /c/SomeCustomName
      if (url.pathname.includes('/c/')) {
        return url.pathname.split('/c/')[1];
      }

      // Example: /user/SomeUser
      if (url.pathname.includes('/user/')) {
        return url.pathname.split('/user/')[1];
      }
    }

    // Otherwise treat as username
    return input.trim();
  } catch {
    return input.trim();
  }
}

/* ---------------------------------------------------------------------- */
/* 🔧 Helper: Convert "1.2M subscribers" → 1200000                        */
/* ---------------------------------------------------------------------- */
function parseSubscriberCount(text: string): number {
  if (!text) return 0;

  const match = text.match(/([\d.]+)\s*([MK]?)/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2]?.toUpperCase();

  if (unit === 'M') return Math.round(value * 1_000_000);
  if (unit === 'K') return Math.round(value * 1_000);

  return Math.round(value);
}
