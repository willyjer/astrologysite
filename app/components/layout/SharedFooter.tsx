import React, { memo } from 'react';
import Link from 'next/link';
import styles from './SharedFooter.module.css';

const SharedFooter = memo(() => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© 2025 AstroAware</p>
        <nav className={styles.footerNav}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </nav>
      </div>
    </footer>
  );
});

SharedFooter.displayName = 'SharedFooter';

export default SharedFooter; 