'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  QualifiedReadingsPageState,
  CartSummary,
  Reading,
} from '../types';
import { readings } from '../data/readings';

export function useQualifiedReadings() {
  const router = useRouter();

  // State management
  const [state, setState] = useState<QualifiedReadingsPageState>({
    selectedReadings: [],
    isLoading: true,
    hasSessionData: false,
    detailViewReading: null,
    isDetailViewVisible: false,
  });

  // Check for session data on mount
  useEffect(() => {
    const checkSessionData = () => {
      const sessionData = localStorage.getItem('astroSession');

      if (!sessionData) {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');

        if (sessionId) {
          // Wait a bit longer and try again
          setTimeout(checkSessionData, 200);
          return;
        }

        router.push('/birth-form');
        return;
      }

      try {
        const parsedSession = JSON.parse(sessionData);

        if (!parsedSession.sessionId || !parsedSession.birthData) {
          router.push('/birth-form');
          return;
        }

        setState((prev) => ({
          ...prev,
          hasSessionData: true,
          isLoading: false,
        }));
      } catch (error) {
        console.error('❌ Error parsing session data:', error);
        router.push('/birth-form');
      }
    };

    checkSessionData();
  }, [router]);

  // Computed values - now returns all readings
  const currentReadings = useMemo(() => {
    return readings;
  }, []);

  const cartSummary = useMemo((): CartSummary => {
    const selectedReadingObjects = currentReadings.filter((reading) =>
      state.selectedReadings.includes(reading.id)
    );

    return {
      totalReadings: selectedReadingObjects.length,
      selectedReadings: selectedReadingObjects,
    };
  }, [state.selectedReadings, currentReadings]);

  // Event handlers
  const handleToggleReading = useCallback((readingId: string) => {
    setState((prev) => ({
      ...prev,
      selectedReadings: prev.selectedReadings.includes(readingId)
        ? prev.selectedReadings.filter((id) => id !== readingId)
        : [...prev.selectedReadings, readingId],
    }));
  }, []);



  const handleProceed = useCallback(() => {
    if (cartSummary.totalReadings === 0) return;

    const sessionData = localStorage.getItem('astroSession');
    if (!sessionData) {
      console.error('❌ Session data not found');
      router.push('/birth-form');
      return;
    }

    const parsedSession = JSON.parse(sessionData);

    // Update session data with selected readings
    const updatedSession = {
      ...parsedSession,
      selectedReadings: state.selectedReadings,
      updatedAt: Date.now(),
    };

    localStorage.setItem('astroSession', JSON.stringify(updatedSession));

    const finalUrl = `/results?sessionId=${parsedSession.sessionId}`;
    router.push(finalUrl);
  }, [cartSummary.totalReadings, state.selectedReadings, router]);

  // Detail view handlers
  const handleOpenDetail = useCallback((reading: Reading) => {
    setState((prev) => ({
      ...prev,
      detailViewReading: reading,
      isDetailViewVisible: true,
    }));
  }, []);

  const handleCloseDetail = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDetailViewVisible: false,
    }));
  }, []);

  // Utility functions
  const isReadingSelected = useCallback(
    (readingId: string) => {
      return state.selectedReadings.includes(readingId);
    },
    [state.selectedReadings]
  );



  return {
    // State
    state,
    currentReadings,
    cartSummary,

    // Actions
    handleToggleReading,
    handleProceed,
    handleOpenDetail,
    handleCloseDetail,

    // Utilities
    isReadingSelected,

    // Data
    isLoading: state.isLoading,
    hasSessionData: state.hasSessionData,
  };
}
