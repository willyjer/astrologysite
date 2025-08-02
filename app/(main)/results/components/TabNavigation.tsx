import { useRef } from 'react';
import type { TabNavigationProps } from '../types';
import styles from './TabNavigation.module.css';

export default function TabNavigation({
  categories,
  selectedCategory,
  onCategoryChange,
  generatedReadings,
}: TabNavigationProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.tabSection}>
      <nav className={styles.tabNavigation} ref={carouselRef}>
        <button 
          className={styles.scrollArrow} 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className={styles.tabCarousel}>
          {categories.map(category => {
            const categoryReadings = generatedReadings.filter(reading => reading.category === category.key);
            const hasReadings = categoryReadings.length > 0;
            return (
              <button
                key={category.key}
                className={`${styles.tabButton} ${selectedCategory === category.key ? styles.tabButtonActive : ''} ${!hasReadings ? styles.tabButtonDisabled : ''}`}
                onClick={() => hasReadings && onCategoryChange(category.key)}
                disabled={!hasReadings}
              >
                {category.shortLabel} {hasReadings && `(${categoryReadings.length})`}
              </button>
            );
          })}
        </div>
        <button 
          className={styles.scrollArrow} 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          ›
        </button>
      </nav>
    </div>
  );
} 