import { Button } from '../../../components/ui/Button';
import { useButtonSize } from '../../../hooks/useButtonSize';
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
  const buttonSize = useButtonSize();
  return (
    <div className={styles.buttons}>
      <Button
        variant="primary"
        size={buttonSize}
        onClick={handleNext}
        disabled={isLoading || isNavigating || (showErrors && !!error)}
        className={`${showErrors && error ? styles.buttonDisabled : ''}`}
      >
        {isLoading || isNavigating
          ? 'Fetching Your Reading List'
          : 'View Readings'}
      </Button>
    </div>
  );
}
