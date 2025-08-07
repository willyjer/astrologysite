'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SharedHeader, SharedFooter } from '../../components/layout';
import { ReadingsErrorBoundary } from './components/ReadingsErrorBoundary';
import styles from './page.module.css';

// Dynamic imports for heavy components
const QualifiedReadingsPageContent = dynamic(
  () => import('./components/QualifiedReadingsPageContent'),
  {
    loading: () => (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading your personalized readings...</p>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function QualifiedReadingsPage() {
    return (
    <ReadingsErrorBoundary>
        <SharedHeader />
      <Suspense fallback={
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading your personalized readings...</p>
            </div>
          </div>
        </div>
      }>
        <QualifiedReadingsPageContent />
      </Suspense>
      <SharedFooter />
    </ReadingsErrorBoundary>
  );
}
