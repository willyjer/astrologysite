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
  category?: string; // Keep for future reference
  extractedData?: ExtractedReadingData; // Store the extracted astrological data for debugging
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



// Loading State Types
export type LoadingStateProps = {
  status: ResultsPageState;
  message?: string;
};

// Error State Types
export type ErrorStateProps = {
  error: string;
  onRetry: () => void;
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
