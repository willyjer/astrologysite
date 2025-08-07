// AI Processing Web Worker
// This worker handles heavy AI processing off the main thread to improve TBT

// Worker state
let isProcessing = false;

// Types for communication
const MESSAGE_TYPES = {
  GENERATE_READINGS: 'GENERATE_READINGS',
  READING_COMPLETE: 'READING_COMPLETE',
  ALL_READINGS_COMPLETE: 'ALL_READINGS_COMPLETE',
  ERROR: 'ERROR',
  PROGRESS_UPDATE: 'PROGRESS_UPDATE'
};

// Import necessary functions (for worker context)
// Note: We'll need to re-implement some functions that rely on imports

/**
 * Reading Extractor - Simplified version for worker
 */
class WorkerReadingExtractor {
  static extract(readingId, chartData) {
    switch (readingId) {
      case 'core-self':
        return this.extractCoreSelf(chartData);
      case 'chart-ruler':
        return this.extractChartRuler(chartData);
      case 'inner-warrior':
        return this.extractInnerWarrior(chartData);
      case 'self-belief':
      case 'self-belief-inner-light':
        return this.extractSelfBelief(chartData, readingId);
      default:
        return null;
    }
  }

  static extractMultiple(readingIds, chartData) {
    return readingIds.map(id => ({
      readingId: id,
      ...this.extract(id, chartData)
    })).filter(Boolean);
  }

  // Simplified extraction methods (implement the core logic)
  static extractCoreSelf(chartData) {
    if (!chartData?.planets?.Sun || !chartData?.houses) {
      return null;
    }
    
    return {
      readingId: 'core-self',
      sun: chartData.planets.Sun,
      ascendant: chartData.houses[1],
      extractedData: {
        sunSign: chartData.planets.Sun.sign,
        sunHouse: chartData.planets.Sun.house,
        ascendantSign: chartData.houses[1].sign
      }
    };
  }

  static extractChartRuler(chartData) {
    if (!chartData?.planets || !chartData?.houses) {
      return null;
    }
    
    // Find the chart ruler based on ascendant
    const ascendantSign = chartData.houses[1]?.sign;
    let ruler = null;
    
    // Basic ruler mapping
    const rulerMap = {
      'Aries': 'Mars',
      'Taurus': 'Venus',
      'Gemini': 'Mercury',
      'Cancer': 'Moon',
      'Leo': 'Sun',
      'Virgo': 'Mercury',
      'Libra': 'Venus',
      'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn',
      'Aquarius': 'Saturn',
      'Pisces': 'Jupiter'
    };
    
    const rulerPlanet = rulerMap[ascendantSign];
    if (rulerPlanet && chartData.planets[rulerPlanet]) {
      ruler = chartData.planets[rulerPlanet];
    }
    
    return {
      readingId: 'chart-ruler',
      ruler,
      ascendantSign,
      extractedData: {
        rulerPlanet,
        rulerSign: ruler?.sign,
        rulerHouse: ruler?.house
      }
    };
  }

  static extractInnerWarrior(chartData) {
    if (!chartData?.planets?.Mars) {
      return null;
    }
    
    return {
      readingId: 'inner-warrior',
      mars: chartData.planets.Mars,
      extractedData: {
        marsSign: chartData.planets.Mars.sign,
        marsHouse: chartData.planets.Mars.house,
        marsAspects: chartData.planets.Mars.aspects || []
      }
    };
  }

  static extractSelfBelief(chartData, readingId) {
    if (!chartData?.planets?.Jupiter) {
      return null;
    }
    
    return {
      readingId,
      jupiter: chartData.planets.Jupiter,
      extractedData: {
        jupiterSign: chartData.planets.Jupiter.sign,
        jupiterHouse: chartData.planets.Jupiter.house,
        jupiterAspects: chartData.planets.Jupiter.aspects || []
      }
    };
  }
}

/**
 * AI Service for worker context
 */
class WorkerAIService {
  static async generateReading(request) {
    try {
      const response = await fetch('/api/ai/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(
          errorData.error || `API error: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async generateCompleteReading(readingId, extractedData, writerPrompt, editorPrompt) {
    try {
      // Generate writer content
      const writerRequest = {
        readingId,
        extractedData,
        prompt: writerPrompt,
      };

      const writerResponse = await this.generateReading(writerRequest);
      if (!writerResponse.success) {
        return {
          success: false,
          error: writerResponse.error,
        };
      }

      // Generate editor refinement
      const editorRequest = {
        readingId,
        rawReading: writerResponse.content,
        prompt: editorPrompt,
      };

      // For now, we'll skip the editor step to simplify
      // In a full implementation, you'd call a separate editor endpoint
      
      return {
        success: true,
        rawReading: writerResponse.content,
        formattedReading: writerResponse.content,
        writerResponse: writerResponse.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate complete reading',
      };
    }
  }
}

/**
 * Get prompt for reading (simplified)
 */
function getPrompt(readingId) {
  const prompts = {
    'core-self': 'Generate a detailed core self reading based on the astrological data.',
    'chart-ruler': 'Generate a chart ruler reading based on the astrological data.',
    'inner-warrior': 'Generate an inner warrior reading based on Mars placement.',
    'self-belief': 'Generate a self-belief reading based on Jupiter placement.',
    'self-belief-inner-light': 'Generate a self-belief inner light reading based on Jupiter placement.',
  };
  
  return prompts[readingId] || 'Generate an astrological reading based on the provided data.';
}

/**
 * Generate a single reading
 */
async function generateSingleReading(readingId, extractedData) {
  try {
    const writerPrompt = getPrompt(readingId);
    const editorPrompt = getPrompt(`editor-${readingId}`);

    const response = await WorkerAIService.generateCompleteReading(
      readingId,
      extractedData,
      writerPrompt,
      editorPrompt
    );

    if (response.success && response.formattedReading) {
      return {
        success: true,
        reading: {
          id: readingId,
          content: response.formattedReading,
          loading: false,
          error: null,
        },
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to generate reading',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate reading',
    };
  }
}

/**
 * Update reading with content
 */
function updateReadingWithContent(reading, content, error = null) {
  return {
    ...reading,
    content: content || '',
    error: error,
    loading: false,
  };
}

/**
 * Initialize generated readings
 */
function initializeGeneratedReadings(selectedReadings) {
  return selectedReadings.map(reading => ({
    id: reading.id,
    title: reading.title,
    category: reading.category,
    description: reading.description,
    content: '',
    loading: true,
    error: null,
  }));
}

/**
 * Main processing function
 */
async function processReadingsGeneration(data) {
  try {
    isProcessing = true;
    
    const { selectedReadings, chartData } = data;
    
    // Extract reading IDs
    const selectedReadingIds = selectedReadings.map(reading => reading.id);
    
    // Extract data for all readings
    const extractedReadings = WorkerReadingExtractor.extractMultiple(
      selectedReadingIds,
      chartData
    );
    
    // Initialize readings
    const initialReadings = initializeGeneratedReadings(selectedReadings);
    
    // Send initial readings to main thread
    self.postMessage({
      type: MESSAGE_TYPES.PROGRESS_UPDATE,
      data: {
        readings: initialReadings,
        progress: 0,
        message: 'Starting reading generation...'
      }
    });
    
    // Generate readings progressively
    const completedReadings = [...initialReadings];
    const total = selectedReadings.length;
    
    for (let i = 0; i < selectedReadings.length; i++) {
      const reading = selectedReadings[i];
      const extractedData = extractedReadings.find(er => er.readingId === reading.id);
      
      if (!extractedData) {
        // Handle missing extracted data
        completedReadings[i] = updateReadingWithContent(
          reading,
          '',
          `No extracted data found for reading: ${reading.id}`
        );
      } else {
        // Generate the reading
        const result = await generateSingleReading(reading.id, extractedData);
        
        if (result.success && result.reading) {
          completedReadings[i] = updateReadingWithContent(
            reading,
            result.reading.content
          );
        } else {
          completedReadings[i] = updateReadingWithContent(
            reading,
            '',
            result.error
          );
        }
      }
      
      // Send individual reading completion
      self.postMessage({
        type: MESSAGE_TYPES.READING_COMPLETE,
        data: {
          reading: completedReadings[i],
          index: i,
          progress: Math.round(((i + 1) / total) * 100)
        }
      });
    }
    
    // Send all completed readings
    self.postMessage({
      type: MESSAGE_TYPES.ALL_READINGS_COMPLETE,
      data: {
        readings: completedReadings,
        progress: 100
      }
    });
    
  } catch (error) {
    self.postMessage({
      type: MESSAGE_TYPES.ERROR,
      data: {
        error: error instanceof Error ? error.message : 'Failed to generate readings'
      }
    });
  } finally {
    isProcessing = false;
  }
}

// Handle messages from main thread
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case MESSAGE_TYPES.GENERATE_READINGS:
      if (!isProcessing) {
        await processReadingsGeneration(data);
      }
      break;
      
    default:
      console.warn('Unknown message type:', type);
  }
});

// Handle errors
self.addEventListener('error', (error) => {
  self.postMessage({
    type: MESSAGE_TYPES.ERROR,
    data: {
      error: 'Worker error: ' + error.message
    }
  });
});

// Signal worker is ready
self.postMessage({
  type: 'WORKER_READY',
  data: { message: 'AI Processing Worker initialized' }
});