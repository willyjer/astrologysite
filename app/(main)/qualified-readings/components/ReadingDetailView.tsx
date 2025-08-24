'use client';

import React, { useEffect } from 'react';
import { Reading } from '../types';
import { Button, IconButton } from '../../../components/ui/Button';
import { getReadingConfig } from '../../../lib/readings/config';
import styles from './ReadingDetailView.module.css';

interface ReadingDetailViewProps {
  reading: Reading | null;
  isVisible: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelection: (readingId: string) => void;
}

export function ReadingDetailView({
  reading,
  isVisible,
  onClose,
  isSelected,
  onToggleSelection,
}: ReadingDetailViewProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when detail view is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  if (!reading) return null;

  const handleToggleSelection = () => {
    onToggleSelection(reading.id);
  };

  // Get marketing content from config, fallback to default
  const readingConfig = getReadingConfig(reading.id);
  const marketing = readingConfig?.marketing || {
    oneLiner: reading.promise,
    valueBullets: [],
    bestForTags: [],
    whatWeExplore: [],
    whatYouReceive: `You'll receive a personalized reading delivered instantly on-screen and as a downloadable PDF.`,
    deliveryDetails: 'View instantly on-screen + PDF by email'
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.detailView} ${isVisible ? styles.slideIn : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{reading.name}</h1>
            <IconButton
              icon="×"
              label="Close detail view"
              variant="close"
              size="md"
              onClick={onClose}
              className={styles.closeButton}
            />
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Hero Summary */}
          <section className={styles.heroSummary}>
            <p className={`${styles.oneLiner} text-sans`}>
              {marketing.oneLiner}
            </p>
            
            {marketing.valueBullets.length > 0 && (
              <div className={styles.valueBullets}>
                {marketing.valueBullets.map((bullet, index) => (
                  <div key={index} className={`${styles.bullet} text-sans pseudo-bullet`}>
                    {bullet}
                  </div>
                ))}
              </div>
            )}

            {marketing.bestForTags.length > 0 && (
              <div className={styles.bestFor}>
                <div className={styles.bestForTags}>
                  {marketing.bestForTags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* What We Explore */}
          {marketing.whatWeExplore.length > 0 && (
            <section className={styles.section}>
              <h2 className={`${styles.sectionTitle} text-sans`}>What We Explore:</h2>
              <div className={styles.whatWeExplore}>
                {marketing.whatWeExplore.map((item, index) => (
                  <div key={index} className={`${styles.exploreItem} text-sans pseudo-check`}>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What You'll Receive */}
          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} text-sans`}>What You&apos;ll Receive:</h2>
            <p className={`${styles.whatYouReceive} text-sans`}>
              {marketing.whatYouReceive}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={`${styles.deliveryDetails} text-sans`}>
              {marketing.deliveryDetails}
            </div>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleToggleSelection}
              className={isSelected ? styles.selected : ''}
              leftIcon={isSelected ? '✓' : '+'}
            >
              {isSelected ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
