'use client';

import React, { useEffect, useState } from 'react';
import { GeneratedReading } from '../types';
import { PDFService } from '../../../lib/pdf-service';
import styles from './ReadingModal.module.css';

interface ReadingModalProps {
  reading: GeneratedReading | null;
  isVisible: boolean;
  onClose: () => void;
}

export function ReadingModal({ reading, isVisible, onClose }: ReadingModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadPDF = async () => {
    if (!reading || isDownloading) return;
    
    try {
      setIsDownloading(true);
      const pdfBlob = await PDFService.generateReadingPDF(reading);
      const filename = PDFService.generateFilename(reading);
      PDFService.downloadBlob(pdfBlob, filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!reading || !isVisible) return null;



  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{reading.title}</h2>
          <div className={styles.modalActions}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              aria-label="Download PDF"
            >
              {isDownloading ? '⏳' : '📄'}
            </button>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close reading"
            >
              ×
            </button>
          </div>
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
