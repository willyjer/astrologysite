import React, { memo } from 'react';
import { Button } from '../../../components/ui/Button';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import styles from './styles.module.css';
import { IntroHeroProps } from './types';

const IntroHeroContent = memo<IntroHeroProps>(({ onStart, onLearnMore, disabled = false }) => {
  return (
  <>
    {/* Headline */}
    <h1 className={styles.title}>
      A Modern Approach<br />
      <span className={styles.highlight}>to Ancient Wisdom</span>
    </h1>

    {/* Sub-headline */}
    <p className={styles.description}>
    AstroAnon offers psychologically attuned astrology readings, customized to your birth chart. Some open universal doors. Others illuminate your hidden corners.
    </p>

    {/* Button Row Centered */}
    <div className={styles.buttonRowCentered}>
      <Button
        variant="primary"
        size="cta"
        onClick={onStart}
        aria-label="Begin your celestial journey"
        disabled={disabled}
      >
        Tap to Begin
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={onLearnMore}
        aria-label="Learn More"
        disabled={disabled}
      >
        Learn More
      </Button>
    </div>
  </>
  );
});

IntroHeroContent.displayName = 'IntroHeroContent';

const IntroHero = memo<IntroHeroProps>((props) => {
  return (
  <ErrorBoundary 
    fallback={
      <div className={styles.errorFallback}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorMessage}>Unable to load hero section. Please refresh the page.</p>
      </div>
    }
  >
    <IntroHeroContent {...props} />
  </ErrorBoundary>
  );
});

IntroHero.displayName = 'IntroHero';

export default IntroHero; 