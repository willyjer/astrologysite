import { useEffect, useRef, useState } from 'react';
import type {
  BirthFormData,
  Reading,
  GeneratedReading,
  AstrologyChartResponse,
  ResultsPageState,
} from '../types';
import { cacheGeneratedReadings } from '../utils/storageUtils';
import { AIWorkerManager, MESSAGE_TYPES } from '../utils/workerUtils';

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
  setGeneratedReadings,
  setStatus,
  setError,
}: UseReadingsGenerationProps) {
  // Use ref to track if generation is in progress
  const isGeneratingRef = useRef(false);
  const hasGeneratedRef = useRef(false);
  const workerRef = useRef<AIWorkerManager | null>(null);
  
  // Worker state
  const [isWorkerInitialized, setIsWorkerInitialized] = useState(false);
  const [workerError, setWorkerError] = useState<string | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    const initWorker = async () => {
      try {
        if (!workerRef.current) {
          workerRef.current = new AIWorkerManager();
          
          // Set up message handlers
          workerRef.current.onMessage(MESSAGE_TYPES.PROGRESS_UPDATE, (data) => {
            console.log('📊 Progress update:', data.progress);
            if (data.readings) {
              setGeneratedReadings(data.readings);
            }
          });

          workerRef.current.onMessage(MESSAGE_TYPES.READING_COMPLETE, (data) => {
            console.log('✅ Reading complete:', data.reading.id, `${data.progress}%`);
            
            // Note: We'll rely on the ALL_READINGS_COMPLETE message to update state
            // Individual updates could cause race conditions with the current API
          });

          workerRef.current.onMessage(MESSAGE_TYPES.ALL_READINGS_COMPLETE, (data) => {
            console.log('🎉 All readings complete!');
            setGeneratedReadings(data.readings);
            
            // Cache the generated readings in sessionStorage
            cacheGeneratedReadings(data.readings);
            
            hasGeneratedRef.current = true;
            setStatus('complete');
            isGeneratingRef.current = false;
          });

          workerRef.current.onMessage(MESSAGE_TYPES.ERROR, (data) => {
            console.error('❌ Worker error:', data.error);
            setError(data.error || 'Failed to generate readings. Please try again.');
            setStatus('error');
            isGeneratingRef.current = false;
          });

          // Initialize the worker
          await workerRef.current.initialize();
          setIsWorkerInitialized(true);
          console.log('🔧 AI Worker initialized successfully');
        }
      } catch (error) {
        console.error('❌ Failed to initialize AI worker:', error);
        setWorkerError(error instanceof Error ? error.message : 'Failed to initialize worker');
        
        // Fallback to main thread processing if worker fails
        setIsWorkerInitialized(false);
      }
    };

    initWorker();

    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [setGeneratedReadings, setStatus, setError]);

  // Generate readings when all required data is available
  useEffect(() => {
    if (
      !birthFormData ||
      !selectedReadings.length ||
      !chartData ||
      status !== 'processing'
    ) {
      return;
    }

    // Prevent multiple generations
    if (isGeneratingRef.current || hasGeneratedRef.current) {
      return;
    }

    const generateAllReadings = async () => {
      try {
        isGeneratingRef.current = true;

        // Use Web Worker if available, otherwise fallback to main thread
        if (isWorkerInitialized && workerRef.current && !workerError) {
          console.log('🚀 Starting reading generation with Web Worker');
          workerRef.current.generateReadings(selectedReadings, chartData);
        } else {
          console.log('⚠️ Fallback to main thread processing');
          
          // Fallback to original main thread processing
          const [
            { ReadingExtractor },
            { initializeGeneratedReadings },
            { generateMultipleReadings },
          ] = await Promise.all([
            import('../../../lib/readings'),
            import('../utils/readingUtils'),
            import('../utils/aiUtils'),
          ]);

          // Extract data for all readings
          const selectedReadingIds = selectedReadings.map(
            (reading) => reading.id
          );

          const extractedReadings = ReadingExtractor.extractMultiple(
            selectedReadingIds,
            chartData
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
          isGeneratingRef.current = false;
        }
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
        isGeneratingRef.current = false;
      }
    };

    generateAllReadings();
  }, [
    birthFormData,
    selectedReadings,
    chartData,
    status,
    isWorkerInitialized,
    workerError,
    setGeneratedReadings,
    setStatus,
    setError,
  ]);

  return {
    // No additional return values needed - all state is managed through props
  };
}
