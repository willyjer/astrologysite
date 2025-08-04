'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  QualifiedReadingsPageState, 
  Reading, 
  Category, 
  CartSummary 
} from '../types';
import { 
  categories, 
  readings, 
  getReadingsByCategory, 
  getCategoryById 
} from '../data/readings';

export function useQualifiedReadings() {
  const router = useRouter();
  
  // State management
  const [state, setState] = useState<QualifiedReadingsPageState>({
    selectedCategory: '', // No default category selected
    selectedReadings: [],
    expandedReadings: [],
    isLoading: true,
    hasSessionData: false
  });

  // Check for session data on mount
  useEffect(() => {
    const checkSessionData = () => {
      const sessionData = sessionStorage.getItem('astroSession');
      
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

        setState(prev => ({
          ...prev,
          hasSessionData: true,
          isLoading: false
        }));
      } catch (error) {
        console.error('❌ Error parsing session data:', error);
        router.push('/birth-form');
      }
    };

    checkSessionData();
  }, [router]);

  // Computed values
  const currentReadings = useMemo(() => {
    if (!state.selectedCategory) return [];
    return getReadingsByCategory(state.selectedCategory);
  }, [state.selectedCategory]);

  const cartSummary = useMemo((): CartSummary => {
    const selectedReadingObjects = currentReadings.filter(reading => 
      state.selectedReadings.includes(reading.id)
    );
    
    const totalPrice = selectedReadingObjects.reduce((sum, reading) => 
      sum + reading.price, 0
    );

    return {
      totalReadings: selectedReadingObjects.length,
      totalPrice,
      selectedReadings: selectedReadingObjects
    };
  }, [state.selectedReadings, currentReadings]);

  // Event handlers
  const handleCategoryChange = useCallback((categoryId: string) => {
    setState(prev => ({
      ...prev,
      selectedCategory: categoryId,
      // Clear expanded readings when changing category
      expandedReadings: []
    }));
  }, []);

  const handleToggleReading = useCallback((readingId: string) => {
    setState(prev => ({
      ...prev,
      selectedReadings: prev.selectedReadings.includes(readingId)
        ? prev.selectedReadings.filter(id => id !== readingId)
        : [...prev.selectedReadings, readingId]
    }));
  }, []);

  const handleToggleExpansion = useCallback((readingId: string) => {
    setState(prev => ({
      ...prev,
      expandedReadings: prev.expandedReadings.includes(readingId)
        ? prev.expandedReadings.filter(id => id !== readingId)
        : [...prev.expandedReadings, readingId]
    }));
  }, []);

  const handleProceed = useCallback(() => {
    if (cartSummary.totalReadings === 0) return;
    
    const sessionData = sessionStorage.getItem('astroSession');
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
      updatedAt: Date.now()
    };
    
    sessionStorage.setItem('astroSession', JSON.stringify(updatedSession));
    
    const finalUrl = `/results?sessionId=${parsedSession.sessionId}`;
    router.push(finalUrl);
  }, [cartSummary.totalReadings, state.selectedReadings, router]);

  // Utility functions
  const isReadingSelected = useCallback((readingId: string) => {
    return state.selectedReadings.includes(readingId);
  }, [state.selectedReadings]);

  const isReadingExpanded = useCallback((readingId: string) => {
    return state.expandedReadings.includes(readingId);
  }, [state.expandedReadings]);

  const getCurrentCategory = useCallback((): Category | undefined => {
    if (!state.selectedCategory) return undefined;
    return getCategoryById(state.selectedCategory);
  }, [state.selectedCategory]);

  return {
    // State
    state,
    currentReadings,
    cartSummary,
    currentCategory: getCurrentCategory(),
    
    // Actions
    handleCategoryChange,
    handleToggleReading,
    handleToggleExpansion,
    handleProceed,
    
    // Utilities
    isReadingSelected,
    isReadingExpanded,
    
    // Data
    categories,
    isLoading: state.isLoading,
    hasSessionData: state.hasSessionData
  };
} 