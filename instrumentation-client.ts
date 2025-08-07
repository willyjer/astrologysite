// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
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

      // Configure environment-specific settings
      environment: process.env.NODE_ENV || 'development',

      // Only capture errors, disable all performance integrations
      integrations: [
        // Explicitly disable performance-related integrations
      ],

      // Reduce the amount of data sent
      maxBreadcrumbs: 10,
      
      // Only send critical errors
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        
        // Only send errors, not performance events
        if (event.type === 'transaction') {
          return null;
        }
        
        return event;
      },
    });
  });
}

// Export router transition function (only available in production)
export const onRouterTransitionStart = process.env.NODE_ENV === 'production' 
  ? () => {
      // This will be called in production when Sentry is loaded
    }
  : () => {
      // No-op in development
    };