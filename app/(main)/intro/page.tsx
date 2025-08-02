'use client';

import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from '../../components/ui/icons';
import { Button } from '../../components/ui/Button';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';
import { IntroErrorFallback } from './components';
import { SharedHeader, SharedFooter } from '../../components/layout';
import { performanceMonitor } from './lib/performance';
import { NonCriticalCSSLoader } from '../../components/ui/ProgressiveCSSLoader';
import styles from './page.module.css';
import IntroHero from './IntroHero';

// Lazy load non-critical components
const LearnList = lazy(() => import('./LearnList'));

// Error boundary for lazy-loaded components
const LazyComponentErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (hasError) {
    return (
      <div className={styles.errorFallback}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>Unable to load content. Please refresh the page.</p>
        <button 
          onClick={() => {
            setHasError(false);
            setError(null);
          }}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary 
      fallback={
        <div className={styles.errorFallback}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorMessage}>Unable to load content. Please refresh the page.</p>
          <button 
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      }
      onError={(error) => {
        setHasError(true);
        setError(error);
        // Lazy component error
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default function IntroPage() {
  const router = useRouter();
  const [section, setSection] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const homeArrowRef = useRef<HTMLButtonElement>(null);

  // Analytics tracking
  const trackInteraction = (action: string, data?: any) => {
    // Track interaction performance
    performanceMonitor.trackInteraction(action);
    // Future: Integrate with analytics service
    // analytics.track('intro_interaction', { action, data });
  };

  // Error display handler
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Navigation handler with error handling
  const handleNavigation = useCallback(async (path: string, action: string) => {
    setIsNavigating(true);
    setError(null);
    
    try {
      trackInteraction(action);
      await router.push(path);
    } catch (error: unknown) {
      setIsNavigating(false);
      showError('Unable to navigate. Please try again.');
      const errorMessage = error instanceof Error ? error.message : String(error);
      trackInteraction('navigation_error', { path, error: errorMessage });
    }
  }, [router]);

  const handleStart = useCallback(() => {
    handleNavigation('/birth-form', 'start_journey');
  }, [handleNavigation]);

  const handleLearnMore = () => {
    if (section === 0) {
      trackInteraction('learn_more_clicked');
      setSection(1);
    } else {
      handleNavigation('/qualified-readings', 'learn_how_we_do_it');
    }
  };

  // Focus management for section changes
  useEffect(() => {
    if (section === 1 && contentRef.current) {
      // Focus first interactive element when section changes
      const firstButton = contentRef.current.querySelector('button, [role="button"]') as HTMLElement;
      if (firstButton) {
        firstButton.focus();
      }
    }
  }, [section]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+Enter to start journey
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleStart();
      }

      // Escape to go back to section 0
      if (e.key === 'Escape' && section === 1) {
        e.preventDefault();
        setSection(0);
      }

      // Space/Enter on home arrow to go back
      if ((e.key === ' ' || e.key === 'Enter') && e.target === homeArrowRef.current) {
        e.preventDefault();
        setSection(0);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [section, handleStart]);

  // Loading fallback for lazy components
  const LoadingFallback = () => (
    <div className={styles.loadingFallback}>
      <div className={styles.loadingSpinner} />
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );

  return (
    <ErrorBoundary fallback={<IntroErrorFallback />}>
      <NonCriticalCSSLoader />
      {/* Header */}
      <SharedHeader />
      
      {/* Skip link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      
      <div className={`${styles.intro} ${section === 0 ? styles.heroSection : styles.learnSection} vignette-bg`}>
        {/* Loading Overlay */}
        {isNavigating && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Preparing your journey...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className={styles.errorDisplay}>
            <div className={styles.errorIcon}>⚠️</div>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        )}

        <div className={styles.content} ref={contentRef} id="main-content">
          {/* Live region for screen readers */}
          <div aria-live="polite" aria-label="Page section" className={styles.srOnly}>
            {section === 0 ? 'Hero section' : 'Learn more section'}
          </div>

          {/* Home arrow button - only show on section 1 */}
          {section === 1 && (
            <button
              ref={homeArrowRef}
              className={styles.homeArrow}
              onClick={() => setSection(0)}
              aria-label="Back to Home"
              disabled={isNavigating}
              tabIndex={0}
            >
              <ArrowLeft />
            </button>
          )}
          
          {section === 0 && (
            <IntroHero 
              onStart={handleStart} 
              onLearnMore={() => setSection(1)} 
              disabled={isNavigating}
            />
          )}
          {section === 1 && (
            <>
              <LazyComponentErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <LearnList />
                </Suspense>
              </LazyComponentErrorBoundary>
              <div className={styles.buttonRow}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStart}
                  aria-label="Get Started"
                  className={styles.getStartedButton}
                  disabled={isNavigating}
                >
                  Get Started
                </Button>
                <button
                  className={styles.linkButton}
                  onClick={handleLearnMore}
                  aria-label="Learn More"
                  disabled={isNavigating}
                >
                  Learn More
                </button>
              </div>
            </>
          )}
        </div>

              {/* Footer */}
      <SharedFooter />
      </div>
    </ErrorBoundary>
  );
}

