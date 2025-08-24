'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '../../components/layout';
import layoutStyles from '../../components/layout/PageLayout.module.css';
import IntroHero from './IntroHero';
import styles from './page.module.css';

export default function IntroPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/birth-form');
  };

  return (
    <PageLayout
      containerClassName={styles.introContainer}
    >
      <div className={`${layoutStyles.contentContainer} ${styles.introContent}`}>
        <IntroHero onStart={handleStart} />
      </div>
    </PageLayout>
  );
}
