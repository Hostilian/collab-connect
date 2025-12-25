// External API integrations. All services are free or offer generous free tiers.

// ==============================================
// GEOCODING & LOCATION SERVICES
// ==============================================

/** Nominatim (OpenStreetMap). */
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

/** LocationIQ geocoding. */
export async function geocodeAddressLocationIQ(address: string) {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  if (!apiKey) return geocodeAddress(address); // Fallback to Nominatim

  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/search?` +
      `key=${apiKey}` +
      `&q=${encodeURIComponent(address)}` +
      `&format=json&limit=1&addressdetails=1`
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
    console.error('LocationIQ geocoding error:', error);
    return geocodeAddress(address); // Fallback
  }
}

/** OpenCage geocoding. */
export async function geocodeAddressOpenCage(address: string) {
  const apiKey = process.env.OPENCAGE_API_KEY;
  if (!apiKey) return geocodeAddress(address);

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?` +
      `key=${apiKey}` +
      `&q=${encodeURIComponent(address)}` +
      `&limit=1&pretty=0`
    );

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        displayName: result.formatted,
        address: result.components,
        confidence: result.confidence,
      };
    }
    return null;
  } catch (error) {
    console.error('OpenCage geocoding error:', error);
    return geocodeAddress(address);
  }
}

/** Reverse geocoding using Nominatim. */
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

/** IP-based location via ipapi.co. */
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

/** IP-based location via GeoJS. */
export async function getIPLocationGeoJS() {
  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const data = await response.json();
    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      city: data.city,
      country: data.country,
      countryCode: data.country_code,
      ip: data.ip,
    };
  } catch (error) {
    console.error('GeoJS location error:', error);
    return getIPLocation(); // Fallback
  }
}

// ==============================================
// TRANSLATION SERVICES
// ==============================================

/** LibreTranslate translation endpoint. */
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

/** Retrieve supported translation languages. */
export async function getSupportedLanguages() {
  try {
    const response = await fetch('https://libretranslate.com/languages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
}

/** MyMemory translation fallback. */
export async function translateTextMyMemory(
  text: string,
  targetLang: string,
  sourceLang: string = 'en'
) {
  try {
    const email = process.env.MYMEMORY_EMAIL || '';
    let url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    if (email) {
      url += `&de=${encodeURIComponent(email)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.error('MyMemory translation error:', error);
    return text;
  }
}

// ==============================================
// USER VERIFICATION & IDENTITY
// ==============================================

/** Generate a Gravatar URL from an email address. */
export async function getGravatarUrl(email: string, size: number = 200): Promise<string> {
  const crypto = (await import('crypto')).default || await import('crypto');
  const hash = crypto
    .createHash('md5')
    .update(email.toLowerCase().trim())
    .digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/** Basic email format validation. */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/** Hunter.io email verification helper. */
export async function verifyEmailHunter(email: string) {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    console.warn('Hunter.io API key not configured - using basic validation');
    return { valid: isValidEmail(email), verified: false };
  }

  try {
    const response = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`
    );

    const data = await response.json();

    if (data.data) {
      return {
        valid: data.data.result === 'deliverable',
        verified: true,
        score: data.data.score,
        result: data.data.result,
        disposable: data.data.disposable,
        webmail: data.data.webmail,
      };
    }
    return { valid: isValidEmail(email), verified: false };
  } catch (error) {
    console.error('Hunter.io verification error:', error);
    return { valid: isValidEmail(email), verified: false };
  }
}

// ==============================================
// REAL ESTATE & HOUSING DATA
// ==============================================

/** Query nearby buildings via OpenStreetMap Overpass. */
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

/** Zillow listings via RapidAPI. */
export async function searchZillowListings(location: string, page: number = 1) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.warn('Zillow API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${encodeURIComponent(location)}&page=${page}`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
        },
      }
    );

    const data = await response.json();
    return data.props || [];
  } catch (error) {
    console.error('Zillow API error:', error);
    return [];
  }
}

/** Placeholder for UK Land Registry price paid data. */
export async function getUKPropertySales(postcode: string) {
  try {
    // This would connect to UK Land Registry open data
    // For now, returning structure - full implementation needs CSV parsing
    console.warn('UK Land Registry integration pending - needs CSV parser');
    return {
      postcode,
      url: 'https://use-land-property-data.service.gov.uk/datasets/price-paid-data',
      note: 'Download CSV and implement local parsing',
    };
  } catch (error) {
    console.error('UK Land Registry error:', error);
    return null;
  }
}

// ==============================================
// MEDIA & ASSETS
// ==============================================

/** Unsplash image search helper. */
export async function searchUnsplashImages(query: string, perPage: number = 10) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn('Unsplash API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    const data = await response.json();
    return data.results.map((photo: {
      id: string;
      urls: { regular: string; small: string; thumb: string };
      alt_description: string;
      user: { name: string; username: string };
      links: { html: string };
    }) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      alt: photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: `https://unsplash.com/@${photo.user.username}`,
      downloadUrl: photo.links.html,
    }));
  } catch (error) {
    console.error('Unsplash API error:', error);
    return [];
  }
}

/** Fetch a random Unsplash image for a category. */
export async function getRandomUnsplashImage(category: string = 'nature') {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(category)}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    const photo = await response.json();
    return {
      id: photo.id,
      url: photo.urls.regular,
      thumbnail: photo.urls.thumb,
      alt: photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: `https://unsplash.com/@${photo.user.username}`,
    };
  } catch (error) {
    console.error('Unsplash random image error:', error);
    return null;
  }
}

// ==============================================
// COLLABORATION & TRANSPARENCY DATA
// ==============================================

/** Generate a QR code URL for sharing data. */
export function generateQRCode(data: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/** Fetch company data from OpenCorporates. */
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

/** Fetch the public IP address. */
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

/** Calculate distance between two coordinates (Haversine). */
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

/** Rate limiting helper for API calls. */
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
