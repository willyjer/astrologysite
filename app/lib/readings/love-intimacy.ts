import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type LoveIntimacyData = BaseReadingData & {
  readingId: 'love-intimacy';
  data: {
    venus: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    descendant: {
      sign: string | null;
      planets: string[];
    };
    fifthHouse: {
      sign: string | null;
      planets: string[];
    };
    moonVenusAspects: string[];
    sunVenusAspects: string[];
  };
};

export class LoveIntimacyExtractor implements IReadingExtractor {
  readingId = 'love-intimacy' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): LoveIntimacyData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find Venus placement using shared utilities
    const venusPlacement = findPlanetPlacement(chartData, 'Venus');

    // Find Venus aspects using shared utilities
    const venusAspects = venusPlacement ? formatAspects(findPlanetAspects(chartData, 'Venus', aspectCfg)) : [];

    // Get Descendant (7th house cusp) sign
    const descSign = houses.find(h => h.house_id === 7)?.sign ?? null;

    // Find planets in the 7th house
    const seventhHouse = houses.find(h => h.house_id === 7);
    const planetsInSeventhHouse = seventhHouse?.planets?.map(planet => planet.name) ?? [];

    // Get 5th house cusp sign
    const fifthHouseSign = houses.find(h => h.house_id === 5)?.sign ?? null;

    // Find planets in the 5th house
    const fifthHouse = houses.find(h => h.house_id === 5);
    const planetsInFifthHouse = fifthHouse?.planets?.map(planet => planet.name) ?? [];

    // Find Moon-Venus aspects
    const moonVenusAspects = venusPlacement ? formatAspects(findPlanetAspects(chartData, 'Moon', aspectCfg).filter(aspect => 
      aspect.aspected_planet === 'Venus' || aspect.aspecting_planet === 'Venus'
    )) : [];

    // Find Sun-Venus aspects
    const sunVenusAspects = venusPlacement ? formatAspects(findPlanetAspects(chartData, 'Sun', aspectCfg).filter(aspect => 
      aspect.aspected_planet === 'Venus' || aspect.aspecting_planet === 'Venus'
    )) : [];

    const extractedData: LoveIntimacyData = {
      readingId: 'love-intimacy' as const,
      applies: true,
      data: {
        venus: venusPlacement ? {
          sign: venusPlacement.sign,
          house: venusPlacement.house,
          dignity: getPlanetDignity('Venus', venusPlacement.sign),
          angular: isAngularHouse(venusPlacement.house),
          aspects: venusAspects
        } : null,
        descendant: {
          sign: descSign,
          planets: planetsInSeventhHouse
        },
        fifthHouse: {
          sign: fifthHouseSign,
          planets: planetsInFifthHouse
        },
        moonVenusAspects,
        sunVenusAspects
      }
    };

    return extractedData;
  }
}
