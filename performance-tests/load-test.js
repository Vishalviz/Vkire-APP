import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
    error_rate: ['rate<0.1'],
  },
};

// Base URL (will be set by CI/CD)
const BASE_URL = __ENV.BASE_URL || 'https://staging.vkapp.com';

export default function () {
  // Test homepage
  const homeResponse = http.get(`${BASE_URL}/`);
  check(homeResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage response time < 500ms': (r) => r.timings.duration < 500,
    'homepage contains VK App': (r) => r.body.includes('VK App'),
  });
  errorRate.add(homeResponse.status !== 200);

  sleep(1);

  // Test API endpoints (if any)
  const apiResponse = http.get(`${BASE_URL}/api/health`);
  check(apiResponse, {
    'API status is 200': (r) => r.status === 200,
    'API response time < 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(apiResponse.status !== 200);

  sleep(1);

  // Test static assets
  const staticResponse = http.get(`${BASE_URL}/static/js/main.js`);
  check(staticResponse, {
    'static asset status is 200': (r) => r.status === 200,
    'static asset response time < 300ms': (r) => r.timings.duration < 300,
  });
  errorRate.add(staticResponse.status !== 200);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'performance-results.json': JSON.stringify(data, null, 2),
    stdout: `
🎯 Performance Test Results:
- Total Requests: ${data.metrics.http_reqs.values.count}
- Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
- 95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
- Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
- VUs: ${data.metrics.vus.values.max}
    `,
  };
}
