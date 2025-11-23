import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DHL_CLIENT_ID = process.env.DHL_CLIENT_ID!;
const DHL_CLIENT_SECRET = process.env.DHL_CLIENT_SECRET!;
const DHL_TOKEN_URL = "https://mydhl.express.dhl/za/en/shipment.html#/?fromAddressLine=Algiers%20Province&fromCountry=DZ&toAddressLine=Algiers%20Province&toDivision=ALGIERS%20PROVINCE&toCountry=DZ&toCity=HUSSEIN%20DEY&shipmentFromDashboard=true#address-details";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  // Exchange code for token
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.DHL_REDIRECT_URI!);

  const auth = Buffer.from(`${DHL_CLIENT_ID}:${DHL_CLIENT_SECRET}`).toString("base64");

  const tokenRes = await fetch(DHL_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await tokenRes.json();

  // Store tokens in Supabase
  const user_id = searchParams.get("user_id")!;
  await supabase.from("shipping_tokens").insert({
    user_id,
    carrier: "dhl",
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? null,
    expires_at: Date.now() + data.expires_in * 1000,
  });

  return NextResponse.json({ success: true, data });
}
