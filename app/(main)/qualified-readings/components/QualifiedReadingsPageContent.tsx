'use client';

import React from 'react';
import { ReadingCard, CategorySelector } from './index';
import styles from '../page.module.css';

interface QualifiedReadingsPageContentProps {
  // State
  currentReadings: any[];
  currentCategory: any;
  categories: any[];
  isLoading: boolean;
  hasSessionData: boolean;

  // Actions
  handleCategoryChange: (categoryId: string) => void;
  handleToggleReading: (readingId: string) => void;
  handleToggleExpansion: (readingId: string) => void;

  // Utilities
  isReadingSelected: (readingId: string) => boolean;
  isReadingExpanded: (readingId: string) => boolean;
}

export default function QualifiedReadingsPageContent({
  currentReadings,
  currentCategory,
  categories,
  isLoading,
  hasSessionData,
  handleCategoryChange,
  handleToggleReading,
  handleToggleExpansion,
  isReadingSelected,
  isReadingExpanded,
}: QualifiedReadingsPageContentProps) {
  // Show loading state while checking session data
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading your personalized readings...</p>
      </div>
    );
  }

  // Don't render the form if no session data
  if (!hasSessionData) {
    return null; // Will redirect to birth form
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Begin Your<br />
          Inner Journey
        </h1>
      </header>

      {/* Category description */}
      <div className={styles.categoryDescription}>
        <p>Select a category below to discover personalized readings that illuminate different dimensions of your life</p>
      </div>

      {/* Unified Category and Readings Container */}
      <div className={styles.unifiedContainer}>
        {/* Category Selection */}
        <CategorySelector
          categories={categories}
          selectedCategory={currentCategory?.id || ''}
          onCategoryChange={handleCategoryChange}
        />

        {/* Readings Selection - Only show when a category is selected */}
        {currentCategory && (
          <section className={styles.section}>
            <div className={styles.readingsGrid}>
              {currentReadings.map((reading) => (
                <ReadingCard
                  key={reading.id}
                  reading={reading}
                  isSelected={isReadingSelected(reading.id)}
                  isExpanded={isReadingExpanded(reading.id)}
                  onToggleSelection={handleToggleReading}
                  onToggleExpansion={handleToggleExpansion}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
} 