export interface Reading {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  price: number;
  category: string;
  icon?: string;
  premium?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SelectedReading {
  reading: Reading;
  isSelected: boolean;
}

export interface CartSummary {
  totalReadings: number;
  totalPrice: number;
  selectedReadings: Reading[];
}

export interface QualifiedReadingsPageState {
  selectedCategory: string;
  selectedReadings: string[];
  expandedReadings: string[];
  isLoading: boolean;
  hasSessionData: boolean;
} 