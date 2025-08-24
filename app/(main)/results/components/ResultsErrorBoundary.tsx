'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './ResultsErrorBoundary.module.css';

interface ResultsErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ResultsErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

// Inner class component for error boundary functionality
class ResultsErrorBoundaryClass extends Component<
  ResultsErrorBoundaryProps,
  ResultsErrorBoundaryState
> {
  constructor(props: ResultsErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ResultsErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // ResultsErrorBoundary caught an error

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[RESULTS ERROR]', {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        context: {
          retryCount: this.state.retryCount,
          errorBoundary: 'ResultsErrorBoundary',
          component: 'results',
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'server',
        },
      });
    }
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;

    // Limit retries to prevent infinite loops
    if (newRetryCount > 3) {
      this.handleReset();
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount,
    });
  };

  handleReset = () => {
    // Clear any stored session data that might be corrupted
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('astroSession');
        window.sessionStorage.removeItem('natalChartData');
        window.sessionStorage.removeItem('birthFormData');
      }
    } catch (storageError) {
      // Failed to clear storage
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });

    // Navigate back to birth form to start fresh
    if (typeof window !== 'undefined') {
      window.location.href = '/birth-form';
    }
  };

  handleGoBack = () => {
    // Navigate back to the birth form
    if (typeof window !== 'undefined') {
      window.location.href = '/birth-form';
    }
  };

  handleGoHome = () => {
    // Navigate to the intro page
    if (typeof window !== 'undefined') {
      window.location.href = '/intro';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.resultsErrorBoundary}>
          <div className={styles.resultsErrorContent}>
            <div className={styles.resultsErrorIcon}>🌟</div>
            <h2 className={styles.resultsErrorTitle}>Reading Generation Error</h2>
            <p className={styles.resultsErrorMessage}>
              We encountered an issue while generating your astrology readings. 
              This might be due to a temporary problem with our AI service or 
              corrupted session data.
            </p>

            {this.state.retryCount > 0 && (
              <p className={styles.resultsErrorRetry}>
                Retry attempt: {this.state.retryCount}/3
              </p>
            )}

            <div className={styles.resultsErrorActions}>
              {this.state.retryCount < 3 && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={this.handleRetry}
                  className={styles.resultsErrorRetryButton}
                >
                  Try Again
                </Button>
              )}

              <Button
                variant="secondary"
                size="md"
                onClick={this.handleReset}
                className={styles.resultsErrorResetButton}
              >
                Start Fresh
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleGoBack}
                className={styles.resultsErrorBackButton}
              >
                Back to Form
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleGoHome}
                className={styles.resultsErrorHomeButton}
              >
                Go Home
              </Button>
            </div>

            <div className={styles.resultsErrorHelp}>
              <p>
                If this problem persists, please try refreshing the page or 
                contact support with the error details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export the class component as the main component
export { ResultsErrorBoundaryClass as ResultsErrorBoundary };

// Higher-order component for easier usage
export function withResultsErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ResultsErrorBoundaryClass onError={onError}>
      <Component {...props} />
    </ResultsErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withResultsErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
} 