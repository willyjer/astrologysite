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

export type ExtractedReadingData =
  | CoreSelfData
  | ChartRulerData
  | InnerWarriorData
  | SelfBeliefData;

export class ReadingExtractor {
  /**
   * Extract data for a specific reading
   */
  static extract(
    readingId: string,
    chartData: AstrologyChartResponse
  ): ExtractedReadingData | null {
    switch (readingId) {
      case 'core-self':
        return CoreSelfExtractor.extract(chartData);
      case 'chart-ruler':
        return ChartRulerExtractor.extract(chartData);
      case 'inner-warrior':
        return InnerWarriorExtractor.extract(chartData);
      case 'self-belief':
      case 'self-belief-inner-light':
        return SelfBeliefExtractor.extract(chartData, readingId);
      default:
        return null;
    }
  }

  /**
   * Extract data for multiple readings
   */
  static extractMultiple(
    readingIds: string[],
    chartData: AstrologyChartResponse
  ): ExtractedReadingData[] {
    return readingIds
      .map((id) => this.extract(id, chartData))
      .filter((data): data is ExtractedReadingData => data !== null);
  }

  /**
   * Get all available reading IDs
   */
  static getAvailableReadings(): string[] {
    return [
      'core-self',
      'chart-ruler',
      'inner-warrior',
      'self-belief',
      'self-belief-inner-light',
    ];
  }
}
