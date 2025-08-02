import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import styles from './styles.module.css';
import { DateTimeFormProps } from './types';

export function DateTimeForm({
  date,
  time,
  error,
  onDateChange,
  onTimeChange,
  onNext
}: DateTimeFormProps) {
  const [showErrors, setShowErrors] = useState(false);

  const handleNext = () => {
    setShowErrors(true);
    if (date && time) {
      onNext();
    }
  };

  const timeErrorMessage = showErrors && !time ? 'Birth time is required' : '';
  
  // Current error message or validation message
  const errorMessage = error || timeErrorMessage;
  
  return (
    <div className={styles.form}>
      <div className={styles.fieldGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label htmlFor="birthDate" className={styles.label}>Birth Date</label>
            <input
              id="birthDate"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className={`${styles.input} ${showErrors && !date ? styles.inputError : ''}`}
              aria-invalid={showErrors && !date}
              aria-describedby={showErrors && !date ? "dateError" : undefined}
            />
            {showErrors && !date && (
              <p id="dateError" className={styles.errorMessage}>
                Birth date is required
              </p>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="birthTime" className={styles.label}>Birth Time</label>
            <input
              id="birthTime"
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className={`${styles.input} ${showErrors && !time ? styles.inputError : ''}`}
              aria-invalid={showErrors && !time}
              aria-describedby={showErrors && !time ? "timeError" : undefined}
            />
            {showErrors && !time && (
              <p id="timeError" className={styles.errorMessage}>
                Birth time is required
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 