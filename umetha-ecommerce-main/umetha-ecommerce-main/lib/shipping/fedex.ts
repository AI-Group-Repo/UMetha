// lib/shipping/fedex.ts
// NOTE: these are sample implementations - adapt to FedEx SOAP/REST API spec
const FEDEX_API_BASE = process.env.FEDEX_API_BASE || "https://apis.fedex.com";
const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;
let FEDEX_TOKEN: string | null = null;

async function getFedexToken() {
  if (FEDEX_TOKEN) return FEDEX_TOKEN;
  // Example token exchange - adjust according to FedEx docs
  const resp = await fetch(`${FEDEX_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: FEDEX_CLIENT_ID || "",
      client_secret: FEDEX_CLIENT_SECRET || "",
    }),
  });
  const data = await resp.json();
  FEDEX_TOKEN = data.access_token;
  return FEDEX_TOKEN;
}

export async function getFedexRates({ fromAddress, toAddress, weight, dimensions }: any) {
  const token = await getFedexToken();
  // Replace with FedEx rates endpoint and payload structure
  const resp = await fetch(`${FEDEX_API_BASE}/rate/v1/rates/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER },
      requestedShipment: {
        shipper: fromAddress,
        recipient: toAddress,
        requestedPackageLineItems: [
          {
            weight: { units: "LB", value: weight },
            dimensions: { units: "IN", ...dimensions },
          },
        ],
      },
    }),
  });
  const data = await resp.json();
  // Normalize response to array of { serviceName, amount, currency, transitDays }
  // This is example mapping — adjust for real response
  return (data.output?.rateReplyDetails || []).map((r: any) => ({
    serviceName: r.serviceType,
    amount: r.ratedShipmentDetails?.[0]?.shipmentRateDetail?.totalNetCharge?.amount,
    currency: r.ratedShipmentDetails?.[0]?.shipmentRateDetail?.totalNetCharge?.currency,
    transitDays: r.expectedTransitTime,
    raw: r,
  }));
}

export async function createFedexShipment({ fromAddress, toAddress, parcel, serviceCode, labelFormat = "PDF" }: any) {
  const token = await getFedexToken();
  // Replace with FedEx Create Shipment endpoint payload (example)
  const resp = await fetch(`${FEDEX_API_BASE}/ship/v1/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      requestedShipment: {
        shipper: fromAddress,
        recipient: toAddress,
        serviceType: serviceCode,
        labelSpecification: { labelFormatType: labelFormat },
        packages: [
          {
            weight: { units: "LB", value: parcel.weight },
            dimensions: { units: "IN", ...parcel.dimensions },
            insuredValue: { amount: parcel.declaredValue || 0 },
          },
        ],
      },
    }),
  });

  const data = await resp.json();
  // Return a normalized object: trackingNumber, labelUrl/base64, raw
  return {
    trackingNumber: data.output?.transactionShipments?.[0]?.trackingNumber || null,
    labelBase64: data.output?.transactionShipments?.[0]?.documents?.[0]?.content || null,
    raw: data,
  };
}

export async function scheduleFedexPickup(pickupDetails: any) {
  const token = await getFedexToken();
  // TODO: replace with real FedEx pickup endpoint
  const resp = await fetch(`${FEDEX_API_BASE}/ship/v1/pickups`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pickup: pickupDetails }),
  });
  const data = await resp.json();
  return data;
}

export async function trackFedex(trackingNumber: string) {
  const token = await getFedexToken();
  const resp = await fetch(`${FEDEX_API_BASE}/track/v1/trackingnumbers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ trackingInfo: [{ trackingNumber }] }),
  });
  const data = await resp.json();
  return data;
}
