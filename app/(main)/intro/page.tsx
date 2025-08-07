'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '../../components/layout';
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
      contentClassName={styles.introContent}
    >

      <IntroHero onStart={handleStart} />
    </PageLayout>
  );
}
