import type { ErrorStateProps } from '../types';
import styles from './ErrorState.module.css';

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <h1>Something Went Wrong</h1>
      <p>{error}</p>
      <button onClick={onRetry} className={styles.retryButton}>
        Try Again
      </button>
    </div>
  );
}
