# 🔐 Security Guide

## Overview

Comprehensive security implementation for CollabConnect including headers, authentication, data protection, and compliance.

## 🛡️ Security Headers

### Implemented Headers

All security headers are configured in `next.config.ts`:

```typescript
Content-Security-Policy: Enhanced CSP with strict policies
Strict-Transport-Security: HSTS with preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: Restrictive permissions
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

### Content Security Policy

```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.sentry.io
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: https: blob:
font-src 'self' https://fonts.gstatic.com
connect-src 'self' https://*.sentry.io https://*.vercel.app https://*.upstash.io
frame-src 'self' https://vercel.live
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
upgrade-insecure-requests
```

## 🔒 Authentication Security

### Password Requirements

- Minimum 8 characters
- Bcrypt hashing with salt rounds: 10
- Password reset tokens expire in 1 hour
- Failed login attempts are rate-limited (5 attempts / 15 minutes)

### Email Verification

- Required for account activation
- Tokens expire in 24 hours
- Resend limited to 3 emails / hour

### Session Management

- JWT-based sessions
- HttpOnly cookies
- Secure flag in production
- SameSite: Lax
- Session expiry: 30 days

## 🚦 Rate Limiting

### Endpoints & Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Email sending | 3 emails | 1 hour |
| Map queries | 300 requests | 1 minute |
| Search | 60 requests | 1 minute |
| Profile updates | 20 requests | 1 hour |
| File uploads | 10 uploads | 1 hour |
| General API | 100 requests | 15 minutes |

### Implementation

```typescript
// Applied via middleware
import { rateLimiters } from '@/lib/ratelimit';

const { success, limit, reset } = await rateLimiters.api.limit(clientId);
```

## 📋 Audit Logging

### Logged Actions

**Authentication Events:**
- USER_LOGIN
- USER_LOGOUT
- USER_REGISTER
- LOGIN_FAILED
- PASSWORD_RESET
- EMAIL_VERIFIED

**Profile Events:**
- PROFILE_CREATED
- PROFILE_UPDATED
- PROFILE_DELETED
- PROFILE_IMAGE_UPLOADED

**Security Events:**
- SUSPICIOUS_ACTIVITY
- RATE_LIMIT_EXCEEDED
- UNAUTHORIZED_ACCESS

**Data Events:**
- DATA_EXPORTED
- DATA_DELETED

### Audit Log Structure

```typescript
{
  action: string,
  userId?: string,
  userEmail?: string,
  ipAddress?: string,
  userAgent?: string,
  resource?: string,
  resourceId?: string,
  details?: object,
  success: boolean,
  errorMessage?: string,
  timestamp: Date
}
```

### Usage Example

```typescript
import { logAudit, AuditAction } from '@/lib/audit';

await logAudit({
  action: AuditAction.USER_LOGIN,
  userId: user.id,
  userEmail: user.email,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  success: true,
});
```

## 🔐 Data Protection

### Encryption at Rest

- Database: PostgreSQL with encryption
- Passwords: Bcrypt hashed
- Sensitive data: Encrypted fields

### Encryption in Transit

- HTTPS only in production
- TLS 1.3 minimum
- Strong cipher suites
- HSTS enabled with preload

### Personal Data Handling

```typescript
// Sensitive fields
const sensitiveFields = [
  'password',
  'emailVerificationToken',
  'resetPasswordToken',
];

// Never return these in API responses
const user = await prisma.user.findUnique({
  select: {
    id: true,
    email: true,
    name: true,
    // password: false (implicit)
  },
});
```

## 🛡️ Input Validation

### Server-Side Validation

```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Invalid email format');
}

// SQL injection prevention (Prisma handles this)
// XSS prevention (sanitize user input)
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### File Upload Security

```typescript
// Allowed MIME types
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Max file size: 5MB
const maxSize = 5 * 1024 * 1024;

// Validate file
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

if (file.size > maxSize) {
  throw new Error('File too large');
}
```

## 🔍 Vulnerability Scanning

### Automated Scanning

1. **Dependabot** - Dependency vulnerabilities
2. **CodeQL** - Code security analysis
3. **Snyk** (optional) - Container and code scanning
4. **npm audit** - Package vulnerabilities

### Manual Security Review

```bash
# Run security audit
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

## 🚨 Incident Response

### Detection

- Monitor audit logs for suspicious patterns
- Alert on rate limit violations
- Track failed login attempts
- Monitor error rates in Sentry

### Response Procedure

1. **Identify** - Determine scope and impact
2. **Contain** - Isolate affected systems
3. **Eradicate** - Remove threat
4. **Recover** - Restore services
5. **Document** - Record incident details
6. **Review** - Post-mortem analysis

### Emergency Contacts

- Security Team: security@collab-connect.com
- On-call Engineer: oncall@collab-connect.com
- PagerDuty: [escalation policy]

## 📊 Security Monitoring

### Key Metrics

- Failed login attempts per hour
- Rate limit violations
- Unusual API access patterns
- Geographic anomalies
- Privilege escalation attempts

### Alerting Rules

```yaml
# Alert when 10+ failed logins from same IP
- name: Brute Force Detection
  condition: failed_logins > 10
  window: 5m
  action: block_ip

# Alert when unusual data access
- name: Data Exfiltration
  condition: api_requests > 1000
  window: 1m
  action: notify_security_team
```

## 🔧 Security Configuration

### Environment Variables

```bash
# Never commit these!
NEXTAUTH_SECRET=  # Generate with: openssl rand -base64 64
DATABASE_URL=     # Use SSL in production
RESEND_API_KEY=   # Rotate monthly
UPSTASH_REDIS_REST_TOKEN=  # Rotate quarterly
SENTRY_AUTH_TOKEN=  # Service-specific token
```

### Database Security

```sql
-- Create read-only user for analytics
CREATE USER analytics WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;

-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM PUBLIC;
```

## 🎯 Security Best Practices

### Development

- ✅ Use environment variables for secrets
- ✅ Never commit sensitive data
- ✅ Enable pre-commit hooks
- ✅ Use TypeScript for type safety
- ✅ Validate all user input
- ✅ Sanitize HTML output
- ✅ Use parameterized queries
- ✅ Enable CORS properly

### Production

- ✅ Enable HTTPS only
- ✅ Use strong CSP headers
- ✅ Implement rate limiting
- ✅ Enable audit logging
- ✅ Monitor error rates
- ✅ Rotate secrets regularly
- ✅ Keep dependencies updated
- ✅ Use security scanning tools

## 📜 Compliance

### GDPR

- Data export functionality
- Right to deletion
- Cookie consent
- Privacy policy
- Data processing agreement

### CCPA

- Do not sell data option
- Data disclosure
- Opt-out mechanisms

### SOC 2

- Access controls
- Audit logging
- Encryption standards
- Incident response

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

*Last Updated: October 2025*
*Security Contact: security@collab-connect.com*
