import React from 'react';
import Link from 'next/link';
import styles from './SharedHeader.module.css';

const SharedHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            AstroAnon
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <span className={styles.navLink}>
            Why We Do It
          </span>
          <span className={styles.navLink}>
            How We Do It
          </span>
        </nav>
      </div>
    </header>
  );
};

export default SharedHeader; 