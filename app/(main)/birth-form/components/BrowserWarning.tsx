import styles from '../page.module.css';
import { checkBrowserSupport, getUnsupportedFeaturesMessage } from '../utils/browserSupport';

interface BrowserWarningProps {
  browserSupport: ReturnType<typeof checkBrowserSupport> | null;
}

export function BrowserWarning({ browserSupport }: BrowserWarningProps) {
  if (!browserSupport || browserSupport.isSupported) {
    return null;
  }

  return (
    <div className={styles.browserWarning}>
      <div className={styles.browserWarningIcon}>🌐</div>
      <p className={styles.browserWarningMessage}>
        {getUnsupportedFeaturesMessage(browserSupport.unsupportedFeatures)}
      </p>
    </div>
  );
} 