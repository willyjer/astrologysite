'use client';

import React, { useState } from 'react';
import { Category } from '../types';
import styles from './CategorySelector.module.css';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  // Define which categories are ready for use
  const readyCategories = ['self-identity'];
  
  const isCategoryReady = (categoryId: string) => {
    return readyCategories.includes(categoryId);
  };

  const handleCategorySelect = (categoryId: string) => {
    // Only allow selection of ready categories
    if (isCategoryReady(categoryId)) {
      onCategoryChange(categoryId);
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.dropdownButton}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span className={styles.selectedCategory}>
            {selectedCategoryData ? (
              <span className={styles.categoryName}>
                {selectedCategoryData.name}
              </span>
            ) : (
              <span className={styles.placeholder}>Choose a Category</span>
            )}
          </span>
          <span
            className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`}
          >
            ⌄
          </span>
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdown}>
            {categories.map((category) => {
              const isReady = isCategoryReady(category.id);
              return (
                <button
                  key={category.id}
                  className={`${styles.dropdownItem} ${selectedCategory === category.id ? styles.selected : ''} ${!isReady ? styles.disabled : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={!isReady}
                >
                  <span className={styles.categoryName}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
