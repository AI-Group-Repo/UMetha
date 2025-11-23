// app/api/shipping/rates/route.ts
import { NextResponse } from "next/server";
import { getFedexRates } from "@/lib/shipping/fedex";
import { getUpsRates } from "@/lib/shipping/ups";
import { getDhlRates } from "@/lib/shipping/dhl";
import { pickBestWarehouse } from "@/lib/shipping/select-warehouse";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Expected body shape (example):
    // { carrier?: 'fedex'|'ups'|'dhl'|'auto', fromAddress, toAddress, weight, dimensions, prefer: 'cheapest'|'fastest' }
    const {
      carrier = "auto",
      fromAddress,
      toAddress,
      weight,
      dimensions,
      prefer = "cheapest",
      useNearestWarehouse = true,
    } = body;

    // Optionally select nearest warehouse (business logic)
    let effectiveFrom = fromAddress;
    if (useNearestWarehouse) {
      const selectedWarehouse = await pickBestWarehouse(toAddress);
      if (selectedWarehouse) {
        effectiveFrom = selectedWarehouse.address;
      }
    }

    // If carrier is 'auto', call all and return options
    const results = [];

    if (carrier === "auto" || carrier === "fedex") {
      const fedex = await getFedexRates({
        fromAddress: effectiveFrom,
        toAddress,
        weight,
        dimensions,
      });
      results.push({ carrier: "fedex", rates: fedex });
    }

    if (carrier === "auto" || carrier === "ups") {
      const ups = await getUpsRates({
        fromAddress: effectiveFrom,
        toAddress,
        weight,
        dimensions,
      });
      results.push({ carrier: "ups", rates: ups });
    }

    if (carrier === "auto" || carrier === "dhl") {
      const dhl = await getDhlRates({
        fromAddress: effectiveFrom,
        toAddress,
        weight,
        dimensions,
      });
      results.push({ carrier: "dhl", rates: dhl });
    }

    // Optionally post-process results (sort by prefer)
    const normalized = results.map((r) => {
      return {
        carrier: r.carrier,
        rates: r.rates || [],
      };
    });

    return NextResponse.json({ success: true, options: normalized });
  } catch (err: any) {
    console.error("GET RATES ERROR", err);
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
