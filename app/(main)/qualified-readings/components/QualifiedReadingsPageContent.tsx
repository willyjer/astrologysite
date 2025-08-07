'use client';

import React from 'react';
import { ReadingCard, CategorySelector, CartSummary } from './index';
import { useQualifiedReadings } from '../hooks/useQualifiedReadings';
import styles from '../page.module.css';

export default function QualifiedReadingsPageContent() {
  const {
    // State
    currentReadings,
    cartSummary,
    currentCategory,
    categories,
    isLoading,
    hasSessionData,

    // Actions
    handleCategoryChange,
    handleToggleReading,
    handleToggleExpansion,
    handleProceed,

    // Utilities
    isReadingSelected,
    isReadingExpanded,
  } = useQualifiedReadings();

  // Show loading state while checking session data
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading your personalized readings...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if no session data
  if (!hasSessionData) {
    return null; // Will redirect to birth form
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Begin Your Inner Journey</h1>
          <p className={styles.subtitle}>
            Explore readings designed to reveal your inner patterns, gifts,
            and growth path
          </p>
        </header>

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
      </div>

      {/* Persistent Bottom Cart */}
      <CartSummary cartSummary={cartSummary} onProceed={handleProceed} />
    </div>
  );
} 