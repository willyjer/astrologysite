import type { StoredReviews, ReviewData, GeneratedReading } from '../types';

// Storage keys
const STORED_REVIEWS_KEY = 'astroReviews';
const NATAL_CHART_KEY = 'natalChartData';
const GENERATED_READINGS_KEY = 'astroGeneratedReadings';

// Client-side storage utilities
const isClient = typeof window !== 'undefined';

/**
 * Get stored reviews from localStorage
 */
export function getStoredReviews(): StoredReviews {
  if (!isClient) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORED_REVIEWS_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (parseError) {
    // Error parsing stored reviews
    return [];
  }
}

/**
 * Add a new review to localStorage
 */
export function addStoredReview(review: ReviewData): void {
  if (!isClient) {
    return;
  }

  try {
    const existingReviews = getStoredReviews();
    const updatedReviews = [...existingReviews, review];
    window.localStorage.setItem(
      STORED_REVIEWS_KEY,
      JSON.stringify(updatedReviews)
    );
  } catch (storageError) {
    // Error adding stored review
  }
}

/**
 * Clear all stored reviews
 */
export function clearStoredReviews(): void {
  if (!isClient) {
    return;
  }

  try {
    window.localStorage.removeItem(STORED_REVIEWS_KEY);
  } catch (clearError) {
    // Error clearing stored reviews
  }
}

/**
 * Get natal chart data from sessionStorage
 */
export function getNatalChartData(): any | null {
  if (!isClient) {
    return null;
  }

  try {
    const stored = window.sessionStorage.getItem(NATAL_CHART_KEY);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (parseError) {
    // Error parsing natal chart data
    return null;
  }
}

/**
 * Set natal chart data in sessionStorage
 */
export function setNatalChartData(chartData: any): void {
  if (!isClient) {
    return;
  }

  try {
    window.sessionStorage.setItem(NATAL_CHART_KEY, JSON.stringify(chartData));
  } catch (storageError) {
    // Error setting natal chart data
  }
}

/**
 * Clear natal chart data from sessionStorage
 */
export function clearNatalChartData(): void {
  if (!isClient) {
    return;
  }

  try {
    window.sessionStorage.removeItem(NATAL_CHART_KEY);
  } catch (clearError) {
    // Error clearing natal chart data
  }
}

/**
 * Get generated readings from sessionStorage
 */
export function getCachedGeneratedReadings(): GeneratedReading[] {
  if (!isClient) {
    return [];
  }

  try {
    const stored = window.sessionStorage.getItem(GENERATED_READINGS_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (parseError) {
    console.error('❌ Error parsing cached generated readings:', parseError);
    return [];
  }
}

/**
 * Cache generated readings in sessionStorage
 */
export function cacheGeneratedReadings(readings: GeneratedReading[]): void {
  if (!isClient) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      GENERATED_READINGS_KEY,
      JSON.stringify(readings)
    );
    // Cached generated readings
  } catch (storageError) {
    console.error('❌ Error caching generated readings:', storageError);
  }
}

/**
 * Clear cached generated readings from sessionStorage
 */
export function clearCachedGeneratedReadings(): void {
  if (!isClient) {
    return;
  }

  try {
    window.sessionStorage.removeItem(GENERATED_READINGS_KEY);
    // Cleared cached generated readings
  } catch (clearError) {
    console.error('❌ Error clearing cached generated readings:', clearError);
  }
}

/**
 * Check if we have cached readings for the current session
 */
export function hasCachedGeneratedReadings(): boolean {
  if (!isClient) {
    return false;
  }

  try {
    const cached = getCachedGeneratedReadings();
    return (
      cached.length > 0 &&
      cached.some((reading) => reading.content && reading.content.length > 0)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Get storage statistics (for debugging)
 */
export function getStorageStats(): {
  storedReviewsCount: number;
  hasNatalChart: boolean;
} {
  const storedReviews = getStoredReviews();
  const hasNatalChart = !!getNatalChartData();

  return {
    storedReviewsCount: storedReviews.length,
    hasNatalChart,
  };
}
