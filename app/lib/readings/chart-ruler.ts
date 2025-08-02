import type { AstrologyChartResponse } from '../astrology-service';
import type { BirthData } from './index';

export type ChartRulerData = {
  readingId: 'chart-ruler';
  applies: boolean;
  data: {
    rulerPlanet: string | null;
    sign: string | null;
    house: number | null;
    isRetrograde: boolean | null;
    isCombust: boolean;
    isCazimi: boolean;
    essentialDignity: string;
    aspects: Array<{
      with: string;
      type: string;
      orb: number;
    }>;
  };
};

export class ChartRulerExtractor {
  /**
   * Extract relevant data for the chart-ruler reading
   */
  static extract(
    chartData: AstrologyChartResponse,
    birthData: BirthData
  ): ChartRulerData {
    const { houses, aspects } = chartData;

    const ascSign = this.findAscendantSign(houses);
    const ruler = this.getRuler(ascSign);
    const placement = this.findPlanetPlacement(houses, ruler);
    const sunDegree = this.findSunDegree(houses);
    const rulerAspects = this.findAspectsToPlanet(aspects, ruler);

    // Only apply combust/cazimi logic for Mercury or Venus
    let isCombust = false;
    let isCazimi = false;
    if (ruler && ['Mercury', 'Venus'].includes(ruler) && placement?.fullDegree !== null && placement?.fullDegree !== undefined && sunDegree != null) {
      const combustion = this.calcCombustCazimi(placement.fullDegree, sunDegree);
      isCombust = combustion.isCombust;
      isCazimi = combustion.isCazimi;
    }

    const dignity = this.getEssentialDignity(ruler, placement?.sign ?? null);

    return {
      readingId: 'chart-ruler',
      applies: true, // Chart ruler reading always applies
      data: {
        rulerPlanet: ruler,
        sign: placement?.sign ?? null,
        house: placement?.house ?? null,
        isRetrograde: placement?.isRetrograde ?? null,
        isCombust,
        isCazimi,
        essentialDignity: dignity,
        aspects: rulerAspects
      }
    };
  }

  /**
   * Find the Ascendant sign from house 1
   */
  private static findAscendantSign(houses: AstrologyChartResponse['houses']): string | null {
    return houses.find(h => h.house_id === 1)?.sign || null;
  }

  /**
   * Get the ruling planet for a sign
   */
  private static getRuler(sign: string | null): string | null {
    if (!sign) return null;
    
    const rulerships: { [key: string]: string } = {
      Aries: 'Mars',
      Taurus: 'Venus',
      Gemini: 'Mercury',
      Cancer: 'Moon',
      Leo: 'Sun',
      Virgo: 'Mercury',
      Libra: 'Venus',
      Scorpio: 'Pluto', // or Mars (traditional)
      Sagittarius: 'Jupiter',
      Capricorn: 'Saturn',
      Aquarius: 'Uranus', // or Saturn (traditional)
      Pisces: 'Neptune', // or Jupiter (traditional)
    };
    return rulerships[sign] || null;
  }

  /**
   * Find a planet's placement with full details
   */
  private static findPlanetPlacement(
    houses: AstrologyChartResponse['houses'], 
    target: string | null
  ) {
    if (!target) return null;
    
    for (const house of houses) {
      for (const planet of house.planets) {
        if (planet.name === target) {
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
   * Find the Sun's degree
   */
  private static findSunDegree(houses: AstrologyChartResponse['houses']): number | null {
    for (const house of houses) {
      for (const planet of house.planets) {
        if (planet.name === 'Sun') {
          return planet.full_degree;
        }
      }
    }
    return null;
  }

  /**
   * Calculate combust/cazimi status
   */
  private static calcCombustCazimi(degA: number, degB: number) {
    const diff = Math.abs(degA - degB) % 360;
    const orb = Math.min(diff, 360 - diff); // handles wraparound at 0°
    return {
      isCombust: orb < 8,
      isCazimi: orb < 0.28
    };
  }

  /**
   * Get essential dignity of a planet in a sign
   */
  private static getEssentialDignity(planet: string | null, sign: string | null): string {
    if (!planet || !sign) return 'None';
    
    const exalted: { [key: string]: string } = {
      Sun: 'Aries',
      Moon: 'Taurus',
      Mercury: 'Virgo',
      Venus: 'Pisces',
      Mars: 'Capricorn',
      Jupiter: 'Cancer',
      Saturn: 'Libra',
    };
    const fall: { [key: string]: string } = {
      Sun: 'Libra',
      Moon: 'Scorpio',
      Mercury: 'Pisces',
      Venus: 'Virgo',
      Mars: 'Cancer',
      Jupiter: 'Capricorn',
      Saturn: 'Aries',
    };
    const detriment: { [key: string]: string | string[] } = {
      Sun: 'Aquarius',
      Moon: 'Capricorn',
      Mercury: ['Sagittarius', 'Pisces'],
      Venus: ['Aries', 'Scorpio'],
      Mars: ['Libra', 'Taurus'],
      Jupiter: 'Gemini',
      Saturn: 'Cancer',
    };

    if (exalted[planet] === sign) return 'Exalted';
    if (fall[planet] === sign) return 'Fall';
    if (detriment[planet] === sign || (Array.isArray(detriment[planet]) && detriment[planet].includes(sign))) return 'Detriment';
    return 'None';
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
   * Find aspects to a specific planet
   */
  private static findAspectsToPlanet(
    aspects: AstrologyChartResponse['aspects'], 
    targetPlanet: string | null
  ) {
    if (!targetPlanet) return [];
    
    return aspects
      .filter(a =>
        (a.aspecting_planet === targetPlanet || a.aspected_planet === targetPlanet) &&
        this.isRelevantAspect(a)
      )
      .map(a => ({
        with: a.aspecting_planet === targetPlanet ? a.aspected_planet : a.aspecting_planet,
        type: a.type,
        orb: a.orb,
      }));
  }
} 