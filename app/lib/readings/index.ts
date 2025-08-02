import type { AstrologyChartResponse } from '../astrology-service';
import { CoreSelfExtractor, type CoreSelfData } from './core-self';
import { ChartRulerExtractor, type ChartRulerData } from './chart-ruler';
import { InnerWarriorExtractor, type InnerWarriorData } from './inner-warrior';
import { SelfBeliefExtractor, type SelfBeliefData } from './self-belief';

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

export type ExtractedReadingData = CoreSelfData | ChartRulerData | InnerWarriorData | SelfBeliefData;

export class ReadingExtractor {
  /**
   * Extract data for a specific reading
   */
  static extract(
    readingId: string,
    chartData: AstrologyChartResponse,
    birthData: BirthData
  ): ExtractedReadingData | null {
    switch (readingId) {
      case 'core-self':
        return CoreSelfExtractor.extract(chartData, birthData);
      case 'chart-ruler':
        return ChartRulerExtractor.extract(chartData, birthData);
      case 'inner-warrior':
        return InnerWarriorExtractor.extract(chartData, birthData);
      case 'self-belief':
      case 'self-belief-inner-light':
        return SelfBeliefExtractor.extract(chartData, birthData, readingId);
      default:
        return null;
    }
  }

  /**
   * Extract data for multiple readings
   */
  static extractMultiple(
    readingIds: string[],
    chartData: AstrologyChartResponse,
    birthData: BirthData
  ): ExtractedReadingData[] {
    return readingIds
      .map(id => this.extract(id, chartData, birthData))
      .filter((data): data is ExtractedReadingData => data !== null);
  }

  /**
   * Get all available reading IDs
   */
  static getAvailableReadings(): string[] {
    return ['core-self', 'chart-ruler', 'inner-warrior', 'self-belief', 'self-belief-inner-light'];
  }
} 