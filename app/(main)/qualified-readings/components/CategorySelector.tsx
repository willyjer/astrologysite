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
  onCategoryChange
}: CategorySelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsDropdownOpen(false);
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
              <>
                <span className={styles.categoryIcon}>{selectedCategoryData.icon}</span>
                <span className={styles.categoryName}>{selectedCategoryData.name}</span>
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
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.dropdownItem} ${selectedCategory === category.id ? styles.selected : ''}`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.description}>
        {selectedCategoryData ? (
          <p>{selectedCategoryData.description}</p>
        ) : (
          <p>Select a category above to explore personalized readings crafted for your unique astrological journey. Each category offers insights into different aspects of your life and personality.</p>
        )}
      </div>
    </div>
  );
} 