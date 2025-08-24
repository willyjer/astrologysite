export interface Reading {
  id: string;
  name: string;
  promise: string;                    // NEW: 1-line promise
  category: string;                   // UPDATED: Required, not optional
  length: string;                     // NEW: e.g., "10–12 min"
  delivery: string;                   // NEW: e.g., "On-screen + PDF"
  icon?: string;                      // KEEP: Optional
  premium?: boolean;                  // KEEP: Optional
}



export interface CartSummary {
  totalReadings: number;
  selectedReadings: Reading[];
}

export interface QualifiedReadingsPageState {
  selectedReadings: string[];
  isLoading: boolean;
  hasSessionData: boolean;
  detailViewReading: Reading | null;
  isDetailViewVisible: boolean;
}
