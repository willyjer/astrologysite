import React from 'react';
import { SharedHeader, SharedFooter } from './index';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  containerClassName = '',
  contentClassName = '',
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div className={`${styles.pageLayout} ${className}`}>
      {/* Skip link for accessibility */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Header */}
      {showHeader && <SharedHeader />}

      {/* Main Container */}
      <main
        className={`${styles.mainContainer} ${containerClassName}`}
        id="main-content"
      >
        {/* Shared Content Container */}
        <div className={`${styles.contentContainer} ${contentClassName}`}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && <SharedFooter />}
    </div>
  );
};

export default PageLayout;
