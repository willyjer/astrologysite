'use client';

import { useEffect, Suspense, lazy, useState } from 'react';
import styles from './styles.module.css';
import { LoadingState, ErrorState } from './components';
import { SharedHeader, SharedFooter } from '../../components/layout';
import { useResultsPage } from './hooks';
import { useReadingsGeneration } from './hooks/useReadingsGeneration';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';

// Lazy load heavy components
const ReadingAccordion = lazy(() => import('./components/ReadingAccordion'));
const TabNavigation = lazy(() => import('./components/TabNavigation'));

function ResultsPageContent() {
  const [isClient, setIsClient] = useState(false);

  // Add logging to see what data we're receiving
  useEffect(() => {
    // SuccessPage: URL params
  }, []);

  // Use extracted hooks for all logic
  const {
    status,
    birthFormData,
    selectedReadings,
    chartData,
    generatedReadings,
    error,
    openAccordion,
    selectedCategory,
    setOpenAccordion,
    setSelectedCategory,
    setError,
    setStatus,
    setGeneratedReadings,
  } = useResultsPage();

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

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle retry functionality
  const handleRetry = () => {
    setError('');
    setStatus('loading');
  };

  // Filter readings by selected category
  const filteredReadings = generatedReadings.filter(reading => reading.category === selectedCategory);

  // Log readings for debugging
  useEffect(() => {
    if (generatedReadings.length > 0) {
      // SuccessPage: Current readings state
    }
  }, [generatedReadings]);

  // Show all categories, but mark inactive ones
  const allCategories: any[] = []; // Temporarily empty until we rebuild categories

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <>
        <SharedHeader />
        <div className={styles.mainContainer}>
          <div className={styles.content}>
            <LoadingState status="loading" />
          </div>
          <SharedFooter />
        </div>
      </>
    );
  }

  // Loading or processing state
  if (status === 'loading' || status === 'processing') {
    return (
      <>
        {/* Header */}
        <SharedHeader />
        
        <div className={styles.mainContainer}>
          <div className={styles.content}>
            <LoadingState 
              status={status} 
              message={status === 'processing' ? 'Our AI is crafting your personalized astrology readings. This may take a minute...' : undefined}
              showProgress={status === 'processing'}
            />
          </div>
          
          {/* Footer */}
          <SharedFooter />
        </div>
      </>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <>
        {/* Header */}
        <SharedHeader />
        
        <div className={styles.mainContainer}>
          <div className={styles.content}>
            <ErrorState 
              error={error} 
              onRetry={handleRetry}
            />
          </div>
          
          {/* Footer */}
          <SharedFooter />
        </div>
      </>
    );
  }

  // Success state
  return (
    <>
      {/* Header */}
      <SharedHeader />
      
      <div className={styles.mainContainer}>
        <div className={styles.content}>
          <div className={styles.successHeader}>
            <h1 className={styles.successTitle}>Your Readings Are Ready! ✨</h1>
            <p className={styles.successSubtitle}>
              Your personalized astrology readings have been crafted with care. 
              Explore the insights below to discover your cosmic path.
            </p>
          </div>

          <div className={styles.readingsContainer}>
            <Suspense fallback={<div>Loading navigation...</div>}>
              <TabNavigation
                categories={allCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                generatedReadings={generatedReadings}
              />
            </Suspense>
            
            <div className={styles.readingsContent}>
              {filteredReadings.map((reading, index) => (
                <Suspense key={reading.id} fallback={<div>Loading reading...</div>}>
                  <ReadingAccordion
                    reading={reading}
                    index={index}
                    isOpen={openAccordion === index}
                    onToggle={() => setOpenAccordion(openAccordion === index ? null : index)}
                  />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <SharedFooter />
      </div>
    </>
  );
}

export default function ResultsPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResultsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}