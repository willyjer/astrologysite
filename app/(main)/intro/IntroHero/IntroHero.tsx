import React from 'react';
import { Button } from '../../../components/ui/Button';
import { useButtonSize } from '../../../hooks/useButtonSize';
import styles from './styles.module.css';

interface IntroHeroProps {
  onStart: () => void;
  disabled?: boolean;
}

export default function IntroHero({
  onStart,
  disabled = false,
}: IntroHeroProps) {
  const buttonSize = useButtonSize();
  return (
    <div className={styles.heroSection}>
      {/* Headline */}
      <h1 className={styles.title}>
        A Modern Lens<br />
        <span className={styles.highlight}>on Ancient Wisdom</span>
      </h1>

      {/* Sub-headline */}
      <p className={styles.description}>
        We offer personalized astrology readings with deep psychological insight
        — grounded in your birth chart, and attuned to your inner life.
      </p>

      {/* Button Row Centered */}
      <div className={styles.buttonRowCentered}>
                  <Button
            variant="primary"
            size={buttonSize}
          onClick={onStart}
          aria-label="Begin your celestial journey"
          disabled={disabled}
        >
          Tap to Begin
        </Button>
        <span className={styles.orDivider}>- or -</span>
                  <Button
            variant="secondary"
            size={buttonSize}
          onClick={() => window.location.href = '/about'}
          aria-label="Learn more about our services"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}
