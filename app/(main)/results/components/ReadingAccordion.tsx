import React, { useState, useRef, useEffect } from 'react';
import styles from './ReadingAccordion.module.css';

// Simple HTML sanitization function
const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return '';
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/<[^>]*>/g, (match) => {
      // Only allow safe HTML tags
      const safeTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'div', 'span'];
      const tagName = match.match(/<(\w+)/)?.[1]?.toLowerCase();
      if (tagName && safeTags.includes(tagName)) {
        return match;
      }
      return '';
    });
};

interface ReadingAccordionProps {
  reading: {
    id: string;
    title: string;
    content: string;
    loading: boolean;
    error?: string;
  };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const ReadingAccordion: React.FC<ReadingAccordionProps> = ({ 
  reading, 
  index, 
  isOpen, 
  onToggle 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Log reading content for debugging
  useEffect(() => {
    // ReadingAccordion reading.id
  }, [reading.content, reading.error, reading.loading, reading.id, isOpen]);

  return (
    <div className={styles.accordion}>
      <button
        className={`${styles.accordionHeader} ${isOpen ? styles.open : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`reading-${reading.id}`}
      >
        <div className={styles.accordionTitle}>
          <div className={styles.titleIcon}>
            <span className={styles.readingIcon}>✨</span>
          </div>
          <h3 className={styles.readingTitle}>{reading.title}</h3>
        </div>
        <div className={styles.accordionIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${styles.icon} ${isOpen ? styles.rotated : ''}`}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      
      <div
        className={`${styles.accordionContent} ${isOpen ? styles.open : ''}`}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className={styles.contentInner}>
          {reading.loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Generating {reading.title}...</p>
            </div>
          ) : reading.error ? (
            <div className={styles.errorState}>
              <p>Error: {reading.error}</p>
            </div>
          ) : (
            <div 
              className={styles.readingContent}
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(reading.content) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingAccordion; 