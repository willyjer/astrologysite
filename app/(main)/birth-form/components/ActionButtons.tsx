import { Button } from '../../../components/ui/Button';
import styles from '../page.module.css';

interface ActionButtonsProps {
  handleNext: () => void;
  isLoading: boolean;
  isNavigating?: boolean;
  showErrors: boolean;
  error: string;
}

export function ActionButtons({
  handleNext,
  isLoading,
  isNavigating = false,
  showErrors,
  error,
}: Readonly<ActionButtonsProps>) {
  return (
    <div className={styles.buttons}>
      <Button
        variant="primary"
        size="sm"
        onClick={handleNext}
        disabled={isLoading || isNavigating || (showErrors && !!error)}
        className={`${showErrors && error ? styles.buttonDisabled : ''} ${styles.responsiveButton}`}
      >
        <span className={styles.desktopText}>
          {isLoading || isNavigating
            ? 'Fetching Your Reading List'
            : 'View My Personalized Readings List'}
        </span>
        <span className={styles.mobileText}>
          {isLoading || isNavigating ? 'Fetching Your Reading List' : 'View My Readings List'}
        </span>
      </Button>
    </div>
  );
}
