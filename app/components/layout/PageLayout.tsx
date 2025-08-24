import React from 'react';
import { SharedHeader, SharedFooter } from './index';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  containerClassName = '',
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
        {children}
      </main>

      {/* Footer */}
      {showFooter && <SharedFooter />}
    </div>
  );
};

export default PageLayout;
