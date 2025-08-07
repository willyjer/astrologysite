'use client';

import { useEffect } from 'react';

// Extend Window interface for scrollTimeout
declare global {
  interface Window {
    scrollTimeout?: NodeJS.Timeout;
  }
}

export default function PerformanceTracker() {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // First Contentful Paint (FCP)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              // FCP logged
              // Send to analytics if needed
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      }

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const _entry of list.getEntries()) {
            // LCP logged
            // Send to analytics if needed
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // Cumulative Layout Shift (CLS)
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          // CLS logged
          // Send to analytics if needed
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      }

      // First Input Delay (FID)
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const _entry of list.getEntries()) {
            // FID logged
            // Send to analytics if needed
          }
        });
        observer.observe({ entryTypes: ['first-input'] });
      }
    };

    // Track page load performance
    const trackPageLoad = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          // Page Load Time logged
          // DOM Content Loaded logged
        }
      }
    };

    // Track user interactions
    const trackInteractions = () => {
      let interactionCount = 0;
      const trackInteraction = () => {
        interactionCount++;
        // User Interaction logged
        // Send to analytics if needed
      };

      // Track clicks, scrolls, and form interactions
      document.addEventListener('click', trackInteraction);
      document.addEventListener('scroll', () => {
        // Throttle scroll events
        if (!window.scrollTimeout) {
          window.scrollTimeout = setTimeout(() => {
            // User Scrolled logged
            window.scrollTimeout = undefined;
          }, 1000);
        }
      });
    };

    // Initialize tracking
    trackWebVitals();
    trackPageLoad();
    trackInteractions();

    // Cleanup
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  return null; // This component doesn't render anything
}
