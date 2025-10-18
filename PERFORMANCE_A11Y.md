# Performance & Accessibility Testing Guide

## 🎯 Overview

This guide covers performance testing, accessibility testing, and optimization strategies for Collab-Connect.

---

## 📊 Performance Testing

### Lighthouse CI

We use Lighthouse CI to track performance metrics over time and enforce performance budgets.

#### Running Lighthouse Locally

```bash
# Install Lighthouse CI globally (if not already installed)
npm install -g @lhci/cli

# Run Lighthouse CI
npm run test:perf
```

#### Performance Budgets

Our performance targets (configured in `lighthouserc.js`):

| Metric | Target | Category |
|--------|--------|----------|
| Performance Score | ≥ 80 | Overall |
| Accessibility Score | ≥ 90 | Overall |
| Best Practices Score | ≥ 90 | Overall |
| SEO Score | ≥ 90 | Overall |
| First Contentful Paint | ≤ 2.0s | Performance |
| Largest Contentful Paint | ≤ 2.5s | Performance |
| Cumulative Layout Shift | ≤ 0.1 | Performance |
| Total Blocking Time | ≤ 300ms | Performance |
| Speed Index | ≤ 3.0s | Performance |

#### Resource Budgets

| Resource Type | Budget |
|--------------|--------|
| JavaScript | ≤ 500 KB |
| CSS | ≤ 100 KB |
| Images | ≤ 500 KB |
| Fonts | ≤ 200 KB |
| HTML | ≤ 50 KB |

### Performance Monitoring in CI/CD

Lighthouse runs automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main`
- Weekly scheduled runs (Mondays at 9 AM UTC)
- Manual workflow dispatch

View results in:
- GitHub Actions → Performance & Accessibility Tests workflow
- Lighthouse artifacts (`.lighthouseci` directory)

---

## ♿ Accessibility Testing

### Automated Accessibility Tests

We use `@axe-core/playwright` for automated accessibility testing.

#### Running Accessibility Tests

```bash
# Run all accessibility tests
npm run test:a11y

# Run specific accessibility test
npx playwright test e2e/accessibility.spec.ts --headed
```

#### What We Test

1. **WCAG 2.1 AA Compliance**
   - Color contrast ratios
   - Keyboard navigation
   - Screen reader compatibility

2. **ARIA Landmarks**
   - Proper use of `<main>`, `<nav>`, `<header>`, `<footer>`
   - Semantic HTML structure

3. **Form Accessibility**
   - Proper label associations
   - Error messages
   - Focus management

4. **Heading Hierarchy**
   - Single `<h1>` per page
   - Logical heading order
   - No skipped levels

5. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Visible focus indicators
   - Skip links present

6. **Image Accessibility**
   - All images have `alt` attributes
   - Decorative images have `alt=""`
   - Complex images have detailed descriptions

### Manual Accessibility Testing

In addition to automated tests, perform manual testing:

#### Screen Readers
- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (free) or JAWS
- **Linux**: Orca

#### Browser Extensions
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [Accessibility Insights](https://accessibilityinsights.io/)

#### Keyboard Testing Checklist
- [ ] Tab through all interactive elements
- [ ] Shift+Tab navigates backwards
- [ ] Enter/Space activates buttons
- [ ] Esc closes modals/dropdowns
- [ ] Arrow keys navigate within components
- [ ] Focus is always visible
- [ ] No keyboard traps

---

## 🚀 Performance Optimization

### Code Splitting

```tsx
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if not needed
});
```

### Image Optimization

```tsx
import Image from 'next/image';

// Always use Next.js Image component
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Font Optimization

```tsx
// In app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

### Bundle Size Analysis

```bash
# Analyze bundle size
ANALYZE=true npm run build

# View bundle visualization
open .next/analyze/client.html
```

### Performance Monitoring

Track real user metrics with Sentry:

```tsx
// Automatically tracked:
// - First Contentful Paint (FCP)
// - Largest Contentful Paint (LCP)
// - First Input Delay (FID)
// - Cumulative Layout Shift (CLS)
// - Time to First Byte (TTFB)
```

---

## 📈 Performance Best Practices

### 1. Minimize JavaScript

- Remove unused dependencies
- Use tree shaking
- Lazy load non-critical components
- Use server components when possible

### 2. Optimize Images

- Use WebP format with fallbacks
- Implement responsive images
- Use appropriate image sizes
- Enable lazy loading

### 3. Reduce CSS

- Remove unused styles
- Use Tailwind's purge/content config
- Minimize custom CSS
- Use CSS modules or CSS-in-JS efficiently

### 4. Caching Strategies

```tsx
// API routes with caching
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const data = await fetchData();
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

### 5. Database Optimization

```tsx
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
  take: 10,
});

// Use indexes for frequently queried fields
// Add to schema.prisma:
// @@index([email])
// @@index([createdAt])
```

---

## 🔍 Debugging Performance Issues

### Chrome DevTools

1. **Performance Tab**
   - Record page load
   - Analyze JavaScript execution
   - Find long tasks (> 50ms)

2. **Network Tab**
   - Check waterfall chart
   - Identify slow resources
   - Look for blocking requests

3. **Lighthouse Tab**
   - Run audits
   - Review opportunities
   - Check diagnostics

### Next.js Performance Tools

```bash
# Enable performance profiling
NEXT_TELEMETRY_DISABLED=1 npm run dev

# Analyze build performance
npm run build -- --profile
```

---

## 📋 Performance Checklist

Before deploying to production:

- [ ] Lighthouse score ≥ 80
- [ ] Accessibility score ≥ 90
- [ ] All images optimized
- [ ] Code splitting implemented
- [ ] Database queries optimized
- [ ] API routes cached where appropriate
- [ ] Bundle size under budget
- [ ] No console errors or warnings
- [ ] Tested on slow 3G network
- [ ] Tested with CPU throttling

---

## 🎯 Accessibility Checklist

Before deploying to production:

- [ ] All automated tests passing
- [ ] Manual keyboard testing completed
- [ ] Screen reader testing completed
- [ ] Color contrast meets WCAG AA
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] ARIA landmarks present
- [ ] Heading hierarchy correct
- [ ] Focus management working
- [ ] Skip links implemented

---

## 📚 Resources

### Performance
- [Next.js Performance](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Resources](https://webaim.org/resources/)

---

*Last Updated: October 2025*
