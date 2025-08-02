'use client';

import { useEffect } from 'react';

interface ProgressiveCSSLoaderProps {
  href: string;
  priority?: 'high' | 'medium' | 'low';
  onLoad?: () => void;
}

export function ProgressiveCSSLoader({ 
  href, 
  priority = 'medium',
  onLoad 
}: ProgressiveCSSLoaderProps) {
  useEffect(() => {
    // Skip if already loaded
    if (document.querySelector(`link[href="${href}"]`)) {
      onLoad?.();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    // Set loading priority
    switch (priority) {
      case 'high':
        // Load immediately
        link.media = 'all';
        break;
      case 'medium':
        // Load after a short delay
        link.media = 'print';
        setTimeout(() => {
          link.media = 'all';
        }, 100);
        break;
      case 'low':
        // Load after page is idle
        link.media = 'print';
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            link.media = 'all';
          });
        } else {
          setTimeout(() => {
            link.media = 'all';
          }, 1000);
        }
        break;
    }

    link.onload = () => {
      onLoad?.();
    };

    document.head.appendChild(link);

    return () => {
      // Cleanup if component unmounts
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [href, priority, onLoad]);

  return null; // This component doesn't render anything
}

// Predefined CSS loaders for common use cases
export function NonCriticalCSSLoader() {
  return (
    <ProgressiveCSSLoader 
      href="/styles/non-critical.css" 
      priority="low" 
    />
  );
} 