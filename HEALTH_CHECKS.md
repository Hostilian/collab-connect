# Health Check Endpoints

This document describes the health check and monitoring endpoints for CollabConnect.

## Endpoints

### `/api/health`

Basic health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-18T12:00:00.000Z",
  "uptime": 123456,
  "environment": "production"
}
```

### `/api/health/ready`

Readiness probe - checks if the application is ready to serve requests.

Checks:
- Database connectivity
- External API availability

**Response** (200 OK):
```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "email": "ok"
  }
}
```

**Response** (503 Service Unavailable):
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

### `/api/health/live`

Liveness probe - checks if the application is alive (not deadlocked).

**Response**:
```json
{
  "status": "alive",
  "timestamp": "2025-10-18T12:00:00.000Z"
}
```

## Monitoring Integration

### UptimeRobot

1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-domain.com/api/health`
   - **Interval**: 5 minutes
   - **Alert Contacts**: Your email/Slack

### Pingdom

1. Create account at [pingdom.com](https://pingdom.com)
2. Add uptime check:
   - **Name**: CollabConnect Health
   - **URL**: `https://your-domain.com/api/health`
   - **Check Interval**: 1 minute

### Better Uptime

1. Create account at [betteruptime.com](https://betteruptime.com)
2. Add monitor:
   - **URL**: `https://your-domain.com/api/health`
   - **Check frequency**: 30 seconds
   - **Call schedule**: Configure on-call rotation

## Kubernetes/Docker Health Checks

### Docker Compose

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Kubernetes

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: collab-connect
    livenessProbe:
      httpGet:
        path: /api/health/live
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    
    readinessProbe:
      httpGet:
        path: /api/health/ready
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
```

## Metrics

Consider adding these metrics endpoints:

### `/api/metrics` (Prometheus format)

```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/api/map/users"} 1234

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 100
http_request_duration_seconds_bucket{le="0.5"} 250
```

## Alert Configuration

### Recommended Alerts

1. **Health Check Failed**
   - Trigger: 3 consecutive failures
   - Action: Page on-call engineer

2. **Database Connectivity**
   - Trigger: Database check fails
   - Action: Alert ops team

3. **High Response Time**
   - Trigger: P95 > 2 seconds for 5 minutes
   - Action: Investigate performance

4. **Error Rate Spike**
   - Trigger: Error rate > 5% for 5 minutes
   - Action: Alert team

## Runbook

See incident response procedures in `/docs/runbooks/`.
