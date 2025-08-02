# Success Page Custom Hooks

This directory contains all custom React hooks for the success page. Each hook encapsulates specific functionality and state management logic.

## Hook Overview

### Core State Management

#### `useSuccessPage`
**File**: `useSuccessPage.ts`

**Purpose**: Main page state management and initialization logic.

**Returns**:
```typescript
interface UseSuccessPageReturn {
  // Page state
  status: 'loading' | 'generating-chart' | 'generating-readings' | 'ready' | 'error';
  error: string | null;
  
  // Data
  birthFormData: BirthFormData | null;
  selectedReadings: string[];
  chartData: AstrologyChartResponse | null;
  generatedReadings: GeneratedReading[];
  totalAmount: number;
  
  // UI state
  openAccordion: string | null;
  selectedCategory: string | null;
  
  // Actions
  setOpenAccordion: (id: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
}
```

**Key Features**:
- URL parameter parsing and validation
- Birth form data processing
- Chart data management
- Reading selection state
- Error handling and recovery
- Local storage integration

**Usage**:
```tsx
const {
  status,
  birthFormData,
  generatedReadings,
  error,
  openAccordion,
  selectedCategory,
  setOpenAccordion,
  setSelectedCategory
} = useSuccessPage();
```

**Dependencies**:
- `urlUtils.ts`: URL parameter parsing
- `storageUtils.ts`: Cached data retrieval
- `types/index.ts`: Type definitions

#### `useReadingsGeneration`
**File**: `useReadingsGeneration.ts`

**Purpose**: AI reading generation logic with progress tracking and error handling.

**Parameters**:
```typescript
interface UseReadingsGenerationParams {
  birthFormData: BirthFormData | null;
  selectedReadings: string[];
}
```

**Returns**:
```typescript
interface UseReadingsGenerationReturn {
  generateAllReadings: () => Promise<void>;
  isGenerating: boolean;
  generationProgress: number;
  generationError: string | null;
}
```

**Key Features**:
- Batch reading generation
- Progress tracking with percentage
- Error handling and retry logic
- Caching of generated readings
- AI service integration

**Usage**:
```tsx
const {
  generateAllReadings,
  isGenerating,
  generationProgress,
  generationError
} = useReadingsGeneration(birthFormData, selectedReadings);
```

**Dependencies**:
- `aiUtils.ts`: AI service interactions
- `readingUtils.ts`: Reading data processing
- `storageUtils.ts`: Caching functionality

### Feature-Specific Hooks

#### `useReviewSystem`
**File**: `useReviewSystem.ts`

**Purpose**: Review modal state management and submission logic.

**Returns**:
```typescript
interface UseReviewSystemReturn {
  // State
  isReviewModalOpen: boolean;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  
  // Actions
  openReviewModal: () => void;
  closeReviewModal: () => void;
  setRating: (rating: number) => void;
  setComment: (comment: string) => void;
  submitReview: () => Promise<void>;
  resetReviewForm: () => void;
}
```

**Key Features**:
- Star rating management (1-5 stars)
- Comment text handling with character limits
- Form validation
- Local storage persistence
- Submission state management
- Form reset functionality

**Usage**:
```tsx
const {
  isReviewModalOpen,
  rating,
  comment,
  isSubmitting,
  openReviewModal,
  closeReviewModal,
  setRating,
  setComment,
  submitReview,
  resetReviewForm
} = useReviewSystem();
```

**Dependencies**:
- `storageUtils.ts`: Review storage
- `types/index.ts`: Review data types

#### `useShareSystem`
**File**: `useShareSystem.ts`

**Purpose**: Social media sharing functionality with platform-specific URLs.

**Returns**:
```typescript
interface UseShareSystemReturn {
  // State
  isShareModalOpen: boolean;
  shareUrl: string;
  shareText: string;
  
  // Actions
  openShareModal: () => void;
  closeShareModal: () => void;
  shareToPlatform: (platform: string) => void;
  copyLink: () => Promise<void>;
  getShareOptions: () => ShareOption[];
}
```

**Key Features**:
- Multiple social media platform support
- Dynamic URL generation
- Clipboard integration
- Platform-specific sharing logic
- Share text customization

**Usage**:
```tsx
const {
  isShareModalOpen,
  shareUrl,
  shareText,
  openShareModal,
  closeShareModal,
  shareToPlatform,
  copyLink,
  getShareOptions
} = useShareSystem();
```

**Dependencies**:
- `urlUtils.ts`: URL building and clipboard functions
- `types/index.ts`: Share option types

## Hook Patterns and Best Practices

### State Management Patterns

#### Centralized State
```typescript
// Main page state in useSuccessPage
const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
const [error, setError] = useState<string | null>(null);
const [birthFormData, setBirthFormData] = useState<BirthFormData | null>(null);
```

#### Feature-Specific State
```typescript
// Feature state in useReviewSystem
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');
```

### Effect Patterns

#### Initialization Effects
```typescript
useEffect(() => {
  const initializePage = async () => {
    try {
      const params = parseUrlParams();
      const data = parseBirthFormData(params);
      setBirthFormData(data);
      setStatus('ready');
    } catch (error) {
      setError(error.message);
      setStatus('error');
    }
  };
  
  initializePage();
}, []);
```

#### Cleanup Effects
```typescript
useEffect(() => {
  return () => {
    // Cleanup logic
    clearTimeout(timeoutId);
  };
}, []);
```

### Error Handling Patterns

#### Try-Catch with State Updates
```typescript
const generateReadings = async () => {
  try {
    setIsGenerating(true);
    setGenerationError(null);
    
    const results = await generateMultipleReadings(requests);
    setGeneratedReadings(results);
  } catch (error) {
    setGenerationError(error.message);
  } finally {
    setIsGenerating(false);
  }
};
```

#### Error Recovery
```typescript
const handleRetry = () => {
  setError(null);
  setStatus('loading');
  // Retry logic
};
```

## Performance Considerations

### Dependency Optimization
```typescript
// Memoize expensive computations
const processedData = useMemo(() => {
  return processBirthData(birthFormData);
}, [birthFormData]);

// Memoize callbacks
const handleSubmit = useCallback(() => {
  submitReview();
}, [submitReview]);
```

### State Updates
```typescript
// Batch state updates
const updateReading = (id: string, content: string) => {
  setGeneratedReadings(prev => 
    prev.map(reading => 
      reading.id === id 
        ? { ...reading, content, loading: false }
        : reading
    )
  );
};
```

## Testing Strategies

### Unit Testing Hooks
```typescript
// Test hook initialization
test('useSuccessPage initializes with loading state', () => {
  const { result } = renderHook(() => useSuccessPage());
  expect(result.current.status).toBe('loading');
});

// Test hook actions
test('useReviewSystem opens modal', () => {
  const { result } = renderHook(() => useReviewSystem());
  act(() => {
    result.current.openReviewModal();
  });
  expect(result.current.isReviewModalOpen).toBe(true);
});
```

### Integration Testing
```typescript
// Test hook interactions
test('reading generation updates state', async () => {
  const { result } = renderHook(() => useReadingsGeneration(mockData, mockReadings));
  
  await act(async () => {
    await result.current.generateAllReadings();
  });
  
  expect(result.current.isGenerating).toBe(false);
  expect(result.current.generationProgress).toBe(100);
});
```

## Error Handling

### Hook-Level Error Boundaries
```typescript
// Error state management
const [error, setError] = useState<string | null>(null);

const handleError = (error: Error) => {
  console.error('Hook error:', error);
  setError(error.message);
};
```

### Recovery Mechanisms
```typescript
// Automatic retry logic
const retryWithBackoff = async (fn: () => Promise<void>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fn();
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};
```

## Future Enhancements

### Potential Improvements
- Add hook testing utilities
- Implement hook composition patterns
- Add performance monitoring
- Consider using React Query for server state
- Add optimistic updates for better UX

### Maintenance Notes
- Keep hooks focused on single responsibilities
- Maintain consistent error handling patterns
- Document complex logic with comments
- Consider breaking large hooks into smaller ones
- Monitor hook dependencies for unnecessary re-renders

---

*Hook documentation should be updated as new features are added or existing hooks are modified.* 