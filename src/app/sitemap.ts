
import { MetadataRoute } from 'next'

// Look, this is the sitemap. If Google can't figure it out, that's their problem.
// We use NEXT_PUBLIC_SITE_URL because that's what everyone expects for sitemaps.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://collab-connect.com'
const lastModified = new Date().toISOString()

// All the important pages. If you add a new route, put it here. Don't overthink it.
const pages: Array<{
  path: string
  changeFrequency: 'daily' | 'monthly' | 'weekly' | 'yearly' | 'always' | 'hourly' | 'never'
  priority: number
}> = [
  { path: '', changeFrequency: 'daily', priority: 1 },
  { path: 'map', changeFrequency: 'daily', priority: 0.9 },
  { path: 'auth/signin', changeFrequency: 'monthly', priority: 0.8 },
  { path: 'auth/signup', changeFrequency: 'monthly', priority: 0.8 },
  { path: 'dashboard', changeFrequency: 'daily', priority: 0.7 },
  { path: 'profile', changeFrequency: 'weekly', priority: 0.6 },
  { path: 'messages', changeFrequency: 'daily', priority: 0.6 },
  { path: 'groups', changeFrequency: 'daily', priority: 0.7 },
  { path: 'about', changeFrequency: 'monthly', priority: 0.5 },
  { path: 'features', changeFrequency: 'monthly', priority: 0.5 },
  { path: 'pricing', changeFrequency: 'monthly', priority: 0.6 },
  { path: 'privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: 'terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: 'cookies', changeFrequency: 'yearly', priority: 0.3 },
  { path: 'help', changeFrequency: 'weekly', priority: 0.4 },
  { path: 'contact', changeFrequency: 'monthly', priority: 0.4 },
  { path: 'status', changeFrequency: 'daily', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Well, would you look at that. It's a real sitemap.
  return pages.map(page => ({
    url: page.path ? `${baseUrl}/${page.path}` : baseUrl,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
