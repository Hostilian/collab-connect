import L from "leaflet"

type Coordinates = { lat: number; lon: number }

const DEFAULT_CENTER: [number, number] = [50.0755, 14.4378] // Prague
const DEFAULT_ZOOM = 13
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search"
const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter"

function addDefaultTileLayer(map: L.Map, provider: string = "OpenStreetMap.Mapnik") {
  type ProviderTileLayer = {
    provider?: (provider: string) => L.TileLayer
  }

  const tileLayer = L.tileLayer as ProviderTileLayer

  if (typeof tileLayer.provider === "function") {
    tileLayer.provider(provider).addTo(map)
    return
  }

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    detectRetina: true,
    tileSize: 256,
  }).addTo(map)
}

export function createMap(elementId: string, options?: L.MapOptions) {
  const target = document.getElementById(elementId)
  if (!target) {
    throw new Error(`Map container #${elementId} not found`)
  }

  const map = L.map(target, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    attributionControl: true,
    ...options,
  })

  addDefaultTileLayer(map)
  return map
}

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  if (!address?.trim()) {
    return null
  }

  const params = new URLSearchParams({ format: "json", q: address, limit: "1" })
  const response = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
    headers: { "User-Agent": "CourierConnect/1.0 (contact@courierconnect.com)" },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    return null
  }

  const data: Array<{ lat: string; lon: string }> = await response.json()
  if (!Array.isArray(data) || data.length === 0) {
    return null
  }

  return {
    lat: Number.parseFloat(data[0].lat),
    lon: Number.parseFloat(data[0].lon),
  }
}

export async function getNearbyBuildings(lat: number, lon: number, radius: number = 1000) {
  const query = `[out:json];node(around:${radius},${lat},${lon})[building];out;`
  const response = await fetch(`${OVERPASS_ENDPOINT}?data=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": "CourierConnect/1.0 (contact@courierconnect.com)" },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error("Overpass API request failed")
  }

  return response.json()
}

export function haversineDistance(a: Coordinates, b: Coordinates) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371 // km
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(haversine)))
}
