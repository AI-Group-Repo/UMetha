// lib/shipping/dhl.ts
const DHL_API_BASE = process.env.DHL_API_BASE || "https://api.dhl.com";
const DHL_API_KEY = process.env.DHL_API_KEY;

export async function getDhlRates({ fromAddress, toAddress, weight, dimensions }: any) {
  // Example DHL rates endpoint (public key usage)
  const resp = await fetch(`${DHL_API_BASE}/rates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DHL-API-Key": DHL_API_KEY || "",
    },
    body: JSON.stringify({
      origin: fromAddress,
      destination: toAddress,
      packages: [{ weight, dimensions }],
    }),
  });
  const data = await resp.json();
  // Normalize
  return (data?.rates || []).map((r: any) => ({
    serviceName: r.serviceName,
    amount: r.totalPrice?.amount,
    currency: r.totalPrice?.currency,
    transitDays: r.estimatedTransitTime || null,
    raw: r,
  }));
}

export async function createDhlShipment({ fromAddress, toAddress, parcel, serviceCode, labelFormat }: any) {
  const resp = await fetch(`${DHL_API_BASE}/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DHL-API-Key": DHL_API_KEY || "",
    },
    body: JSON.stringify({
      plannedShipment: {
        shipper: fromAddress,
        recipient: toAddress,
        packages: [{ weight: parcel.weight, dimensions: parcel.dimensions }],
        productCode: serviceCode,
      },
      labelFormat,
    }),
  });
  const data = await resp.json();
  return {
    trackingNumber: data?.shipmentTrackingNumber || null,
    labelBase64: data?.label?.content || null,
    raw: data,
  };
}

export async function scheduleDhlPickup(details: any) {
  const resp = await fetch(`${DHL_API_BASE}/pickups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DHL-API-Key": DHL_API_KEY || "",
    },
    body: JSON.stringify(details),
  });
  return await resp.json();
}

export async function trackDhl(trackingNumber: string) {
  const resp = await fetch(`${DHL_API_BASE}/track/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "DHL-API-Key": DHL_API_KEY || "",
    },
    body: JSON.stringify({ trackingNumber }),
  });
  return await resp.json();
}
