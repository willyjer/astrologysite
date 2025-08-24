import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type BoundariesProtectionData = BaseReadingData & {
  readingId: 'boundaries-protection';
  data: {
    saturn: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    pluto: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    ascendant: {
      sign: string | null;
      planets: string[];
    };
  };
};

export class BoundariesProtectionExtractor implements IReadingExtractor {
  readingId = 'boundaries-protection' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): BoundariesProtectionData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find placements using shared utilities
    const saturnPlacement = findPlanetPlacement(chartData, 'Saturn');
    const plutoPlacement = findPlanetPlacement(chartData, 'Pluto');

    // Find aspects using shared utilities
    const saturnAspects = saturnPlacement ? formatAspects(findPlanetAspects(chartData, 'Saturn', aspectCfg)) : [];
    const plutoAspects = plutoPlacement ? formatAspects(findPlanetAspects(chartData, 'Pluto', aspectCfg)) : [];

    // Get Ascendant (1st house cusp) sign
    const ascSign = houses.find(h => h.house_id === 1)?.sign ?? null;

    // Find planets in the 1st house
    const firstHouse = houses.find(h => h.house_id === 1);
    const planetsInFirstHouse = firstHouse?.planets?.map(planet => planet.name) ?? [];

    const extractedData: BoundariesProtectionData = {
      readingId: 'boundaries-protection' as const,
      applies: true,
      data: {
        saturn: saturnPlacement ? {
          sign: saturnPlacement.sign,
          house: saturnPlacement.house,
          dignity: getPlanetDignity('Saturn', saturnPlacement.sign),
          angular: isAngularHouse(saturnPlacement.house),
          aspects: saturnAspects
        } : null,
        pluto: plutoPlacement ? {
          sign: plutoPlacement.sign,
          house: plutoPlacement.house,
          dignity: getPlanetDignity('Pluto', plutoPlacement.sign),
          angular: isAngularHouse(plutoPlacement.house),
          aspects: plutoAspects
        } : null,
        ascendant: {
          sign: ascSign,
          planets: planetsInFirstHouse
        }
      }
    };

    return extractedData;
  }
}
