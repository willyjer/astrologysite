'use client';

import React from 'react';
import styles from './styles.module.css';
import { IconButtonProps } from './types';

export function IconButton({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${styles.iconButton}
        ${isLoading ? styles.loading : ''}
        ${className || ''}
      `}
      disabled={disabled || isLoading}
      aria-label={label}
      {...props}
    >
      {isLoading ? (
        <svg 
          className={styles.spinner} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      ) : (
        <span className={styles.icon}>{icon}</span>
      )}
    </button>
  );
} 