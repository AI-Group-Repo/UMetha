// app/api/shipping/create/route.ts
import { NextResponse } from "next/server";
import { createFedexShipment } from "@/lib/shipping/fedex";
import { createUpsShipment } from "@/lib/shipping/ups";
import { createDhlShipment } from "@/lib/shipping/dhl";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // expected body: { carrier: 'fedex'|'ups'|'dhl', fromAddress, toAddress, parcel: {weight, dimensions}, serviceCode, labelFormat }
    const { carrier, fromAddress, toAddress, parcel, serviceCode, labelFormat = "PDF" } = body;

    if (!carrier) {
      return NextResponse.json({ success: false, error: "Carrier required" }, { status: 400 });
    }

    if (carrier === "fedex") {
      const res = await createFedexShipment({ fromAddress, toAddress, parcel, serviceCode, labelFormat });
      return NextResponse.json({ success: true, carrier: "fedex", result: res });
    }

    if (carrier === "ups") {
      const res = await createUpsShipment({ fromAddress, toAddress, parcel, serviceCode, labelFormat });
      return NextResponse.json({ success: true, carrier: "ups", result: res });
    }

    if (carrier === "dhl") {
      const res = await createDhlShipment({ fromAddress, toAddress, parcel, serviceCode, labelFormat });
      return NextResponse.json({ success: true, carrier: "dhl", result: res });
    }

    return NextResponse.json({ success: false, error: "Unknown carrier" }, { status: 400 });
  } catch (err: any) {
    console.error("CREATE SHIPMENT ERROR", err);
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
