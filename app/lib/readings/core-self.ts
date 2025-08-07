import type { AstrologyChartResponse } from '../astrology-service';

export type CoreSelfData = {
  readingId: 'core-self';
  applies: boolean;
  data: {
    sun?: {
      sign: string;
      house: number;
      summary: string;
    } | null;
    rising?: {
      sign: string;
      summary: string;
    } | null;
    sunAscAspect?: {
      type: string;
      orb: number;
      summary: string;
    } | null;
  };
};

export class CoreSelfExtractor {
  /**
   * Extract relevant data for the core-self reading
   */
  static extract(
    chartData: AstrologyChartResponse
  ): CoreSelfData {
    const { houses, aspects } = chartData;

    const sun = this.findPlanet(houses, 'Sun');
    const asc = this.findAscendant(houses);
    const sunAscAspect = this.findAspect(aspects, 'Sun', 'Ascendant');

    return {
      readingId: 'core-self',
      applies: true, // Core self reading always applies
      data: {
        sun,
        rising: asc,
        sunAscAspect,
      },
    };
  }

  /**
   * Find a specific planet in the houses
   */
  private static findPlanet(
    houses: AstrologyChartResponse['houses'],
    target: string
  ) {
    for (const house of houses) {
      for (const planet of house.planets) {
        if (planet.name === target) {
          return {
            sign: planet.sign,
            house: house.house_id,
            summary: `${target} in ${planet.sign} in the ${this.ordinal(house.house_id)} house`,
          };
        }
      }
    }
    return null;
  }

  /**
   * Find the Ascendant (Rising sign) from house 1
   */
  private static findAscendant(houses: AstrologyChartResponse['houses']) {
    const house1 = houses.find((h) => h.house_id === 1);
    return {
      sign: house1?.sign || 'Unknown',
      summary: `${house1?.sign || 'Unknown'} Rising`,
    };
  }

  /**
   * Find a specific aspect between two planets
   */
  private static findAspect(
    aspects: AstrologyChartResponse['aspects'],
    planetA: string,
    planetB: string
  ) {
    for (const aspect of aspects) {
      const aspectingPlanet = aspect.aspecting_planet;
      const aspectedPlanet = aspect.aspected_planet;
      if (
        (aspectingPlanet === planetA && aspectedPlanet === planetB) ||
        (aspectingPlanet === planetB && aspectedPlanet === planetA)
      ) {
        return {
          type: aspect.type,
          orb: aspect.orb,
          summary: `${aspect.type} aspect between ${planetA} and ${planetB} (orb: ${aspect.orb}°)`,
        };
      }
    }
    return null;
  }

  /**
   * Convert number to ordinal (1st, 2nd, 3rd, etc.)
   */
  private static ordinal(n: number): string {
    const ordinalSuffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = n % 100;
    const suffix1 = ordinalSuffixes[(remainder - 20) % 10];
    const suffix2 = ordinalSuffixes[remainder];
    const suffix3 = ordinalSuffixes[0];
    
    return (
      n +
      (suffix1 || suffix2 || suffix3)
    );
  }
}
