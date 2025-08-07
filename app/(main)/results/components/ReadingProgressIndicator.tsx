'use client';

import React from 'react';
import styles from './ReadingProgressIndicator.module.css';

interface ReadingProgressIndicatorProps {
  totalReadings: number;
  completedReadings: number;
  currentReading?: string;
}

export default function ReadingProgressIndicator({
  totalReadings,
  completedReadings,
  currentReading,
}: ReadingProgressIndicatorProps) {
  const progressPercentage = Math.round((completedReadings / totalReadings) * 100);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          🚀 Generating Readings
        </h3>
      </div>
      
      <div className={styles.progressInfo}>
        <span className={styles.progressText}>
          {completedReadings} of {totalReadings} complete
        </span>
        <span className={styles.progressPercentage}>
          {progressPercentage}%
        </span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {currentReading && (
        <div className={styles.currentReading}>
          <span className={styles.currentLabel}>Currently generating:</span>
          <span className={styles.currentTitle}>{currentReading}</span>
        </div>
      )}

    </div>
  );
}