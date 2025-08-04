import { useEffect, useRef } from 'react';
import type { 
  BirthFormData, 
  Reading, 
  GeneratedReading, 
  AstrologyChartResponse,
  ResultsPageState 
} from '../types';
import { cacheGeneratedReadings } from '../utils/storageUtils';

export interface UseReadingsGenerationProps {
  birthFormData: BirthFormData | null;
  selectedReadings: Reading[];
  chartData: AstrologyChartResponse | null;
  status: ResultsPageState;
  generatedReadings: GeneratedReading[];
  setGeneratedReadings: (readings: GeneratedReading[]) => void;
  setStatus: (status: ResultsPageState) => void;
  setError: (error: string) => void;
}

export function useReadingsGeneration({
  birthFormData,
  selectedReadings,
  chartData,
  status,
  generatedReadings,
  setGeneratedReadings,
  setStatus,
  setError,
}: UseReadingsGenerationProps) {
  
  // Use ref to track if generation is in progress
  const isGeneratingRef = useRef(false);
  const hasGeneratedRef = useRef(false);
  
  // Generate readings when all required data is available
  useEffect(() => {
    if (!birthFormData || !selectedReadings.length || !chartData || status !== 'processing') {
      return;
    }

    // Prevent multiple generations
    if (isGeneratingRef.current || hasGeneratedRef.current) {
      return;
    }

    const generateAllReadings = async () => {
      try {
        isGeneratingRef.current = true;
        
        // Dynamically import heavy utilities only when needed
        const [
          { ReadingExtractor },
          { processBirthData, initializeGeneratedReadings },
          { generateMultipleReadings, handleAIError }
        ] = await Promise.all([
          import('../../../lib/readings'),
          import('../utils/readingUtils'),
          import('../utils/aiUtils')
        ]);

        // Process birth data for reading generation
        const birthData = processBirthData(birthFormData);
        
        // Extract data for all readings
        const selectedReadingIds = selectedReadings.map(reading => reading.id);
        
        const extractedReadings = ReadingExtractor.extractMultiple(
          selectedReadingIds,
          chartData,
          birthData
        );

        // Initialize generated readings state
        const initialReadings = initializeGeneratedReadings(selectedReadings);
        setGeneratedReadings(initialReadings);

        // Generate AI readings for all selected readings
        const completedReadings = await generateMultipleReadings(
          initialReadings,
          extractedReadings
        );
        
        setGeneratedReadings(completedReadings);
        
        // Cache the generated readings in sessionStorage
        cacheGeneratedReadings(completedReadings);
        
        hasGeneratedRef.current = true;
        
        setStatus('complete');

      } catch (generationError) {
        console.error('❌ Error in generateAllReadings:', generationError);
        
        let errorMessage = 'Failed to generate readings. Please try again.';
        
        try {
          // Try to get specific error message if available
          const { handleAIError } = await import('../utils/aiUtils');
          errorMessage = handleAIError(generationError);
        } catch {
          // Fallback to generic error if error handler fails to load
          console.error('❌ Failed to load error handler');
        }
        
        setError(errorMessage);
        setStatus('error');
      } finally {
        isGeneratingRef.current = false;
      }
    };

    generateAllReadings();
  }, [birthFormData, selectedReadings, chartData, status, setGeneratedReadings, setStatus, setError]);

  return {
    // No additional return values needed - all state is managed through props
  };
} 