'use client';

import React, { useState } from 'react';
import { Reading } from '../types';
import styles from './ReadingCard.module.css';

interface ReadingCardProps {
  reading: Reading;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelection: (readingId: string) => void;
  onToggleExpansion: (readingId: string) => void;
}

export function ReadingCard({
  reading,
  isSelected,
  isExpanded,
  onToggleSelection,
  onToggleExpansion
}: ReadingCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleExpansion = () => {
    setIsAnimating(true);
    onToggleExpansion(reading.id);
    
    // Reset animation flag after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleToggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(reading.id);
  };

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      {/* Top Row: Icon, Title, Add Button */}
      <div className={styles.cardTopRow}>
        <div className={styles.titleSection}>
          <div className={styles.titleSection}>
            <h3 className={styles.readingTitle}>{reading.name}</h3>
          </div>
        </div>
        
        <button
          className={`${styles.addButton} ${isSelected ? styles.added : ''}`}
          onClick={handleToggleSelection}
          aria-label={isSelected ? 'Remove reading' : 'Add reading'}
        >
          {isSelected ? (
            <span className={styles.checkIcon}>✓</span>
          ) : (
            <span className={styles.addIcon}>+</span>
          )}
        </button>
      </div>

      {/* Description Section */}
      <div className={styles.descriptionSection}>
        <p className={styles.readingSubtitle}>{reading.subtitle}</p>
        <p className={styles.readingDescription}>{reading.description}</p>
      </div>

      {/* Bottom Row: Price and Learn More */}
      <div className={styles.cardBottomRow}>
        <span className={styles.price}>${reading.price.toFixed(2)}</span>
        <button
          className={`${styles.learnMoreButton} ${isExpanded ? styles.expanded : ''}`}
          onClick={handleToggleExpansion}
          aria-label={isExpanded ? 'Collapse details' : 'Learn more'}
        >
          <span className={styles.learnMoreText}>Learn More</span>
          <span className={styles.learnMoreIcon}>→</span>
        </button>
      </div>

      {/* Expandable Content */}
      <div className={`${styles.expandableContent} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.detailedDescription}>
          {reading.detailedDescription}
        </div>
      </div>
    </div>
  );
} 