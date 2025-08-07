export async function register() {
  // Only load Sentry in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config');
    }
  }
}

// Export error handler (only available in production)
export const onRequestError = process.env.NODE_ENV === 'production' 
  ? async (error: Error) => {
      // This will be called in production when Sentry is loaded
      console.error('Request error:', error);
    }
  : async (error: Error) => {
      // No-op in development
      console.error('Request error:', error);
    };
