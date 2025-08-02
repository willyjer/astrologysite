# Success Page Utilities

This directory contains all utility functions for the success page. These utilities handle data processing, storage management, AI interactions, and URL operations.

## Utility Overview

### URL and Sharing Utilities

#### `urlUtils.ts`
**Purpose**: URL parameter handling, sharing functionality, and clipboard operations.

**Key Functions**:

##### `parseUrlParams()`
- **Purpose**: Extract and parse URL parameters
- **Returns**: `URLParams` object with birth data and readings
- **Usage**: Called during page initialization
```typescript
const params = parseUrlParams();
// Returns: { birthData: string, readings: string, ... }
```

##### `parseBirthFormData(params: URLParams)`
- **Purpose**: Convert URL parameters to structured birth form data
- **Parameters**: `URLParams` object
- **Returns**: `BirthFormData` object
- **Features**: Validation and error handling
```typescript
const birthData = parseBirthFormData(params);
// Returns: { name, birthDate, birthTime, birthLocation, ... }
```

##### `parseReadingsParam(readingsParam: string)`
- **Purpose**: Parse comma-separated reading IDs
- **Parameters**: String of reading IDs
- **Returns**: Array of reading IDs
- **Features**: Handles empty strings and validation
```typescript
const readings = parseReadingsParam("reading1,reading2,reading3");
// Returns: ["reading1", "reading2", "reading3"]
```

##### `buildShareUrl(birthFormData: BirthFormData, readings: string[])`
- **Purpose**: Generate shareable URLs with birth data and readings
- **Parameters**: Birth form data and reading IDs
- **Returns**: Formatted URL string
- **Features**: URL encoding and parameter formatting
```typescript
const shareUrl = buildShareUrl(birthData, selectedReadings);
// Returns: "https://example.com/success?birthData=...&readings=..."
```

##### `copyToClipboard(text: string)`
- **Purpose**: Copy text to clipboard with fallback support
- **Parameters**: Text to copy
- **Returns**: Promise<boolean> indicating success
- **Features**: Modern clipboard API with fallback
```typescript
const success = await copyToClipboard("Text to copy");
// Returns: true if successful, false otherwise
```

##### `getCurrentUrl()`
- **Purpose**: Get current page URL
- **Returns**: Current URL string
- **Features**: Handles different environments (client/server)
```typescript
const currentUrl = getCurrentUrl();
// Returns: "https://example.com/success"
```

##### `getCurrentPageTitle()`
- **Purpose**: Get current page title for sharing
- **Returns**: Page title string
- **Features**: Default fallback if title not available
```typescript
const title = getCurrentPageTitle();
// Returns: "Your Astrology Readings - AstroAware"
```

### Storage Management Utilities

#### `storageUtils.ts`
**Purpose**: Local storage and session storage management for caching and persistence.

**Key Functions**:

##### `getCachedReadings(birthDataKey: string)`
- **Purpose**: Retrieve cached readings from localStorage
- **Parameters**: Unique key for birth data
- **Returns**: `CachedReadings` object or null
- **Features**: Automatic key generation and validation
```typescript
const cached = getCachedReadings(birthDataKey);
// Returns: { readings: GeneratedReading[], timestamp: number } | null
```

##### `setCachedReadings(birthDataKey: string, readings: GeneratedReading[])`
- **Purpose**: Store readings in localStorage cache
- **Parameters**: Cache key and readings array
- **Returns**: void
- **Features**: Automatic timestamp and validation
```typescript
setCachedReadings(birthDataKey, generatedReadings);
// Stores readings with current timestamp
```

##### `clearCachedReadings()`
- **Purpose**: Clear all cached readings
- **Returns**: void
- **Features**: Removes all reading cache entries
```typescript
clearCachedReadings();
// Removes all cached readings from localStorage
```

##### `getStoredReviews()`
- **Purpose**: Retrieve all stored reviews
- **Returns**: Array of `ReviewData` objects
- **Features**: Handles missing data gracefully
```typescript
const reviews = getStoredReviews();
// Returns: ReviewData[] array
```

##### `addStoredReview(review: ReviewData)`
- **Purpose**: Add new review to storage
- **Parameters**: Review data object
- **Returns**: void
- **Features**: Appends to existing reviews
```typescript
addStoredReview({ rating: 5, comment: "Great readings!", timestamp: Date.now() });
// Adds review to localStorage
```

##### `clearStoredReviews()`
- **Purpose**: Clear all stored reviews
- **Returns**: void
- **Features**: Removes all review data
```typescript
clearStoredReviews();
// Removes all reviews from localStorage
```

##### `getNatalChartData(birthDataKey: string)`
- **Purpose**: Retrieve cached natal chart data
- **Parameters**: Birth data key
- **Returns**: `AstrologyChartResponse` or null
- **Features**: Session storage for chart data
```typescript
const chartData = getNatalChartData(birthDataKey);
// Returns: AstrologyChartResponse | null
```

##### `setNatalChartData(birthDataKey: string, chartData: AstrologyChartResponse)`
- **Purpose**: Store natal chart data in session storage
- **Parameters**: Birth data key and chart data
- **Returns**: void
- **Features**: Session storage for temporary data
```typescript
setNatalChartData(birthDataKey, chartResponse);
// Stores chart data in sessionStorage
```

##### `clearNatalChartData()`
- **Purpose**: Clear all natal chart data
- **Returns**: void
- **Features**: Removes all chart data from session storage
```typescript
clearNatalChartData();
// Removes all chart data from sessionStorage
```

##### `hasValidCachedData(birthDataKey: string)`
- **Purpose**: Check if valid cached data exists
- **Parameters**: Birth data key
- **Returns**: boolean
- **Features**: Validates cache age and data integrity
```typescript
const hasValid = hasValidCachedData(birthDataKey);
// Returns: true if valid cache exists, false otherwise
```

##### `getStorageStats()`
- **Purpose**: Get storage usage statistics
- **Returns**: Object with storage statistics
- **Features**: Shows cache size and review count
```typescript
const stats = getStorageStats();
// Returns: { cacheSize: number, reviewCount: number, totalSize: string }
```

### Reading Data Processing

#### `readingUtils.ts`
**Purpose**: Reading data processing, filtering, and validation utilities.

**Key Functions**:

##### `processBirthData(birthFormData: BirthFormData)`
- **Purpose**: Process and validate birth form data
- **Parameters**: Birth form data object
- **Returns**: Processed birth data
- **Features**: Validation, formatting, and error handling
```typescript
const processed = processBirthData(birthFormData);
// Returns: Processed birth data with validation
```

##### `filterReadingsByCategory(readings: GeneratedReading[], category: string | null)`
- **Purpose**: Filter readings by category
- **Parameters**: Readings array and category filter
- **Returns**: Filtered readings array
- **Features**: Handles null category (show all)
```typescript
const filtered = filterReadingsByCategory(readings, "self-identity");
// Returns: Readings filtered by category
```

##### `getReadingTitles(readings: GeneratedReading[])`
- **Purpose**: Extract reading titles from array
- **Parameters**: Readings array
- **Returns**: Array of reading titles
- **Features**: Handles missing titles gracefully
```typescript
const titles = getReadingTitles(readings);
// Returns: ["Core Self", "Inner Warrior", ...]
```

##### `getReadingCategories(readings: GeneratedReading[])`
- **Purpose**: Extract unique categories from readings
- **Parameters**: Readings array
- **Returns**: Array of unique category names
- **Features**: Deduplication and sorting
```typescript
const categories = getReadingCategories(readings);
// Returns: ["self-identity", "love-style", ...]
```

##### `initializeGeneratedReadings(selectedReadings: string[])`
- **Purpose**: Initialize reading state for generation
- **Parameters**: Array of reading IDs
- **Returns**: Array of initialized reading objects
- **Features**: Sets up loading state and structure
```typescript
const initialized = initializeGeneratedReadings(["reading1", "reading2"]);
// Returns: [{ id: "reading1", loading: true, ... }, ...]
```

##### `updateReadingWithContent(reading: GeneratedReading, content: string)`
- **Purpose**: Update reading with generated content
- **Parameters**: Reading object and content string
- **Returns**: Updated reading object
- **Features**: Preserves other properties, updates content and loading state
```typescript
const updated = updateReadingWithContent(reading, "Generated content...");
// Returns: Reading with content and loading: false
```

##### `areAllReadingsComplete(readings: GeneratedReading[])`
- **Purpose**: Check if all readings are complete
- **Parameters**: Readings array
- **Returns**: boolean
- **Features**: Checks loading and error states
```typescript
const complete = areAllReadingsComplete(readings);
// Returns: true if all readings are complete
```

##### `getReadingStats(readings: GeneratedReading[])`
- **Purpose**: Get reading generation statistics
- **Parameters**: Readings array
- **Returns**: Statistics object
- **Features**: Counts complete, loading, error states
```typescript
const stats = getReadingStats(readings);
// Returns: { total: 5, complete: 3, loading: 1, error: 1 }
```

##### `filterAllowedCategories(categories: Category[], allowedReadings: string[])`
- **Purpose**: Filter categories to only include allowed readings
- **Parameters**: Categories array and allowed reading IDs
- **Returns**: Filtered categories array
- **Features**: Maintains category structure
```typescript
const filtered = filterAllowedCategories(categories, allowedReadings);
// Returns: Categories with only allowed readings
```

##### `getCategoriesWithReadings(categories: Category[], readings: GeneratedReading[])`
- **Purpose**: Get categories that have associated readings
- **Parameters**: Categories and readings arrays
- **Returns**: Categories with reading counts
- **Features**: Adds reading count to each category
```typescript
const withReadings = getCategoriesWithReadings(categories, readings);
// Returns: Categories with reading counts
```

##### `validateReadingData(reading: GeneratedReading)`
- **Purpose**: Validate reading data structure
- **Parameters**: Reading object
- **Returns**: boolean
- **Features**: Checks required properties and data types
```typescript
const valid = validateReadingData(reading);
// Returns: true if reading data is valid
```

##### `sortReadings(readings: GeneratedReading[])`
- **Purpose**: Sort readings by category and title
- **Parameters**: Readings array
- **Returns**: Sorted readings array
- **Features**: Consistent ordering for display
```typescript
const sorted = sortReadings(readings);
// Returns: Readings sorted by category and title
```

##### `getUniqueCategories(readings: GeneratedReading[])`
- **Purpose**: Get unique categories from readings
- **Parameters**: Readings array
- **Returns**: Array of unique category names
- **Features**: Deduplication and alphabetical sorting
```typescript
const unique = getUniqueCategories(readings);
// Returns: ["category1", "category2", ...]
```

### AI Service Integration

#### `aiUtils.ts`
**Purpose**: AI service interactions for reading generation and error handling.

**Key Functions**:

##### `generateReading(request: ReadingGenerationRequest)`
- **Purpose**: Generate single reading via AI service
- **Parameters**: Reading generation request
- **Returns**: Promise<ReadingGenerationResult>
- **Features**: Error handling, retry logic, validation
```typescript
const result = await generateReading({
  birthData: processedData,
  readingType: "core-self",
  prompt: "Generate core self reading..."
});
// Returns: { content: string, error: null } or { content: null, error: string }
```

##### `generateMultipleReadings(requests: ReadingGenerationRequest[])`
- **Purpose**: Generate multiple readings in parallel
- **Parameters**: Array of reading requests
- **Returns**: Promise<ReadingGenerationResult[]>
- **Features**: Parallel processing, progress tracking, error handling
```typescript
const results = await generateMultipleReadings(readingRequests);
// Returns: Array of generation results
```

##### `handleAIError(error: any)`
- **Purpose**: Handle AI service errors consistently
- **Parameters**: Error object
- **Returns**: Formatted error message
- **Features**: Error classification and user-friendly messages
```typescript
const errorMessage = handleAIError(error);
// Returns: User-friendly error message
```

##### `validateAIResponse(response: any)`
- **Purpose**: Validate AI service response
- **Parameters**: Response object
- **Returns**: boolean
- **Features**: Checks response structure and content
```typescript
const valid = validateAIResponse(response);
// Returns: true if response is valid
```

##### `retryAIGeneration(fn: () => Promise<any>, maxRetries: number)`
- **Purpose**: Retry AI generation with exponential backoff
- **Parameters**: Generation function and max retries
- **Returns**: Promise<any>
- **Features**: Exponential backoff, error handling
```typescript
const result = await retryAIGeneration(generateReading, 3);
// Returns: Generation result or throws error
```

##### `checkAIServiceHealth()`
- **Purpose**: Check AI service availability
- **Returns**: Promise<boolean>
- **Features**: Health check endpoint
```typescript
const healthy = await checkAIServiceHealth();
// Returns: true if service is healthy
```

##### `getAIGenerationProgress(completed: number, total: number)`
- **Purpose**: Calculate generation progress percentage
- **Parameters**: Completed and total counts
- **Returns**: Progress percentage (0-100)
- **Features**: Handles edge cases and rounding
```typescript
const progress = getAIGenerationProgress(3, 5);
// Returns: 60 (percentage)
```

## Error Handling Patterns

### Consistent Error Handling
```typescript
// Standard error handling pattern
try {
  const result = await someAsyncFunction();
  return { success: true, data: result };
} catch (error) {
  const message = handleError(error);
  return { success: false, error: message };
}
```

### Validation Patterns
```typescript
// Data validation pattern
const validateData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!data.requiredField) return false;
  return true;
};
```

## Performance Considerations

### Caching Strategies
```typescript
// Cache with expiration
const getCachedData = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  const age = Date.now() - timestamp;
  
  if (age > CACHE_EXPIRY) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data;
};
```

### Batch Operations
```typescript
// Batch processing for efficiency
const processBatch = async (items: any[]) => {
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processItem));
    results.push(...batchResults);
  }
  
  return results;
};
```

## Testing Strategies

### Unit Testing Utilities
```typescript
// Test utility functions
test('parseUrlParams handles valid parameters', () => {
  const url = '?birthData=test&readings=reading1,reading2';
  const params = parseUrlParams(url);
  expect(params.readings).toEqual(['reading1', 'reading2']);
});

test('validateReadingData rejects invalid data', () => {
  const invalidReading = { id: 'test' }; // Missing required fields
  expect(validateReadingData(invalidReading)).toBe(false);
});
```

### Mock Testing
```typescript
// Mock AI service for testing
const mockAIService = {
  generateReading: jest.fn().mockResolvedValue({ content: 'Test reading' }),
  generateMultipleReadings: jest.fn().mockResolvedValue([
    { content: 'Reading 1' },
    { content: 'Reading 2' }
  ])
};
```

## Future Enhancements

### Potential Improvements
- Add comprehensive unit tests for all utilities
- Implement more sophisticated caching strategies
- Add performance monitoring and metrics
- Consider implementing retry queues for failed requests
- Add data compression for storage utilities

### Maintenance Notes
- Keep utilities focused on single responsibilities
- Maintain consistent error handling patterns
- Document complex algorithms and business logic
- Consider breaking large utilities into smaller ones
- Monitor performance impact of utility functions

---

*Utility documentation should be updated as new functions are added or existing ones are modified.* 