import React from 'react';
import styles from './styles.module.css';
import { DateTimeFormProps } from './types';
import { Calendar, Clock } from '@/components/ui/icons';

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
              aria-describedby="birthDateHint"
            />
            <span className={styles.inputIcon} aria-hidden="true">
              <Calendar size={18} />
            </span>
            <small id="birthDateHint" className={styles.hint}>Tap to pick</small>
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
              aria-describedby="birthTimeHint"
            />
            <span className={styles.inputIcon} aria-hidden="true">
              <Clock size={18} />
            </span>
            <small id="birthTimeHint" className={styles.hint}>Tap to pick</small>
          </div>
        </div>
      </div>
    </div>
  );
}
