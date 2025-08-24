'use client';

import React, { useEffect } from 'react';
import { GeneratedReading } from '../types';
import styles from './ReadingModal.module.css';

interface ReadingModalProps {
  reading: GeneratedReading | null;
  isVisible: boolean;
  onClose: () => void;
}

export function ReadingModal({ reading, isVisible, onClose }: ReadingModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  if (!reading || !isVisible) return null;



  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{reading.title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close reading"
          >
            ×
          </button>
        </header>

        {/* Content */}
        <div className={styles.modalContent}>
          {reading.loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading {reading.title}...</p>
            </div>
          ) : reading.error ? (
            <div className={styles.errorState}>
              <p>Error: {reading.error}</p>
            </div>
          ) : (
            <div 
              className={styles.readingContent}
              dangerouslySetInnerHTML={{ __html: reading.content }}
            />
          )}
        </div>


      </div>
    </div>
  );
}
