import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type RootsSecurityData = BaseReadingData & {
  readingId: 'roots-security';
  data: {
    moon: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    saturn: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    ic: {
      sign: string | null;
      planets: string[];
    };
  };
};

export class RootsSecurityExtractor implements IReadingExtractor {
  readingId = 'roots-security' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): RootsSecurityData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find placements using shared utilities
    const moonPlacement = findPlanetPlacement(chartData, 'Moon');
    const saturnPlacement = findPlanetPlacement(chartData, 'Saturn');

    // Find aspects using shared utilities
    const moonAspects = moonPlacement ? formatAspects(findPlanetAspects(chartData, 'Moon', aspectCfg)) : [];
    const saturnAspects = saturnPlacement ? formatAspects(findPlanetAspects(chartData, 'Saturn', aspectCfg)) : [];

    // Get IC (4th house cusp) sign
    const icSign = houses.find(h => h.house_id === 4)?.sign ?? null;

    // Find planets in the 4th house
    const fourthHouse = houses.find(h => h.house_id === 4);
    const planetsInFourthHouse = fourthHouse?.planets?.map(planet => planet.name) ?? [];

    const extractedData: RootsSecurityData = {
      readingId: 'roots-security' as const,
      applies: true,
      data: {
        moon: moonPlacement ? {
          sign: moonPlacement.sign,
          house: moonPlacement.house,
          dignity: getPlanetDignity('Moon', moonPlacement.sign),
          angular: isAngularHouse(moonPlacement.house),
          aspects: moonAspects
        } : null,
        saturn: saturnPlacement ? {
          sign: saturnPlacement.sign,
          house: saturnPlacement.house,
          dignity: getPlanetDignity('Saturn', saturnPlacement.sign),
          angular: isAngularHouse(saturnPlacement.house),
          aspects: saturnAspects
        } : null,
        ic: {
          sign: icSign,
          planets: planetsInFourthHouse
        }
      }
    };

    return extractedData;
  }
}
