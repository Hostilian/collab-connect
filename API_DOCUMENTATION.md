# 📚 API Documentation

## Overview

Complete API reference for Collab-Connect including authentication, endpoints, rate limits, and examples.

**Base URL:** `https://your-domain.com/api`  
**Version:** 1.0.0  
**Authentication:** NextAuth.js (JWT)

---

## 🔐 Authentication

### Sign Up

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "clxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "emailVerified": null
  },
  "message": "Verification email sent"
}
```

**Rate Limit:** 5 requests / 15 minutes

---

### Sign In

Authenticate with email and password.

**Endpoint:** `POST /api/auth/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clxxx",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Rate Limit:** 5 requests / 15 minutes

---

### Verify Email

Verify email address with token.

**Endpoint:** `GET /api/auth/verify?token=xxx`

**Query Parameters:**
- `token` (required): Email verification token

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Rate Limit:** 10 requests / hour

---

### Resend Verification

Resend verification email.

**Endpoint:** `POST /api/auth/resend-verification`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

**Rate Limit:** 3 requests / hour (email limit)

---

## 🗺️ Map API

### Get Users on Map

Retrieve users within geographical bounds.

**Endpoint:** `GET /api/map/users`

**Query Parameters:**
- `minLat` (optional): Minimum latitude
- `maxLat` (optional): Maximum latitude
- `minLng` (optional): Minimum longitude
- `maxLng` (optional): Maximum longitude
- `limit` (optional): Results per page (default: 50, max: 100)
- `page` (optional): Page number (default: 1)

**Example Request:**
```bash
GET /api/map/users?minLat=37.0&maxLat=38.0&minLng=-123.0&maxLng=-122.0&limit=20
```

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "clxxx",
      "name": "John Doe",
      "image": "https://...",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "bio": "Full-stack developer...",
      "skills": ["JavaScript", "React"],
      "availability": "Available",
      "location": "San Francisco, CA"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "hasMore": false
}
```

**Rate Limit:** 300 requests / minute

---

## 🔍 Search API

### Search Users

Search for users by name, skills, or interests.

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `q` (required): Search query (min 2 characters)
- `limit` (optional): Results per page (default: 20, max: 50)
- `page` (optional): Page number (default: 1)
- `filter` (optional): Filter type (`skills`, `location`, `availability`)

**Example Request:**
```bash
GET /api/search?q=javascript&filter=skills&limit=10
```

**Response:** `200 OK`
```json
{
  "query": "javascript",
  "total": 42,
  "page": 1,
  "limit": 10,
  "results": [
    {
      "id": "clxxx",
      "name": "John Doe",
      "bio": "Full-stack developer...",
      "skills": ["JavaScript", "TypeScript", "React"],
      "location": "San Francisco, CA",
      "availability": "Available"
    }
  ]
}
```

**Rate Limit:** 60 requests / minute

---

## 👤 Profile API

### Get User Profile

Retrieve a user's profile.

**Endpoint:** `GET /api/profile/:userId`

**Response:** `200 OK`
```json
{
  "id": "clxxx",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://...",
  "bio": "Full-stack developer passionate about collaboration",
  "location": "San Francisco, CA",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "interests": ["Web Development", "AI/ML"],
  "availability": "Available",
  "timezone": "America/Los_Angeles",
  "createdAt": "2024-10-18T12:00:00.000Z"
}
```

**Rate Limit:** 100 requests / 15 minutes

---

### Update Profile

Update authenticated user's profile.

**Endpoint:** `PUT /api/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Updated bio",
  "location": "New York, NY",
  "skills": ["JavaScript", "Python"],
  "interests": ["AI", "Blockchain"],
  "availability": "Part-time"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "profile": {
    "id": "clxxx",
    "name": "John Doe",
    "bio": "Updated bio",
    ...
  }
}
```

**Rate Limit:** 20 requests / hour

---

## 🏥 Health Checks

### Basic Health Check

Check if API is running.

**Endpoint:** `GET /api/health`

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-10-18T12:00:00.000Z",
  "uptime": 12345,
  "environment": "production",
  "version": "1.0.0"
}
```

**Rate Limit:** None

---

### Readiness Check

Check if API and dependencies are ready.

**Endpoint:** `GET /api/health/ready`

**Response:** `200 OK`
```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "email": "ok"
  }
}
```

**Response on failure:** `503 Service Unavailable`
```json
{
  "status": "not_ready",
  "checks": {
    "database": "error",
    "email": "ok"
  },
  "errors": ["Database connection failed"]
}
```

**Rate Limit:** None

---

### Liveness Check

Check if API is alive.

**Endpoint:** `GET /api/health/live`

**Response:** `200 OK`
```json
{
  "status": "alive",
  "timestamp": "2024-10-18T12:00:00.000Z"
}
```

**Rate Limit:** None

---

## 📊 Rate Limiting

All API endpoints are rate-limited to prevent abuse.

### Rate Limit Headers

Every response includes:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-10-18T12:15:00.000Z
```

### Rate Limit Tiers

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Email sending | 3 emails | 1 hour |
| Map queries | 300 requests | 1 minute |
| Search | 60 requests | 1 minute |
| Profile updates | 20 requests | 1 hour |
| File uploads | 10 uploads | 1 hour |
| General API | 100 requests | 15 minutes |

### Rate Limit Exceeded

When rate limit is exceeded:

**Response:** `429 Too Many Requests`
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "limit": 100,
  "remaining": 0,
  "reset": "2024-10-18T12:15:00.000Z"
}
```

**Headers:**
```
Retry-After: 300
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-10-18T12:15:00.000Z
```

---

## ❌ Error Responses

### Standard Error Format

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {}
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Common Error Examples

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "message": "Invalid request parameters",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## 🔑 Authentication

### JWT Token

API uses JWT tokens for authentication.

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Structure:**
```json
{
  "sub": "user_id",
  "email": "john@example.com",
  "iat": 1697644800,
  "exp": 1697731200
}
```

### Session-based Auth

For web applications, use session cookies:

```
Cookie: next-auth.session-token=xxx
```

---

## 📝 Examples

### Using cURL

```bash
# Sign up
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Search users
curl "https://your-domain.com/api/search?q=javascript&limit=10"

# Get map users
curl "https://your-domain.com/api/map/users?minLat=37&maxLat=38"
```

### Using JavaScript/Fetch

```javascript
// Sign up
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();

// Search users
const searchResponse = await fetch('/api/search?q=javascript&limit=10');
const searchData = await searchResponse.json();
```

### Using Axios

```javascript
import axios from 'axios';

// With rate limit handling
async function searchUsers(query) {
  try {
    const response = await axios.get('/api/search', {
      params: { q: query, limit: 20 }
    });

    console.log('Rate limit:', {
      limit: response.headers['x-ratelimit-limit'],
      remaining: response.headers['x-ratelimit-remaining'],
      reset: response.headers['x-ratelimit-reset']
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    }
    throw error;
  }
}
```

---

## 🚀 Best Practices

### 1. Handle Rate Limits

Always check rate limit headers and implement backoff:

```javascript
async function apiCall(url) {
  const response = await fetch(url);
  
  const remaining = parseInt(response.headers.get('x-ratelimit-remaining'));
  
  if (remaining < 10) {
    console.warn('Approaching rate limit!');
  }
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after');
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return apiCall(url); // Retry
  }
  
  return response.json();
}
```

### 2. Use Pagination

For large datasets, always use pagination:

```javascript
async function getAllUsers() {
  let allUsers = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/map/users?page=${page}&limit=50`);
    const data = await response.json();
    
    allUsers = [...allUsers, ...data.users];
    hasMore = data.hasMore;
    page++;
  }

  return allUsers;
}
```

### 3. Cache Responses

Cache API responses when appropriate:

```javascript
const cache = new Map();

async function getCachedUser(userId) {
  if (cache.has(userId)) {
    return cache.get(userId);
  }

  const user = await fetch(`/api/profile/${userId}`).then(r => r.json());
  cache.set(userId, user);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(userId), 5 * 60 * 1000);
  
  return user;
}
```

---

## 📚 SDKs & Libraries

### Official SDKs

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- Ruby SDK

### Community Libraries

- [Next.js](https://nextjs.org/) - Recommended framework
- [React Query](https://tanstack.com/query) - Data fetching
- [Axios](https://axios-http.com/) - HTTP client
- [SWR](https://swr.vercel.app/) - Data fetching hooks

---

## 🔒 Security

### HTTPS Only

All API requests must use HTTPS in production.

### CORS

Cross-Origin Resource Sharing is configured for:
- `https://your-domain.com`
- `https://*.vercel.app`

### Content Security Policy

CSP headers are enforced. See `vercel.json` for details.

---

## 📞 Support

- **Documentation:** https://docs.your-domain.com
- **GitHub Issues:** https://github.com/your-org/collab-connect/issues
- **Email:** support@your-domain.com

---

*Last Updated: October 2025*  
*API Version: 1.0.0*
