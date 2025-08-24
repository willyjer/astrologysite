import { useState } from 'react';
import type { BirthFormValues } from '../types';
import { validateDateFormat, validateTimeFormat } from '../utils/validation';
import { clearCachedGeneratedReadings } from '../../results/utils/storageUtils';

export interface UseFormSubmissionReturn {
  handleSubmit: (data: BirthFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useFormSubmission(): UseFormSubmissionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BirthFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate input data
      const dateValidation = validateDateFormat(data.birthDate);
      if (!dateValidation.isValid) {
        throw new Error(dateValidation.error || 'Invalid date format');
      }

      const timeValidation = validateTimeFormat(data.birthTime);
      if (!timeValidation.isValid) {
        throw new Error(timeValidation.error || 'Invalid time format');
      }

      // Parse birth date and time (avoid timezone issues with new Date())
      const [year, month, day] = data.birthDate.split('-').map(Number);
      const [hour, minute] = data.birthTime.split(':').map(Number);

      // Prepare chart request data
      const chartRequest = {
        day: day,
        month: month,
        year: year,
        hour: hour,
        min: minute,
        lat: data.lat,
        lon: data.lon,
        tzone: data.timezone,
        house_type: 'placidus',
      };

      // Call the astrology API with retry logic
      const { fetchWithRetry, formatApiError } = await import(
        '../utils/apiUtils'
      );

      const result = await fetchWithRetry(
        '/api/astrology-chart',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chartRequest),
        },
        {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 8000,
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
        }
      );

      if (!result.success) {
        throw new Error(formatApiError(result.error, result.retryCount));
      }

      const chartData = result.data;

      // Generate a unique session ID
      const sessionId = generateSessionId();

      // Clear any cached generated readings from previous sessions
      clearCachedGeneratedReadings();

      // Store all data in sessionStorage with session ID
      const sessionData = {
        sessionId,
        birthData: data,
        chartData: chartData.chart,
        timestamp: Date.now(),
      };

      const storageSuccess = safeSetStorage(
        'astroSession',
        JSON.stringify(sessionData)
      );

      if (!storageSuccess) {
        throw new Error('Unable to save data. Please try again.');
      }
    } catch (submissionError) {
      const errorMessage =
        submissionError instanceof Error
          ? submissionError.message
          : 'An error occurred';
      setError(errorMessage);
      // Form submission error
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for safe storage operations
  const safeSetStorage = (key: string, value: string): boolean => {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (storageError) {
      return false;
    }
  };

  // Generate a unique session ID
  const generateSessionId = (): string => {
    return `astro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
}
