import type { AstrologyChartResponse } from '../../astrology-service';
import type { BaseReadingData, IReadingExtractor, ReadingExtractorOptions } from '../types';
import { 
  findPlanetPlacement, 
  findPlanetAspects, 
  getPlanetDignity, 
  isAngularHouse,
  formatAspects
} from '../utils';

// Define the data structure for this specific reading
export type TemplateReadingData = BaseReadingData & {
  readingId: 'template-reading';
  data: {
    // Define the specific astrological data needed for this reading
    // Example:
    venus: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    mars: {
      sign: string;
      house: number;
      dignity: string;
      angular: boolean;
      aspects: string[];
    } | null;
    // Add more planets/points as needed
  };
};

export class TemplateReadingExtractor implements IReadingExtractor {
  readingId = 'template-reading' as const;

  extract(
    chartData: AstrologyChartResponse,
    opts?: ReadingExtractorOptions
  ): TemplateReadingData {
    const aspectCfg = {
      includeMinor: opts?.aspects?.includeMinor ?? true,
      majorOrb: opts?.aspects?.majorOrb ?? 5,
      minorOrb: opts?.aspects?.minorOrb ?? 2.5,
      majorTypes: opts?.aspects?.majorTypes ?? ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'],
      minorTypes: opts?.aspects?.minorTypes ?? ['Quincunx', 'Semi Sextile', 'Semi Square', 'Quintile'],
    };

    // Find placements using shared utilities
    const venusPlacement = findPlanetPlacement(chartData, 'Venus');
    const marsPlacement = findPlanetPlacement(chartData, 'Mars');
    // Add more planet placements as needed

    // Find aspects using shared utilities
    const venusAspects = venusPlacement ? formatAspects(findPlanetAspects(chartData, 'Venus', aspectCfg)) : [];
    const marsAspects = marsPlacement ? formatAspects(findPlanetAspects(chartData, 'Mars', aspectCfg)) : [];
    // Add more aspect calculations as needed

    return {
      readingId: 'template-reading',
      applies: true, // Set to false if this reading doesn't apply to this chart
      data: {
        venus: venusPlacement ? {
          sign: venusPlacement.sign,
          house: venusPlacement.house,
          dignity: getPlanetDignity('Venus', venusPlacement.sign),
          angular: isAngularHouse(venusPlacement.house),
          aspects: venusAspects
        } : null,
        mars: marsPlacement ? {
          sign: marsPlacement.sign,
          house: marsPlacement.house,
          dignity: getPlanetDignity('Mars', marsPlacement.sign),
          angular: isAngularHouse(marsPlacement.house),
          aspects: marsAspects
        } : null,
        // Add more data fields as needed
      }
    };
  }
}

/*
INSTRUCTIONS FOR CREATING A NEW EXTRACTOR:

1. Copy this template file and rename it to match your reading (e.g., love-relationships.ts)

2. Update the following:
   - Change 'template-reading' to your reading ID (e.g., 'love-relationships')
   - Update the data structure to include the astrological elements needed for your reading
   - Add the specific planet placements and aspects your reading requires
   - Update the applies logic if needed

3. Register your extractor in app/lib/readings/index.ts:
   ```typescript
   import { YourReadingExtractor } from './your-reading';
   
   // In registerExtractors():
   readingRegistry.register(new YourReadingExtractor());
   ```

4. Add your reading to the config in app/lib/readings/config.ts

5. Create your prompt files in app/lib/prompts/

Example for Love & Relationships reading:
- Focus on Venus, Mars, 7th house, Venus/Mars aspects
- Include relationship houses (5th, 7th, 8th)
- Consider synastry-like elements

Example for Career Path reading:
- Focus on 10th house, Midheaven, Saturn, Sun
- Include 6th house (daily work)
- Consider vocational indicators
*/
