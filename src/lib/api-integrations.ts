/**
 * External API Integrations
 *
 * "The system's rigged, but we've got the APIs to rig it back."
 * - A platform that actually gives a damn about people
 */

// ==============================================
// GEOCODING & LOCATION SERVICES
// ==============================================

/**
 * Nominatim (OpenStreetMap) - Free geocoding
 * Address → Coordinates
 */
export async function geocodeAddress(address: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(address)}` +
      `&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CollabConnect/1.0 (contact@collabconnect.com)',
        },
      }
    );

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        address: data[0].address,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse Geocode - Coordinates → Address
 */
export async function reverseGeocode(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
      `lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CollabConnect/1.0 (contact@collabconnect.com)',
        },
      }
    );

    const data = await response.json();
    return {
      displayName: data.display_name,
      address: data.address,
      city: data.address.city || data.address.town || data.address.village,
      country: data.address.country,
      countryCode: data.address.country_code,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Get user's IP-based location
 * Using ipapi.co (free, no auth required)
 */
export async function getIPLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country_name,
      countryCode: data.country_code,
      ip: data.ip,
    };
  } catch (error) {
    console.error('IP location error:', error);
    return null;
  }
}

// ==============================================
// TRANSLATION SERVICES
// ==============================================

/**
 * LibreTranslate - Free, open-source translation
 * Because we connect people across ALL languages
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto'
) {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original on error
  }
}

/**
 * Get supported languages
 */
export async function getSupportedLanguages() {
  try {
    const response = await fetch('https://libretranslate.com/languages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
}

// ==============================================
// USER VERIFICATION & IDENTITY
// ==============================================

/**
 * Get Gravatar URL by email
 * Shows profile picture if user has one
 */
export async function getGravatarUrl(email: string, size: number = 200): Promise<string> {
  const crypto = (await import('crypto')).default || await import('crypto');
  const hash = crypto
    .createHash('md5')
    .update(email.toLowerCase().trim())
    .digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/**
 * Verify email format and basic validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==============================================
// REAL ESTATE & HOUSING DATA
// ==============================================

/**
 * Get nearby buildings using Overpass API (OpenStreetMap)
 * For finding properties and housing data
 */
export async function getNearbyBuildings(
  lat: number,
  lon: number,
  radius: number = 1000 // meters
) {
  try {
    const overpassQuery = `
      [out:json];
      (
        way["building"](around:${radius},${lat},${lon});
        relation["building"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
    });

    const data = await response.json();
    return data.elements.map((element: {
      id: string | number;
      tags?: Record<string, string>;
      center?: { lat: number; lon: number };
      lat?: number;
      lon?: number;
    }) => ({
      id: element.id,
      type: element.tags?.building || 'building',
      address: element.tags?.['addr:street']
        ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}`
        : null,
      lat: element.center?.lat || element.lat || 0,
      lon: element.center?.lon || element.lon || 0,
      tags: element.tags,
    }));
  } catch (error) {
    console.error('Building data error:', error);
    return [];
  }
}

// ==============================================
// COLLABORATION & TRANSPARENCY DATA
// ==============================================

/**
 * Generate QR code for profile/invite sharing
 * Using goqr.me API (free, no auth)
 */
export function generateQRCode(data: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Get company data from OpenCorporates
 * For transparency when dealing with insurance companies
 */
export async function getCompanyData(companyName: string, jurisdiction?: string) {
  try {
    let url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(companyName)}`;
    if (jurisdiction) {
      url += `&jurisdiction_code=${jurisdiction}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.companies.length > 0) {
      return data.results.companies.map((item: {
        company: {
          name: string;
          company_number: string;
          jurisdiction_code: string;
          current_status: string;
          incorporation_date: string;
          registered_address_in_full: string;
          opencorporates_url: string;
        };
      }) => ({
        name: item.company.name,
        companyNumber: item.company.company_number,
        jurisdiction: item.company.jurisdiction_code,
        status: item.company.current_status,
        incorporationDate: item.company.incorporation_date,
        address: item.company.registered_address_in_full,
        url: item.company.opencorporates_url,
      }));
    }
    return [];
  } catch (error) {
    console.error('Company data error:', error);
    return [];
  }
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

/**
 * Get public IP address
 */
export async function getPublicIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('IP fetch error:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Rate limiting helper for API calls
 */
export class RateLimiter {
  private calls: number[] = [];

  constructor(
    private maxCalls: number,
    private windowMs: number
  ) {}

  canMakeCall(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    return this.calls.length < this.maxCalls;
  }

  recordCall(): void {
    this.calls.push(Date.now());
  }

  async waitForSlot(): Promise<void> {
    while (!this.canMakeCall()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.recordCall();
  }
}
