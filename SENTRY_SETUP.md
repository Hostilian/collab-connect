# Sentry Integration Guide

CollabConnect uses Sentry for error tracking and performance monitoring in production.

## Setup

### 1. Create Sentry Project

1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project for "Next.js"
3. Note your DSN and auth token

### 2. Configure Environment Variables

Add to your `.env.local` (development) and Vercel environment variables (production):

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="collab-connect"
```

### 3. Install Dependencies

```bash
npm install --save @sentry/nextjs
```

### 4. Initialize Sentry

Run the Sentry wizard:

```bash
npx @sentry/wizard@latest -i nextjs
```

This will create:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Update `next.config.ts` with Sentry configuration

### 5. Configure Sentry Files

The wizard creates these files. Customize as needed:

**sentry.client.config.ts**:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  
  // Configure integrations
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  environment: process.env.NODE_ENV,
});
```

### 6. Upload Source Maps (CI/CD)

Source maps are automatically uploaded during build if `SENTRY_AUTH_TOKEN` is set.

For manual upload:
```bash
npx @sentry/cli releases files YOUR_RELEASE upload-sourcemaps .next
```

## Usage

### Capturing Errors

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Adding Context

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

Sentry.setTag("section", "map-view");
Sentry.setContext("collaboration", {
  id: collab.id,
  type: collab.type,
});
```

### Custom Events

```typescript
Sentry.captureMessage("User completed onboarding", "info");
```

### Performance Monitoring

```typescript
import * as Sentry from "@sentry/nextjs";

const transaction = Sentry.startTransaction({
  name: "Load Map Users",
  op: "http.server",
});

try {
  // Your operation
  const span = transaction.startChild({
    op: "db.query",
    description: "Fetch users from database",
  });
  
  const users = await fetchUsers();
  
  span.finish();
} finally {
  transaction.finish();
}
```

## CI/CD Integration

### GitHub Actions

The deploy workflow automatically uploads source maps:

```yaml
- name: Upload source maps to Sentry
  if: github.ref == 'refs/heads/main'
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: ${{ secrets.SENTRY_ORG }}
    SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT }}
  run: |
    npx @sentry/cli releases new ${{ github.sha }}
    npx @sentry/cli releases files ${{ github.sha }} upload-sourcemaps .next
    npx @sentry/cli releases finalize ${{ github.sha }}
```

### Required GitHub Secrets

- `SENTRY_AUTH_TOKEN` - Authentication token for Sentry CLI
- `SENTRY_ORG` - Your Sentry organization slug
- `SENTRY_PROJECT` - Your Sentry project slug

## Alerts

Configure alerts in Sentry dashboard:

1. **Error Rate Alert**: Notify when error rate exceeds threshold
2. **New Issue Alert**: Notify on new error types
3. **Performance Alert**: Notify when page load time degrades
4. **User Feedback Alert**: Notify on user-submitted feedback

## Best Practices

1. **Don't log PII**: Mask sensitive data in error messages
2. **Set appropriate sample rates**: Reduce costs in production
3. **Use breadcrumbs**: Add context to error reports
4. **Tag strategically**: Use tags for filtering and grouping
5. **Monitor release health**: Track error rates per release
6. **Set up alerts**: Don't rely on manual checking

## Troubleshooting

### Source Maps Not Uploading

Ensure `SENTRY_AUTH_TOKEN` is set in CI environment and has `project:releases` permission.

### Errors Not Appearing

Check:
1. DSN is correct
2. Sentry is initialized before errors occur
3. Network connectivity (check browser console)
4. Sample rates aren't filtering too aggressively

### High Event Volume

Adjust sample rates:
```typescript
tracesSampleRate: 0.1,  // 10% of transactions
replaysSessionSampleRate: 0.01,  // 1% of sessions
```

## Resources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://sentry.io)
- [Sentry CLI Docs](https://docs.sentry.io/cli/)
