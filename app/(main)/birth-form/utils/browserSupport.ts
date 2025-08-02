/**
 * Browser compatibility utilities for the birth form
 */

export interface BrowserSupport {
  localStorage: boolean;
  sessionStorage: boolean;
  fetch: boolean;
  abortController: boolean;
  dateInput: boolean;
  timeInput: boolean;
  isSupported: boolean;
  unsupportedFeatures: string[];
}

/**
 * Check if the current browser supports all required features
 */
export function checkBrowserSupport(): BrowserSupport {
  const support: BrowserSupport = {
    localStorage: false,
    sessionStorage: false,
    fetch: false,
    abortController: false,
    dateInput: false,
    timeInput: false,
    isSupported: true,
    unsupportedFeatures: []
  };

  // Only run on client side
  if (typeof window === 'undefined') {
    return support;
  }

  // Check localStorage
  try {
    const storageTestKey = '__storage_test__';
    window.localStorage.setItem(storageTestKey, storageTestKey);
    window.localStorage.removeItem(storageTestKey);
    support.localStorage = true;
  } catch (storageError) {
    support.unsupportedFeatures.push('localStorage');
    support.isSupported = false;
  }

  // Check sessionStorage
  try {
    const sessionTestKey = '__session_test__';
    window.sessionStorage.setItem(sessionTestKey, sessionTestKey);
    window.sessionStorage.removeItem(sessionTestKey);
    support.sessionStorage = true;
  } catch (sessionError) {
    support.unsupportedFeatures.push('sessionStorage');
    support.isSupported = false;
  }

  // Check fetch
  if (typeof fetch !== 'undefined') {
    support.fetch = true;
  } else {
    support.unsupportedFeatures.push('fetch');
    support.isSupported = false;
  }

  // Check AbortController
  if (typeof AbortController !== 'undefined') {
    support.abortController = true;
  } else {
    support.unsupportedFeatures.push('AbortController');
    support.isSupported = false;
  }

  // Check date input support
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  support.dateInput = dateInput.type === 'date';

  // Check time input support
  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  support.timeInput = timeInput.type === 'time';

  if (!support.dateInput) {
    support.unsupportedFeatures.push('date input');
  }
  if (!support.timeInput) {
    support.unsupportedFeatures.push('time input');
  }

  return support;
}

/**
 * Get a user-friendly message for unsupported features
 */
export function getUnsupportedFeaturesMessage(features: string[]): string {
  if (features.length === 0) return '';

  const featureMessages = features.map(feature => {
    switch (feature) {
      case 'localStorage':
        return 'data saving';
      case 'sessionStorage':
        return 'temporary data storage';
      case 'fetch':
        return 'network requests';
      case 'AbortController':
        return 'request cancellation';
      case 'date input':
        return 'date picker';
      case 'time input':
        return 'time picker';
      default:
        return feature;
    }
  });

  if (featureMessages.length === 1) {
    return `Your browser doesn't support ${featureMessages[0]}. Please use a modern browser.`;
  }

  const lastFeature = featureMessages.pop();
  return `Your browser doesn't support ${featureMessages.join(', ')}, and ${lastFeature}. Please use a modern browser.`;
}

/**
 * Check if the browser is likely to have issues with the form
 */
export function isBrowserLikelyToHaveIssues(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const support = checkBrowserSupport();
  
  // Check for old browsers
  const userAgent = window.navigator.userAgent;
  const isOldIE = /MSIE|Trident/.test(userAgent);
  const isOldSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent) && /Version\/[1-9]\./.test(userAgent);
  
  return isOldIE || isOldSafari || !support.isSupported;
}

/**
 * Get browser-specific recommendations
 */
export function getBrowserRecommendations(): string {
  if (typeof window === 'undefined') {
    return 'For the best experience, please use Chrome, Firefox, Safari, or Edge.';
  }
  
  const userAgent = window.navigator.userAgent;
  
  if (/MSIE|Trident/.test(userAgent)) {
    return 'Please use Microsoft Edge, Chrome, Firefox, or Safari for the best experience.';
  }
  
  if (/Firefox/.test(userAgent)) {
    return 'You\'re using Firefox. For the best experience, consider using Chrome or Safari.';
  }
  
  if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    return 'You\'re using Safari. For the best experience, consider using Chrome or Firefox.';
  }
  
  return 'For the best experience, please use Chrome, Firefox, Safari, or Edge.';
} 