'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from './Button';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log detailed error information to console during development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error stack:', error.stack);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Log error in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[ROOT ERROR BOUNDARY]', {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        context: {
          errorBoundary: 'RootErrorBoundary',
          component: 'ErrorBoundary',
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'server',
        },
      });
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if props changed and resetOnPropsChange is true
    if (
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children &&
      this.state.hasError
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorBoundaryContent}>
            <div className={styles.errorBoundaryIcon}>⚠️</div>
            <h2 className={styles.errorBoundaryTitle}>Something went wrong</h2>
            <p className={styles.errorBoundaryMessage}>
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorBoundaryDetails}>
                <summary>Error Details (Development Only)</summary>
                <div className={styles.errorBoundaryStack}>
                  <strong>Error:</strong> {this.state.error.message}
                  {'\n\n'}
                  <strong>Stack:</strong>
                  {'\n'}
                  {this.state.error.stack}
                  {'\n\n'}
                  <strong>Component Stack:</strong>
                  {'\n'}
                  {this.state.errorInfo?.componentStack}
                </div>
              </details>
            )}

            <div className={styles.errorBoundaryActions}>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReset}
                className={styles.errorBoundaryResetButton}
              >
                Try Again
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.location.reload()}
                className={styles.errorBoundaryReloadButton}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
