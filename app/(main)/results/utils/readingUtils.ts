import type {
  GeneratedReading,
  Reading,
  BirthFormData,
} from '../types';
import { getReadingConfig, getAllReadingConfigs } from '../../../lib/readings/config';

/**
 * Process birth data for reading generation
 */
export function processBirthData(birthFormData: BirthFormData): {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
} {
  const [year, month, day] = birthFormData.birthDate.split('-').map(Number);
  let hour = 0,
    min = 0;

  if (birthFormData.birthTime) {
    [hour, min] = birthFormData.birthTime.split(':').map(Number);
  }

  return {
    day,
    month,
    year,
    hour,
    min,
    lat: birthFormData.lat,
    lon: birthFormData.lon,
    tzone: birthFormData.timezone,
  };
}

/**
 * Get reading titles mapping from config
 */
export function getReadingTitles(): Record<string, string> {
  const configs = getAllReadingConfigs();
  const titles: Record<string, string> = {};
  
  configs.forEach(config => {
    titles[config.id] = config.name;
  });
  
  return titles;
}

/**
 * Get reading categories mapping from config
 */
export function getReadingCategories(): Record<string, string> {
  const configs = getAllReadingConfigs();
  const categories: Record<string, string> = {};
  
  configs.forEach(config => {
    categories[config.id] = config.category;
  });
  
  return categories;
}

/**
 * Initialize generated readings with loading state
 */
export function initializeGeneratedReadings(
  selectedReadings: Reading[]
): GeneratedReading[] {
  const readingTitles = getReadingTitles();
  const readingCategories = getReadingCategories();

  return selectedReadings.map((reading) => ({
    id: reading.id,
    title:
      readingTitles[reading.id as keyof typeof readingTitles] || reading.id,
    content: '',
    loading: true,
    category:
      readingCategories[reading.id as keyof typeof readingCategories] ||
      'self-identity',
  }));
}

/**
 * Update reading with generated content
 */
export function updateReadingWithContent(
  reading: GeneratedReading,
  content: string,
  error?: string
): GeneratedReading {
  return {
    ...reading,
    content: content || '',
    loading: false,
    error: error || undefined,
  };
}

/**
 * Check if all readings are complete
 */
export function areAllReadingsComplete(readings: GeneratedReading[]): boolean {
  return readings.every((reading) => !reading.loading);
}

/**
 * Get reading config for a specific reading
 */
export function getReadingConfigById(readingId: string) {
  return getReadingConfig(readingId);
}

/**
 * Get reading statistics
 */
export function getReadingStats(readings: GeneratedReading[]): {
  total: number;
  completed: number;
  loading: number;
  error: number;
} {
  return {
    total: readings.length,
    completed: readings.filter((r) => !r.loading && !r.error).length,
    loading: readings.filter((r) => r.loading).length,
    error: readings.filter((r) => r.error).length,
  };
}

/**
 * Validate reading data
 */
export function validateReadingData(reading: GeneratedReading): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!reading.id) {
    errors.push('Reading ID is required');
  }

  if (!reading.title) {
    errors.push('Reading title is required');
  }

  if (reading.loading && reading.content) {
    errors.push('Loading reading should not have content');
  }

  if (!reading.loading && !reading.content && !reading.error) {
    errors.push('Completed reading should have content or error');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sort readings by completion status and title
 */
export function sortReadings(readings: GeneratedReading[]): GeneratedReading[] {
  return [...readings].sort((a, b) => {
    // First, sort by loading status (completed first)
    if (a.loading && !b.loading) return 1;
    if (!a.loading && b.loading) return -1;

    // Then sort by title alphabetically
    return a.title.localeCompare(b.title);
  });
}
