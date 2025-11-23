import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.RAPIDAPI_TWITTER_KEY || "d967172b3fmshbfc8c4b88a8e1b0p1725efjsn338a650a8b27";
const API_HOST = "twitter241.p.rapidapi.com";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Clean username
    const cleanUsername = username.replace("@", "").trim();
    if (!cleanUsername) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // 🔹 RapidAPI Twitter Endpoint
    const url = `https://${API_HOST}/user?username=${encodeURIComponent(cleanUsername)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    });

    const data = await response.json();

    // ❌ Invalid or Not Found
    if (!response.ok || !data || data.status !== "ok" || !data.data) {
      return NextResponse.json(
        {
          error: "User not found",
          message: `@${cleanUsername} does not exist on Twitter.`,
        },
        { status: 404 }
      );
    }

    const user = data.data;

    // Normalize follower count (some APIs return strings)
    const followerCount = parseInt(user.followers_count) || 0;

    const result = {
      platform: "twitter",
      username: cleanUsername,
      exists: true,
      display_name: user.name,
      followers: followerCount,
      verified: user.verified || false,
      avatar: user.profile_image_url || null,
      description: user.description || "",
      link: `https://twitter.com/${user.username}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Twitter validation error:", error);
    return NextResponse.json({ error: "Failed to validate Twitter user" }, { status: 500 });
  }
}
