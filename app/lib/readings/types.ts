import type { AstrologyChartResponse } from '../astrology-service';

// Base interface for all reading data
export interface BaseReadingData {
  readingId: string;
  applies: boolean;
  data: Record<string, any>;
}

// Base interface for all extractors
export interface IReadingExtractor {
  readingId: string;
  extract(chartData: AstrologyChartResponse, opts?: ReadingExtractorOptions): BaseReadingData;
}

// Options for extractors
export interface ReadingExtractorOptions {
  rulership?: 'modern' | 'traditional';
  aspects?: {
    includeMinor?: boolean;
    majorOrb?: number;
    minorOrb?: number;
    majorTypes?: string[];
    minorTypes?: string[];
  };
  mcConjOrb?: number;
}

// Configuration for each reading
export interface ReadingConfig {
  id: string;
  name: string;
  category: string;
  promise: string;
  length: string;
  delivery: string;
  icon: string;
  extractor: string;
  prompt: string;
  editorPrompt: string;
  marketing?: {
    oneLiner: string;
    valueBullets: string[];
    bestForTags: string[];
    whatWeExplore: string[];
    whatYouReceive: string;
    deliveryDetails: string;
  };
}

// Registry for managing all extractors
export interface ReadingRegistry {
  register(extractor: IReadingExtractor): void;
  get(readingId: string): IReadingExtractor | undefined;
  getAll(): IReadingExtractor[];
  getAvailableReadings(): string[];
}

// Union type for all possible reading data
export type ExtractedReadingData = BaseReadingData;
