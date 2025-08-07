export interface LocationAutocompleteProps {
  readonly onPlaceSelect: (place: {
    readonly name: string;
    readonly lat: number;
    readonly lng: number;
    readonly timezone?: number;
  }) => void;
  readonly defaultValue?: string;
  readonly error?: string;
  readonly birthDate?: {
    readonly day: number;
    readonly month: number;
    readonly year: number;
    readonly hour: number;
    readonly minute: number;
  };
  readonly className?: string;
}
