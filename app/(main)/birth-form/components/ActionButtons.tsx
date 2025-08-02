import { Button } from '../../../components/ui/Button';
import styles from '../page.module.css';

interface ActionButtonsProps {
  handleNext: () => void;
  isLoading: boolean;
  showErrors: boolean;
  error: string;
}

export function ActionButtons({ handleNext, isLoading, showErrors, error }: ActionButtonsProps) {
  return (
    <div className={styles.buttons}>
      <Button
        variant="primary"
        size="md"
        onClick={handleNext}
        disabled={isLoading || (showErrors && !!error)}
        className={showErrors && error ? styles.buttonDisabled : ''}
      >
        {isLoading ? 'Fetching Your Chart...' : 'View My Personalized Readings List'}
      </Button>
    </div>
  );
} 