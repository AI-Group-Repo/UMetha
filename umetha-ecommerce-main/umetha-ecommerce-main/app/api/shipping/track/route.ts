// app/api/shipping/track/route.ts
import { NextResponse } from "next/server";
import { trackFedex } from "@/lib/shipping/fedex";
import { trackUps } from "@/lib/shipping/ups";
import { trackDhl } from "@/lib/shipping/dhl";

export async function POST(req: Request) {
  try {
    const { carrier, trackingNumber } = await req.json();
    if (!carrier || !trackingNumber) {
      return NextResponse.json({ success: false, error: "carrier and trackingNumber required" }, { status: 400 });
    }

    if (carrier === "fedex") {
      return NextResponse.json({ success: true, result: await trackFedex(trackingNumber) });
    }
    if (carrier === "ups") {
      return NextResponse.json({ success: true, result: await trackUps(trackingNumber) });
    }
    if (carrier === "dhl") {
      return NextResponse.json({ success: true, result: await trackDhl(trackingNumber) });
    }
    return NextResponse.json({ success: false, error: "unknown carrier" }, { status: 400 });
  } catch (err: any) {
    console.error("TRACK ERROR", err);
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
