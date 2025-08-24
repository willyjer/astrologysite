import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type SelfWorthValuesData = BaseReadingData & {
  readingId: 'self-worth-values';
  data: {
    sun: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    secondHouse: {
      sign: string | null;
      planets: string[];
    };
    venus: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    jupiter: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
  };
};

export class SelfWorthValuesExtractor implements IReadingExtractor {
  readingId = 'self-worth-values' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): SelfWorthValuesData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find Sun placement using shared utilities
    const sunPlacement = findPlanetPlacement(chartData, 'Sun');

    // Find Sun aspects using shared utilities
    const sunAspects = sunPlacement ? formatAspects(findPlanetAspects(chartData, 'Sun', aspectCfg)) : [];

    // Get 2nd house cusp sign
    const secondHouseSign = houses.find(h => h.house_id === 2)?.sign ?? null;

    // Find planets in the 2nd house
    const secondHouse = houses.find(h => h.house_id === 2);
    const planetsInSecondHouse = secondHouse?.planets?.map(planet => planet.name) ?? [];

    // Find Venus placement using shared utilities
    const venusPlacement = findPlanetPlacement(chartData, 'Venus');

    // Find Venus aspects using shared utilities
    const venusAspects = venusPlacement ? formatAspects(findPlanetAspects(chartData, 'Venus', aspectCfg)) : [];

    // Find Jupiter placement using shared utilities
    const jupiterPlacement = findPlanetPlacement(chartData, 'Jupiter');

    // Find Jupiter aspects using shared utilities
    const jupiterAspects = jupiterPlacement ? formatAspects(findPlanetAspects(chartData, 'Jupiter', aspectCfg)) : [];

    const extractedData: SelfWorthValuesData = {
      readingId: 'self-worth-values' as const,
      applies: true,
      data: {
        sun: sunPlacement ? {
          sign: sunPlacement.sign,
          house: sunPlacement.house,
          dignity: getPlanetDignity('Sun', sunPlacement.sign),
          angular: isAngularHouse(sunPlacement.house),
          aspects: sunAspects
        } : null,
        secondHouse: {
          sign: secondHouseSign,
          planets: planetsInSecondHouse
        },
        venus: venusPlacement ? {
          sign: venusPlacement.sign,
          house: venusPlacement.house,
          dignity: getPlanetDignity('Venus', venusPlacement.sign),
          angular: isAngularHouse(venusPlacement.house),
          aspects: venusAspects
        } : null,
        jupiter: jupiterPlacement ? {
          sign: jupiterPlacement.sign,
          house: jupiterPlacement.house,
          dignity: getPlanetDignity('Jupiter', jupiterPlacement.sign),
          angular: isAngularHouse(jupiterPlacement.house),
          aspects: jupiterAspects
        } : null
      }
    };

    return extractedData;
  }
}
