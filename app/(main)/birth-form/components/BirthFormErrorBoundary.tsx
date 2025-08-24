'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './BirthFormErrorBoundary.module.css';

interface BirthFormErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface BirthFormErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

// Inner class component for error boundary functionality
class BirthFormErrorBoundaryClass extends Component<
  BirthFormErrorBoundaryProps,
  BirthFormErrorBoundaryState
> {
  constructor(props: BirthFormErrorBoundaryProps) {
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
  ): Partial<BirthFormErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // BirthFormErrorBoundary caught an error

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[BIRTH FORM ERROR]', {
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
          errorBoundary: 'BirthFormErrorBoundary',
          component: 'birth-form',
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
    // Clear any stored form data that might be corrupted
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('birthForm');
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

    // Reload the page to start fresh
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleGoBack = () => {
    // Navigate back to the intro page
    if (typeof window !== 'undefined') {
      window.location.href = '/intro';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.birthFormErrorBoundary}>
          <div className={styles.birthFormErrorContent}>
            <div className={styles.birthFormErrorIcon}>🌌</div>
            <h2 className={styles.birthFormErrorTitle}>Form Error</h2>
            <p className={styles.birthFormErrorMessage}>
              We encountered an issue with the birth form. This might be due to
              corrupted data or a temporary problem.
            </p>

            {this.state.retryCount > 0 && (
              <p className={styles.birthFormErrorRetry}>
                Retry attempt: {this.state.retryCount}/3
              </p>
            )}

            <div className={styles.birthFormErrorActions}>
              {this.state.retryCount < 3 && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={this.handleRetry}
                  className={styles.birthFormErrorRetryButton}
                >
                  Try Again
                </Button>
              )}

              <Button
                variant="secondary"
                size="md"
                onClick={this.handleReset}
                className={styles.birthFormErrorResetButton}
              >
                Start Fresh
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleGoBack}
                className={styles.birthFormErrorBackButton}
              >
                Go Back
              </Button>
            </div>

            <div className={styles.birthFormErrorHelp}>
              <p>
                If this problem persists, please contact support with the error
                details above.
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
export { BirthFormErrorBoundaryClass as BirthFormErrorBoundary };

// Higher-order component for easier usage
export function withBirthFormErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <BirthFormErrorBoundaryClass onError={onError}>
      <Component {...props} />
    </BirthFormErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withBirthFormErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
