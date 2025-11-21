// /app/api/shipping/fedex/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

// You will need to replace these values with the actual ones from FedEx
const FEDEX_TOKEN_URL = "https://api.fedex.com/oauth/token"; // Example URL
const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID!;
const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET!;
const FEDEX_REDIRECT_URI = process.env.FEDEX_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authorizationCode = searchParams.get("code");

  if (!authorizationCode) {
    return NextResponse.redirect("/error"); // Handle error if no code
  }

  try {
    // Exchange the authorization code for an access token
    const response = await fetch(FEDEX_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        client_id: FEDEX_CLIENT_ID,
        client_secret: FEDEX_CLIENT_SECRET,
        redirect_uri: FEDEX_REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!data.access_token) {
      return NextResponse.redirect("/error"); // Handle error if no access token
    }

    // Store the access token (e.g., in a session or a database)
    // For now, let's assume we store it in a cookie (this is just an example)
    // You should consider securely storing the token, such as in a session or encrypted storage.
    const accessToken = data.access_token;

    // Redirect to dashboard or wherever you want the user to go
    return NextResponse.redirect("/dashboard");
  } catch (error) {
    console.error("Error exchanging authorization code for access token:", error);
    return NextResponse.redirect("/error");
  }
}
