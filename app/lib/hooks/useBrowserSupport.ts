'use client';

import { useState, useEffect } from 'react';

export interface BrowserSupport {
  localStorage: boolean;
  sessionStorage: boolean;
  fetch: boolean;
  abortController: boolean;
  dateInput: boolean;
  timeInput: boolean;
  isSupported: boolean;
  unsupportedFeatures: string[];
}

export function useBrowserSupport(): BrowserSupport {
  const [support, setSupport] = useState<BrowserSupport>({
    localStorage: false,
    sessionStorage: false,
    fetch: false,
    abortController: false,
    dateInput: false,
    timeInput: false,
    isSupported: true,
    unsupportedFeatures: []
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkSupport: BrowserSupport = {
      localStorage: false,
      sessionStorage: false,
      fetch: false,
      abortController: false,
      dateInput: false,
      timeInput: false,
      isSupported: true,
      unsupportedFeatures: []
    };

    // Check localStorage
    try {
      const storageTestKey = '__storage_test__';
      window.localStorage.setItem(storageTestKey, storageTestKey);
      window.localStorage.removeItem(storageTestKey);
      checkSupport.localStorage = true;
    } catch (storageError) {
      checkSupport.unsupportedFeatures.push('localStorage');
      checkSupport.isSupported = false;
    }

    // Check sessionStorage
    try {
      const sessionTestKey = '__session_test__';
      window.sessionStorage.setItem(sessionTestKey, sessionTestKey);
      window.sessionStorage.removeItem(sessionTestKey);
      checkSupport.sessionStorage = true;
    } catch (sessionError) {
      checkSupport.unsupportedFeatures.push('sessionStorage');
      checkSupport.isSupported = false;
    }

    // Check fetch
    if (typeof fetch !== 'undefined') {
      checkSupport.fetch = true;
    } else {
      checkSupport.unsupportedFeatures.push('fetch');
      checkSupport.isSupported = false;
    }

    // Check AbortController
    if (typeof AbortController !== 'undefined') {
      checkSupport.abortController = true;
    } else {
      checkSupport.unsupportedFeatures.push('AbortController');
      checkSupport.isSupported = false;
    }

    // Check date input support
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    checkSupport.dateInput = dateInput.type === 'date';

    // Check time input support
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    checkSupport.timeInput = timeInput.type === 'time';

    if (!checkSupport.dateInput) {
      checkSupport.unsupportedFeatures.push('date input');
    }
    if (!checkSupport.timeInput) {
      checkSupport.unsupportedFeatures.push('time input');
    }

    setSupport(checkSupport);
  }, []);

  return support;
} 