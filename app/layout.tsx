import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import './styles/critical.css';
import PerformanceTracker from './components/ui/PerformanceMonitor';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "AstroAware - AI-Powered Astrological Readings",
  description: "Discover your cosmic path through personalized AI-powered astrological readings, tailored uniquely to your birth details.",
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
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
      </head>
      <body>
        <PerformanceTracker />
        {children}
      </body>
    </html>
  );
}