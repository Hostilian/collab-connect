/**
 * Map Clustering with Supercluster
 * Efficient marker clustering for the map view
 */

import Supercluster from 'supercluster';

interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  name?: string;
  type: 'user' | 'group' | 'property';
  data?: Record<string, unknown>;
}

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    name?: string;
    type: string;
    cluster?: boolean;
    point_count?: number;
    [key: string]: unknown;
  };
}

/**
 * Create a supercluster instance
 */
export function createClusterer(
  options: {
    radius?: number;
    maxZoom?: number;
    minZoom?: number;
    extent?: number;
  } = {}
) {
  const {
    radius = 60,
    maxZoom = 17,
    minZoom = 0,
    extent = 512,
  } = options;

  return new Supercluster<GeoJSONFeature['properties']>({
    radius,
    maxZoom,
    minZoom,
    extent,
  });
}

/**
 * Convert map points to GeoJSON features
 */
export function pointsToGeoJSON(points: MapPoint[]): GeoJSONFeature[] {
  return points.map(point => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [point.longitude, point.latitude],
    },
    properties: {
      id: point.id,
      name: point.name,
      type: point.type,
      ...point.data,
    },
  }));
}

/**
 * Get clusters for a given bounding box and zoom level
 */
export function getClusters(
  clusterer: Supercluster<GeoJSONFeature['properties']>,
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  },
  zoom: number
) {
  const { west, south, east, north } = bounds;

  return clusterer.getClusters(
    [west, south, east, north],
    Math.floor(zoom)
  );
}

/**
 * Get cluster expansion zoom (zoom level to expand a cluster)
 */
export function getClusterExpansionZoom(
  clusterer: Supercluster<GeoJSONFeature['properties']>,
  clusterId: number
) {
  return clusterer.getClusterExpansionZoom(clusterId);
}

/**
 * Get cluster leaves (individual points in a cluster)
 */
export function getClusterLeaves(
  clusterer: Supercluster<GeoJSONFeature['properties']>,
  clusterId: number,
  limit = 10,
  offset = 0
) {
  return clusterer.getLeaves(clusterId, limit, offset);
}

/**
 * Calculate heat map data
 */
export function calculateHeatmapData(
  points: MapPoint[],
  options: {
    radius?: number;
    maxIntensity?: number;
  } = {}
) {
  const { radius = 30, maxIntensity = 1 } = options;

  // Convert points to heatmap format
  const heatmapData = points.map(point => ({
    lat: point.latitude,
    lng: point.longitude,
    weight: 1, // Can be adjusted based on point importance
  }));

  return {
    data: heatmapData,
    options: {
      radius,
      maxIntensity,
      gradient: {
        0.0: 'rgba(0, 0, 255, 0)',
        0.2: 'rgba(0, 0, 255, 1)',
        0.4: 'rgba(0, 255, 255, 1)',
        0.6: 'rgba(0, 255, 0, 1)',
        0.8: 'rgba(255, 255, 0, 1)',
        1.0: 'rgba(255, 0, 0, 1)',
      },
    },
  };
}

/**
 * Filter points by criteria
 */
export function filterPoints(
  points: MapPoint[],
  filters: {
    type?: MapPoint['type'] | MapPoint['type'][];
    search?: string;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  }
) {
  let filtered = points;

  // Filter by type
  if (filters.type) {
    const types = Array.isArray(filters.type) ? filters.type : [filters.type];
    filtered = filtered.filter(p => types.includes(p.type));
  }

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(searchLower) ||
      p.id.toLowerCase().includes(searchLower)
    );
  }

  // Filter by bounds
  if (filters.bounds) {
    const { north, south, east, west } = filters.bounds;
    filtered = filtered.filter(
      p =>
        p.latitude >= south &&
        p.latitude <= north &&
        p.longitude >= west &&
        p.longitude <= east
    );
  }

  return filtered;
}

/**
 * Get optimal zoom level for a set of points
 */
export function getOptimalZoom(
  points: MapPoint[],
  mapDimensions: { width: number; height: number }
): number {
  if (points.length === 0) return 10;
  if (points.length === 1) return 14;

  // Calculate bounds
  const lats = points.map(p => p.latitude);
  const lngs = points.map(p => p.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Calculate the span
  const lngSpan = maxLng - minLng;  // Calculate zoom based on span
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  function latRad(lat: number) {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;
  const lngFraction = lngSpan / 360;

  const latZoom = zoom(mapDimensions.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapDimensions.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX) - 1; // -1 for padding
}

/**
 * Get center point from a set of points
 */
export function getCenterPoint(points: MapPoint[]): { lat: number; lng: number } {
  if (points.length === 0) {
    return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  }

  const sumLat = points.reduce((sum, p) => sum + p.latitude, 0);
  const sumLng = points.reduce((sum, p) => sum + p.longitude, 0);

  return {
    lat: sumLat / points.length,
    lng: sumLng / points.length,
  };
}
