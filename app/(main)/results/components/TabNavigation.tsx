import { useState, useEffect, useRef } from 'react';
import type { TabNavigationProps } from '../types';
import styles from './TabNavigation.module.css';

export default function TabNavigation({
  categories,
  selectedCategory,
  onCategoryChange,
  generatedReadings,
}: TabNavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategorySelect = (categoryKey: string) => {
    const categoryReadings = generatedReadings.filter(reading => reading.category === categoryKey);
    if (categoryReadings.length > 0) {
      onCategoryChange(categoryKey);
      setIsDropdownOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Get the selected category data
  const selectedCategoryData = categories.find(cat => cat.key === selectedCategory);
  
  // Get reading counts for each category
  const getCategoryReadingCount = (categoryKey: string) => {
    return generatedReadings.filter(reading => reading.category === categoryKey).length;
  };

  return (
    <div className={styles.tabSection}>
      <div className={styles.categorySelector} ref={dropdownRef}>
        <div className={styles.header}>
          <button
            className={styles.dropdownButton}
            onClick={toggleDropdown}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span className={styles.selectedCategory}>
              {selectedCategoryData ? (
                <>
                  <span className={styles.categoryName}>
                    {selectedCategoryData.shortLabel}
                  </span>
                </>
              ) : (
                <span className={styles.placeholder}>Choose a Category</span>
              )}
            </span>
            <span className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`}>
              ⌄
            </span>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {categories.map((category) => {
                const readingCount = getCategoryReadingCount(category.key);
                const hasReadings = readingCount > 0;
                return (
                  <button
                    key={category.key}
                    className={`${styles.dropdownItem} ${selectedCategory === category.key ? styles.selected : ''} ${!hasReadings ? styles.disabled : ''}`}
                    onClick={() => handleCategorySelect(category.key)}
                    disabled={!hasReadings}
                  >
                    <span className={styles.categoryName}>
                      {category.shortLabel} ({readingCount} readings)
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 