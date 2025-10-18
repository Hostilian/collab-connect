import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Adjust this value in production to reduce volume
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  environment: process.env.NODE_ENV,

  // Ignore common browser errors
  ignoreErrors: [
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Can\'t find variable: __gCrWeb',
    'Network request failed',
  ],

  beforeSend(event, _hint) {
    // Filter out errors from development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Add user context if available
    if (typeof window !== 'undefined' && window.location) {
      event.contexts = {
        ...event.contexts,
        page: {
          url: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
        },
      };
    }

    return event;
  },
});
