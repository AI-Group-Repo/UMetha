// app/api/shipping/pickup/route.ts
import { NextResponse } from "next/server";
import { scheduleFedexPickup } from "@/lib/shipping/fedex";
import { scheduleUpsPickup } from "@/lib/shipping/ups";
import { scheduleDhlPickup } from "@/lib/shipping/dhl";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected: { carrier, pickupDetails }
    const { carrier, pickupDetails } = body;
    if (!carrier) return NextResponse.json({ success: false, error: "carrier required" }, { status: 400 });

    if (carrier === "fedex") {
      const r = await scheduleFedexPickup(pickupDetails);
      return NextResponse.json({ success: true, result: r });
    }
    if (carrier === "ups") {
      const r = await scheduleUpsPickup(pickupDetails);
      return NextResponse.json({ success: true, result: r });
    }
    if (carrier === "dhl") {
      const r = await scheduleDhlPickup(pickupDetails);
      return NextResponse.json({ success: true, result: r });
    }

    return NextResponse.json({ success: false, error: "unknown carrier" }, { status: 400 });
  } catch (err: any) {
    console.error("SCHEDULE PICKUP ERROR", err);
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
