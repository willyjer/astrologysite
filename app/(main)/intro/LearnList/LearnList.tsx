import React, { memo, useMemo, useState, useRef, useEffect } from 'react';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import styles from './styles.module.css';
import { LearnListProps } from './types';

const LearnListContent = memo<LearnListProps>(() => {
  const [showReadingsTooltip, setShowReadingsTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Analytics tracking for theme interactions
  const trackThemeInteraction = (theme: string) => {
    // Future: Integrate with analytics service
    // analytics.track('theme_interaction', { theme });
  };

  const handleThemeClick = (theme: string) => {
    trackThemeInteraction(theme);
    if (theme === 'Self & Identity') {
      setShowReadingsTooltip(!showReadingsTooltip);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowReadingsTooltip(false);
      }
    };

    if (showReadingsTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReadingsTooltip]);

  const selfIdentityReadings = [
    'Core Self & Personality Blueprint',
    'Your Guiding Energy',
    'Confidence & Drive',
    'Self-Belief & Inner Light'
  ];

  return (
    <div className={styles.learnContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h3 className={styles.headerTitle}>
          <span className={styles.desktopTitle}>A Quiet Revolution in Astrology</span>
          <span className={styles.mobileTitle}>A Revolution in Astrology</span>
        </h3>
        <p className={styles.headerBody}>
        Where personal astrology meets emotional depth. AI-assisted. Soul-centered. Psychologically-attuned.
        </p>
      </div>

      {/* Themes Section */}
      <div className={styles.themesSection}>
        <div className={styles.themesHeader}>
          <span className={styles.themesIntro}>Themes we cover</span>
          <span className={styles.totalCount}>About</span>
        </div>
        
        {/* Mobile Themes Header */}
        <div className={styles.mobileThemesHeader}>
          <span className={styles.mobileThemesIntro}>Themes</span>
        </div>
        
        <ul className={styles.themesList}>
          <li className={styles.themeItem}>
            <div className={styles.themeLeft}>
              <span className={styles.themeIcon} role="img" aria-label="Sun">☀️</span>
              <span className={styles.themeText}>Self & Identity <span className={styles.themeCountInline}>(4 readings)</span></span>
            </div>
            <button 
              className={styles.learnMoreButton} 
              aria-label="Learn more about Self & Identity"
              onClick={() => handleThemeClick('Self & Identity')}
            >
              <span className={styles.learnMoreIcon}>ℹ️</span>
            </button>
          </li>
          <li className={styles.themeItem}>
            <div className={styles.themeLeft}>
              <span className={styles.themeIcon} role="img" aria-label="Heart">💗</span>
              <span className={styles.themeText}>Love & Relationships <span className={styles.themeCountInline}>(Coming Soon)</span></span>
            </div>
          </li>
          <li className={styles.themeItem}>
            <div className={styles.themeLeft}>
              <span className={styles.themeIcon} role="img" aria-label="Brain">🧠</span>
              <span className={styles.themeText}>Mindset & Communication <span className={styles.themeCountInline}>(Coming Soon)</span></span>
            </div>
          </li>
          <li className={styles.themeItem}>
            <div className={styles.themeLeft}>
              <span className={styles.themeIcon} role="img" aria-label="Fire">🔥</span>
              <span className={styles.themeText}>Healing & Inner Transformation <span className={styles.themeCountInline}>(Coming Soon)</span></span>
            </div>
          </li>
          <li className={styles.themeItem}>
            <div className={styles.themeLeft}>
              <span className={styles.themeIcon} role="img" aria-label="Sparkles">✨</span>
              <span className={styles.themeText}>More Themes Coming <span className={styles.themeCountInline}>(Stay Tuned)</span></span>
            </div>
          </li>
        </ul>
        
        {/* Mobile Themes List */}
        <ul className={styles.mobileThemesList}>
          <li className={styles.mobileThemeItem}>
            <span className={styles.mobileThemeText}>Self & Identity</span>
            <button 
              className={styles.mobileLearnMoreButton} 
              aria-label="Learn more about Self & Identity"
              onClick={() => handleThemeClick('Self & Identity')}
            >
              <span className={styles.mobileLearnMoreIcon}>ℹ️</span>
            </button>
          </li>
          <li className={styles.mobileThemeItem}>
            <span className={styles.mobileThemeText}>Love & Relationships</span>
          </li>
          <li className={styles.mobileThemeItem}>
            <span className={styles.mobileThemeText}>Mindset & Communication</span>
          </li>
          <li className={styles.mobileThemeItem}>
            <span className={styles.mobileThemeText}>Healing & Inner Transformation</span>
          </li>
          <li className={styles.mobileThemeItem}>
            <span className={styles.mobileThemeText}>(More Themes Coming)</span>
          </li>
        </ul>
      </div>

      {/* Readings Tooltip */}
      {showReadingsTooltip && (
        <div className={styles.tooltipOverlay}>
          <div className={styles.tooltip} ref={tooltipRef}>
            <div className={styles.tooltipContent}>
              <button 
                className={styles.tooltipCloseButton}
                onClick={() => setShowReadingsTooltip(false)}
                aria-label="Close tooltip"
              >
                ✕
              </button>
              <div className={styles.categoryDescription}>
                This category reflects your core identity, how you show up in the world, and the journey of becoming more fully yourself.
              </div>
              <div className={styles.readingsHeader}>
                Included Readings
              </div>
              <ul className={styles.readingsList}>
                {selfIdentityReadings.map((reading, index) => (
                  <li key={index} className={styles.readingItem}>
                    {reading}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

LearnListContent.displayName = 'LearnListContent';

const LearnList = memo<LearnListProps>(() => {
  return (
    <ErrorBoundary 
      fallback={
        <div className={styles.errorFallback}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorMessage}>Unable to load learn section. Please refresh the page.</p>
        </div>
      }
    >
      <LearnListContent />
    </ErrorBoundary>
  );
});

LearnList.displayName = 'LearnList';

export default LearnList; 