# 🎯 DEPLOYMENT MONITORING GUIDE

## 🚀 Current Deployment Status

**Time:** October 20, 2025  
**Status:** 🔄 **DEPLOYMENT IN PROGRESS**  
**Commits Pushed:**
- `27676b1` - Auto-redeploy workflow with concurrency
- `1424fd9` - Force deploy to Vercel production (TRIGGERED DEPLOY)
- `11167e5` - Deployment docs

---

## 📊 How to Monitor the Deployment

### 1. GitHub Actions (Primary Source of Truth)

**URL:** https://github.com/Hostilian/collab-connect/actions

#### What to Do:
1. Click the "Actions" tab in GitHub
2. Look for the "Deploy to Vercel" workflow
3. Find the run triggered by commit `1424fd9` or later
4. Click on the workflow run

#### What You'll See:
- **Pre-deploy checks** job running lint, typecheck, tests
- **Deploy-production** job running:
  - Setup Node.js
  - Install Vercel CLI
  - Verify secrets
  - Pull Vercel env vars
  - **Verify core env vars** (DATABASE_URL, NEXTAUTH_SECRET, etc.) ← Can fail here
  - Build artifacts
  - Deploy to production
  - **Production URL appears here** ← This is what you need!
  - Smoke tests (home + health endpoints)
- **Post-deploy-validation** job (optional, may be skipped)

#### Getting the Production URL:
1. Wait for "deploy-production" job to complete
2. Look at the **Job Summary** section
3. Find the line: `URL: https://collab-connect-XXXXX.vercel.app`
4. That's your production URL!

---

### 2. Vercel Dashboard (Alternative)

**URL:** https://vercel.com/dashboard

#### What to Do:
1. Log in to Vercel
2. Find your "collab-connect" project
3. Look at the "Deployments" tab
4. Find the latest deployment (should be building or completed)

#### What You'll See:
- Build logs
- Deployment status (Building / Ready / Error)
- Production URL
- Environment variables
- Build time

**Note:** If Vercel UI shows 502/429 errors (dashboard issues), rely on GitHub Actions instead.

---

### 3. Auto-Redeploy in 10 Minutes

After the primary deploy succeeds:

1. Wait ~10 minutes
2. Check GitHub Actions for new workflow: **"Redeploy 10 minutes after deploy"**
3. This will:
   - Sleep for 10 minutes
   - Create empty commit: "ci: auto-redeploy 10 minutes after deploy"
   - Push to main
   - Trigger another "Deploy to Vercel" run
4. Second deploy ensures all changes propagate fully

---

## ✅ Quick Health Checks (After Deploy)

Once you have the production URL from GitHub Actions:

### Using Browser
```
https://YOUR-PRODUCTION-URL.vercel.app/
https://YOUR-PRODUCTION-URL.vercel.app/api/health/live
https://YOUR-PRODUCTION-URL.vercel.app/api/health/ready
https://YOUR-PRODUCTION-URL.vercel.app/api/ai/grok
```

### Using Command Line (Windows CMD)
```cmd
set PROD_URL=https://YOUR-PRODUCTION-URL.vercel.app

REM Home page
curl %PROD_URL%

REM Health live
curl %PROD_URL%/api/health/live

REM Health ready
curl %PROD_URL%/api/health/ready

REM XAI status
curl %PROD_URL%/api/ai/grok
```

### Expected Responses

**Home Page:**
- Status: 200
- Content: HTML with "CollabConnect" title and modern dark UI

**Health Live:**
```json
{
  "status": "alive",
  "timestamp": "2025-10-20T..."
}
```

**Health Ready:**
```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "email": "ok"
  }
}
```

**XAI Status:**
```json
{
  "status": "ok",
  "configured": true,
  "message": "XAI API is configured"
}
```

---

## 🚨 Common Issues & Fixes

### Issue: Deploy Fails at "Verify Vercel secrets"
**Error:** `Missing one or more required secrets`

**Fix:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Get values from Vercel dashboard → Settings → Tokens
4. Re-run the workflow

---

### Issue: Deploy Fails at "Verify core app env vars"
**Error:** `Missing DATABASE_URL in .env.production.local`

**Fix:**
1. Go to Vercel project → Settings → Environment Variables
2. Add missing variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `NEXTAUTH_SECRET` (random 32+ char string)
   - `NEXTAUTH_URL` (production URL, e.g., https://collab-connect.vercel.app)
   - `XAI_API_KEY` (X.AI Grok API key)
3. Make sure to add them to:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Re-run the workflow or push a new commit

---

### Issue: Health Ready Returns 503
**Error:** `{ "status": "not_ready", "checks": { "database": "error" } }`

**Cause:** Database connection failed

**Fix:**
1. Verify `DATABASE_URL` is correct
2. Check database is accessible from Vercel (firewall/IP allowlist)
3. Ensure database tables exist (run migrations):
   ```bash
   npx prisma migrate deploy
   ```
4. Test connection locally:
   ```bash
   npx prisma db pull
   ```

---

### Issue: XAI Returns Not Configured
**Error:** `{ "configured": false, "message": "XAI_API_KEY is not set" }`

**Fix:**
1. Add `XAI_API_KEY` to Vercel env vars
2. Redeploy (workflow will pick it up automatically)

---

### Issue: Build Fails with TypeScript Errors

**Fix:**
1. Run locally:
   ```bash
   npm run typecheck
   npm run build
   ```
2. Fix any errors
3. Commit and push

---

## 📈 Success Indicators

### ✅ Deployment Successful When:
- GitHub Actions shows green checkmark ✅
- Production URL accessible
- Home page loads (200)
- Health endpoints return 200
- No errors in build logs

### ✅ Fully Operational When:
- All health checks pass
- Auth pages load
- XAI configured: true
- Database connected
- Sentry receiving events
- Auto-redeploy completes

---

## 📞 Where to Get Help

### Documentation
- **Deployment Checklist:** `DEPLOYMENT_READINESS_CHECKLIST.md`
- **Deployment Summary:** `DEPLOYMENT_SUMMARY.md`
- **README:** `README.md`
- **Quick Start:** `QUICKSTART.md`

### Logs & Debugging
- **GitHub Actions:** Full build logs, smoke test results
- **Vercel Dashboard:** Deployment logs, runtime logs
- **Sentry:** Error tracking and performance
- **Browser DevTools:** Console errors, network requests

---

## 🎯 Timeline

### Now (0-5 minutes)
- Deploy to Vercel workflow running
- Building production artifacts
- Deploying to Vercel
- **WAIT FOR THIS TO COMPLETE**

### Soon (5-10 minutes)
- Deploy completes
- Production URL available in GitHub Actions job summary
- Smoke tests pass
- Auto-redeploy workflow queues

### Later (10-15 minutes)
- Auto-redeploy workflow triggers
- Sleeps for 10 minutes
- Creates empty commit
- Triggers second deploy

### Finally (15-20 minutes)
- Second deploy completes
- Post-deploy validation (E2E, Lighthouse)
- All systems green ✅

---

## 📋 Immediate Next Steps

1. **Monitor GitHub Actions**
   - https://github.com/Hostilian/collab-connect/actions
   - Wait for "Deploy to Vercel" to complete

2. **Capture Production URL**
   - Open the workflow run
   - Look at "deploy-production" job summary
   - Copy the production URL

3. **Run Health Checks**
   - Test home page
   - Test /api/health/live
   - Test /api/health/ready
   - Test /api/ai/grok

4. **Monitor Auto-Redeploy**
   - Wait 10 minutes
   - Check for "Redeploy 10 minutes after deploy" workflow
   - Verify second deploy completes

5. **Update Documentation**
   - Add production URL to README
   - Mark deployment as complete
   - Document any issues encountered

---

**Last Updated:** October 20, 2025  
**Status:** 🔄 **MONITORING DEPLOYMENT**

Check GitHub Actions now: https://github.com/Hostilian/collab-connect/actions
