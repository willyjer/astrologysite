// Service Worker registration utility
// Only registers in production to avoid development issues

export const registerServiceWorker = async (): Promise<boolean> => {
  // Only register in production and when service workers are supported
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    console.log('[SW] Registering service worker...');
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('[SW] Service worker registered successfully');

    // Listen for service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker installed, notify user
            console.log('[SW] New version available, will activate on next page load');
            
            // Optionally show a notification to user
            if (window.confirm('A new version of the app is available. Reload to update?')) {
              window.location.reload();
            }
          }
        });
      }
    });

    // Handle service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_VERSION') {
        console.log('[SW] Service worker version:', event.data.version);
      }
    });

    return true;
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return false;
  }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('[SW] Service worker unregistered');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[SW] Service worker unregistration failed:', error);
    return false;
  }
};

// Check if service worker is supported and active
export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

export const isServiceWorkerActive = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return registration?.active !== null;
  } catch {
    return false;
  }
};

// Communicate with service worker
export const sendMessageToServiceWorker = (message: any): void => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
};

// For development debugging
export const getServiceWorkerInfo = async () => {
  if (!isServiceWorkerSupported()) {
    return { supported: false };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      supported: true,
      registered: !!registration,
      active: !!registration?.active,
      installing: !!registration?.installing,
      waiting: !!registration?.waiting,
      scope: registration?.scope
    };
  } catch (error) {
    return { supported: true, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};