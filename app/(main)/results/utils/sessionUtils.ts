import type { BirthFormData } from '../types';

export interface AstroSession {
  sessionId: string;
  birthData: BirthFormData;
  chartData: any;
  selectedReadings?: string[];
  timestamp: number;
  updatedAt?: number;
}

/**
 * Get session data from localStorage
 */
export function getSessionData(): AstroSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const sessionData = localStorage.getItem('astroSession');
    if (!sessionData) {
      return null;
    }

    const parsed = JSON.parse(sessionData);

    // Validate session data structure
    if (!parsed.sessionId || !parsed.birthData || !parsed.chartData) {
      console.error('❌ Invalid session data structure');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('❌ Error parsing session data:', error);
    return null;
  }
}

/**
 * Validate session data integrity
 */
export function validateSessionData(session: AstroSession): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!session.sessionId) {
    errors.push('Missing session ID');
  }

  if (!session.birthData) {
    errors.push('Missing birth data');
  } else {
    // Validate birth data
    if (!session.birthData.birthDate) errors.push('Missing birth date');
    if (!session.birthData.birthTime) errors.push('Missing birth time');
    if (!session.birthData.birthPlace) errors.push('Missing birth place');
    if (typeof session.birthData.lat !== 'number')
      errors.push('Invalid latitude');
    if (typeof session.birthData.lon !== 'number')
      errors.push('Invalid longitude');
    if (typeof session.birthData.timezone !== 'number')
      errors.push('Invalid timezone');
  }

  if (!session.chartData) {
    errors.push('Missing chart data');
  }

  // Check session age (max 1 hour)
  const sessionAge = Date.now() - session.timestamp;
  const maxAge = 60 * 60 * 1000; // 1 hour
  if (sessionAge > maxAge) {
    errors.push('Session expired');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clear session data
 */
export function clearSessionData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('astroSession');
  } catch (error) {
    console.error('❌ Error clearing session data:', error);
  }
}

/**
 * Get session ID from URL parameters
 */
export function getSessionIdFromUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('sessionId');
}

/**
 * Validate session ID matches stored session
 */
export function validateSessionId(sessionId: string): boolean {
  const session = getSessionData();
  return session?.sessionId === sessionId;
}
