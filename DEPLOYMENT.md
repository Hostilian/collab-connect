# Deployment Guide

## 🚀 Overview

Complete guide for deploying Collab-Connect to production with Vercel, including environment setup, database migrations, and monitoring.

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run ci`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Coverage ≥ 80% (`npm run test:coverage`)
- [ ] Accessibility tests passing (`npm run test:a11y`)
- [ ] Performance score ≥ 80 (`npm run test:perf`)

### Security
- [ ] No critical vulnerabilities (`npm audit`)
- [ ] All dependencies up to date
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] API keys rotated if needed

### Documentation
- [ ] CHANGELOG.md updated
- [ ] README.md current
- [ ] API documentation updated
- [ ] Migration notes documented

---

## 🌍 Environment Setup

### Required Environment Variables

#### Core Application
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"

# Email Service
RESEND_API_KEY="re_xxxxxxxxxxxx"
```

#### Monitoring & Error Tracking
```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="collab-connect"
SENTRY_AUTH_TOKEN="your-auth-token"
```

#### Vercel (automatically set)
```bash
VERCEL_URL  # Automatically provided
VERCEL_ENV  # production, preview, or development
```

---

## 📦 Vercel Deployment

### Initial Setup

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Set Environment Variables**
   ```bash
   # Production
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   vercel env add RESEND_API_KEY production
   vercel env add SENTRY_DSN production
   vercel env add SENTRY_AUTH_TOKEN production
   
   # Preview
   vercel env add DATABASE_URL preview
   # ... repeat for other variables
   ```

### Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or let GitHub Actions handle it
git push origin main
```

### Preview Deployments

Every pull request automatically gets a preview deployment:
- URL: `https://collab-connect-git-[branch]-[team].vercel.app`
- Full environment with preview database
- Automatic comments on PR with deployment URL

---

## 🗄️ Database Management

### Production Database Setup

1. **Recommended Providers**
   - [Neon](https://neon.tech/) - Serverless PostgreSQL
   - [Supabase](https://supabase.com/) - PostgreSQL with extras
   - [Railway](https://railway.app/) - Simple deployment
   - [AWS RDS](https://aws.amazon.com/rds/) - Enterprise solution

2. **Database Configuration**
   ```bash
   # Connection pooling recommended for serverless
   DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1"
   ```

### Running Migrations

```bash
# Generate migration
npm run prisma:migrate

# Deploy migration to production
DATABASE_URL="production_url" npm run prisma:migrate:deploy

# Or use Vercel CLI
vercel env pull .env.production
npm run prisma:migrate:deploy
```

### Migration Strategy

1. **Development**
   ```bash
   npm run prisma:migrate
   ```

2. **Staging**
   ```bash
   DATABASE_URL=$STAGING_DB npm run prisma:migrate:deploy
   ```

3. **Production**
   - Create backup first
   - Deploy migration
   - Verify changes
   - Monitor for errors

---

## 🔄 Deployment Workflow

### GitHub Actions (Automated)

Our setup deploys automatically:

```yaml
main branch → Production
feature/* → Preview deployment
pull request → Preview deployment + checks
```

### Manual Deployment

```bash
# 1. Build locally to test
npm run build

# 2. Test production build
npm run start

# 3. Deploy to preview
vercel

# 4. Promote to production
vercel --prod
```

---

## 📊 Post-Deployment Verification

### 1. Health Checks

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-10-18T...",
  "uptime": 12345,
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Readiness Check

```bash
curl https://your-domain.com/api/health/ready

# Expected response:
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "email": "ok"
  }
}
```

### 3. Smoke Tests

Run critical user journeys:

- [ ] Homepage loads
- [ ] User can sign up
- [ ] User can sign in
- [ ] Map displays correctly
- [ ] Dashboard accessible
- [ ] Profile updates work

### 4. Performance Check

```bash
# Run Lighthouse
npm run test:perf

# Or use online tools
# https://pagespeed.web.dev/
```

---

## 🔍 Monitoring

### Vercel Analytics

1. Enable in Vercel Dashboard
2. View metrics at `https://vercel.com/[team]/[project]/analytics`

Tracks:
- Page views
- User locations
- Device types
- Performance metrics

### Sentry Monitoring

1. **Error Tracking**
   - View at `https://sentry.io/organizations/[org]/issues/`
   - Set up alerts for critical errors
   - Monitor error rates

2. **Performance Monitoring**
   - Track transaction times
   - Monitor API performance
   - Identify slow queries

3. **Release Tracking**
   ```bash
   # Automatically tracked with semantic-release
   # Or manually create release
   sentry-cli releases new [version]
   sentry-cli releases finalize [version]
   ```

### Uptime Monitoring

Set up with:
- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)
- [Better Uptime](https://betteruptime.com/)

Monitor endpoints:
- `https://your-domain.com/api/health`
- `https://your-domain.com/api/health/ready`

---

## 🚨 Rollback Procedure

### Immediate Rollback (Vercel)

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]

# Or via dashboard
# Vercel Dashboard → Deployments → Select previous → Promote to Production
```

### Database Rollback

```bash
# If migration failed
prisma migrate resolve --rolled-back [migration-name]

# Restore from backup
pg_restore -d database_name backup_file
```

---

## 📈 Scaling Considerations

### Database Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Caching Strategy

```typescript
// API route with caching
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const data = await fetchData();
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### CDN Configuration

Vercel automatically provides:
- Global CDN
- Automatic static asset optimization
- Image optimization
- Edge network

---

## 🔐 Security

### Security Headers

Configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### API Rate Limiting

```typescript
// Implement rate limiting (if using Redis)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  // ... rest of handler
}
```

---

## 📝 Deployment Logs

### View Logs

```bash
# Vercel CLI
vercel logs [deployment-url]

# Or in dashboard
# Vercel Dashboard → Deployments → Select deployment → Logs
```

### Log Levels

- **Info**: General information
- **Warn**: Warnings (investigate but not critical)
- **Error**: Errors (requires immediate attention)

---

## 🎯 Deployment Checklist

### Before Deployment

- [ ] Run full test suite
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create git tag
- [ ] Database backup created
- [ ] Environment variables verified
- [ ] Dependencies audited

### During Deployment

- [ ] Monitor build logs
- [ ] Watch for errors
- [ ] Verify deployment URL
- [ ] Run smoke tests

### After Deployment

- [ ] Verify health checks
- [ ] Check error monitoring
- [ ] Verify analytics tracking
- [ ] Test critical features
- [ ] Update documentation
- [ ] Notify team

---

## 🆘 Troubleshooting

### Build Failures

```bash
# Check build logs
vercel logs --build

# Common issues:
# 1. TypeScript errors → Run `npm run typecheck`
# 2. Missing env vars → Check Vercel dashboard
# 3. Dependency issues → Delete node_modules, npm install
```

### Runtime Errors

```bash
# Check function logs
vercel logs

# Common issues:
# 1. Database connection → Verify DATABASE_URL
# 2. Missing secrets → Check environment variables
# 3. API errors → Check Sentry for details
```

### Performance Issues

```bash
# Analyze bundle
ANALYZE=true npm run build

# Check database queries
# Add logging to Prisma client

# Monitor with Sentry Performance
```

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Sentry Deployment](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

*Last Updated: October 2025*
