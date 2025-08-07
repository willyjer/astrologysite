import { LocationAutocomplete } from '../location/LocationAutocomplete';
import styles from '../page.module.css';
import dateTimeStyles from '../DateTimeForm/styles.module.css';

interface LocationSectionProps {
  setLocation: (location: {
    name: string;
    lat: number;
    lon: number;
    timezone: number;
  }) => void;
  showErrors: boolean;
  setError: (error: string) => void;
  birthDate:
    | { day: number; month: number; year: number; hour: number; minute: number }
    | undefined;
}

export function LocationSection({
  setLocation,
  showErrors,
  setError,
  birthDate,
}: LocationSectionProps) {
  return (
    <>
      <div className={styles.locationSpacer}></div>
      <div className={dateTimeStyles.inputWrapper}>
        <label htmlFor="birthLocation" className={dateTimeStyles.label}>
          Birth Location
        </label>
        <LocationAutocomplete
          onPlaceSelect={(place) => {
            setLocation({
              name: place.name,
              lat: place.lat,
              lon: place.lng,
              timezone: place.timezone || 0,
            });
            if (showErrors) setError('');
          }}
          birthDate={birthDate}
        />
      </div>
      <div className={styles.subheadline}>Begin typing your city above</div>
    </>
  );
}
