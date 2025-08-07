'use client';

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '../../../components/ui/Button';
import styles from './ReadingsErrorBoundary.module.css';

interface ReadingsErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ReadingsErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

// Inner class component for error boundary functionality
class ReadingsErrorBoundaryClass extends Component<
  ReadingsErrorBoundaryProps,
  ReadingsErrorBoundaryState
> {
  constructor(props: ReadingsErrorBoundaryProps) {
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
  ): Partial<ReadingsErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // ReadingsErrorBoundary caught an error

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, {
        extra: {
          componentStack: errorInfo.componentStack,
          retryCount: this.state.retryCount,
          errorBoundary: 'ReadingsErrorBoundary',
        },
        tags: {
          errorBoundary: 'readings',
          component: 'ReadingsErrorBoundary',
          retryCount: this.state.retryCount.toString(),
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
        <div className={styles.readingsErrorBoundary}>
          <div className={styles.readingsErrorContent}>
            <div className={styles.readingsErrorIcon}>📚</div>
            <h2 className={styles.readingsErrorTitle}>Readings Display Error</h2>
            <p className={styles.readingsErrorMessage}>
              We encountered an issue while loading your personalized readings. 
              This might be due to a temporary problem with the data or 
              corrupted session information.
            </p>

            {this.state.retryCount > 0 && (
              <p className={styles.readingsErrorRetry}>
                Retry attempt: {this.state.retryCount}/3
              </p>
            )}

            <div className={styles.readingsErrorActions}>
              {this.state.retryCount < 3 && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={this.handleRetry}
                  className={styles.readingsErrorRetryButton}
                >
                  Try Again
                </Button>
              )}

              <Button
                variant="secondary"
                size="md"
                onClick={this.handleReset}
                className={styles.readingsErrorResetButton}
              >
                Start Fresh
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleGoBack}
                className={styles.readingsErrorBackButton}
              >
                Back to Form
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleGoHome}
                className={styles.readingsErrorHomeButton}
              >
                Go Home
              </Button>
            </div>

            <div className={styles.readingsErrorHelp}>
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
export { ReadingsErrorBoundaryClass as ReadingsErrorBoundary };

// Higher-order component for easier usage
export function withReadingsErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ReadingsErrorBoundaryClass onError={onError}>
      <Component {...props} />
    </ReadingsErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withReadingsErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
} 