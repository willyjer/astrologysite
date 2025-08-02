'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Search } from '../../../../components/ui/icons';
import styles from './styles.module.css';
import { LocationAutocompleteProps } from './types';

export function LocationAutocomplete({
  onPlaceSelect,
  defaultValue = '',
  error,
  birthDate,
  className = '',
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Array<{
    name: string;
    lat: number;
    lng: number;
    id: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close suggestions when clicking outside the component
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for places using Nominatim with retry logic
  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.length < 3 || userSelected) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const { fetchWithRetry, formatApiError } = await import('../../utils/apiUtils');
      
      const result = await fetchWithRetry(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AstroAnon/1.0'
          }
        },
        {
          maxRetries: 2,
          baseDelay: 500,
          shouldRetry: (error: any) => {
            // Retry on network errors and 5xx server errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
              return true;
            }
            if (error.status >= 500 && error.status < 600) {
              return true;
            }
            return false;
          }
        }
      );

      if (!result.success) {
        // Location search failed
        setSuggestions([]);
        return;
      }
      
      const data = result.data;
      
      if (!Array.isArray(data)) {
        // Invalid response format from location API
        setSuggestions([]);
        return;
      }
      
      const formattedSuggestions = data.slice(0, 5).map((place: any) => ({
        name: place.display_name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        id: `${place.place_id}-${place.osm_id}`,
      }));
      
      setSuggestions(formattedSuggestions);
        } catch (searchError) {
      // Error searching places
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [userSelected]);

  // Debounce function to limit API calls
  useEffect(() => {
    if (userSelected) {
      return;
    }

    const timer = setTimeout(() => {
      searchPlaces(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, userSelected, searchPlaces]);

  // Handle selecting a place
  const handleSelectPlace = async (place: { name: string; lat: number; lng: number }) => {
    setUserSelected(true);
    setInputValue(place.name);
    setSuggestions([]);
    
    try {
      // Create timestamp for the birth date if available
      let timezoneUrl = `/api/timezone?lat=${place.lat}&lng=${place.lng}`;
      
      if (birthDate) {
        // Create a timestamp for the birth date at noon (to avoid DST edge cases)
        const birthTimestamp = new Date(
          birthDate.year, 
          birthDate.month - 1, // month is 0-indexed
          birthDate.day, 
          12, 0, 0
        ).getTime() / 1000; // Convert to Unix timestamp
        
        timezoneUrl += `&timestamp=${Math.floor(birthTimestamp)}`;
      }
      
      const response = await fetch(timezoneUrl);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      let timezone: number | undefined = undefined;
      
      if (data.status === 'OK' && data.gmtOffset !== undefined) {
        timezone = data.gmtOffset / 3600; // Convert seconds to hours
      }
      
      onPlaceSelect({
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        timezone,
      });
        } catch (timezoneError) {
      // Error in handleSelectPlace
      onPlaceSelect({
        name: place.name,
        lat: place.lat,
        lng: place.lng,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Find if the value matches a suggestion exactly
    const selectedPlace = suggestions.find(place => place.name === value);
    if (selectedPlace) {
      handleSelectPlace(selectedPlace);
    } else {
      setUserSelected(false);
    }
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <div className={styles.inputContainer}>
        <Input
          type="text"
          placeholder="Enter your birth city"
          value={inputValue}
          onChange={handleInputChange}
          className={styles.input}
          error={error}
          fullWidth
        />
        <div className={styles.searchIcon}>
          <Search size={18} color="#9CA3AF" />
        </div>
      </div>

      {loading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <span>Searching...</span>
        </div>
      )}
      
      {!loading && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((place) => (
            <li
              key={place.id}
              className={styles.suggestionItem}
              onClick={() => handleSelectPlace(place)}
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 