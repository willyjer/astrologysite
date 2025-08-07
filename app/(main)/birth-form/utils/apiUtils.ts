/**
 * API utility functions for retry logic and error handling
 */

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  shouldRetry: (error: any) => boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  retryCount?: number;
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  shouldRetry: (error: any) => {
    // Retry on network errors, 5xx server errors, and rate limits
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true; // Network error
    }
    if (error.status >= 500 && error.status < 600) {
      return true; // Server error
    }
    if (error.status === 429) {
      return true; // Rate limit
    }
    if (error.status === 503) {
      return true; // Service unavailable
    }
    return false;
  },
};

/**
 * Calculate delay for exponential backoff
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = baseDelay * Math.pow(multiplier, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<ApiResponse<T>> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: any;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      const result = await fn();
      return {
        success: true,
        data: result,
        retryCount: attempt,
      };
    } catch (error) {
      lastError = error;

      // Don't retry if we've reached max attempts or if error shouldn't be retried
      if (
        attempt === finalConfig.maxRetries ||
        !finalConfig.shouldRetry(error)
      ) {
        break;
      }

      // Calculate delay for next attempt
      const delay = calculateBackoffDelay(
        attempt,
        finalConfig.baseDelay,
        finalConfig.maxDelay,
        finalConfig.backoffMultiplier
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Request failed after all retries',
    retryCount: finalConfig.maxRetries,
  };
}

/**
 * Enhanced fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<ApiResponse> {
  return retryWithBackoff(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || `HTTP ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, retryConfig);
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // Remove old requests outside the window
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    // Check if we're at the limit
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // Add current request
    this.requests.push(now);

    return fn();
  }
}

/**
 * Error message formatter
 */
export function formatApiError(error: any, retryCount?: number): string {
  if (error.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (error.status === 503) {
    return 'Service temporarily unavailable. Please try again in a few minutes.';
  }

  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }

  if (error.name === 'AbortError') {
    return 'Request timed out. Please check your connection and try again.';
  }

  if (error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (retryCount && retryCount > 0) {
    return `${error.message} (Retried ${retryCount} times)`;
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}
