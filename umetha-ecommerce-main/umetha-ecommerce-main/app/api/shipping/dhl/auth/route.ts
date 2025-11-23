import { NextRequest, NextResponse } from "next/server";

const DHL_CLIENT_ID = process.env.DHL_CLIENT_ID!;
const DHL_REDIRECT_URI = process.env.DHL_REDIRECT_URI!; // e.g., https://yourdomain.com/api/shipping/dhl/callback
const DHL_AUTH_URL = "https://mydhl.express.dhl/za/en/shipment.html#/?fromAddressLine=Algiers%20Province&fromCountry=DZ&toAddressLine=Algiers%20Province&toDivision=ALGIERS%20PROVINCE&toCountry=DZ&toCity=HUSSEIN%20DEY&shipmentFromDashboard=true#address-details";

export async function GET(req: NextRequest) {
  const url = new URL(DHL_AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", DHL_CLIENT_ID);
  url.searchParams.set("redirect_uri", DHL_REDIRECT_URI);
  url.searchParams.set("scope", "shipping"); // Adjust scopes as necessary

  return NextResponse.redirect(url.toString());
}
