import type { URLParams, BirthFormData, Reading } from '../types';

/**
 * Parse URL search parameters into a structured object
 */
export function parseUrlParams(searchParams: URLSearchParams): URLParams {
  return {
    birthDate: searchParams.get('birthDate'),
    birthTime: searchParams.get('birthTime'),
    birthPlace: searchParams.get('birthPlace'),
    email: searchParams.get('email'),
    lat: searchParams.get('lat'),
    lon: searchParams.get('lon'),
    timezone: searchParams.get('timezone'),
    readings: searchParams.get('readings'),
  
  };
}

/**
 * Convert URL parameters to BirthFormData
 */
export function parseBirthFormData(params: URLParams): BirthFormData | null {
  if (!params.birthDate || !params.birthTime || !params.birthPlace) {
    return null;
  }

  const lat = Number(params.lat);
  const lon = Number(params.lon);
  const timezone = Number(params.timezone);

  return {
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    birthPlace: params.birthPlace,
    email: params.email || '',
    lat: isNaN(lat) ? 0 : lat,
    lon: isNaN(lon) ? 0 : lon,
    timezone: isNaN(timezone) ? 0 : timezone,
  };
}

/**
 * Parse readings parameter from URL
 */
export function parseReadingsParam(readingsParam: string | null): Reading[] {
  if (!readingsParam) {
    return [];
  }

  try {
    // Handle comma-separated string format (e.g., "core-self,inner-warrior")
    const readingIds = readingsParam.split(',').map(id => id.trim());
    return readingIds.map((id: string) => ({ id, name: id }));
  } catch (parseError) {
    console.error('Error parsing readings param:', parseError);
    return [];
  }
}

/**
 * Build share URL for social media
 */
export function buildShareUrl(platform: string, url: string, text: string): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (platform.toLowerCase()) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    default:
      return url;
  }
}

import { copyToClipboard as safeCopyToClipboard, getCurrentUrl as safeGetCurrentUrl, getCurrentPageTitle as safeGetCurrentPageTitle } from '../../../lib/utils/clientUtils';

/**
 * Copy URL to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  return safeCopyToClipboard(text);
}

/**
 * Get current page URL
 */
export function getCurrentUrl(): string {
  return safeGetCurrentUrl();
}

/**
 * Get current page title
 */
export function getCurrentPageTitle(): string {
  return safeGetCurrentPageTitle();
} 