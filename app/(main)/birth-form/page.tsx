'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const BirthFormPageContent = dynamic(
  () => import('./components/BirthFormPageContent')
);

export default function BirthFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BirthFormPageContent />
    </Suspense>
  );
}
