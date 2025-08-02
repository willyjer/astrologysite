'use client';

/**
 * Client-side utility functions that safely handle browser APIs
 */

/**
 * Copy text to clipboard with SSR safety
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (clipboardError) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackError) {
      return false;
    }
  }
}

/**
 * Get current page URL with SSR safety
 */
export function getCurrentUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.href;
}

/**
 * Get current page title with SSR safety
 */
export function getCurrentPageTitle(): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'AstroAware - Your Astrology Readings';
  }
  return document.title || 'AstroAware - Your Astrology Readings';
}

/**
 * Check if browser supports specific features
 */
export function checkBrowserSupport() {
  if (typeof window === 'undefined') {
    return {
      clipboard: false,
      localStorage: false,
      sessionStorage: false,
      performanceObserver: false,
    };
  }

  return {
    clipboard: 'clipboard' in navigator,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window,
    performanceObserver: 'PerformanceObserver' in window,
  };
}

/**
 * Safe DOM query selector with SSR check
 */
export function safeQuerySelector(selector: string): Element | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  return document.querySelector(selector);
}

/**
 * Safe DOM query selector all with SSR check
 */
export function safeQuerySelectorAll(selector: string): NodeListOf<Element> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return [] as unknown as NodeListOf<Element>;
  }
  return document.querySelectorAll(selector);
}

/**
 * Create element with SSR safety
 */
export function safeCreateElement(tagName: string): HTMLElement | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  return document.createElement(tagName);
}

/**
 * Add event listener with SSR safety
 */
export function safeAddEventListener(
  element: Element | Window | Document,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  if (typeof window === 'undefined') {
    return;
  }
  element.addEventListener(event, handler, options);
}

/**
 * Remove event listener with SSR safety
 */
export function safeRemoveEventListener(
  element: Element | Window | Document,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions
): void {
  if (typeof window === 'undefined') {
    return;
  }
  element.removeEventListener(event, handler, options);
} 