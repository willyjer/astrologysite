'use client';

import React from 'react';
import styles from './styles.module.css';
import { ButtonProps } from './types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        ${styles.button}
        ${variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.tertiary}
        ${
          size === 'sm' ? styles.sm :
          size === 'md' ? styles.md :
          size === 'lg' ? styles.lg :
          styles.xl
        }
        ${fullWidth ? styles.fullWidth : ''}
        ${isLoading ? styles.loading : ''}
        ${className || ''}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className={styles.spinner}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && (
        <span className={styles.leftIcon}>{leftIcon}</span>
      )}
      <span className={styles.content}>{children}</span>
      {!isLoading && rightIcon && (
        <span className={styles.rightIcon}>{rightIcon}</span>
      )}
    </button>
  );
}
