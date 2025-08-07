'use client';

import { Suspense, lazy } from 'react';
import styles from './styles.module.css';
import { LoadingState, ErrorState } from './components';
import { PageLayout } from '../../components/layout';
import { useResultsPage } from './hooks';
import { useReadingsGeneration } from './hooks/useReadingsGeneration';
import { ResultsErrorBoundary } from './components/ResultsErrorBoundary';

// Lazy load heavy components
const ReadingAccordion = lazy(() => import('./components/ReadingAccordion'));
const TabNavigation = lazy(() => import('./components/TabNavigation'));

function ResultsPageContent() {
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
    progressData,
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

  // Handle retry functionality
  const handleRetry = () => {
    setError('');
    setStatus('loading');
  };

  // Filter readings by selected category
  const filteredReadings = generatedReadings.filter(
    (reading) => reading.category === selectedCategory
  );

  // Build categories with reading counts
  const allCategories = [
    {
      key: 'self-identity',
      label: 'Self-Identity & Authenticity',
      shortLabel: 'Self-Identity & Authenticity',
      overview: '',
      readings: [
        {
          id: 'core-self',
          name: 'Core Self & Personality Blueprint',
          description: '',
          universal: true,
          conditional: false,
        },
        {
          id: 'inner-warrior',
          name: 'Your Inner Warrior – Confidence & Drive',
          description: '',
          universal: true,
          conditional: false,
        },
        {
          id: 'self-belief',
          name: 'Self-Belief & Inner Light',
          description: '',
          universal: true,
          conditional: false,
        },
        {
          id: 'chart-ruler',
          name: 'The Chart Ruler & Your Guiding Energy',
          description: '',
          universal: true,
          conditional: false,
        },
      ],
    },
    {
      key: 'mindset',
      label: 'Mindset & Growth',
      shortLabel: 'Mindset & Growth',
      overview: '',
      readings: [
        {
          id: 'growth-mindset',
          name: 'Growth Mindset',
          description: '',
          universal: true,
          conditional: false,
        },
        {
          id: 'mental-clarity',
          name: 'Mental Clarity',
          description: '',
          universal: true,
          conditional: false,
        },
      ],
    },
    {
      key: 'love',
      label: 'Love & Relationships',
      shortLabel: 'Love & Relationships',
      overview: '',
      readings: [
        {
          id: 'love-patterns',
          name: 'Love Patterns',
          description: '',
          universal: true,
          conditional: false,
        },
        {
          id: 'soulmate-compatibility',
          name: 'Soulmate Compatibility',
          description: '',
          universal: true,
          conditional: false,
        },
      ],
    },
    {
      key: 'career',
      label: 'Career & Purpose',
      shortLabel: 'Career & Purpose',
      overview: '',
      readings: [
        {
          id: 'career-path',
          name: 'Career Path & Professional Growth',
          description: '',
          universal: true,
          conditional: false,
        },
        {
          id: 'life-purpose',
          name: 'Life Purpose & Soul Mission',
          description: '',
          universal: true,
          conditional: false,
        },
      ],
    },
  ];

  // Loading state
  if (status === 'loading' || status === 'processing') {
    return (
      <PageLayout
        containerClassName={styles.resultsContainer}
        contentClassName={styles.resultsContent}
      >
        <LoadingState
          status={status}
          message={
            status === 'processing'
              ? 'Our AI is crafting your personalized astrology readings. This may take a minute...'
              : undefined
          }
          showProgress={status === 'processing'}
          progressData={progressData}
        />
      </PageLayout>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <PageLayout
        containerClassName={styles.resultsContainer}
        contentClassName={styles.resultsContent}
      >
        <ErrorState error={error} onRetry={handleRetry} />
      </PageLayout>
    );
  }

  // Success state
  return (
    <PageLayout
      containerClassName={styles.resultsContainer}
      contentClassName={styles.resultsContent}
    >
      <div className={styles.successHeader}>
        <h1 className={styles.successTitle}>Your Readings Are Ready!</h1>
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
                isOpen={openAccordion === index}
                onToggle={() =>
                  setOpenAccordion(openAccordion === index ? null : index)
                }
              />
            </Suspense>
          ))}
        </div>
      </div>
    </PageLayout>
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
