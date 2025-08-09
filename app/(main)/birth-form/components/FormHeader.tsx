import styles from '../page.module.css';

export function FormHeader() {
  return (
    <div className={styles.titleGroup}>
      <h1 className={styles.title}>Birth Information</h1>
      <p className={styles.helpText}>
         For the most personalized and accurate readings, please enter your birth time.
      </p>
    </div>
  );
}
