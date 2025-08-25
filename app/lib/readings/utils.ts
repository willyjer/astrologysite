import type { AstrologyChartResponse } from '../astrology-service';

// Common utility functions for astrological calculations

export interface Placement {
  sign: string;
  house: number;
}

export interface PlanetData {
  name: string;
  sign: string;
  house: number;
  dignity?: string;
  angular?: boolean;
  retrograde?: boolean;
}

export interface AspectData {
  type: string;
  orb: number;
  aspecting_planet: string;
  aspected_planet: string;
}

// Find a planet's placement in the chart
export function findPlanetPlacement(
  chartData: AstrologyChartResponse,
  planetName: string
): Placement | null {
  const { houses } = chartData;
  
  for (const house of houses) {
    for (const planet of house.planets || []) {
      if (planet.name === planetName) {
        return {
          sign: planet.sign,
          house: house.house_id,
        };
      }
    }
  }
  return null;
}

// Find aspects for a specific planet
export function findPlanetAspects(
  chartData: AstrologyChartResponse,
  planetName: string,
  options: {
    includeMinor?: boolean;
    majorOrb?: number;
    minorOrb?: number;
    majorTypes?: string[];
    minorTypes?: string[];
  } = {}
): AspectData[] {
  const {
    includeMinor = true,
    majorOrb = 5,
    minorOrb = 2.5,
    majorTypes = ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
    minorTypes = ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
  } = options;

  const { aspects } = chartData;
  
  // Find all aspects involving this planet
  const allInvolvingAspects = aspects.filter(aspect => {
    const isInvolved = aspect.aspected_planet === planetName || aspect.aspecting_planet === planetName;
    return isInvolved;
  });
  
  const filteredAspects = allInvolvingAspects.filter(aspect => {
    const isMajorAspect = majorTypes.includes(aspect.type);
    const isMinorAspect = minorTypes.includes(aspect.type);
    
    if (isMajorAspect) {
      const passes = aspect.orb <= majorOrb;
      return passes;
    } else if (isMinorAspect && includeMinor) {
      const passes = aspect.orb <= minorOrb;
      return passes;
    }
    
    return false;
  });
  
  return filteredAspects;
}

// Get chart ruler based on ascendant sign
export function getChartRuler(ascendantSign: string | null): string | null {
  if (!ascendantSign) return null;
  
  const rulershipMap: Record<string, string> = {
    'Aries': 'Mars',
    'Taurus': 'Venus',
    'Gemini': 'Mercury',
    'Cancer': 'Moon',
    'Leo': 'Sun',
    'Virgo': 'Mercury',
    'Libra': 'Venus',
    'Scorpio': 'Mars', // Traditional: Mars, Modern: Pluto
    'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn',
    'Aquarius': 'Saturn', // Traditional: Saturn, Modern: Uranus
    'Pisces': 'Jupiter', // Traditional: Jupiter, Modern: Neptune
  };
  
  return rulershipMap[ascendantSign] || null;
}

// Get dignity of a planet in a sign
export function getPlanetDignity(planet: string, sign: string): string {
  const dignities: Record<string, Record<string, string>> = {
    'Sun': {
      'Leo': 'Domicile',
      'Aries': 'Exaltation',
      'Aquarius': 'Detriment',
      'Libra': 'Fall',
    },
    'Moon': {
      'Cancer': 'Domicile',
      'Taurus': 'Exaltation',
      'Capricorn': 'Detriment',
      'Scorpio': 'Fall',
    },
    'Mercury': {
      'Gemini': 'Domicile',
      'Virgo': 'Domicile', // Mercury rules Virgo, exalts in Virgo
      'Sagittarius': 'Detriment',
      'Pisces': 'Detriment', // Mercury is in detriment in Pisces, falls in Pisces
    },
    'Venus': {
      'Taurus': 'Domicile',
      'Libra': 'Domicile',
      'Pisces': 'Exaltation',
      'Aries': 'Detriment',
      'Scorpio': 'Detriment',
      'Virgo': 'Fall',
    },
    'Mars': {
      'Aries': 'Domicile',
      'Scorpio': 'Domicile',
      'Capricorn': 'Exaltation',
      'Taurus': 'Detriment',
      'Libra': 'Detriment',
      'Cancer': 'Fall',
    },
    'Jupiter': {
      'Sagittarius': 'Domicile',
      'Pisces': 'Domicile',
      'Cancer': 'Exaltation',
      'Gemini': 'Detriment',
      'Virgo': 'Detriment',
      'Capricorn': 'Fall',
    },
    'Saturn': {
      'Capricorn': 'Domicile',
      'Aquarius': 'Domicile',
      'Libra': 'Exaltation',
      'Cancer': 'Detriment',
      'Leo': 'Detriment',
      'Aries': 'Fall',
    },
  };
  
  return dignities[planet]?.[sign] || 'Peregrine';
}

// Check if a house is angular
export function isAngularHouse(houseNumber: number): boolean {
  return [1, 4, 7, 10].includes(houseNumber);
}

// Find planets conjunct Midheaven
export function findPlanetsConjunctMC(
  chartData: AstrologyChartResponse,
  orb: number = 5
): string[] {
  const { aspects } = chartData;
  
  return aspects
    .filter(aspect => 
      (aspect.aspected_planet === 'Midheaven' || aspect.aspecting_planet === 'Midheaven') &&
      aspect.type === 'Conjunction' &&
      aspect.orb <= orb
    )
    .map(aspect => 
      aspect.aspecting_planet === 'Midheaven' ? aspect.aspected_planet : aspect.aspecting_planet
    );
}

// Get house cusps
export function getHouseCusps(chartData: AstrologyChartResponse): Record<number, string> {
  const { houses } = chartData;
  const cusps: Record<number, string> = {};
  
  for (const house of houses) {
    cusps[house.house_id] = house.sign;
  }
  
  return cusps;
}

// Format aspects for AI consumption
export function formatAspects(aspects: AspectData[]): string[] {
  return aspects.map(aspect => 
    `${aspect.aspecting_planet} ${aspect.type} ${aspect.aspected_planet} ${aspect.orb}°`
  );
}
