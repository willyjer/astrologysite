import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type MeaningSpiritualGrowthData = BaseReadingData & {
  readingId: 'meaning-spiritual-growth';
  data: {
    jupiter: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    neptune: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    ninthHouse: {
      sign: string | null;
      planets: string[];
    };
  };
};

export class MeaningSpiritualGrowthExtractor implements IReadingExtractor {
  readingId = 'meaning-spiritual-growth' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): MeaningSpiritualGrowthData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find Jupiter placement using shared utilities
    const jupiterPlacement = findPlanetPlacement(chartData, 'Jupiter');

    // Find Jupiter aspects using shared utilities
    const jupiterAspects = jupiterPlacement ? formatAspects(findPlanetAspects(chartData, 'Jupiter', aspectCfg)) : [];

    // Find Neptune placement using shared utilities
    const neptunePlacement = findPlanetPlacement(chartData, 'Neptune');

    // Find Neptune aspects using shared utilities
    const neptuneAspects = neptunePlacement ? formatAspects(findPlanetAspects(chartData, 'Neptune', aspectCfg)) : [];

    // Get 9th house cusp sign
    const ninthHouseSign = houses.find(h => h.house_id === 9)?.sign ?? null;

    // Find planets in the 9th house
    const ninthHouse = houses.find(h => h.house_id === 9);
    const planetsInNinthHouse = ninthHouse?.planets?.map(planet => planet.name) ?? [];

    const extractedData: MeaningSpiritualGrowthData = {
      readingId: 'meaning-spiritual-growth' as const,
      applies: true,
      data: {
        jupiter: jupiterPlacement ? {
          sign: jupiterPlacement.sign,
          house: jupiterPlacement.house,
          dignity: getPlanetDignity('Jupiter', jupiterPlacement.sign),
          angular: isAngularHouse(jupiterPlacement.house),
          aspects: jupiterAspects
        } : null,
        neptune: neptunePlacement ? {
          sign: neptunePlacement.sign,
          house: neptunePlacement.house,
          dignity: getPlanetDignity('Neptune', neptunePlacement.sign),
          angular: isAngularHouse(neptunePlacement.house),
          aspects: neptuneAspects
        } : null,
        ninthHouse: {
          sign: ninthHouseSign,
          planets: planetsInNinthHouse
        }
      }
    };

    return extractedData;
  }
}
