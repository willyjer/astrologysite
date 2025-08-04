/**
 * Input sanitization utilities for security and data integrity
 */

/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Encode ampersands
    .replace(/["]/g, '&quot;') // Encode quotes
    .replace(/[']/g, '&#x27;') // Encode single quotes
    .slice(0, 50000); // Increased from 1000 to prevent AI response truncation
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9@._-]/g, '') // Remove special characters
    .slice(0, 254); // RFC 5321 limit
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(input: any): number | null {
  if (input === null || input === undefined) {
    return null;
  }
  
  const num = Number(input);
  return isNaN(num) ? null : num;
}

/**
 * Validate and sanitize birth data
 */
export function validateAndSanitizeBirthData(data: any) {
  return {
    day: sanitizeNumber(data.day),
    month: sanitizeNumber(data.month),
    year: sanitizeNumber(data.year),
    hour: sanitizeNumber(data.hour),
    min: sanitizeNumber(data.min),
    lat: sanitizeNumber(data.lat),
    lon: sanitizeNumber(data.lon),
    tzone: sanitizeNumber(data.tzone)
  };
}

/**
 * Validate birth data ranges
 */
export function validateBirthDataRanges(data: ReturnType<typeof validateAndSanitizeBirthData>) {
  const errors: string[] = [];
  
  if (data.day === null || data.day < 1 || data.day > 31) {
    errors.push('Invalid day value. Must be between 1 and 31');
  }
  
  if (data.month === null || data.month < 1 || data.month > 12) {
    errors.push('Invalid month value. Must be between 1 and 12');
  }
  
  if (data.year === null || data.year < 1900 || data.year > 2100) {
    errors.push('Invalid year value. Must be between 1900 and 2100');
  }
  
  if (data.hour === null || data.hour < 0 || data.hour > 23) {
    errors.push('Invalid hour value. Must be between 0 and 23');
  }
  
  if (data.min === null || data.min < 0 || data.min > 59) {
    errors.push('Invalid minute value. Must be between 0 and 59');
  }
  
  if (data.lat === null || data.lat < -90 || data.lat > 90) {
    errors.push('Invalid latitude value. Must be between -90 and 90');
  }
  
  if (data.lon === null || data.lon < -180 || data.lon > 180) {
    errors.push('Invalid longitude value. Must be between -180 and 180');
  }
  
  if (data.tzone === null || data.tzone < -12 || data.tzone > 14) {
    errors.push('Invalid timezone value. Must be between -12 and 14');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize reading ID
 */
export function sanitizeReadingId(input: any): string | null {
  if (typeof input !== 'string') {
    return null;
  }
  
  const sanitized = input.trim().replace(/[^a-zA-Z0-9-_]/g, '');
  return sanitized.length > 0 ? sanitized : null;
}

/**
 * Sanitize prompt text
 */
export function sanitizePrompt(input: any): string | null {
  if (typeof input !== 'string') {
    return null;
  }
  
  const sanitized = input.trim().slice(0, 50000); // Increased from 10000 to prevent truncation
  return sanitized.length > 0 ? sanitized : null;
}

/**
 * Sanitize coordinates for timezone API
 */
export function sanitizeCoordinates(lat: any, lng: any): { lat: number | null; lng: number | null } {
  return {
    lat: sanitizeNumber(lat),
    lng: sanitizeNumber(lng)
  };
}

/**
 * Validate request size
 */
export function validateRequestSize(contentLength: string | null): boolean {
  if (!contentLength) {
    return true; // Allow if no content length
  }
  
  const size = parseInt(contentLength);
  return !isNaN(size) && size <= 1024 * 1024; // 1MB limit
} 