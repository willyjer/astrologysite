import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './styles/design-system.css';
import './styles/layout.css';
import PerformanceTracker from './components/ui/PerformanceMonitor';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
// import ProductionMonitoringDashboard from './components/ui/ProductionMonitoringDashboard';
import ServiceWorkerProvider from './components/ServiceWorkerProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
});

export const metadata: Metadata = {
  title: 'AstroAnew - AI-Powered Astrological Readings',
  description:
    'Discover your cosmic path through personalized AI-powered astrological readings, tailored uniquely to your birth details.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
                    <head>
                {/* Modern favicon with dark mode support */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
                
                {/* Resource hints for critical resources */}
                <link rel="dns-prefetch" href="//api.openai.com" />
                <link rel="dns-prefetch" href="//api.timezonedb.com" />
                <link rel="dns-prefetch" href="//json.astrologyapi.com" />
                <link rel="dns-prefetch" href="//nominatim.openstreetmap.org" />
                
                {/* Critical CSS is handled automatically by Next.js */}
                
                {/* Critical CSS will be inlined by Next.js automatically */}
              </head>
      <body>
        <ServiceWorkerProvider />
        {process.env.NODE_ENV === 'development' && <PerformanceTracker />}
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        {/* {process.env.NODE_ENV === 'development' && (
          <ProductionMonitoringDashboard showInDevelopment={true} />
        )} */}
      </body>
    </html>
  );
}
