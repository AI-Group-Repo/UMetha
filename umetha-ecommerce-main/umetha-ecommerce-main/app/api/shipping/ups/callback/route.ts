import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID!;
const UPS_CLIENT_SECRET = process.env.UPS_CLIENT_SECRET!;
const UPS_TOKEN_URL = "https://wwwcie.ups.com/ups/oauth/token";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.UPS_REDIRECT_URI!);

  const auth = Buffer.from(`${UPS_CLIENT_ID}:${UPS_CLIENT_SECRET}`).toString("base64");

  const tokenRes = await fetch(UPS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await tokenRes.json();

  const user_id = searchParams.get("user_id")!;
  await supabase.from("shipping_tokens").insert({
    user_id,
    carrier: "ups",
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? null,
    expires_at: Date.now() + data.expires_in * 1000,
  });

  return NextResponse.json({ success: true, data });
}
