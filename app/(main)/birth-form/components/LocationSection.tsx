import { LocationAutocomplete } from '../location/LocationAutocomplete';
import styles from '../page.module.css';

interface LocationSectionProps {
  location: {
    name: string;
    lat: number;
    lon: number;
    timezone: number;
  };
  setLocation: (location: { name: string; lat: number; lon: number; timezone: number }) => void;
  showErrors: boolean;
  setError: (error: string) => void;
  birthDate: { day: number; month: number; year: number; hour: number; minute: number } | undefined;
}

export function LocationSection({ 
  location, 
  setLocation, 
  showErrors, 
  setError, 
  birthDate 
}: LocationSectionProps) {
  return (
    <>
      <div className={styles.locationSpacer}></div>
      <div className={styles.inputWrapper}>
        <label htmlFor="birthLocation" className={styles.locationLabel}>Birth Location</label>
        <LocationAutocomplete
          onPlaceSelect={(place) => {
            setLocation({
              name: place.name,
              lat: place.lat,
              lon: place.lng,
              timezone: place.timezone || 0
            });
            if (showErrors) setError('');
          }}
          birthDate={birthDate}
          className={styles.locationWrapper}
        />
      </div>
      <div className={styles.subheadline}>Begin typing your city — autocomplete will help ensure an accurate match.</div>
    </>
  );
} 