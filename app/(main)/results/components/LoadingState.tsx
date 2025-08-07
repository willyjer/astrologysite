import type { LoadingStateProps } from '../types';
import styles from './LoadingState.module.css';

export default function LoadingState({
  status,
  message,
  showProgress = false,
}: LoadingStateProps) {
  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Preparing Your Readings';
      case 'processing':
        return 'Generating Your Readings';
      default:
        return 'Loading...';
    }
  };

  const getMessage = () => {
    if (message) return message;

    switch (status) {
      case 'loading':
        return 'Please wait while we set up your personalized astrology readings...';
      case 'processing':
        return 'Our AI is crafting your personalized astrology readings. This may take a minute...';
      default:
        return 'Please wait...';
    }
  };

  return (
    <div className={styles.loadingState}>
      <div className={styles.loadingSpinner}></div>
      <h1>{getTitle()}</h1>
      <p>{getMessage()}</p>
      
      {/* Simple progress bar only */}
      {showProgress && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      )}
    </div>
  );
}
