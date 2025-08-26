'use client';

import React, { useState } from 'react';
import { GeneratedReading } from '../types';
import { PDFService } from '../../../lib/pdf-service';
import styles from './ReadingList.module.css';

interface ReadingListProps {
  readings: GeneratedReading[];
  onReadingClick: (reading: GeneratedReading) => void;
}

export function ReadingList({ readings, onReadingClick }: ReadingListProps) {
  const [downloadingPDFs, setDownloadingPDFs] = useState<Set<string>>(new Set());

  const handleReadingClick = (reading: GeneratedReading) => {
    onReadingClick(reading);
  };

  const handleDownloadPDF = async (reading: GeneratedReading, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    
    // Don't allow multiple downloads of the same reading
    if (downloadingPDFs.has(reading.id)) {
      return;
    }
    
    try {
      // Add to downloading set
      setDownloadingPDFs(prev => new Set(prev).add(reading.id));
      
      // Generate PDF
      const pdfBlob = await PDFService.generateReadingPDF(reading);
      
      // Generate filename and download
      const filename = PDFService.generateFilename(reading);
      PDFService.downloadBlob(pdfBlob, filename);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Remove from downloading set
      setDownloadingPDFs(prev => {
        const newSet = new Set(prev);
        newSet.delete(reading.id);
        return newSet;
      });
    }
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
                disabled={downloadingPDFs.has(reading.id)}
                aria-label={`Download ${reading.title} as PDF`}
              >
                {downloadingPDFs.has(reading.id) ? '⏳' : '📄'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
