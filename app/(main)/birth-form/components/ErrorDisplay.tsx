import styles from '../page.module.css';

interface ErrorDisplayProps {
  showErrors: boolean;
  error: string;
  submissionError: string | null;
}

export function ErrorDisplay({ showErrors, error, submissionError }: ErrorDisplayProps) {
  if (!((showErrors && error) || submissionError)) {
    return null;
  }

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <p className={styles.errorMessage}>{error || submissionError}</p>
    </div>
  );
} 