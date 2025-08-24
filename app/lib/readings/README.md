# Reading System Documentation

This directory contains the astrological reading extraction system. The system is designed to be scalable and easy to extend with new readings.

## Architecture Overview

### Core Components

1. **Registry System** (`registry.ts`) - Manages all reading extractors
2. **Configuration** (`config.ts`) - Centralized configuration for all readings
3. **Shared Utilities** (`utils.ts`) - Common astrological calculation functions
4. **Type Definitions** (`types.ts`) - TypeScript interfaces and types
5. **Individual Extractors** - One file per reading type

### How It Works

1. **Chart Data** comes from `AstrologyService.getNatalChart()`
2. **Reading IDs** are selected by the user
3. **Extractors** pull relevant astrological data for each reading
4. **AI Generation** uses the extracted data + prompts to create readings
5. **Display** shows formatted HTML readings to users

## Adding a New Reading

### Step 1: Create the Extractor

1. Copy the template: `templates/extractor-template.ts`
2. Rename it to match your reading (e.g., `love-relationships.ts`)
3. Update the data structure to include the astrological elements your reading needs
4. Implement the extraction logic using shared utilities

**Example for Love & Relationships:**
```typescript
export type LoveRelationshipsData = BaseReadingData & {
  readingId: 'love-relationships';
  data: {
    venus: { sign: string; house: number; dignity: string; aspects: string[] } | null;
    mars: { sign: string; house: number; dignity: string; aspects: string[] } | null;
    seventhHouse: { sign: string; planets: string[] };
    venusMarsAspect: string | null;
    // ... more relationship-specific data
  };
};
```

### Step 2: Register the Extractor

In `index.ts`, add your extractor to the registration:

```typescript
import { LoveRelationshipsExtractor } from './love-relationships';

// In registerExtractors():
readingRegistry.register(new LoveRelationshipsExtractor());
```

### Step 3: Add Configuration

In `config.ts`, add your reading configuration:

```typescript
'love-relationships': {
  id: 'love-relationships',
  name: 'Love & Relationships',
  category: 'Relationships',
  promise: 'Your romantic patterns and soul connections.',
  length: '8–10 min',
  delivery: 'On-screen + PDF',
  icon: '💕',
  extractor: 'LoveRelationshipsExtractor',
  prompt: 'love-relationships',
  editorPrompt: 'editor-love-relationships',
},
```

### Step 4: Create Prompts

Create two prompt files in `app/lib/prompts/`:

1. **Writer Prompt** (`love-relationships.ts`) - Generates the raw reading
2. **Editor Prompt** (`editor-love-relationships.ts`) - Formats the reading as HTML

### Step 5: Test

1. Add your reading to the qualified readings page
2. Test the extraction and generation process
3. Verify the reading displays correctly

## Shared Utilities

The `utils.ts` file provides common functions:

- `findPlanetPlacement()` - Find where a planet is placed
- `findPlanetAspects()` - Find aspects for a planet
- `getChartRuler()` - Get the chart ruler based on ascendant
- `getPlanetDignity()` - Get planet dignity in a sign
- `isAngularHouse()` - Check if a house is angular
- `formatAspects()` - Format aspects for AI consumption

## Reading Types

### Current Readings
- **Core Self & Life Path** - Identity, growth, and direction

### Planned Readings
- **Love & Relationships** - Romantic patterns and soul connections
- **Career Path** - Professional calling and work style
- **Life Purpose** - Soul mission and highest potential
- **Communication Style** - How you express yourself
- **Emotional Patterns** - Emotional landscape and inner world

## Best Practices

1. **Use Shared Utilities** - Don't duplicate astrological calculations
2. **Keep Data Focused** - Only extract data relevant to the reading
3. **Handle Missing Data** - Always check for null/undefined values
4. **Use TypeScript** - Leverage type safety for better code quality
5. **Follow Naming Conventions** - Use consistent naming across files
6. **Test Thoroughly** - Verify extraction works with various chart types

## Troubleshooting

### Common Issues

1. **Reading not appearing** - Check if extractor is registered
2. **Missing data** - Verify planet names match API response
3. **Type errors** - Ensure data structure matches interface
4. **Generation fails** - Check prompt files exist and are valid

### Debug Tips

1. Check console logs for extraction status
2. Verify chart data structure in browser dev tools
3. Test individual extractors in isolation
4. Use TypeScript strict mode for better error catching
