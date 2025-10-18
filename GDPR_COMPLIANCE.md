# 🇪🇺 GDPR Compliance Guide

## Overview

CollabConnect is fully compliant with the General Data Protection Regulation (GDPR) and respects user privacy rights.

## 👤 Data Subject Rights

### 1. Right to Access (Article 15)

Users can request a copy of all personal data we hold about them.

**Implementation:**

```typescript
// app/api/gdpr/data-export/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  // Collect all user data
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      collaborations: true,
      notifications: true,
      auditLogs: true,
    },
  });

  // Remove sensitive fields
  const exportData = {
    ...userData,
    password: undefined,
    emailVerificationToken: undefined,
  };

  // Create JSON export
  const jsonData = JSON.stringify(exportData, null, 2);

  return new Response(jsonData, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="collab-connect-data-${Date.now()}.json"`,
    },
  });
}
```

**User Interface:**

```typescript
// components/DataExport.tsx
export function DataExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const response = await fetch('/api/gdpr/data-export', {
        method: 'POST',
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-${Date.now()}.json`;
      a.click();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting...' : 'Download My Data'}
    </button>
  );
}
```

### 2. Right to Rectification (Article 16)

Users can update incorrect or incomplete personal data.

**Implementation:**
- Profile edit page at `/profile/edit`
- Email change with verification
- Real-time validation
- Audit logging of changes

### 3. Right to Erasure (Article 17)

Users can request deletion of their personal data ("Right to be Forgotten").

**Implementation:**

```typescript
// app/api/gdpr/delete-account/route.ts
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { confirmPassword, reason } = body;

  // Verify password
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isValid = await bcrypt.compare(confirmPassword, user.password);
  if (!isValid) {
    return Response.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Log deletion request
  await logAudit({
    action: AuditAction.DATA_DELETED,
    userId: session.user.id,
    userEmail: session.user.email,
    details: { reason },
    success: true,
  });

  // Anonymize or delete data
  await prisma.$transaction([
    // Delete user data
    prisma.profile.delete({ where: { userId: session.user.id } }),
    prisma.notification.deleteMany({ where: { userId: session.user.id } }),
    
    // Anonymize audit logs (keep for compliance)
    prisma.auditLog.updateMany({
      where: { userId: session.user.id },
      data: {
        userEmail: '[deleted]',
        ipAddress: '[deleted]',
      },
    }),
    
    // Delete user account
    prisma.user.delete({ where: { id: session.user.id } }),
  ]);

  // Send confirmation email
  await sendAccountDeletionEmail(user.email);

  return Response.json({ success: true });
}
```

### 4. Right to Data Portability (Article 20)

Users can export data in a machine-readable format.

**Formats Supported:**
- JSON (primary)
- CSV (tabular data)
- PDF (human-readable report)

### 5. Right to Object (Article 21)

Users can object to data processing for marketing purposes.

**Implementation:**
- Unsubscribe from marketing emails
- Opt-out of analytics tracking
- Disable personalized recommendations

### 6. Right to Restrict Processing (Article 18)

Users can temporarily suspend data processing.

**Implementation:**

```typescript
interface UserPrivacySettings {
  dataProcessingRestricted: boolean;
  marketingOptOut: boolean;
  analyticsOptOut: boolean;
  sharingOptOut: boolean;
}
```

## 📋 Data Collection & Processing

### Legal Basis for Processing

| Data Type | Legal Basis | Purpose |
|-----------|-------------|---------|
| Account Info (email, name) | Contract | Provide service |
| Profile Info | Consent | Collaboration matching |
| Location Data | Consent | Map visualization |
| Usage Data | Legitimate Interest | Service improvement |
| Cookie Data | Consent | Authentication |

### Data We Collect

**Account Data:**
- Email address
- Name
- Password (hashed)
- Account creation date

**Profile Data:**
- Bio
- Skills & interests
- Location (optional)
- Profile picture (optional)

**Usage Data:**
- IP address (anonymized after 90 days)
- User agent
- Page views
- API usage

**Communication Data:**
- Emails sent/received
- In-app messages
- Notifications

### Data Retention

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| Active accounts | Indefinite | User-initiated |
| Inactive accounts (2+ years) | Deleted | Automatic |
| Deleted account data | 30 days | Hard delete |
| Audit logs | 7 years | Legal requirement |
| Analytics data | 2 years | Automatic |
| Backups | 90 days | Automatic rotation |

## 🍪 Cookie Consent

### Cookie Banner Implementation

```typescript
// components/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  function acceptAll() {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    }));
    setShowBanner(false);
    initializeAnalytics();
  }

  function acceptNecessary() {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    }));
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 pr-4">
          <p className="text-sm">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            {' '}
            <a href="/privacy" className="underline">Learn more</a>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={acceptNecessary}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Necessary Only
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Cookie Categories

**Necessary Cookies:**
- Session management
- Authentication
- Security (CSRF tokens)
- Cannot be disabled

**Analytics Cookies:**
- Google Analytics
- Performance monitoring
- Usage statistics
- Can be disabled

**Marketing Cookies:**
- Advertising
- Social media integration
- Can be disabled

## 📄 Privacy Policy

### Required Sections

1. **Data Controller Information**
   - Company name
   - Contact details
   - DPO contact (if applicable)

2. **Data Collection**
   - What data we collect
   - How we collect it
   - Why we collect it

3. **Legal Basis**
   - Consent
   - Contract
   - Legitimate interest

4. **Data Sharing**
   - Third-party services
   - Data processors
   - International transfers

5. **User Rights**
   - Access
   - Rectification
   - Erasure
   - Data portability

6. **Security Measures**
   - Encryption
   - Access controls
   - Security audits

7. **Contact Information**
   - Privacy email
   - DPO contact
   - Supervisory authority

### Privacy Policy Template

```markdown
# Privacy Policy

**Last Updated: October 18, 2025**

## 1. Data Controller

CollabConnect Inc.
Email: privacy@collab-connect.com
DPO: dpo@collab-connect.com

## 2. Data We Collect

We collect the following personal data:
- Account information (email, name)
- Profile information (bio, skills, location)
- Usage data (IP address, browser type)

## 3. How We Use Your Data

We use your data to:
- Provide and improve our services
- Communicate with you
- Ensure security
- Comply with legal obligations

## 4. Legal Basis

We process your data based on:
- Your consent (profile data)
- Contract performance (account data)
- Legitimate interest (usage data)

## 5. Data Sharing

We may share data with:
- Service providers (hosting, email)
- Analytics providers (Google Analytics)
- Legal authorities (when required)

## 6. Your Rights

You have the right to:
- Access your data
- Correct inaccurate data
- Delete your data
- Export your data
- Object to processing
- Withdraw consent

## 7. Data Security

We protect your data using:
- Encryption (TLS/SSL)
- Access controls
- Regular security audits
- Secure data centers

## 8. Data Retention

We retain data:
- Active accounts: indefinitely
- Inactive accounts: 2 years
- Deleted accounts: 30 days
- Audit logs: 7 years

## 9. Cookies

We use cookies for:
- Authentication
- Security
- Analytics (with consent)

## 10. Contact Us

For privacy inquiries:
- Email: privacy@collab-connect.com
- DPO: dpo@collab-connect.com
```

## 🔒 Data Protection Measures

### Technical Measures

1. **Encryption**
   - TLS 1.3 for data in transit
   - AES-256 for data at rest
   - Bcrypt for passwords

2. **Access Controls**
   - Role-based access control (RBAC)
   - Multi-factor authentication (MFA)
   - Principle of least privilege

3. **Monitoring**
   - Audit logging
   - Intrusion detection
   - Anomaly detection

### Organizational Measures

1. **Staff Training**
   - GDPR awareness training
   - Data handling procedures
   - Security best practices

2. **Data Processing Agreements**
   - Contracts with processors
   - Sub-processor agreements
   - Liability clauses

3. **Incident Response**
   - Breach notification procedures
   - 72-hour reporting requirement
   - Communication templates

## 📊 Compliance Checklist

- ✅ Privacy policy published
- ✅ Cookie consent banner
- ✅ Data export functionality
- ✅ Account deletion
- ✅ Email verification
- ✅ Unsubscribe links
- ✅ Audit logging
- ✅ Data encryption
- ✅ Access controls
- ✅ Breach procedures
- ✅ DPA with processors
- ✅ Regular audits

## 🚨 Data Breach Response

### Notification Timeline

1. **Detection**: Immediate
2. **Assessment**: Within 24 hours
3. **Containment**: Within 48 hours
4. **Notification**: Within 72 hours

### Notification Template

```
Subject: Data Breach Notification - CollabConnect

Dear User,

We are writing to inform you of a data security incident that may have affected your personal information.

**What Happened:**
[Description of incident]

**Data Affected:**
[Types of data exposed]

**Actions Taken:**
[Steps to contain breach]

**What You Should Do:**
- Change your password immediately
- Enable two-factor authentication
- Monitor your accounts

**Contact:**
For questions: security@collab-connect.com

Sincerely,
CollabConnect Security Team
```

## 📞 Contact

**Privacy Officer:** privacy@collab-connect.com  
**Data Protection Officer:** dpo@collab-connect.com  
**Security Team:** security@collab-connect.com

**Supervisory Authority:**
[Your local data protection authority]

---

*Last Updated: October 2025*
*Version: 1.0*
