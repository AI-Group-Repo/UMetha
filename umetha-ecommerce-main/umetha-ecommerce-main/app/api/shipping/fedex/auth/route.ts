// /app/api/shipping/fedex/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID!;
const FEDEX_REDIRECT_URI = process.env.FEDEX_REDIRECT_URI!;
const FEDEX_AUTH_URL = "https://www.fedex.com/register/contact?locale=en-za&enrollmentid=za22601020&rt=cc&Terms-Agreement=Yes?locale=en-za&enrollmentid=za22601020&rt=cc";

export async function GET(req: NextRequest) {
  const url = new URL(FEDEX_AUTH_URL);

  // Set OAuth parameters
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", FEDEX_CLIENT_ID);
  url.searchParams.set("redirect_uri", FEDEX_REDIRECT_URI);
  url.searchParams.set("scope", "ship"); // Adjust this scope if needed

  // Redirect the user to FedEx authorization page
  return NextResponse.redirect(url.toString());
}
