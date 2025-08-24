import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { readingRegistry } from './registry';

import { RootsSecurityExtractor } from './roots-security';
import { DriveAmbitionExtractor } from './drive-ambition';
import { BoundariesProtectionExtractor } from './boundaries-protection';
import { LoveIntimacyExtractor } from './love-intimacy';
import { MindCommunicationExtractor } from './mind-communication';
import { SelfWorthValuesExtractor } from './self-worth-values';
import { HealingTransformationExtractor } from './healing-transformation';
import { MeaningSpiritualGrowthExtractor } from './meaning-spiritual-growth';

export type BirthData = {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
};

export type ExtractedReadingData = BaseReadingData;

// Register all available extractors
const registerExtractors = () => {

  
  // Register Roots and Emotional Security extractor
  readingRegistry.register(new RootsSecurityExtractor());
  
  // Register Drive & Ambition extractor
  readingRegistry.register(new DriveAmbitionExtractor());
  
  // Register Boundaries & Self-Protection extractor
  readingRegistry.register(new BoundariesProtectionExtractor());
  
  // Register Love & Intimacy Patterns extractor
  readingRegistry.register(new LoveIntimacyExtractor());
  
  // Register Mind & Communication Style extractor
  readingRegistry.register(new MindCommunicationExtractor());
  
  // Register Self-Worth & Personal Values extractor
  readingRegistry.register(new SelfWorthValuesExtractor());
  
  // Register Healing & Transformation extractor
  readingRegistry.register(new HealingTransformationExtractor());
  
  // Register Meaning & Spiritual Growth extractor
  readingRegistry.register(new MeaningSpiritualGrowthExtractor());
  
  // TODO: Register additional extractors as you create them
  // readingRegistry.register(new LoveRelationshipsExtractor());
  // readingRegistry.register(new CareerPathExtractor());
  // readingRegistry.register(new LifePurposeExtractor());
  // readingRegistry.register(new CommunicationStyleExtractor());
  // readingRegistry.register(new EmotionalPatternsExtractor());
};

// Initialize the registry
registerExtractors();

export class ReadingExtractor {
  /**
   * Extract data for a specific reading
   */
  static extract(
    readingId: string,
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): ExtractedReadingData | null {
    const extractor = readingRegistry.get(readingId);
    if (!extractor) {
      return null;
    }
    
    try {
      const result = extractor.extract(chartData, opts);
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract data for multiple readings
   */
  static extractMultiple(
    readingIds: string[],
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): ExtractedReadingData[] {
    const results = readingIds
      .map((id) => this.extract(id, chartData, opts))
      .filter((data): data is ExtractedReadingData => data !== null);
    
    return results;
  }

  /**
   * Get all available reading IDs
   */
  static getAvailableReadings(): string[] {
    return readingRegistry.getAvailableReadings();
  }

  /**
   * Check if a reading is available
   */
  static hasReading(readingId: string): boolean {
    return readingRegistry.hasReading(readingId);
  }

  /**
   * Get all registered extractors
   */
  static getAllExtractors(): IReadingExtractor[] {
    return readingRegistry.getAll();
  }
}

// Export the registry for direct access if needed
export { readingRegistry };
