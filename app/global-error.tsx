"use client";

import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log global error in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[GLOBAL ERROR]', {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
          digest: error.digest,
        },
        context: {
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'server',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        },
      });
    }
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}