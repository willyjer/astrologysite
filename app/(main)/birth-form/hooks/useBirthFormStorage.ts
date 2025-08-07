import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BirthFormValues } from '../types';

// Define a consistent storage key
const STORAGE_KEY = 'birthForm';

/**
 * Check if localStorage is available
 * @returns True if localStorage can be used
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const storageTestKey = '__storage_test__';
    window.localStorage.setItem(storageTestKey, storageTestKey);
    window.localStorage.removeItem(storageTestKey);
    return true;
  } catch (storageError) {
    return false;
  }
};

/**
 * Custom hook for managing birth form data persistence
 * Centralizes localStorage interactions and URL parameter handling
 */
export function useBirthFormStorage() {
  // Initialize state with all possible form fields
  const [formData, setFormData] = useState<Partial<BirthFormValues>>({});
  const [readings, setReadings] = useState<string[]>([]);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check localStorage availability on mount
  useEffect(() => {
    setStorageAvailable(isLocalStorageAvailable());
  }, []);

  // Load data from localStorage and URL on mount
  useEffect(() => {
    // Get readings from URL
    const urlReadings = searchParams.getAll('readings');
    setReadings(urlReadings);

    // Get form data from localStorage if available
    if (storageAvailable && typeof window !== 'undefined') {
      try {
        const storedData = window.localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
          } catch (parseError) {
            // Error parsing stored form data
            // Remove corrupted data
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (storageAccessError) {
        // Error accessing localStorage
        setStorageAvailable(false);
      }
    }
  }, [searchParams, storageAvailable]);

  /**
   * Update form data (partial updates supported)
   * @param updates Partial form data to merge with existing data
   * @returns The updated form data
   */
  const updateFormData = (updates: Partial<BirthFormValues>) => {
    const newData = { ...formData, ...updates, readings };

    // Always ensure readings are included
    if (!newData.readings) {
      newData.readings = readings;
    }

    setFormData(newData);

    // Persist to localStorage if available
    if (storageAvailable && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (saveError) {
        // Error saving to localStorage

        // Try to save without readings which could be large
        try {
          const { readings: _, ...essentialData } = newData;
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(essentialData)
          );
        } catch (minimalSaveError) {
          // Failed to save even minimal data to localStorage

          // Try to clear some space and retry
          try {
            const { readings: _, ...essentialData } = newData;
            window.localStorage.clear();
            window.localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(essentialData)
            );
          } catch (clearStorageError) {
            // Failed to save after clearing storage
            setStorageAvailable(false);
            throw new Error(
              'Unable to save form data. Please try refreshing the page.'
            );
          }
        }
      }
    }

    return newData;
  };

  /**
   * Clear form data from state and localStorage
   */
  const clearFormData = () => {
    if (storageAvailable && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (clearError) {
        // Error clearing localStorage
      }
    }

    setFormData({});
  };

  /**
   * Navigate to a step while preserving readings in the URL
   * @param path The path to navigate to
   */
  const navigateToStep = (path: string) => {
    const params = new URLSearchParams();
    readings.forEach((reading) => {
      params.append('readings', reading);
    });
    const queryString = params.toString();
    const nextPath = queryString ? `${path}?${queryString}` : path;
    router.push(nextPath);
  };

  return {
    formData,
    readings,
    storageAvailable,
    updateFormData,
    clearFormData,
    navigateToStep,
  };
}
