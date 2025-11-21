// lib/shipping/select-warehouse.ts
// A simple nearest-warehouse picker. Replace warehouse list with DB lookup or geo service.
const WAREHOUSES = [
  {
    id: "wh-1",
    name: "Cape Town Warehouse",
    address: { street: "1 Cape St", city: "Cape Town", country: "ZA", postalCode: "8000" },
    lat: -33.9249,
    lng: 18.4241,
  },
  {
    id: "wh-2",
    name: "Johannesburg Warehouse",
    address: { street: "1 Joburg Rd", city: "Johannesburg", country: "ZA", postalCode: "2000" },
    lat: -26.2041,
    lng: 28.0473,
  },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * pickBestWarehouse
 * toAddress expected to have { lat, lng } to compute distance; if none, returns first.
 */
export async function pickBestWarehouse(toAddress: any) {
  if (!toAddress) return WAREHOUSES[0];
  const { lat: lat2, lng: lon2 } = toAddress;
  if (!lat2 || !lon2) return WAREHOUSES[0];
  let best = null;
  let minDist = Infinity;
  for (const w of WAREHOUSES) {
    const d = haversineDistance(w.lat, w.lng, lat2, lon2);
    if (d < minDist) {
      minDist = d;
      best = w;
    }
  }
  return best;
}
