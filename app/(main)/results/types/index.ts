// Import external types
import type { AstrologyChartResponse } from '../../../lib/astrology-service';
import type { ExtractedReadingData } from '../../../lib/readings';
import type { AICompleteReadingResponse } from '../../../lib/ai-service';

// Success Page Specific Types
export type BirthFormData = {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  email: string;
  lat: number;
  lon: number;
  timezone: number;
};

export type Reading = {
  id: string;
  name: string;
};

export type GeneratedReading = {
  id: string;
  title: string;
  content: string;
  loading: boolean;
  error?: string;
  category?: string;
};

export type ResultsPageState = 'loading' | 'processing' | 'complete' | 'error';

export type ReviewData = {
  rating: number;
  comment: string;
  timestamp: number;
  readingTitle: string;
};

export type ShareData = {
  url: string;
  text: string;
  platform: string;
};

// Category Types
export type Category = {
  key: string;
  label: string;
  shortLabel: string;
  overview: string;
  readings: Array<{
    id: string;
    name: string;
    description: string;
    universal: boolean;
    conditional: boolean;
  }>;
};

// Tab Navigation Types
export type TabNavigationProps = {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  generatedReadings: GeneratedReading[];
};

// Progress Data Types
export type ProgressData = {
  totalReadings: number;
  completedReadings: number;
  currentReading?: string;
  isWorkerEnabled?: boolean;
};

// Loading State Types
export type LoadingStateProps = {
  status: ResultsPageState;
  message?: string;
  showProgress?: boolean;
  progressData?: ProgressData | null;
};

// Error State Types
export type ErrorStateProps = {
  error: string;
  onRetry: () => void;
};

// Reading Accordion Types
export type ReadingAccordionProps = {
  reading: GeneratedReading;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

// URL Parameter Types
export type URLParams = {
  birthDate: string | null;
  birthTime: string | null;
  birthPlace: string | null;
  email: string | null;
  lat: string | null;
  lon: string | null;
  timezone: string | null;
  readings: string | null;
};

// AI Generation Types
export type ReadingGenerationRequest = {
  readingId: string;
  extractedData: ExtractedReadingData;
  writerPrompt: string;
  editorPrompt: string;
};

export type ReadingGenerationResult = {
  success: boolean;
  reading?: GeneratedReading;
  error?: string;
};

// Storage Types
export type StoredReviews = ReviewData[];

// Buy Me A Coffee Types
export type BuyMeACoffeeConfig = {
  url: string;
  imageUrl: string;
  altText: string;
  height: number;
  width: number;
};

// Export all types for easy importing
export type {
  AstrologyChartResponse,
  ExtractedReadingData,
  AICompleteReadingResponse,
};
