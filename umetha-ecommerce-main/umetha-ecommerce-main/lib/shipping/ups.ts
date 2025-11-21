// lib/shipping/ups.ts
// Minimal UPS REST wrapper (replace endpoints/payloads per UPS docs)
const UPS_API_BASE = process.env.UPS_API_BASE || "https://onlinetools.ups.com";
const UPS_CLIENT_ID = process.env.UPS_CLIENT_ID;
const UPS_CLIENT_SECRET = process.env.UPS_CLIENT_SECRET;
const UPS_ACCESS_TOKEN_KEY = "UPS_ACCESS_TOKEN";
let UPS_TOKEN: string | null = null;

async function getUpsToken() {
  if (UPS_TOKEN) return UPS_TOKEN;
  // UPS auth flow may differ (use developer docs). Example placeholder below:
  const resp = await fetch(`${UPS_API_BASE}/security/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: UPS_CLIENT_ID || "",
      client_secret: UPS_CLIENT_SECRET || "",
    }),
  });
  const data = await resp.json();
  UPS_TOKEN = data.access_token;
  return UPS_TOKEN;
}

export async function getUpsRates({ fromAddress, toAddress, weight, dimensions }: any) {
  const token = await getUpsToken();
  const resp = await fetch(`${UPS_API_BASE}/ship/v1/rating/Rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      // Fill UPS-specific rate payload
      ShipmentRequest: {
        Shipment: {
          Shipper: fromAddress,
          ShipTo: toAddress,
          Package: {
            PackagingType: { Code: "02" }, // box
            PackageWeight: { UnitOfMeasurement: { Code: "LBS" }, Weight: weight },
            Dimensions: { UnitOfMeasurement: { Code: "IN" }, ...dimensions },
          },
        },
      },
    }),
  });
  const data = await resp.json();
  // Normalize results
  return (data.RatedShipment || []).map((r: any) => ({
    serviceName: r.Service?.Code,
    amount: r.TotalCharges?.MonetaryValue,
    currency: r.TotalCharges?.CurrencyCode,
    transitDays: r.GuaranteedDaysToDelivery || null,
    raw: r,
  }));
}

export async function createUpsShipment({ fromAddress, toAddress, parcel, serviceCode, labelFormat }: any) {
  const token = await getUpsToken();
  const resp = await fetch(`${UPS_API_BASE}/ship/v1/shipments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      // Build UPS create shipment payload
      ShipmentRequest: {
        Shipment: {
          Shipper: fromAddress,
          ShipTo: toAddress,
          Service: { Code: serviceCode },
          Package: [
            {
              PackagingType: { Code: "02" },
              PackageWeight: { UnitOfMeasurement: { Code: "LBS" }, Weight: parcel.weight },
              Dimensions: { UnitOfMeasurement: { Code: "IN" }, ...parcel.dimensions },
            },
          ],
        },
      },
    }),
  });
  const data = await resp.json();
  return {
    trackingNumber: data?.ShipmentResponse?.ShipmentResults?.PackageResults?.TrackingNumber || null,
    label: data?.label || null,
    raw: data,
  };
}

export async function scheduleUpsPickup(details: any) {
  const token = await getUpsToken();
  const resp = await fetch(`${UPS_API_BASE}/ship/v1/pickups`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(details),
  });
  return await resp.json();
}

export async function trackUps(trackingNumber: string) {
  const token = await getUpsToken();
  const resp = await fetch(`${UPS_API_BASE}/track/v1/details/${trackingNumber}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await resp.json();
}
