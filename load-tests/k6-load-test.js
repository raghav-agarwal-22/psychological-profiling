/**
 * Innermind Load Test — k6 script
 *
 * Usage:
 *   k6 run load-tests/k6-load-test.js
 *   k6 run --env BASE_URL=https://api.innermind.app load-tests/k6-load-test.js
 *
 * Install k6: brew install k6
 *
 * Scenarios:
 *   1. anonymous_flow   — anonymous assessment creation + completion (most PH traffic)
 *   2. health_checks    — simulates Railway load balancer probes
 *   3. share_views      — simulates viral profile share link clicks
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001'

// Custom metrics
const errorRate = new Rate('error_rate')
const synthesisLatency = new Trend('synthesis_latency', true)
const shareLatency = new Trend('share_latency', true)

export const options = {
  scenarios: {
    // Ramp to 1000 concurrent anonymous users over 2 minutes, hold for 3 minutes
    anonymous_flow: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 200 },
        { duration: '1m', target: 1000 },
        { duration: '3m', target: 1000 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'anonFlow',
    },
    // Constant health check probe
    health_checks: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '6m',
      preAllocatedVUs: 5,
      exec: 'healthCheck',
    },
    // Simulate viral share link traffic (100 concurrent viewers)
    share_views: {
      executor: 'constant-vus',
      vus: 100,
      duration: '6m',
      exec: 'shareView',
    },
  },
  thresholds: {
    // 95th percentile must be under 500ms for non-synthesis endpoints
    'http_req_duration{scenario:health_checks}': ['p(95)<200'],
    'http_req_duration{scenario:share_views}': ['p(95)<500'],
    // Synthesis can take up to 45s (LLM call)
    synthesis_latency: ['p(95)<45000'],
    share_latency: ['p(95)<500'],
    error_rate: ['rate<0.05'], // Less than 5% errors
    http_req_failed: ['rate<0.05'],
  },
}

// ─── Helper: generate fake Big Five responses ──────────────────────────────

function randomResponses(questionCount = 44) {
  return Array.from({ length: questionCount }, (_, i) => ({
    questionId: `q${i + 1}`,
    value: Math.floor(Math.random() * 5) + 1,
  }))
}

// ─── Scenario: anonymous assessment flow ──────────────────────────────────

export function anonFlow() {
  // Step 1: get available templates
  const templatesRes = http.get(`${BASE_URL}/api/templates`)
  const ok = check(templatesRes, {
    'templates status 200': (r) => r.status === 200,
  })
  if (!ok) {
    errorRate.add(1)
    sleep(1)
    return
  }
  errorRate.add(0)

  let templateId
  try {
    const templates = templatesRes.json('templates')
    const bigFive = Array.isArray(templates)
      ? templates.find((t) => t.type === 'BIG_FIVE')
      : null
    templateId = bigFive?.id
  } catch {
    sleep(1)
    return
  }

  if (!templateId) {
    sleep(1)
    return
  }

  // Step 2: create anonymous session
  const createRes = http.post(
    `${BASE_URL}/api/anon/sessions`,
    JSON.stringify({ templateId }),
    { headers: { 'Content-Type': 'application/json' } },
  )
  const createOk = check(createRes, {
    'anon session created': (r) => r.status === 201,
  })
  if (!createOk) {
    errorRate.add(1)
    sleep(2)
    return
  }
  errorRate.add(0)

  let anonSessionId, guestToken
  try {
    anonSessionId = createRes.json('anonSessionId')
    guestToken = createRes.json('guestToken')
  } catch {
    sleep(1)
    return
  }

  // Step 3: simulate user taking assessment (5-15 seconds of "thinking")
  sleep(Math.random() * 10 + 5)

  // Step 4: complete with synthesized profile (the expensive LLM call)
  const start = Date.now()
  const completeRes = http.post(
    `${BASE_URL}/api/anon/sessions/${anonSessionId}/complete`,
    JSON.stringify({ responses: randomResponses(44) }),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-guest-token': guestToken,
      },
      timeout: '60s',
    },
  )
  synthesisLatency.add(Date.now() - start)
  const completeOk = check(completeRes, {
    'anon complete 200': (r) => r.status === 200,
  })
  errorRate.add(completeOk ? 0 : 1)

  sleep(2)
}

// ─── Scenario: health checks ───────────────────────────────────────────────

export function healthCheck() {
  const res = http.get(`${BASE_URL}/api/health`)
  const ok = check(res, {
    'health 200': (r) => r.status === 200,
    'health body ok': (r) => {
      try {
        return r.json('status') === 'ok'
      } catch {
        return false
      }
    },
  })
  errorRate.add(ok ? 0 : 1)
}

// ─── Scenario: share link views (viral profile traffic) ───────────────────

// Pre-seeded share tokens for testing — replace with real tokens from DB
const SHARE_TOKENS = __ENV.SHARE_TOKENS
  ? __ENV.SHARE_TOKENS.split(',')
  : ['test-token-1', 'test-token-2']

export function shareView() {
  const token = SHARE_TOKENS[Math.floor(Math.random() * SHARE_TOKENS.length)]
  const start = Date.now()
  const res = http.get(`${BASE_URL}/api/share/${token}`)
  shareLatency.add(Date.now() - start)

  // 404 is acceptable if tokens don't exist in test DB
  check(res, {
    'share response valid': (r) => r.status === 200 || r.status === 404,
  })
}
