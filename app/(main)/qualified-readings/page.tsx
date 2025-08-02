'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SharedHeader, SharedFooter } from '../../components/layout';
import styles from './page.module.css';

export default function QualifiedReadingsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('self-identity');
  const [selectedReadings, setSelectedReadings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSessionData, setHasSessionData] = useState(false);

  // Check for session data on mount
  useEffect(() => {
    const checkSessionData = () => {
      // Checking session data
      const sessionData = sessionStorage.getItem('astroSession');
      // Raw session data
      
      if (!sessionData) {
        // Check if we have a session ID in the URL (indicating we should have session data)
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');
        // Session ID from URL
        
        if (sessionId) {
          // We have a session ID but no session data - this might be a timing issue
          // Wait a bit longer and try again
          // Session ID found but no session data, retrying
          setTimeout(checkSessionData, 200);
          return;
        }
        
        // No session data found, redirecting to birth form
        router.push('/birth-form');
        return;
      }

      try {
        const parsedSession = JSON.parse(sessionData);
        // Parsed session data
        
        if (!parsedSession.sessionId || !parsedSession.birthData) {
          // Invalid session data, redirecting to birth form
          router.push('/birth-form');
          return;
        }

        setHasSessionData(true);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error parsing session data:', error);
        router.push('/birth-form');
      }
    };

    // Initial check
    checkSessionData();
  }, [router]);

  const handleContinue = () => {
    if (selectedReadings.length === 0) return;
    
    // Get session data from storage
    const sessionData = sessionStorage.getItem('astroSession');
    if (!sessionData) {
      console.error('❌ Session data not found');
      router.push('/birth-form');
      return;
    }

    const parsedSession = JSON.parse(sessionData);
    
    // Session data
    // Selected Readings
    
    // Update session data with selected readings
    const updatedSession = {
      ...parsedSession,
      selectedReadings,
      updatedAt: Date.now()
    };
    
    // Store updated session data
    sessionStorage.setItem('astroSession', JSON.stringify(updatedSession));
    
    // Navigate to results with session ID only
    const finalUrl = `/results?sessionId=${parsedSession.sessionId}`;
    // Navigating to finalUrl
    
    router.push(finalUrl);
  };

  // Show loading state while checking session data
  if (isLoading) {
    return (
      <>
        <SharedHeader />
        <div className={styles.container}>
          <div className={styles.content}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading...</p>
            </div>
          </div>
        </div>
        <SharedFooter />
      </>
    );
  }

  // Don't render the form if no session data
  if (!hasSessionData) {
    return null; // Will redirect to birth form
  }

  const readings = [
    { id: 'core-self', name: 'Core Self Reading', description: 'Discover your authentic self' },
    { id: 'inner-warrior', name: 'Inner Warrior', description: 'Unlock your inner strength' },
    { id: 'self-belief', name: 'Self Belief', description: 'Build confidence and self-worth' },
  ];

  return (
    <>
      <SharedHeader />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Choose Your Readings
          </h1>
          
          {/* Category Selection */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Category</h3>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              <option value="self-identity">Self Identity</option>
              <option value="mindset">Mindset</option>
              <option value="love">Love & Relationships</option>
            </select>
          </div>
          
          {/* Readings Selection */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Available Readings</h3>
            {readings.map((reading) => (
              <div 
                key={reading.id}
                className={`${styles.readingCard} ${selectedReadings.includes(reading.id) ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedReadings(prev => 
                    prev.includes(reading.id)
                      ? prev.filter(id => id !== reading.id)
                      : [...prev, reading.id]
                  );
                }}
              >
                <div className={styles.readingName}>
                  {reading.name}
                </div>
                <div className={styles.readingDescription}>
                  {reading.description}
                </div>
              </div>
            ))}
          </div>
          
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={selectedReadings.length === 0}
            className={styles.continueButton}
          >
            Generate My Readings ({selectedReadings.length} selected)
          </button>
        </div>
      </div>
      
      <SharedFooter />
    </>
  );
} 