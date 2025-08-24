'use client';

import React from 'react';
import { GeneratedReading } from '../types';
import styles from './ReadingList.module.css';

interface ReadingListProps {
  readings: GeneratedReading[];
  onReadingClick: (reading: GeneratedReading) => void;
}

export function ReadingList({ readings, onReadingClick }: ReadingListProps) {
  const handleReadingClick = (reading: GeneratedReading) => {
    onReadingClick(reading);
  };

  const handleDownloadPDF = (_reading: GeneratedReading, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    // TODO: Implement PDF download functionality
    // PDF download functionality will be implemented in a future update
  };

  return (
    <div className={styles.readingTableContainer}>
      <div className={styles.tableBody}>
        {readings.map((reading) => (
          <div
            key={reading.id}
            className={styles.tableRow}
            onClick={() => handleReadingClick(reading)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${reading.title} reading`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReadingClick(reading);
              }
            }}
          >
            <div className={styles.readingNameCell}>
              {reading.title}
            </div>
            <div className={styles.actionsCell}>
              <button
                className={styles.downloadButton}
                onClick={(e) => handleDownloadPDF(reading, e)}
                aria-label={`Download ${reading.title} as PDF`}
              >
                📄
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
