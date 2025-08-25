'use client';

import React from 'react';
import styles from './DonationWidget.module.css';

export function DonationWidget() {
  const handleDonationClick = () => {
    window.open('https://www.buymeacoffee.com/astroanon', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.donationSection}>
      <div className={styles.donationCard}>
        <div className={styles.donationContent}>
          <h2 className={styles.donationTitle}>Thank you for checking our site out</h2>
          <p className={styles.donationDescription}>
            If you&apos;d like to support us developing this site, please consider donating at any of the links below or message me with any feedback.
          </p>
                     <button 
             className={styles.donationButton}
             onClick={handleDonationClick}
             aria-label="Support AstroAnon on Buy Me a Coffee"
           >
             <span className={styles.buttonText}>Donations are Appreciated!</span>
           </button>
           <div className={styles.paymentOptions}>
             <p className={styles.paymentText}>
               <span className={styles.paymentLabel}>CashApp:</span> $wisjer1987
             </p>
             <p className={styles.paymentText}>
               <span className={styles.paymentLabel}>Venmo:</span> @jeremywils87
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
