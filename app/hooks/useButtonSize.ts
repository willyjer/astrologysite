'use client';

import { useState, useEffect } from 'react';
import type { ButtonSize } from '../components/ui/Button/types';

type SizeBreakpoint = {
  breakpoint: number;
  size: ButtonSize;
};

const defaultBreakpoints: SizeBreakpoint[] = [
  { breakpoint: 414, size: 'xl' },
  { breakpoint: 375, size: 'lg' },
];

export function useButtonSize(
  breakpoints: SizeBreakpoint[] = defaultBreakpoints,
  defaultSize: ButtonSize = 'sm'
): ButtonSize {
  const [size, setSize] = useState<ButtonSize>(defaultSize);

  useEffect(() => {
    function updateSize() {
      const width = window.innerWidth;
      
      // Find the first breakpoint that matches
      const matchingBreakpoint = breakpoints.find(bp => width >= bp.breakpoint);
      const newSize = (matchingBreakpoint?.size ?? defaultSize) as ButtonSize;
      
      // Debug log
      console.log('Window width:', width, 'Button size:', newSize);
      
      setSize(newSize);
    }

    // Set initial size
    updateSize();

    // Update size when window resizes
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [breakpoints, defaultSize]);

  return size;
}
