# 🌍 Multi-Environment Configuration Guide

## Overview

Collab-Connect supports multiple environments with isolated configurations.

**Environments:**
- **Development** - Local development
- **Staging** - Pre-production testing
- **Production** - Live application

---

## 📁 Environment Files

### File Structure

```
.env.development    # Development configuration
.env.staging        # Staging configuration
.env.production     # Production configuration
.env.local          # Local overrides (gitignored)
.env                # Default fallback (gitignored)
```

### Loading Priority

Next.js loads environment variables in this order:
1. `.env.$(NODE_ENV).local`
2. `.env.local` (not loaded when NODE_ENV is test)
3. `.env.$(NODE_ENV)`
4. `.env`

---

## 🔧 Configuration

### Development Environment

**File:** `.env.development`

```bash
# Local PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/collabconnect_dev"

# Local NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-min-32-characters"

# Development email (console logging)
RESEND_API_KEY=""
EMAIL_FROM="dev@localhost"

# Redis optional in dev
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Debug mode
NODE_ENV=development
LOG_LEVEL=debug
```

**Start development:**
```bash
npm run dev
```

---

### Staging Environment

**File:** `.env.staging`

```bash
# Staging database
DATABASE_URL="postgresql://user:password@staging-db.example.com:5432/collabconnect_staging"

# Staging URL
NEXTAUTH_URL="https://staging.collab-connect.com"
NEXTAUTH_SECRET="staging-secret-different-from-prod"

# Staging email
RESEND_API_KEY="re_staging_xxxxx"
EMAIL_FROM="noreply@staging.collab-connect.com"

# Staging Redis
UPSTASH_REDIS_REST_URL="https://staging-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="staging-token"

# Sentry for staging
SENTRY_DSN="https://xxxxx@sentry.io/staging"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/staging"

# Staging mode
NODE_ENV=production
LOG_LEVEL=info
VERCEL_ENV=preview
```

**Deploy to staging:**
```bash
vercel --env-file=.env.staging
```

---

### Production Environment

**File:** `.env.production`

```bash
# Production database
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/collabconnect_prod"

# Production URL
NEXTAUTH_URL="https://collab-connect.com"
NEXTAUTH_SECRET="production-secret-NEVER-COMMIT"

# Production email
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@collab-connect.com"

# Production Redis
UPSTASH_REDIS_REST_URL="https://prod-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="prod-token"

# Sentry for production
SENTRY_DSN="https://xxxxx@sentry.io/prod"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/prod"

# Production mode
NODE_ENV=production
LOG_LEVEL=warn
VERCEL_ENV=production
RATE_LIMIT_ENABLED=true
```

**Deploy to production:**
```bash
vercel --prod --env-file=.env.production
```

---

## 🔐 Secret Management

### Local Development

Create `.env.local` for local secrets:

```bash
# .env.local (gitignored)
DATABASE_URL="postgresql://localhost:5432/mydb"
NEXTAUTH_SECRET="my-local-secret"
RESEND_API_KEY="re_local_xxxxx"
```

### Vercel Deployment

**Add secrets via CLI:**
```bash
# Add to development
vercel env add DATABASE_URL development

# Add to preview (staging)
vercel env add DATABASE_URL preview

# Add to production
vercel env add DATABASE_URL production
```

**Or use Vercel dashboard:**
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add variables for each environment

---

## 🚀 Deployment Workflows

### Development Workflow

```bash
# 1. Start local database
docker-compose up -d

# 2. Run migrations
npm run db:migrate

# 3. Seed database
npm run prisma:seed

# 4. Start dev server
npm run dev
```

### Staging Deployment

```bash
# 1. Push to staging branch
git push origin staging

# 2. Vercel auto-deploys preview
# Or manually:
vercel --env-file=.env.staging

# 3. Run staging migrations
npm run db:migrate:staging

# 4. Test staging environment
npm run test:e2e:staging
```

### Production Deployment

```bash
# 1. Merge to main branch
git checkout main
git merge develop

# 2. Create release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 3. Vercel auto-deploys production
# Or manually:
vercel --prod

# 4. Run production migrations (if needed)
npm run db:migrate:prod

# 5. Verify deployment
npm run test:smoke:prod
```

---

## 🗄️ Database Migrations

### Development

```bash
# Create migration
npx prisma migrate dev --name add_feature

# Apply migrations
npm run db:migrate
```

### Staging

```bash
# Deploy migrations
DATABASE_URL="staging-url" npx prisma migrate deploy

# Or use script
npm run db:migrate:staging
```

### Production

```bash
# ALWAYS backup first!
npm run db:backup:prod

# Deploy migrations
DATABASE_URL="prod-url" npx prisma migrate deploy

# Or use script
npm run db:migrate:prod
```

---

## 📊 Environment-Specific Features

### Feature Flags

Use environment variables to control features:

```typescript
// lib/config.ts
export const config = {
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableSentry: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  enableDebugTools: process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOOLS === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
}

// components/Analytics.tsx
import { config } from '@/lib/config'

export function Analytics() {
  if (!config.enableAnalytics) return null
  
  return <GoogleAnalytics />
}
```

### Environment Detection

```typescript
// lib/env.ts
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const isStaging = process.env.VERCEL_ENV === 'preview'

export function getEnvironmentName(): string {
  if (isDevelopment) return 'development'
  if (isStaging) return 'staging'
  if (isProduction) return 'production'
  return 'unknown'
}
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```gitignore
# .gitignore
.env
.env.local
.env.*.local
.env.production
.env.staging
```

### 2. Use Strong Secrets

```bash
# Generate secure random secrets
openssl rand -base64 32

# For NEXTAUTH_SECRET
openssl rand -base64 64
```

### 3. Rotate Secrets Regularly

```bash
# Update production secret
vercel env rm NEXTAUTH_SECRET production
vercel env add NEXTAUTH_SECRET production

# Redeploy
vercel --prod
```

### 4. Limit Secret Access

- Only give team members access to secrets they need
- Use Vercel teams to control access
- Enable 2FA on all accounts

---

## 📝 Environment Variable Reference

### Required Variables

| Variable | Dev | Staging | Prod | Description |
|----------|-----|---------|------|-------------|
| `DATABASE_URL` | ✅ | ✅ | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | ✅ | ✅ | Application URL |
| `NEXTAUTH_SECRET` | ✅ | ✅ | ✅ | NextAuth encryption key |

### Optional Variables

| Variable | Dev | Staging | Prod | Description |
|----------|-----|---------|------|-------------|
| `RESEND_API_KEY` | ❌ | ✅ | ✅ | Email API key |
| `UPSTASH_REDIS_REST_URL` | ❌ | ✅ | ✅ | Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | ✅ | ✅ | Redis token |
| `SENTRY_DSN` | ❌ | ✅ | ✅ | Error monitoring |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ | ✅ | ✅ | Client-side Sentry |

---

## 🧪 Testing Environments

### Local Testing

```bash
# Test with development env
npm run test

# Test with production build
NODE_ENV=production npm run build
npm run start
```

### Staging Testing

```bash
# E2E tests against staging
NEXT_PUBLIC_APP_URL=https://staging.collab-connect.com npm run test:e2e

# Smoke tests
npm run test:smoke:staging
```

### Production Testing

```bash
# Smoke tests only (non-destructive)
npm run test:smoke:prod

# Health check
curl https://collab-connect.com/api/health
```

---

## 🐛 Troubleshooting

### Issue: Environment variables not loading

**Solution:**
```bash
# 1. Check file name
ls -la .env*

# 2. Verify NODE_ENV
echo $NODE_ENV

# 3. Restart dev server
npm run dev

# 4. Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Different values in browser vs server

**Cause:** NEXT_PUBLIC prefix required for client-side variables

**Solution:**
```bash
# ❌ Won't work in browser
API_KEY=xxx

# ✅ Works in browser
NEXT_PUBLIC_API_KEY=xxx
```

### Issue: Vercel deployment uses wrong environment

**Solution:**
```bash
# Check current environment
vercel env ls

# Pull specific environment
vercel env pull .env.local --environment=production

# Redeploy with specific env
vercel --prod
```

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)

---

*Last Updated: October 2025*
