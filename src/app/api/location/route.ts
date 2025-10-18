/**
 * Geocoding & Location API
 * GET /api/location/geocode - Convert address to coordinates
 * GET /api/location/reverse - Convert coordinates to address
 * GET /api/location/ip - Get location from IP
 * GET /api/location/nearby - Find nearby buildings/properties
 */

import {
  geocodeAddress,
  getIPLocation,
  getNearbyBuildings,
  reverseGeocode,
} from '@/lib/api-integrations';
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
      case 'geocode': {
        const address = searchParams.get('address');
        if (!address) {
          return NextResponse.json(
            { error: 'Address parameter required' },
            { status: 400 }
          );
        }

        const result = await geocodeAddress(address);
        if (!result) {
          return NextResponse.json(
            { error: 'Address not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(result);
      }

      case 'reverse': {
        const lat = parseFloat(searchParams.get('lat') || '');
        const lon = parseFloat(searchParams.get('lon') || '');

        if (isNaN(lat) || isNaN(lon)) {
          return NextResponse.json(
            { error: 'Valid lat and lon parameters required' },
            { status: 400 }
          );
        }

        const result = await reverseGeocode(lat, lon);
        if (!result) {
          return NextResponse.json(
            { error: 'Location not found' },
            { status: 404 }
          );
        }

        return NextResponse.json(result);
      }

      case 'ip': {
        const result = await getIPLocation();
        if (!result) {
          return NextResponse.json(
            { error: 'Could not determine location' },
            { status: 500 }
          );
        }

        return NextResponse.json(result);
      }

      case 'nearby': {
        const lat = parseFloat(searchParams.get('lat') || '');
        const lon = parseFloat(searchParams.get('lon') || '');
        const radius = parseInt(searchParams.get('radius') || '1000');

        if (isNaN(lat) || isNaN(lon)) {
          return NextResponse.json(
            { error: 'Valid lat and lon parameters required' },
            { status: 400 }
          );
        }

        const buildings = await getNearbyBuildings(lat, lon, radius);
        return NextResponse.json({
          buildings,
          count: buildings.length,
        });
      }

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
            validActions: ['geocode', 'reverse', 'ip', 'nearby'],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
