// Apple Maps-style interactive map integration
// If you can't find your house, blame the map, not me.

import L from 'leaflet';

export function createMap(elementId: string, options?: L.MapOptions) {
  return L.map(elementId, {
    center: [50.0755, 14.4378], // Prague, default center
    zoom: 13,
    ...options,
  });

function _addTileLayer(map: L.Map, provider: string = 'OpenStreetMap.Mapnik') {
  // If leaflet-providers is available, use it. Otherwise, fallback to OSM.
  type ProviderTileLayer = {
    provider?: (provider: string) => L.TileLayer;
  };
  const tileLayer = L.tileLayer as ProviderTileLayer;
  if (typeof tileLayer.provider === "function") {
    tileLayer.provider(provider).addTo(map);
  } else {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
  }
}
}

export async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  // Use Nominatim API for geocoding
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}

export async function getNearbyBuildings(lat: number, lon: number, radius: number = 1000) {
  // Use Overpass API for building data
  const query = `[out:json];node(around:${radius},${lat},${lon})[building];out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return res.json();
}
