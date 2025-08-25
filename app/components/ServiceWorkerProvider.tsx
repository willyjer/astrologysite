'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '../lib/serviceWorker';

export default function ServiceWorkerProvider() {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker().then((registered) => {
      if (registered) {
      
      }
    });
  }, []);

  // This component doesn't render anything
  return null;
}