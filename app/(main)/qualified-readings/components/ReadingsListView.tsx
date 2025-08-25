'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Reading, CartSummary } from '../types';
import { CartSummary as CartSummaryComponent } from './CartSummary';
import { ReadingDetailView } from './ReadingDetailView';
import styles from './ReadingsListView.module.css';

interface ReadingsListViewProps {
  readings: Reading[];
  onSelectReading: (reading: Reading) => void;
  cartSummary: CartSummary;
  onProceed: () => void;
  isLoading: boolean;
}

// Trial readings configuration
const TRIAL_READING_IDS = [
  'love-intimacy',
  'meaning-spiritual-growth', 
  'roots-security'
];

export function ReadingsListView({
  readings,
  onSelectReading,
  cartSummary,
  onProceed,
  isLoading,
}: ReadingsListViewProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/intro');
  };

  const handleMenuClick = () => {
    // TODO: Implement menu functionality

  };

  const isTrialReading = (readingId: string) => {
    return TRIAL_READING_IDS.includes(readingId);
  };

  const handleReadingClick = (reading: Reading) => {
    if (isTrialReading(reading.id)) {
      onSelectReading(reading);
    }
    // If not a trial reading, do nothing (disabled)
  };

  // Sort readings: trial readings first, then others
  const sortedReadings = [...readings].sort((a, b) => {
    const aIsTrial = isTrialReading(a.id);
    const bIsTrial = isTrialReading(b.id);
    
    if (aIsTrial && !bIsTrial) return -1;
    if (!aIsTrial && bIsTrial) return 1;
    return 0;
  });

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <button 
          className={styles.homeButton} 
          aria-label="Go to home"
          onClick={handleHomeClick}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9,22 9,12 15,12 15,22"></polyline>
          </svg>
        </button>
        <div 
          className={styles.menuIcon}
          onClick={handleMenuClick}
          role="button"
          tabIndex={0}
          aria-label="Open menu"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMenuClick();
            }
          }}
        >
          ☰
        </div>
      </header>

      {/* Page Title */}
      <div className={styles.pageTitle}>Explore Our Readings</div>
      <div className={styles.pageSubtitle}>Tap any reading to see details and add to cart</div>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Readings List */}
        <div className={styles.readingsList}>
          <div className={styles.readingsContainer}>
            {sortedReadings.map((reading) => {
              const isTrial = isTrialReading(reading.id);
              return (
                <div
                  key={reading.id}
                  className={`${styles.readingItem} ${isTrial ? '' : styles.readingItemDisabled}`}
                  onClick={() => handleReadingClick(reading)}
                  role="button"
                  tabIndex={isTrial ? 0 : -1}
                  aria-label={`${isTrial ? 'View details for' : 'Coming soon:'} ${reading.name}`}
                  onKeyDown={(e) => {
                    if (isTrial && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleReadingClick(reading);
                    }
                  }}
                >
                  <span className={styles.readingName}>{reading.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reading Preview - Right Side */}
        <div className={styles.miniDetailView}>
          <ReadingDetailView
            reading={readings[0]}
            isVisible={true}
            onClose={() => {}} // No-op since this is just a preview
            isSelected={false}
            onToggleSelection={() => {}} // No-op since this is just a preview
          />
        </div>
      </div>

      {/* Cart Summary */}
      <CartSummaryComponent 
        cartSummary={cartSummary}
        onProceed={onProceed}
        isLoading={isLoading}
      />
    </div>
  );
}
