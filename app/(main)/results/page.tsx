'use client';

import React, { Suspense } from 'react';
import styles from './styles.module.css';
import { LoadingState, ErrorState, ReadingList, ReadingModal, DonationWidget } from './components';
import { PageLayout } from '../../components/layout';
import layoutStyles from '../../components/layout/PageLayout.module.css';
import { useResultsPage } from './hooks';
import { useReadingsGeneration } from './hooks/useReadingsGeneration';
import { ResultsErrorBoundary } from './components/ResultsErrorBoundary';
import { GeneratedReading } from './types';

function ResultsPageContent() {
  // Use extracted hooks for all logic
  const {
    status,
    birthFormData,
    selectedReadings,
    chartData,
    generatedReadings,
    error,
    setError,
    setStatus,
    setGeneratedReadings,
  } = useResultsPage();

  // Modal state
  const [selectedReading, setSelectedReading] = React.useState<GeneratedReading | null>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  // Use the readings generation hook directly
  useReadingsGeneration({
    birthFormData,
    selectedReadings,
    chartData,
    status,
    generatedReadings,
    setGeneratedReadings,
    setStatus,
    setError,
  });

  // Handle retry functionality
  const handleRetry = () => {
    setError('');
    setStatus('loading');
  };

  // Handle reading selection
  const handleReadingClick = (reading: GeneratedReading) => {
    setSelectedReading(reading);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReading(null);
  };

  // Loading state
  if (status === 'loading' || status === 'processing') {
    return (
      <PageLayout
        containerClassName={styles.resultsContainer}
      >
        <div className={`${layoutStyles.contentContainer} ${styles.resultsContent}`}>
          <LoadingState
            status={status}
            message={
              status === 'processing'
                ? 'Our AI is crafting your personalized astrology readings. This may take a minute...'
                : undefined
            }
          />
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <PageLayout
        containerClassName={styles.resultsContainer}
      >
        <div className={`${layoutStyles.contentContainer} ${styles.resultsContent}`}>
          <ErrorState error={error} onRetry={handleRetry} />
        </div>
      </PageLayout>
    );
  }

  // Success state
  return (
    <>
      <PageLayout
        containerClassName={styles.resultsContainer}
      >
        <div className={`${layoutStyles.contentContainer} ${styles.resultsContent}`}>
          <div className={styles.successHeader}>
            <h1 className={styles.successTitle}>Your Readings Are Ready!</h1>
            <p className={styles.successSubheadline}>View your readings by clicking on them below</p>
          </div>

          <div className={styles.readingsContainer}>
            <ReadingList 
              readings={generatedReadings}
              onReadingClick={handleReadingClick}
            />
          </div>

          {/* Donation Widget */}
          <DonationWidget />
        </div>
      </PageLayout>

      {/* Reading Modal - rendered outside PageLayout to avoid z-index stacking context issues */}
      <ReadingModal
        reading={selectedReading}
        isVisible={isModalVisible}
        onClose={handleModalClose}
      />
    </>
  );
}

export default function ResultsPage() {
  return (
    <ResultsErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <ResultsPageContent />
      </Suspense>
    </ResultsErrorBoundary>
  );
}
