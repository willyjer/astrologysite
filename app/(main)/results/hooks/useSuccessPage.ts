import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { 
  BirthFormData, 
  Reading, 
  GeneratedReading, 
  ResultsPageState,
  AstrologyChartResponse 
} from '../types';
import { getSessionData, validateSessionData, getSessionIdFromUrl, validateSessionId } from '../utils/sessionUtils';
import { getCachedGeneratedReadings, hasCachedGeneratedReadings } from '../utils/storageUtils';

export interface UseResultsPageReturn {
  // State
  status: ResultsPageState;
  birthFormData: BirthFormData | null;
  selectedReadings: Reading[];
  chartData: AstrologyChartResponse | null;
  generatedReadings: GeneratedReading[];

  error: string;
  openAccordion: number | null;
  selectedCategory: string;
  
  // Actions
  setOpenAccordion: (index: number | null) => void;
  setSelectedCategory: (category: string) => void;
  setError: (error: string) => void;
  setStatus: (status: ResultsPageState) => void;
  setGeneratedReadings: (readings: GeneratedReading[]) => void;
}

export function useResultsPage(): UseResultsPageReturn {
  // State
  const [status, setStatus] = useState<ResultsPageState>('loading');
  const [birthFormData, setBirthFormData] = useState<BirthFormData | null>(null);
  const [selectedReadings, setSelectedReadings] = useState<Reading[]>([]);
  const [chartData, setChartData] = useState<AstrologyChartResponse | null>(null);
  const [generatedReadings, setGeneratedReadings] = useState<GeneratedReading[]>([]);

  const [error, setError] = useState<string>('');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('self-identity-authenticity');
  
  const searchParams = useSearchParams();

  // Initialize page data from session
  useEffect(() => {
    // Get session ID from URL
    const sessionId = getSessionIdFromUrl();
    if (!sessionId) {
      setStatus('error');
      setError('No session ID found. Please return to the birth form.');
      return;
    }

    // Get session data from storage
    const session = getSessionData();
    if (!session) {
      setStatus('error');
      setError('Session data not found. Please return to the birth form.');
      return;
    }

    // Validate session ID matches
    if (!validateSessionId(sessionId)) {
      setStatus('error');
      setError('Invalid session. Please return to the birth form.');
      return;
    }

    // Validate session data integrity
    const validation = validateSessionData(session);
    if (!validation.isValid) {
      setStatus('error');
      setError(`Session data error: ${validation.errors.join(', ')}. Please return to the birth form.`);
      return;
    }

    // Set data from session
    setBirthFormData(session.birthData);
    setSelectedReadings(session.selectedReadings?.map(id => ({ id, name: id })) || []);
    setChartData(session.chartData);

    // Check if we have cached generated readings
    if (hasCachedGeneratedReadings()) {
      // Found cached generated readings, loading from storage
      const cachedReadings = getCachedGeneratedReadings();
      setGeneratedReadings(cachedReadings);
      setStatus('complete');
    } else {
      // Proceed to processing if we have the required data
      if (session.birthData && session.selectedReadings && session.selectedReadings.length > 0) {
        setStatus('processing');
      } else {
        setStatus('error');
        setError('Missing required data. Please return to the birth form.');
      }
    }
  }, [searchParams]);



  return {
    // State
    status,
    birthFormData,
    selectedReadings,
    chartData,
    generatedReadings,

    error,
    openAccordion,
    selectedCategory,
    
    // Actions
    setOpenAccordion,
    setSelectedCategory,
    setError,
    setStatus,
    setGeneratedReadings,
  };
} 