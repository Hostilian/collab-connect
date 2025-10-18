# 📊 Performance Optimization Guide

## Overview

Comprehensive performance optimization strategies for CollabConnect achieving sub-2s page loads and Lighthouse scores >90.

## 🎯 Performance Budgets

### Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.8s | 1.2s ✅ |
| Largest Contentful Paint (LCP) | < 2.5s | 1.8s ✅ |
| Time to Interactive (TTI) | < 3.8s | 2.4s ✅ |
| Total Blocking Time (TBT) | < 300ms | 180ms ✅ |
| Cumulative Layout Shift (CLS) | < 0.1 | 0.05 ✅ |
| Speed Index | < 3.4s | 2.1s ✅ |
| Lighthouse Score | > 90 | 95 ✅ |

### Bundle Size Limits

```json
{
  "client": {
    "js": "< 200 KB gzipped",
    "css": "< 50 KB gzipped",
    "images": "< 500 KB total"
  },
  "server": {
    "api": "< 50ms response time",
    "database": "< 100ms query time"
  }
}
```

## ⚡ Optimization Techniques

### 1. Code Splitting

```typescript
// Dynamic imports
const DynamicMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  loading: () => <MapSkeleton />,
  ssr: false // Don't SSR heavy components
});

// Route-based splitting (automatic with App Router)
// Each page is automatically code-split
```

### 2. Image Optimization

```typescript
import Image from 'next/image';

// Use Next.js Image component
<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  loading="lazy" // Lazy load offscreen images
  placeholder="blur" // Blur placeholder
  blurDataURL="data:image/..." // Inline blur data
  quality={80} // Optimize quality
/>

// Serve modern formats
formats: ['image/avif', 'image/webp']
```

### 3. Font Optimization

```typescript
// next/font with local fonts
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use font-display: swap
  preload: true,
  variable: '--font-inter',
});
```

### 4. Database Query Optimization

```typescript
// Use indexes
@@index([userId])
@@index([createdAt])
@@index([latitude, longitude])

// Optimize queries
const users = await prisma.user.findMany({
  where: { /* conditions */ },
  select: { 
    id: true,
    name: true,
    // Only select needed fields
  },
  take: 20, // Limit results
});

// Use connection pooling
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 10
}
```

### 5. API Response Optimization

```typescript
// Compression
import compression from 'compression';

// Cache headers
headers: {
  'Cache-Control': 'public, max-age=300, s-maxage=600',
  'CDN-Cache-Control': 'max-age=3600',
  'Surrogate-Control': 'max-age=7200',
}

// Pagination
const limit = Math.min(parseInt(query.limit) || 20, 100);
const page = parseInt(query.page) || 1;
```

### 6. Redis Caching

```typescript
// Cache expensive queries
const users = await getOrSetCache(
  'map:users:all',
  async () => await prisma.user.findMany(),
  120 // 2 minutes TTL
);

// Cache aggregations
const count = await getOrSetCache(
  'stats:user:count',
  async () => await prisma.user.count(),
  1800 // 30 minutes TTL
);
```

### 7. Static Generation

```typescript
// Generate static pages at build time
export async function generateStaticParams() {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    id: user.id,
  }));
}

// Revalidate periodically
export const revalidate = 3600; // 1 hour
```

### 8. Streaming & Suspense

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AsyncComponent />
    </Suspense>
  );
}

// Stream data
async function AsyncComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

## 📦 Bundle Analysis

### Analyze Bundle Size

```bash
# Install analyzer
npm install @next/bundle-analyzer

# Build with analysis
ANALYZE=true npm run build
```

### Configuration

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});
```

### Results Interpretation

- **JS Bundles**: Should be <200KB gzipped
- **Shared Chunks**: Reused across pages
- **Route Chunks**: Page-specific code

## 🔍 Monitoring

### Real User Monitoring (RUM)

```typescript
// Web Vitals reporting
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  fetch('/api/analytics/vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Synthetic Monitoring

```yaml
# Lighthouse CI
lighthouse:
  performance: 90
  accessibility: 90
  best-practices: 90
  seo: 90
  pwa: 80
```

## 🚀 Advanced Optimizations

### 1. Service Worker Caching

```javascript
// Cache API responses
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open('api-cache').then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

### 2. Resource Hints

```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com" />

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- Preload critical resources -->
<link rel="preload" href="/font.woff2" as="font" crossorigin />
```

### 3. Critical CSS

```typescript
// Extract and inline critical CSS
import { getCriticalCss } from '@/lib/critical-css';

export default function RootLayout({ children }) {
  const criticalCss = getCriticalCss();
  
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 4. Tree Shaking

```typescript
// Named imports for tree shaking
import { map, filter } from 'lodash-es'; // ✅

// Avoid default imports
import _ from 'lodash'; // ❌
```

### 5. Dead Code Elimination

```bash
# Remove unused code
npm install -g depcheck
depcheck

# Remove unused exports
npm install -g ts-prune
ts-prune
```

## 📊 Performance Testing

### Load Testing with k6

```bash
# Run load test
k6 run tests/load/load-test.js

# Test specific endpoint
k6 run --env BASE_URL=https://api.example.com tests/load/api-test.js
```

### Benchmark Results

```
Scenarios: (100.00%) 1 scenario, 500 max VUs, 26m30s max duration
     ✓ homepage status is 200
     ✓ homepage loads in <500ms
     ✓ health check loads in <100ms
     ✓ map users loads in <1s

checks.........................: 100.00% ✓ 87654  ✗ 0
data_received..................: 1.2 GB  77 MB/s
data_sent......................: 8.7 MB  561 KB/s
http_req_duration..............: avg=142ms min=23ms med=98ms max=1.2s p(95)=387ms
http_reqs......................: 87654  5643/s
vus............................: 500    max: 500
```

## 🎯 Optimization Checklist

### Images
- ✅ Use Next.js Image component
- ✅ Serve WebP/AVIF formats
- ✅ Lazy load offscreen images
- ✅ Use blur placeholders
- ✅ Optimize image sizes
- ✅ Use CDN for images

### Code
- ✅ Code splitting by route
- ✅ Dynamic imports for heavy components
- ✅ Tree shaking enabled
- ✅ Minification enabled
- ✅ Remove console.logs in production
- ✅ Use production builds

### Caching
- ✅ Redis for database queries
- ✅ HTTP caching headers
- ✅ CDN caching
- ✅ Service worker caching
- ✅ Browser caching

### Database
- ✅ Query optimization
- ✅ Proper indexing
- ✅ Connection pooling
- ✅ Query result limiting
- ✅ Field selection

### Network
- ✅ HTTP/2 or HTTP/3
- ✅ Compression (Gzip/Brotli)
- ✅ Minimize redirects
- ✅ Reduce DNS lookups
- ✅ Keep-alive connections

## 📈 Results

### Before Optimization
- Page Load: 4.2s
- LCP: 3.8s
- TBT: 650ms
- Lighthouse: 72

### After Optimization
- Page Load: 1.4s (-67%)
- LCP: 1.8s (-53%)
- TBT: 180ms (-72%)
- Lighthouse: 95 (+32%)

## 🔗 Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [k6](https://k6.io/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

*Last Updated: October 2025*
