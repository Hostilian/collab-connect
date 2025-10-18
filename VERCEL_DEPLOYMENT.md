# Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Repository pushed to GitHub

### Step 1: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository `Hostilian/collab-connect`
4. Authorize Vercel to access your repository

### Step 2: Configure Project Settings

#### Framework Preset
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

#### Root Directory
- Leave as root (`/`)

### Step 3: Environment Variables

Add these required environment variables in Vercel Dashboard:

```bash
# Database
DATABASE_URL=your_database_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-app.vercel.app

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Sentry (Optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Step 4: Deploy

Click "Deploy" and Vercel will:
1. Clone your repository
2. Install dependencies
3. Run build process
4. Deploy to production

### Step 5: Configure GitHub Actions

#### Get Vercel Credentials

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Get your Project ID and Org ID from `.vercel/project.json`

#### Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN`: Get from Vercel Dashboard → Settings → Tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

### Step 6: Verify Deployment

1. Check deployment URL: `https://your-project.vercel.app`
2. Verify all pages load correctly
3. Check API routes work
4. Test authentication
5. Verify database connections

## 🔄 Automatic Deployments

### Production Deployments
- Every push to `main` branch triggers production deployment
- Pre-deployment checks run automatically
- Post-deployment validation ensures site health

### Preview Deployments
- Every PR gets a unique preview URL
- Preview URL is automatically commented on PR
- Full CI/CD checks run before deployment

## 📊 Monitoring

### Built-in Vercel Analytics
- Automatically enabled for all deployments
- View in Vercel Dashboard → Analytics

### Lighthouse CI
- Runs on every deployment
- Performance, Accessibility, SEO, Best Practices scores
- Results available in GitHub Actions artifacts

### Sentry Error Tracking
- Real-time error monitoring
- Performance tracking
- Release tracking

## 🔧 Advanced Configuration

### Custom Domains

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Vercel automatically provisions SSL certificate

### Edge Functions

Configured in `vercel.json`:
```json
{
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Caching Strategy

Headers configured for optimal caching:
- Static assets: 1 year cache
- API routes: No cache
- Pages: ISR with revalidation

### Security Headers

Security headers automatically applied:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 🐛 Troubleshooting

### Build Failures

**Issue**: `Module not found` errors
**Solution**: Ensure all dependencies are in `package.json` and commit `package-lock.json`

**Issue**: Environment variable errors
**Solution**: Check all required env vars are set in Vercel Dashboard

**Issue**: Type errors during build
**Solution**: Run `npm run typecheck` locally and fix issues

### Runtime Errors

**Issue**: Database connection fails
**Solution**: Verify `DATABASE_URL` is correct and database is accessible from Vercel

**Issue**: Authentication not working
**Solution**: Check `NEXTAUTH_URL` matches your deployment URL

### Performance Issues

**Issue**: Slow page loads
**Solution**: 
- Enable caching
- Optimize images with Next.js Image component
- Use ISR for dynamic pages
- Check Vercel Analytics for bottlenecks

## 📱 Mobile & PWA

The app is configured as a Progressive Web App:
- Service worker for offline support
- Web app manifest
- Mobile-responsive design
- Install prompt on mobile devices

## 🔐 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate tokens regularly** - Update Vercel env vars
3. **Enable Vercel Authentication** - For staging environments
4. **Use Vercel Firewall** - Configure IP allowlists if needed
5. **Monitor security advisories** - GitHub Dependabot enabled

## 📈 Scaling

Vercel automatically scales:
- **Serverless Functions**: Auto-scale to demand
- **Edge Network**: Global CDN for static assets
- **Database**: Use connection pooling (Prisma Accelerate recommended)

For high traffic:
1. Enable Vercel Pro plan for better limits
2. Use Redis caching (Upstash)
3. Implement rate limiting
4. Use ISR for dynamic content

## 🆘 Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Issues](https://github.com/Hostilian/collab-connect/issues)

## 🎯 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] OAuth providers configured (if using)
- [ ] Custom domain setup (optional)
- [ ] Monitoring enabled (Sentry, Vercel Analytics)
- [ ] Security headers verified
- [ ] Performance scores checked
- [ ] E2E tests passing
- [ ] Documentation updated
- [ ] Team notified of deployment

---

**Note**: For team deployments, consider using Vercel Teams for better collaboration and access control.
