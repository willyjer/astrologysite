// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// Only load Sentry in production to reduce development bundle size
if (process.env.NODE_ENV === 'production') {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: "https://3627a007f250cd23e50c1c2183353e26@o4509788270952448.ingest.us.sentry.io/4509788271149056",

      // COMPLETELY DISABLE performance monitoring to reduce bundle size
      tracesSampleRate: 0, // Disable all performance traces
      profilesSampleRate: 0, // Disable profiling

      // Disable logs to reduce bundle size
      enableLogs: false,

      // Disable debug mode
      debug: false,

      // COMPLETELY DISABLE session replay (major bundle killer)
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,

      // Only send critical errors
      beforeSend(event) {
        // Only send errors, not performance events
        if (event.type === 'transaction') {
          return null;
        }
        return event;
      },
    });
  });
}

// Export to make this a module
export {};
