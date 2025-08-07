import type { AstrologyChartResponse } from '../astrology-service';

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

export type SelfBeliefData = {
  readingId: 'self-belief' | 'self-belief-inner-light';
  applies: boolean;
  data: {
    sun: {
      sign: string | null;
      house: number | null;
    };
    sunAspects: Array<{
      with: string;
      type: string;
      orb: number;
    }>;
    leoPersonalPlanets: string[];
    fifthHousePersonalPlanets: string[];
  };
};

export class SelfBeliefExtractor {
  /**
   * Extract relevant data for the self-belief reading
   */
  static extract(
    chartData: AstrologyChartResponse,
    readingId: 'self-belief' | 'self-belief-inner-light' = 'self-belief'
  ): SelfBeliefData {
    const { houses, aspects } = chartData;

    const sun = this.findSunPlacement(houses);
    const sunAspects = this.findSunAspects(aspects);
    const leoPersonalPlanets = this.findLeoPersonalPlanets(houses);
    const fifthHousePersonalPlanets =
      this.findFifthHousePersonalPlanets(houses);

    return {
      readingId,
      applies: true, // Self-belief reading always applies
      data: {
        sun,
        sunAspects,
        leoPersonalPlanets,
        fifthHousePersonalPlanets,
      },
    };
  }

  /**
   * Find Sun placement
   */
  private static findSunPlacement(houses: AstrologyChartResponse['houses']) {
    for (const house of houses) {
      for (const planet of house.planets) {
        if (planet.name === 'Sun') {
          return {
            sign: planet.sign,
            house: house.house_id,
          };
        }
      }
    }
    return { sign: null, house: null };
  }

  /**
   * Find aspects to Sun from relevant planets
   */
  private static findSunAspects(aspects: AstrologyChartResponse['aspects']) {
    const relevantPlanets = ['Saturn', 'Jupiter', 'Neptune', 'Pluto', 'Chiron'];
    const strong = ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'];
    const minor = ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'];

    return aspects
      .filter(
        (a) =>
          (a.aspecting_planet === 'Sun' &&
            relevantPlanets.includes(a.aspected_planet)) ||
          (a.aspected_planet === 'Sun' &&
            relevantPlanets.includes(a.aspecting_planet))
      )
      .filter((a) => {
        if (strong.includes(a.type)) return a.orb <= 5;
        if (minor.includes(a.type)) return a.orb <= 2.5;
        return false;
      })
      .map((a) => ({
        with:
          a.aspecting_planet === 'Sun' ? a.aspected_planet : a.aspecting_planet,
        type: a.type,
        orb: a.orb,
      }));
  }

  /**
   * Find personal planets in Leo
   */
  private static findLeoPersonalPlanets(
    houses: AstrologyChartResponse['houses']
  ): string[] {
    const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
    const planetsInLeo: string[] = [];

    for (const house of houses) {
      for (const planet of house.planets) {
        if (planet.sign === 'Leo' && personalPlanets.includes(planet.name)) {
          planetsInLeo.push(planet.name);
        }
      }
    }

    return planetsInLeo;
  }

  /**
   * Find personal planets in the fifth house
   */
  private static findFifthHousePersonalPlanets(
    houses: AstrologyChartResponse['houses']
  ): string[] {
    const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
    const fifthHouse = houses.find((h) => h.house_id === 5);
    if (!fifthHouse) return [];

    return fifthHouse.planets
      .filter((p) => personalPlanets.includes(p.name))
      .map((p) => p.name);
  }
}
