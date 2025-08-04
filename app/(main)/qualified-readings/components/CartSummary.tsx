'use client';

import React from 'react';
import { CartSummary as CartSummaryType } from '../types';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  cartSummary: CartSummaryType;
  onProceed: () => void;
  isLoading?: boolean;
}

export function CartSummary({
  cartSummary,
  onProceed,
  isLoading = false
}: CartSummaryProps) {
  const { totalReadings, totalPrice, selectedReadings } = cartSummary;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.summary}>
          <div className={styles.summaryText}>
            <span className={styles.readingCount}>
              {totalReadings} reading{totalReadings !== 1 ? 's' : ''} selected
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.totalPrice}>
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          className={`${styles.proceedButton} ${totalReadings === 0 ? styles.disabled : ''}`}
          onClick={onProceed}
          disabled={totalReadings === 0 || isLoading}
          aria-label={`Proceed to payment with ${totalReadings} readings selected`}
        >
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span className={styles.buttonText}>Continue to Payment</span>
              <span className={styles.buttonIcon}>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
} 