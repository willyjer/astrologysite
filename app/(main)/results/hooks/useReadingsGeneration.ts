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
          // useReadingsGeneration: Skipping generation
      return;
    }

    // Prevent multiple generations
    if (isGeneratingRef.current || hasGeneratedRef.current) {
      // useReadingsGeneration: Skipping - already generating or completed
      return;
    }

    // useReadingsGeneration: Starting generation process

    const generateAllReadings = async () => {
      try {
        isGeneratingRef.current = true;
        // Loading dynamic imports
        
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

        // Dynamic imports loaded successfully

        // Process birth data for reading generation
        const birthData = processBirthData(birthFormData);
        // Processed birth data

        // Extract data for all readings
        const selectedReadingIds = selectedReadings.map(reading => reading.id);
        // Selected reading IDs
        
        const extractedReadings = ReadingExtractor.extractMultiple(
          selectedReadingIds,
          chartData,
          birthData
        );
        // Extracted readings data

        // Initialize generated readings state
        const initialReadings = initializeGeneratedReadings(selectedReadings);
        // Initial readings
        setGeneratedReadings(initialReadings);

        // Generate AI readings for all selected readings
        // Starting AI generation for readings
        const completedReadings = await generateMultipleReadings(
          initialReadings,
          extractedReadings
        );
        
        // AI generation completed
        setGeneratedReadings(completedReadings);
        
        // Cache the generated readings in sessionStorage
        cacheGeneratedReadings(completedReadings);
        
        // Log the state after a brief delay to see if it changes
        setTimeout(() => {
          // State after setting readings
        }, 100);
        
        hasGeneratedRef.current = true;
        
        setStatus('complete');

      } catch (generationError) {
        console.error('❌ Error in generateAllReadings:', generationError);
        
        // Error generating readings
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