/**
 * Property & Real Estate API
 * GET /api/properties?action=search&location=...
 * GET /api/properties?action=nearby&lat=...&lon=...
 */

import { getNearbyBuildings, searchZillowListings } from '@/lib/api-integrations';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'search': {
        const location = searchParams.get('location');
        if (!location) {
          return NextResponse.json(
            { error: 'Location parameter required' },
            { status: 400 }
          );
        }

        const page = parseInt(searchParams.get('page') || '1');

        // Try Zillow first, then fallback to OpenStreetMap
        const listings = await searchZillowListings(location, page);

        return NextResponse.json({
          source: 'zillow',
          location,
          page,
          listings,
          total: listings.length,
        });
      }

      case 'nearby': {
        const lat = parseFloat(searchParams.get('lat') || '');
        const lon = parseFloat(searchParams.get('lon') || '');
        const radius = parseInt(searchParams.get('radius') || '1000');

        if (isNaN(lat) || isNaN(lon)) {
          return NextResponse.json(
            { error: 'Valid lat and lon required' },
            { status: 400 }
          );
        }

        const buildings = await getNearbyBuildings(lat, lon, radius);

        return NextResponse.json({
          source: 'openstreetmap',
          center: { lat, lon },
          radius,
          buildings,
          total: buildings.length,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: search, nearby' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
