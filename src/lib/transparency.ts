// Data transparency features using OpenCorporates, EU Data Portal, GOV.UK, and Clearbit
// If you want to know who's real, who's not, and who's hiding something, this is the place.

export async function getCompanyData(name: string, jurisdiction?: string) {
  // OpenCorporates API
  const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(name)}${jurisdiction ? `&jurisdiction_code=${jurisdiction}` : ''}`;
  const res = await fetch(url);
  return res.json();
}

export async function getEUTransparencyData(dataset: string) {
  // EU Open Data Portal
  const url = `https://data.europa.eu/api/hub/search?query=${encodeURIComponent(dataset)}`;
  const res = await fetch(url);
  return res.json();
}

export async function getUKTransparencyData(query: string) {
  // GOV.UK Transparency Data
  const url = `https://www.gov.uk/search/transparency-and-freedom-of-information-releases?keywords=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return res.text(); // Returns HTML, needs parsing
}

export async function getClearbitData(email: string) {
  // Clearbit API
  const url = `https://person.clearbit.com/v2/people/find?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${process.env.CLEARBIT_API_KEY}` },
  });
  return res.json();
}
