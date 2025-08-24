import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type HealingTransformationData = BaseReadingData & {
  readingId: 'healing-transformation';
  data: {
    chiron: {
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
    eighthHouse: {
      sign: string | null;
      planets: string[];
    };
  };
};

export class HealingTransformationExtractor implements IReadingExtractor {
  readingId = 'healing-transformation' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): HealingTransformationData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find Chiron placement using shared utilities
    const chironPlacement = findPlanetPlacement(chartData, 'Chiron');

    // Find Chiron aspects using shared utilities
    const chironAspects = chironPlacement ? formatAspects(findPlanetAspects(chartData, 'Chiron', aspectCfg)) : [];

    // Find Pluto placement using shared utilities
    const plutoPlacement = findPlanetPlacement(chartData, 'Pluto');

    // Find Pluto aspects using shared utilities
    const plutoAspects = plutoPlacement ? formatAspects(findPlanetAspects(chartData, 'Pluto', aspectCfg)) : [];

    // Get 8th house cusp sign
    const eighthHouseSign = houses.find(h => h.house_id === 8)?.sign ?? null;

    // Find planets in the 8th house
    const eighthHouse = houses.find(h => h.house_id === 8);
    const planetsInEighthHouse = eighthHouse?.planets?.map(planet => planet.name) ?? [];

    const extractedData: HealingTransformationData = {
      readingId: 'healing-transformation' as const,
      applies: true,
      data: {
        chiron: chironPlacement ? {
          sign: chironPlacement.sign,
          house: chironPlacement.house,
          dignity: getPlanetDignity('Chiron', chironPlacement.sign),
          angular: isAngularHouse(chironPlacement.house),
          aspects: chironAspects
        } : null,
        pluto: plutoPlacement ? {
          sign: plutoPlacement.sign,
          house: plutoPlacement.house,
          dignity: getPlanetDignity('Pluto', plutoPlacement.sign),
          angular: isAngularHouse(plutoPlacement.house),
          aspects: plutoAspects
        } : null,
        eighthHouse: {
          sign: eighthHouseSign,
          planets: planetsInEighthHouse
        }
      }
    };

    return extractedData;
  }
}
