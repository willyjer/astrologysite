import React, { useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import {
  X,
  Loader2,
} from '../../../components/ui/icons';
import styles from './BirthDataConfirmationModal.module.css';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

export interface BirthDataConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  birthData: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    lat: number;
    lon: number;
    timezone: number;
  };
  isLoading?: boolean;
}

export function BirthDataConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  birthData,
  isLoading = false,
}: BirthDataConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    // Parse the date string as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Unknown';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };



  return (
    <div className={styles.overlay}>
      <ErrorBoundary
        fallback={
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.title}>Error</h2>
              <button onClick={onClose} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.content}>
              <p className={styles.description}>
                There was an error displaying the confirmation details. Please
                try again or refresh the page.
              </p>
            </div>
            <div className={styles.footer}>
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
                className={styles.confirmButton}
              >
                Close
              </Button>
            </div>
          </div>
        }
      >
        <div className={styles.modal} ref={modalRef}>
          {/* Loading Overlay */}
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}>
                <Loader2 size={32} className={styles.spinnerIcon} />
              </div>
              <p className={styles.loadingText}>
                Fetching your astrological chart...
              </p>
            </div>
          )}

          <div className={styles.header}>
            <h2 className={styles.title}>Confirm Birth Info</h2>
            <button
              onClick={onClose}
              className={styles.closeButton}
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.content}>
            <p className={styles.description}>
              Please review your birth information below. This data will be used
              to determine which readings are applicable to you and to generate
              your personalized astrological readings.
            </p>

            <div className={styles.dataSection}>
              <h3 className={styles.sectionTitle}>Your Birth Information</h3>
              <div className={styles.dataRow}>
                <div className={styles.dataItem}>
                  <div className={styles.dataContent}>
                    <label className={styles.label}>Birth Date</label>
                    <span className={styles.value}>
                      {formatDate(birthData.birthDate)}
                    </span>
                  </div>
                </div>

                <div className={styles.dataItem}>
                  <div className={styles.dataContent}>
                    <label className={styles.label}>Birth Time</label>
                    <span className={styles.value}>
                      {formatTime(birthData.birthTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.dataItem}>
                <div className={styles.dataContent}>
                  <label className={styles.label}>Birth Location</label>
                  <span className={styles.value}>{birthData.birthPlace}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              variant="primary"
              size="md"
              onClick={onConfirm}
              disabled={isLoading}
              className={styles.confirmButton}
            >
              {isLoading ? 'Fetching Your Chart...' : 'Confirm & Continue'}
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
