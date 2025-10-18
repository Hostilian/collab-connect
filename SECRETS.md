# Secrets Management Guide

This document outlines all secrets and environment variables required for the Collab Connect application and CI/CD pipelines.

## Application Secrets

### Required for Development

| Secret | Description | How to Generate |
|--------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | Install PostgreSQL locally or use Docker |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL for authentication callbacks | `http://localhost:3000` (dev) |
| `RESEND_API_KEY` | API key for email service | Sign up at [resend.com](https://resend.com) |

### Optional Secrets

| Secret | Description | When Needed |
|--------|-------------|-------------|
| `MAPBOX_TOKEN` | Mapbox access token | If using Mapbox instead of MapLibre |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking | Production error monitoring |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for sourcemap upload | Production deploys with Sentry |

## GitHub Repository Secrets

Configure these in: **Settings → Secrets and variables → Actions**

### Required for CI/CD

| Secret | Description | How to Get |
|--------|-------------|------------|
| `CODECOV_TOKEN` | Token for uploading coverage reports | Sign up at [codecov.io](https://codecov.io), add repo |
| `VERCEL_TOKEN` | Vercel API token for deployments | Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization/team ID | Found in Vercel project settings or `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel project ID | Found in Vercel project settings or `.vercel/project.json` |

### Optional CI Secrets

| Secret | Description | When Needed |
|--------|-------------|-------------|
| `SNYK_TOKEN` | Snyk token for security scanning | If using Snyk instead of CodeQL |

## Vercel Environment Variables

Configure these in: **Vercel Dashboard → Project → Settings → Environment Variables**

Add all secrets from `.env.example` to Vercel for each environment (Production, Preview, Development):

- `DATABASE_URL` - Your production PostgreSQL URL
- `NEXTAUTH_SECRET` - Production secret (different from dev)
- `NEXTAUTH_URL` - Your production URL (e.g., `https://collab-connect.vercel.app`)
- `RESEND_API_KEY` - Your Resend API key
- `NEXT_PUBLIC_APP_URL` - Your production URL
- Any optional secrets you're using

## Jenkins Secrets (if using)

Configure these in: **Jenkins → Credentials → System → Global credentials**

| Credential | Type | Description |
|------------|------|-------------|
| `VERCEL_TOKEN` | Secret text | Vercel token for deployments |
| `github-pat` | Username with password | GitHub PAT for repo access |

## Security Best Practices

### 1. Never Commit Secrets

- Always use `.env.example` with placeholder values
- Keep real secrets in `.env` (already in `.gitignore`)
- Use environment-specific secrets (different for dev/staging/prod)

### 2. Rotate Secrets Regularly

- Rotate API keys every 90 days
- Rotate `NEXTAUTH_SECRET` after security incidents
- Update all environments when rotating

### 3. Least Privilege

- Use read-only tokens where possible
- Limit token scopes (e.g., Vercel tokens scoped to specific projects)
- Don't share production secrets with development

### 4. Secret Storage

For production workloads, consider:
- **HashiCorp Vault** - Enterprise secret management
- **AWS Secrets Manager** - If deploying to AWS
- **GitHub Secrets** - For CI/CD only (current setup)
- **Vercel Environment Variables** - For Vercel deployments (current setup)

## Getting Tokens

### Codecov Token

1. Go to [codecov.io](https://codecov.io)
2. Sign in with GitHub
3. Add your repository
4. Copy the upload token
5. Add as `CODECOV_TOKEN` in GitHub Secrets

### Vercel Tokens

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Tokens → Create Token
3. Copy the token (shown once!)
4. Add as `VERCEL_TOKEN` in GitHub Secrets

For project IDs:
```bash
# Link your project first
npx vercel link

# IDs are stored in .vercel/project.json
cat .vercel/project.json
```

### Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in dashboard
3. Add to `.env` and Vercel environment variables

## Troubleshooting

### Missing Secrets Error in CI

Check GitHub Actions logs for which secret is missing, then verify:
1. Secret exists in GitHub repository settings
2. Secret name matches exactly (case-sensitive)
3. Secret has a value (not empty)

### Vercel Deploy Fails

Ensure all three Vercel secrets are set:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Email Not Sending

1. Verify `RESEND_API_KEY` is set correctly
2. Check Resend dashboard for API limits/errors
3. Ensure sender email is verified in Resend

## Need Help?

- Check environment variable names in `.env.example`
- Review CI workflow files in `.github/workflows/`
- Create an issue with the "bug" label if secrets aren't working
