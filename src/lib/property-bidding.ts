// Property bidding and listing integration
// If you want to bid on a house with your friends, this is where the magic happens.

import fetch from 'node-fetch';

export async function searchZillowListings(location: string, page: number = 1) {
  // Use Zillow RapidAPI for real listings
  const url = `https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${encodeURIComponent(location)}&page=${page}`;
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
    },
  });
  return res.json();
}

export async function getLandRegistryData(postcode: string) {
  // UK Land Registry API
  const url = `https://use-land-property-data.service.gov.uk/datasets/price-paid-data?postcode=${encodeURIComponent(postcode)}`;
  const res = await fetch(url);
  return res.json();
}

export async function getOpenStreetMapBuildings(lat: number, lon: number, radius: number = 1000) {
  // Overpass API for building data
  const query = `[out:json];node(around:${radius},${lat},${lon})[building];out;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return res.json();
}
