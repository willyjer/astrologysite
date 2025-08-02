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

export type InnerWarriorData = {
  readingId: 'inner-warrior';
  applies: boolean;
  data: {
    mars: {
      sign: string | null;
      house: number | null;
      isRetrograde: boolean | null;
    };
    marsAspects: Array<{
      with: string;
      type: string;
      orb: number;
    }>;
    ariesPersonalPlanets: string[];
    firstHousePersonalPlanets: string[];
  };
};

export class InnerWarriorExtractor {
  /**
   * Extract relevant data for the inner-warrior reading
   */
  static extract(
    chartData: AstrologyChartResponse,
    birthData: BirthData
  ): InnerWarriorData {
    const { houses, aspects } = chartData;

    const marsPlacement = this.findMarsPlacement(houses);
    const marsAspects = this.findMarsAspects(aspects);
    const ariesPersonalPlanets = this.findAriesPersonalPlanets(houses);
    const firstHousePersonalPlanets = this.findFirstHousePersonalPlanets(houses);

    return {
      readingId: 'inner-warrior',
      applies: true, // Inner warrior reading always applies
      data: {
        mars: {
          sign: marsPlacement?.sign ?? null,
          house: marsPlacement?.house ?? null,
          isRetrograde: marsPlacement?.isRetrograde ?? null,
        },
        marsAspects,
        ariesPersonalPlanets,
        firstHousePersonalPlanets,
      }
    };
  }

  /**
   * Find Mars placement with full details
   */
  private static findMarsPlacement(houses: AstrologyChartResponse['houses']) {
    for (const house of houses) {
      for (const planet of house.planets) {
        if (planet.name === 'Mars') {
          return {
            sign: planet.sign,
            house: house.house_id,
            fullDegree: planet.full_degree,
            isRetrograde: planet.is_retro === "true",
          };
        }
      }
    }
    return null;
  }

  /**
   * Find personal planets in Aries
   */
  private static findAriesPersonalPlanets(houses: AstrologyChartResponse['houses']): string[] {
    const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
    const planetsInAries: string[] = [];

    for (const house of houses) {
      for (const planet of house.planets) {
        if (
          planet.sign === 'Aries' &&
          personalPlanets.includes(planet.name)
        ) {
          planetsInAries.push(planet.name);
        }
      }
    }
    return planetsInAries;
  }

  /**
   * Find personal planets in the first house
   */
  private static findFirstHousePersonalPlanets(houses: AstrologyChartResponse['houses']): string[] {
    const personalPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'];
    const firstHouse = houses.find(h => h.house_id === 1);
    if (!firstHouse) return [];

    return firstHouse.planets
      .filter(p => personalPlanets.includes(p.name))
      .map(p => p.name);
  }

  /**
   * Check if an aspect is relevant based on type and orb
   */
  private static isRelevantAspect(aspect: AstrologyChartResponse['aspects'][0]): boolean {
    const strong = ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'];
    const minor = ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'];

    if (strong.includes(aspect.type)) return aspect.orb <= 5;
    if (minor.includes(aspect.type)) return aspect.orb <= 2.5;
    return false;
  }

  /**
   * Find aspects to Mars from relevant planets
   */
  private static findMarsAspects(aspects: AstrologyChartResponse['aspects']) {
    const relevantTargets = ['Sun', 'Moon', 'Ascendant', 'Venus'];
    return aspects
      .filter(a =>
        (a.aspecting_planet === 'Mars' && relevantTargets.includes(a.aspected_planet)) ||
        (a.aspected_planet === 'Mars' && relevantTargets.includes(a.aspecting_planet))
      )
      .filter(this.isRelevantAspect)
      .map(a => ({
        with: a.aspecting_planet === 'Mars' ? a.aspected_planet : a.aspecting_planet,
        type: a.type,
        orb: a.orb
      }));
  }
} 