'use client';

import { useState, useEffect } from 'react';
import type { ButtonSize } from '../components/ui/Button/types';

type SizeBreakpoint = {
  breakpoint: number;
  size: ButtonSize;
};

const defaultBreakpoints: SizeBreakpoint[] = [
  { breakpoint: 390, size: 'xl' },
  { breakpoint: 320, size: 'md' },
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
