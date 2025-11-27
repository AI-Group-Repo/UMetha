import { NextRequest, NextResponse } from "next/server";

const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID;
const UPS_REDIRECT_URI = process.env.UPS_REDIRECT_URI;
const UPS_AUTH_URL = "https://wwwcie.ups.com/security/v1/oauth/authorize";

export async function GET(req: NextRequest) {
  if (!UPS_CLIENT_ID || !UPS_REDIRECT_URI) {
    return NextResponse.json(
      { error: "UPS credentials not configured" },
      { status: 500 }
    );
  }

  const url = new URL(UPS_AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", UPS_CLIENT_ID);
  url.searchParams.set("redirect_uri", UPS_REDIRECT_URI);
  url.searchParams.set("scope", "read write");

  return NextResponse.redirect(url.toString());
}

