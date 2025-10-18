module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/map',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/auth/signin',
      ],
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Performance budgets
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],

        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 100000 }],
        'resource-summary:document:size': ['warn', { maxNumericValue: 50000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }],
        'resource-summary:font:size': ['warn', { maxNumericValue: 200000 }],

        // Accessibility checks
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr-value': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'color-contrast': 'warn',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
