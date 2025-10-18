import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  environment: process.env.NODE_ENV,

  // Ignore errors from specific paths
  ignoreErrors: [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],

  beforeSend(event, _hint) {
    // Filter out errors from development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Add additional context
    if (event.request) {
      event.contexts = {
        ...event.contexts,
        server: {
          node_env: process.env.NODE_ENV,
          node_version: process.version,
        },
      };
    }

    return event;
  },
});
