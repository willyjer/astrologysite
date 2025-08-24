'use client';

import React from 'react';
import { ReadingsErrorBoundary } from './components';
import { ReadingsListView } from './components';
import { ReadingDetailView } from './components';
import { useQualifiedReadings } from './hooks/useQualifiedReadings';
import styles from './page.module.css';

export default function QualifiedReadingsPage() {
  // Lift the hook to page level so both components share the same state
  const qualifiedReadingsData = useQualifiedReadings();

  return (
    <ReadingsErrorBoundary>
      {qualifiedReadingsData.isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading your personalized readings...</p>
        </div>
      ) : qualifiedReadingsData.hasSessionData ? (
        <ReadingsListView 
          readings={qualifiedReadingsData.currentReadings}
          onSelectReading={qualifiedReadingsData.handleOpenDetail}
          cartSummary={qualifiedReadingsData.cartSummary}
          onProceed={qualifiedReadingsData.handleProceed}
          isLoading={qualifiedReadingsData.isLoading}
        />
      ) : null}

      {/* Reading Detail View */}
      <ReadingDetailView
        reading={qualifiedReadingsData.state.detailViewReading}
        isVisible={qualifiedReadingsData.state.isDetailViewVisible}
        onClose={qualifiedReadingsData.handleCloseDetail}
        isSelected={qualifiedReadingsData.state.detailViewReading ? qualifiedReadingsData.isReadingSelected(qualifiedReadingsData.state.detailViewReading.id) : false}
        onToggleSelection={qualifiedReadingsData.handleToggleReading}
      />
    </ReadingsErrorBoundary>
  );
}
