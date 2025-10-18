import { check, sleep } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 500 }, // Spike to 500 users
    { duration: '5m', target: 500 }, // Stay at 500 users
    { duration: '5m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    errors: ['rate<0.1'],             // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function loadTest() {
  // Test homepage
  let res = http.get(`${BASE_URL}/`);
  const homepageCheck = check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in <500ms': (r) => r.timings.duration < 500,
  });
  if (!homepageCheck) {
    errorRate.add(1);
  }

  sleep(1);

  // Test API health endpoint
  res = http.get(`${BASE_URL}/api/health`);
  const healthCheck = check(res, {
    'health status is 200': (r) => r.status === 200,
    'health check loads in <100ms': (r) => r.timings.duration < 100,
  });
  if (!healthCheck) {
    errorRate.add(1);
  }

  sleep(1);

  // Test map users endpoint
  res = http.get(`${BASE_URL}/api/map/users?limit=50`);
  const mapCheck = check(res, {
    'map users status is 200': (r) => r.status === 200,
    'map users loads in <1s': (r) => r.timings.duration < 1000,
  });
  if (!mapCheck) {
    errorRate.add(1);
  }

  sleep(2);

  // Test search endpoint
  res = http.get(`${BASE_URL}/api/search?q=javascript&limit=20`);
  const searchCheck = check(res, {
    'search status is 200': (r) => r.status === 200,
    'search loads in <500ms': (r) => r.timings.duration < 500,
  });
  if (!searchCheck) {
    errorRate.add(1);
  }

  sleep(1);
}

// Setup function - runs once at the start
export function setup() {
  console.log(`Starting load test against ${BASE_URL}`);
  console.log('Test duration: 26 minutes');
  console.log('Max concurrent users: 500');
}

// Teardown function - runs once at the end
export function teardown() {
  console.log('Load test completed');
}
