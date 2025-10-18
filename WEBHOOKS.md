# 🔗 Webhooks System Documentation

## Overview

CollabConnect webhooks allow you to receive real-time HTTP notifications when events occur in your account.

## 📡 How Webhooks Work

1. You configure a webhook endpoint URL in your settings
2. CollabConnect monitors for specific events
3. When an event occurs, we send an HTTP POST to your endpoint
4. Your endpoint processes the payload and responds with 200 OK
5. We retry failed deliveries with exponential backoff

## 🎯 Supported Events

### User Events
- `user.created` - New user registered
- `user.updated` - User profile updated
- `user.deleted` - User account deleted
- `user.verified` - Email verified

### Collaboration Events
- `collaboration.created` - New collaboration created
- `collaboration.updated` - Collaboration details changed
- `collaboration.member_added` - User joined collaboration
- `collaboration.member_removed` - User left collaboration

### Profile Events
- `profile.updated` - Profile information changed
- `profile.image_uploaded` - Profile picture updated
- `profile.location_changed` - Location coordinates changed

## 📦 Webhook Payload

### Structure

```json
{
  "id": "evt_1234567890",
  "type": "user.created",
  "created": 1634567890,
  "data": {
    "object": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-10-18T12:00:00Z"
    }
  },
  "livemode": true
}
```

### Headers

```
Content-Type: application/json
X-Webhook-ID: evt_1234567890
X-Webhook-Signature: sha256=abc123...
X-Webhook-Timestamp: 1634567890
User-Agent: CollabConnect-Webhooks/1.0
```

## 🔐 Security

### Signature Verification

Every webhook includes a signature in the `X-Webhook-Signature` header.

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${expectedSignature}` === signature;
}

// Usage
const isValid = verifyWebhookSignature(
  JSON.stringify(payload),
  req.headers['x-webhook-signature'],
  process.env.WEBHOOK_SECRET
);

if (!isValid) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Best Practices

1. ✅ Always verify signatures
2. ✅ Use HTTPS endpoints only
3. ✅ Return 200 OK quickly
4. ✅ Process async in background
5. ✅ Implement idempotency
6. ✅ Log all webhook attempts
7. ✅ Monitor for failures

## 📝 Implementation Example

### Express.js Handler

```typescript
import express from 'express';
import { verifyWebhookSignature } from './utils';

const app = express();

app.post('/webhooks/collabconnect', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body.toString();

  // Verify signature
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(payload);

  // Handle event types
  switch (event.type) {
    case 'user.created':
      handleUserCreated(event.data.object);
      break;
    case 'collaboration.created':
      handleCollaborationCreated(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return 200 OK
  res.json({ received: true });
});

async function handleUserCreated(user) {
  // Process in background
  await queue.add('send-welcome-email', { userId: user.id });
}
```

### Next.js API Route

```typescript
// app/api/webhooks/collabconnect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-webhook-signature');

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (`sha256=${expectedSignature}` !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Handle event
  await handleWebhookEvent(event);

  return NextResponse.json({ received: true });
}

async function handleWebhookEvent(event: WebhookEvent) {
  switch (event.type) {
    case 'user.created':
      // Handle user creation
      await sendInternalNotification('New user signed up!');
      break;
    // ... other cases
  }
}
```

## 🔄 Retry Logic

### Retry Schedule

| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1 | Immediate | 0s |
| 2 | 5 seconds | 5s |
| 3 | 25 seconds | 30s |
| 4 | 2 minutes | 2.5m |
| 5 | 10 minutes | 12.5m |
| 6 | 1 hour | 1h 12.5m |

### Failed Delivery Handling

- After 6 failed attempts, webhook is marked as failed
- You'll receive an email notification
- Webhook can be manually retried from dashboard
- Check webhook logs for error details

## 🧪 Testing

### Test Endpoint

```bash
# Send test webhook
curl -X POST https://your-app.com/api/webhooks/test \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: sha256=test" \
  -d '{
    "id": "evt_test_123",
    "type": "user.created",
    "created": 1634567890,
    "data": {
      "object": {
        "id": "user_test_123",
        "email": "test@example.com"
      }
    },
    "livemode": false
  }'
```

### Local Testing with ngrok

```bash
# Start ngrok
ngrok http 3000

# Use ngrok URL as webhook endpoint
https://abc123.ngrok.io/api/webhooks/collabconnect
```

### Mock Event Generator

```typescript
// scripts/test-webhook.ts
async function sendTestWebhook(type: string) {
  const payload = {
    id: `evt_test_${Date.now()}`,
    type,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'test_123',
        email: 'test@example.com',
      },
    },
    livemode: false,
  };

  const response = await fetch('http://localhost:3000/api/webhooks/collabconnect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': generateSignature(payload),
    },
    body: JSON.stringify(payload),
  });

  console.log('Response:', await response.json());
}

sendTestWebhook('user.created');
```

## 📊 Monitoring

### Webhook Dashboard

View webhook status in your dashboard:
- Total deliveries
- Success rate
- Failed deliveries
- Average response time
- Recent attempts

### Logs

All webhook attempts are logged:

```typescript
{
  id: 'wh_attempt_123',
  webhookId: 'wh_456',
  eventType: 'user.created',
  url: 'https://example.com/webhook',
  status: 200,
  responseTime: 145,
  attempt: 1,
  error: null,
  timestamp: '2024-10-18T12:00:00Z'
}
```

## 🛠️ Configuration

### Creating a Webhook

```bash
# Via API
curl -X POST https://api.collab-connect.com/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/collabconnect",
    "events": ["user.created", "user.updated"],
    "description": "Production webhook",
    "enabled": true
  }'
```

### Webhook Settings

```typescript
interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  description?: string;
  headers?: Record<string, string>;
  metadata?: Record<string, any>;
}
```

## ⚠️ Common Issues

### Issue: Webhook Timing Out

**Cause:** Processing takes too long

**Solution:**
```typescript
// ❌ Bad: Slow processing blocks response
app.post('/webhook', async (req, res) => {
  await longRunningTask(); // Takes 30+ seconds
  res.json({ received: true });
});

// ✅ Good: Queue and respond quickly
app.post('/webhook', async (req, res) => {
  await queue.add('process-webhook', req.body);
  res.json({ received: true }); // Responds in <1s
});
```

### Issue: Duplicate Events

**Cause:** Retry logic or network issues

**Solution:**
```typescript
// Implement idempotency
const processedEvents = new Set();

function handleWebhook(event) {
  if (processedEvents.has(event.id)) {
    return; // Already processed
  }

  // Process event
  processEvent(event);

  // Mark as processed
  processedEvents.add(event.id);
}
```

### Issue: Invalid Signature

**Cause:** Wrong secret or payload modification

**Solution:**
```typescript
// Use raw body, not parsed JSON
app.post('/webhook',
  express.raw({ type: 'application/json' }), // ✅
  (req, res) => {
    const body = req.body.toString(); // Raw bytes
    verifySignature(body, signature, secret);
  }
);
```

## 📚 Resources

- [Webhook Best Practices](https://webhooks.fyi/)
- [Testing Webhooks](https://webhook.site/)
- [ngrok Documentation](https://ngrok.com/docs)

---

*Last Updated: October 2025*
*API Version: 1.0*
