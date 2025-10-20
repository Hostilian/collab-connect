# 🚀 Deployment Readiness Checklist

**Project:** CollabConnect  
**Date:** October 20, 2025  
**Status:** ✅ DEPLOYMENT IN PROGRESS

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality & Testing
- [x] **Linting**: ESLint passes with no errors
- [x] **Type Checking**: TypeScript compilation succeeds (tsc --noEmit)
- [x] **Unit Tests**: Vitest test suite passes (2 files, 9 tests)
- [x] **Build**: Next.js production build succeeds locally
- [x] **Dependencies**: All npm packages installed and locked (package-lock.json)

### ✅ CI/CD Configuration
- [x] **GitHub Actions**: Deploy to Vercel workflow configured with:
  - Pre-deploy checks (lint, typecheck, test)
  - Environment variable guards (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, XAI_API_KEY)
  - Preview deployments for PRs
  - Production deployments on main push
  - Job summaries with deployment URLs
  - Smoke tests (home, health endpoints)
  - Concurrency groups to prevent conflicts
  - Manual workflow dispatch
- [x] **Auto-Redeploy**: 10-minute delayed redeploy workflow configured
- [x] **Post-Deploy Validation**: E2E and Lighthouse tests configured

### ✅ Vercel Configuration
- [x] **vercel.json**: Properly configured with:
  - Build/dev/install commands
  - Framework: Next.js
  - Regions: iad1 (US East)
  - Comprehensive environment variable mappings
  - Security headers (CSP, HSTS, X-Frame-Options, etc.)
  - Redirects and rewrites
- [x] **next.config.ts**: Security headers, image domains, Sentry integration

### 🔐 Secrets & Environment Variables

#### GitHub Secrets (Repository Settings)
- [ ] **VERCEL_TOKEN**: Vercel API token for deployments
- [ ] **VERCEL_ORG_ID**: Vercel organization ID
- [ ] **VERCEL_PROJECT_ID**: Vercel project ID
- [ ] **LHCI_GITHUB_APP_TOKEN**: Lighthouse CI GitHub app token (optional)

#### Vercel Project Environment Variables
**Core (Required):**
- [ ] **DATABASE_URL**: PostgreSQL connection string
- [ ] **NEXTAUTH_SECRET**: NextAuth.js secret (32+ chars random)
- [ ] **NEXTAUTH_URL**: Production URL (https://collab-connect.vercel.app)
- [ ] **XAI_API_KEY**: X.AI Grok API key

**Authentication:**
- [ ] **GOOGLE_CLIENT_ID**: Google OAuth client ID
- [ ] **GOOGLE_CLIENT_SECRET**: Google OAuth client secret

**Email:**
- [ ] **RESEND_API_KEY**: Resend email service API key

**SMS (Optional):**
- [ ] **TWILIO_ACCOUNT_SID**: Twilio account SID
- [ ] **TWILIO_AUTH_TOKEN**: Twilio auth token
- [ ] **TWILIO_PHONE_NUMBER**: Twilio phone number

**Push Notifications:**
- [ ] **VAPID_EMAIL**: VAPID email for push notifications
- [ ] **VAPID_PUBLIC_KEY**: VAPID public key
- [ ] **VAPID_PRIVATE_KEY**: VAPID private key
- [ ] **NEXT_PUBLIC_VAPID_PUBLIC_KEY**: Public VAPID key (client-side)

**Maps & Location:**
- [ ] **NEXT_PUBLIC_MAPTILER_KEY**: MapTiler API key
- [ ] **LOCATIONIQ_API_KEY**: LocationIQ geocoding API key
- [ ] **OPENCAGE_API_KEY**: OpenCage geocoding API key

**Third-Party APIs:**
- [ ] **HUNTER_API_KEY**: Hunter.io email verification
- [ ] **RAPIDAPI_KEY**: RapidAPI key
- [ ] **UNSPLASH_ACCESS_KEY**: Unsplash image API key
- [ ] **MYMEMORY_EMAIL**: MyMemory translation API email

**Storage:**
- [ ] **AWS_ACCESS_KEY_ID**: AWS S3 access key
- [ ] **AWS_SECRET_ACCESS_KEY**: AWS S3 secret key
- [ ] **AWS_S3_BUCKET** / **AWS_BUCKET_NAME**: S3 bucket name
- [ ] **AWS_REGION**: AWS region (e.g., us-east-1)

**Real-Time:**
- [ ] **PUSHER_APP_ID**: Pusher app ID
- [ ] **PUSHER_KEY**: Pusher key
- [ ] **PUSHER_SECRET**: Pusher secret
- [ ] **PUSHER_CLUSTER**: Pusher cluster (e.g., us2)

**Cache:**
- [ ] **UPSTASH_REDIS_REST_URL**: Upstash Redis REST URL
- [ ] **UPSTASH_REDIS_REST_TOKEN**: Upstash Redis REST token

**Monitoring:**
- [ ] **SENTRY_DSN**: Sentry error tracking DSN
- [ ] **SENTRY_ORG**: Sentry organization slug
- [ ] **SENTRY_PROJECT**: Sentry project slug
- [ ] **SENTRY_AUTH_TOKEN**: Sentry auth token (for releases)

---

## 🎯 Deployment Execution

### ✅ Current Status
- [x] **Workflow Fixed**: Auto-redeploy workflow updated with concurrency
- [x] **Force Deploy**: Empty commit pushed to main
- [x] **Pipeline Triggered**: Deploy to Vercel workflow started

### 🔄 Active Deployments
**Commit:** `1424fd9` - "ci: force deploy to vercel production"  
**Branch:** main  
**Workflow:** Deploy to Vercel  
**Status:** 🔄 Running

---

## 🧪 Post-Deployment Validation

### Health Checks
- [ ] **Home Page**: GET / → 200 with landing page content
- [ ] **Health Live**: GET /api/health/live → 200 { status: "alive" }
- [ ] **Health Ready**: GET /api/health/ready → 200 { status: "ready" }

### Core Features
- [ ] **XAI Status**: GET /api/ai/grok → { configured: true }
- [ ] **Auth Pages**: /auth/signin, /auth/signup, /dashboard accessible
- [ ] **OAuth Flow**: Google OAuth redirect and callback work
- [ ] **Email Verification**: /api/auth/verify endpoint operational
- [ ] **Database**: Prisma queries succeed
- [ ] **XAI Chat**: Authenticated POST /api/ai/grok with message works

### Performance & Quality
- [ ] **Security Headers**: CSP, HSTS, X-Frame-Options present
- [ ] **Image Optimization**: WebP/AVIF formats delivered
- [ ] **Lighthouse Score**: Performance, Accessibility, Best Practices, SEO
- [ ] **E2E Tests**: Playwright tests pass
- [ ] **Accessibility**: Axe tests pass
- [ ] **Sentry**: Error tracking receiving events

### Automated Checks
- [ ] **Smoke Tests**: Workflow smoke tests pass (home + health endpoints)
- [ ] **Post-Deploy Job**: E2E and Lighthouse CI pass in Actions
- [ ] **Auto-Redeploy**: 10-minute delayed redeploy completes successfully

---

## 📊 Monitoring & Observability

### GitHub Actions
**URL:** https://github.com/Hostilian/collab-connect/actions

1. Go to Actions tab
2. Find "Deploy to Vercel" workflow
3. Open latest run on main
4. Check Job Summary for:
   - ✅ Production URL
   - ✅ Smoke test results
   - ✅ Deployment status

### Vercel Dashboard
**URL:** https://vercel.com/dashboard

- View deployment logs
- Check environment variables
- Monitor build times and errors
- Access deployment URLs

### Sentry
**URL:** https://sentry.io

- Monitor error rates
- Track performance metrics
- View stack traces
- Set up alerts

---

## 🔥 Troubleshooting

### If Deploy Fails at "Verify Vercel secrets"
**Issue:** Missing VERCEL_TOKEN, VERCEL_ORG_ID, or VERCEL_PROJECT_ID

**Fix:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add the missing secrets
3. Re-run the workflow

### If Deploy Fails at "Verify core app env vars"
**Issue:** Missing DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, or XAI_API_KEY in Vercel

**Fix:**
1. Go to Vercel project → Settings → Environment Variables
2. Add the missing variables for Production, Preview, and Development
3. Re-run the workflow or push a new commit

### If Build Fails
**Common causes:**
- TypeScript errors → Run `npm run typecheck` locally
- Linting errors → Run `npm run lint` locally
- Missing dependencies → Run `npm install` and commit package-lock.json
- Environment variable issues → Check .env.example for required vars

### If Health Check Fails
**Issue:** /api/health/ready returns 503

**Possible causes:**
- Database connection failed (invalid DATABASE_URL)
- Database not accessible from Vercel (firewall/IP whitelist)
- Missing database tables (run migrations)

**Fix:**
1. Verify DATABASE_URL is correct in Vercel env vars
2. Check database provider allows connections from Vercel IPs
3. Run `npx prisma migrate deploy` in Vercel or locally against production DB

---

## 📝 Post-Deployment Tasks

### Immediate (Within 30 minutes)
- [ ] Capture production URL from GitHub Actions job summary
- [ ] Verify all health endpoints return 200
- [ ] Test critical user flows (sign up, sign in, post property)
- [ ] Check Sentry for any immediate errors
- [ ] Verify auto-redeploy workflow triggers after 10 minutes

### Short-term (Within 24 hours)
- [ ] Update README.md with production URL
- [ ] Run full E2E test suite against production
- [ ] Monitor error rates in Sentry
- [ ] Check performance metrics in Vercel Analytics
- [ ] Verify all third-party integrations work (Resend, XAI, etc.)

### Long-term (Within 1 week)
- [ ] Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Configure alerts for downtime and errors
- [ ] Review and optimize Lighthouse scores
- [ ] Set up automated weekly backups
- [ ] Document production runbook for common issues

---

## ✅ Sign-Off

**Deployment Lead:** GitHub Copilot  
**Date:** October 20, 2025  
**Production URL:** _Pending deployment completion_  
**Status:** 🚀 **DEPLOYMENT IN PROGRESS**

**Next Steps:**
1. Monitor GitHub Actions for deployment completion
2. Extract production URL from job summary
3. Run post-deployment validation checklist
4. Create deployment summary report

---

## 📞 Support & Resources

- **GitHub Repository:** https://github.com/Hostilian/collab-connect
- **Documentation:** See README.md, QUICKSTART.md, DEPLOYMENT.md
- **Issue Tracker:** https://github.com/Hostilian/collab-connect/issues
- **CI/CD Logs:** https://github.com/Hostilian/collab-connect/actions

---

*Last Updated: October 20, 2025*
