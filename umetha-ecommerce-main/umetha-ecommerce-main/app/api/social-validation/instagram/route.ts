import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    // --- Call RapidAPI Instagram Search ---
    const res = await fetch(
      `https://instagram-scraper21.p.rapidapi.com/api/v1/search?q=${encodeURIComponent(
        cleanUsername
      )}&limit=20`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
          'x-rapidapi-host': 'instagram-scraper21.p.rapidapi.com',
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('RapidAPI error:', errText);
      return NextResponse.json(
        { error: 'Instagram API request failed' },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data || data.status !== 'ok' || !data.data?.users?.length) {
      return NextResponse.json(
        { error: `@${cleanUsername} not found` },
        { status: 404 }
      );
    }

    const user =
      data.data.users.find(
        (u: any) => u.username.toLowerCase() === cleanUsername.toLowerCase()
      ) || data.data.users[0];

    return NextResponse.json({
      platform: 'instagram',
      exists: true,
      username: user.username,
      full_name: user.full_name,
      verified: user.is_verified,
      link: user.link,
      followers: user.follower_count ?? null,
    });
  } catch (err) {
    console.error('Instagram validation error:', err);
    return NextResponse.json(
      { error: 'Failed to validate Instagram username' },
      { status: 500 }
    );
  }
}
