import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type DriveAmbitionData = BaseReadingData & {
  readingId: 'drive-ambition';
  data: {
    mars: {
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
    midheaven: {
      sign: string | null;
      planets: string[];
    };
  };
};

export class DriveAmbitionExtractor implements IReadingExtractor {
  readingId = 'drive-ambition' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): DriveAmbitionData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find placements using shared utilities
    const marsPlacement = findPlanetPlacement(chartData, 'Mars');
    const plutoPlacement = findPlanetPlacement(chartData, 'Pluto');

    // Find aspects using shared utilities
    const marsAspects = marsPlacement ? formatAspects(findPlanetAspects(chartData, 'Mars', aspectCfg)) : [];
    const plutoAspects = plutoPlacement ? formatAspects(findPlanetAspects(chartData, 'Pluto', aspectCfg)) : [];

    // Get Midheaven (10th house cusp) sign
    const mcSign = houses.find(h => h.house_id === 10)?.sign ?? null;

    // Find planets in the 10th house
    const tenthHouse = houses.find(h => h.house_id === 10);
    const planetsInTenthHouse = tenthHouse?.planets?.map(planet => planet.name) ?? [];

    const extractedData: DriveAmbitionData = {
      readingId: 'drive-ambition' as const,
      applies: true,
      data: {
        mars: marsPlacement ? {
          sign: marsPlacement.sign,
          house: marsPlacement.house,
          dignity: getPlanetDignity('Mars', marsPlacement.sign),
          angular: isAngularHouse(marsPlacement.house),
          aspects: marsAspects
        } : null,
        pluto: plutoPlacement ? {
          sign: plutoPlacement.sign,
          house: plutoPlacement.house,
          dignity: getPlanetDignity('Pluto', plutoPlacement.sign),
          angular: isAngularHouse(plutoPlacement.house),
          aspects: plutoAspects
        } : null,
        midheaven: {
          sign: mcSign,
          planets: planetsInTenthHouse
        }
      }
    };

    return extractedData;
  }
}
