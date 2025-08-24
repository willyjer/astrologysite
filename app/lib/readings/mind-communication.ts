import type { AstrologyChartResponse } from '../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from './types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from './utils';

export type MindCommunicationData = BaseReadingData & {
  readingId: 'mind-communication';
  data: {
    mercury: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    thirdHouse: {
      sign: string | null;
      planets: string[];
    };
    ninthHouse: {
      sign: string | null;
      planets: string[];
    };
  };
};

export class MindCommunicationExtractor implements IReadingExtractor {
  readingId = 'mind-communication' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): MindCommunicationData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    const { houses } = chartData;

    // Find Mercury placement using shared utilities
    const mercuryPlacement = findPlanetPlacement(chartData, 'Mercury');

    // Find Mercury aspects using shared utilities
    const mercuryAspects = mercuryPlacement ? formatAspects(findPlanetAspects(chartData, 'Mercury', aspectCfg)) : [];

    // Get 3rd house cusp sign
    const thirdHouseSign = houses.find(h => h.house_id === 3)?.sign ?? null;

    // Find planets in the 3rd house
    const thirdHouse = houses.find(h => h.house_id === 3);
    const planetsInThirdHouse = thirdHouse?.planets?.map(planet => planet.name) ?? [];

    // Get 9th house cusp sign
    const ninthHouseSign = houses.find(h => h.house_id === 9)?.sign ?? null;

    // Find planets in the 9th house
    const ninthHouse = houses.find(h => h.house_id === 9);
    const planetsInNinthHouse = ninthHouse?.planets?.map(planet => planet.name) ?? [];

    const extractedData: MindCommunicationData = {
      readingId: 'mind-communication' as const,
      applies: true,
      data: {
        mercury: mercuryPlacement ? {
          sign: mercuryPlacement.sign,
          house: mercuryPlacement.house,
          dignity: getPlanetDignity('Mercury', mercuryPlacement.sign),
          angular: isAngularHouse(mercuryPlacement.house),
          aspects: mercuryAspects
        } : null,
        thirdHouse: {
          sign: thirdHouseSign,
          planets: planetsInThirdHouse
        },
        ninthHouse: {
          sign: ninthHouseSign,
          planets: planetsInNinthHouse
        }
      }
    };

    return extractedData;
  }
}
