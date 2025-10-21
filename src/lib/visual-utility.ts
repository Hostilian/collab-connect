// Visual and utility APIs: Unsplash, QR Code Generator, IPify, News API, JSONPlaceholder, Mocki.io
// If you want a pretty picture, a QR code, or just some fake data, this is your stop.

export async function getUnsplashImages(query: string, perPage: number = 10) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  });
  const data = await res.json();
  return data.results;
}

export function getQRCodeUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`;
}

export async function getPublicIP() {
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return data.ip;
}

export async function getNews(query: string) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.articles;
}

export async function getFakeUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  return res.json();
}

export async function getMockData(endpoint: string) {
  const url = `https://mocki.io/v1/${endpoint}`;
  const res = await fetch(url);
  return res.json();
}
