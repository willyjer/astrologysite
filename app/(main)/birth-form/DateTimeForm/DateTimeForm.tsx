import React from 'react';
import styles from './styles.module.css';
import { DateTimeFormProps } from './types';

export function DateTimeForm({
  date,
  time,
  onDateChange,
  onTimeChange,
}: Readonly<DateTimeFormProps>) {
  return (
    <div className={styles.form}>
      <div className={styles.fieldGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label htmlFor="birthDate" className={styles.label}>
              Birth Date
            </label>
            <input
              id="birthDate"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className={styles.input}
              placeholder="YYYY-MM-DD"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="birthTime" className={styles.label}>
              Birth Time
            </label>
            <input
              id="birthTime"
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className={styles.input}
              placeholder="HH:MM"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
