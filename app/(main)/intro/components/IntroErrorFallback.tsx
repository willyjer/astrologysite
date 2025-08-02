import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/Button';
import styles from './IntroErrorFallback.module.css';

interface IntroErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const IntroErrorFallback: React.FC<IntroErrorFallbackProps> = ({ 
  error, 
  resetError 
}) => {
  const router = useRouter();
  
  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Something went wrong</h2>
        <p className={styles.errorMessage}>
          We encountered an unexpected error. Please try refreshing the page.
        </p>

        <div className={styles.errorActions}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleRefresh}
            className={styles.refreshButton}
          >
            Refresh Page
          </Button>
          <button
            onClick={() => router.push('/')}
            className={styles.homeButton}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroErrorFallback; 