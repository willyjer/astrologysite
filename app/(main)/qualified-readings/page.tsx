'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PageLayout } from '../../components/layout';
import { ReadingsErrorBoundary } from './components/ReadingsErrorBoundary';
import { CartSummary } from './components';
import { useQualifiedReadings } from './hooks/useQualifiedReadings';
import styles from './page.module.css';

// Dynamic imports for heavy components
const QualifiedReadingsPageContent = dynamic(
  () => import('./components/QualifiedReadingsPageContent'),
  {
    loading: () => (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading your personalized readings...</p>
      </div>
    ),
    ssr: false
  }
);

export default function QualifiedReadingsPage() {
  // Lift the hook to page level so both components share the same state
  const qualifiedReadingsData = useQualifiedReadings();

  return (
    <ReadingsErrorBoundary>
      <PageLayout
        containerClassName={styles.qualifiedReadingsContainer}
        contentClassName={styles.qualifiedReadingsContent}
      >
        <Suspense fallback={
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading your personalized readings...</p>
          </div>
        }>
          <QualifiedReadingsPageContent {...qualifiedReadingsData} />
        </Suspense>
      </PageLayout>
      
      {/* Persistent Bottom Cart - Outside PageLayout to stick to bottom */}
      <div className={styles.bottomCartContainer}>
        <Suspense fallback={<div>Loading cart...</div>}>
          <CartSummary 
            cartSummary={qualifiedReadingsData.cartSummary} 
            onProceed={qualifiedReadingsData.handleProceed}
            isLoading={qualifiedReadingsData.isLoading}
          />
        </Suspense>
      </div>
    </ReadingsErrorBoundary>
  );
}
