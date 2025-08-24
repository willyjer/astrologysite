// AI Processing Web Worker - Minimal Version
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

/**
 * Simple AI Service for worker context
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
 * Get prompt for reading from the main prompts system
 */
async function getPrompt(readingId) {
  try {
    // Fetch the actual prompts from the main application
    const response = await fetch('/api/prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ readingId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prompt: ${response.status}`);
    }

    const data = await response.json();
    return data.prompt || 'Generate an astrological reading based on the provided data.';
  } catch (error) {
    console.error('Error fetching prompt:', error);
    // Fallback to basic prompts if the API fails
    const fallbackPrompts = {
      'core-self-life-path': 'Generate a detailed core self life path reading based on the astrological data.',
      'editor-core-self-life-path': 'Format the core self life path reading into professional HTML.',
    };
    
    return fallbackPrompts[readingId] || 'Generate an astrological reading based on the provided data.';
  }
}

/**
 * Generate a single reading using AI
 */
async function generateSingleReading(readingId, extractedData) {
  try {
    const writerPrompt = await getPrompt(readingId);
    const editorPrompt = await getPrompt(`editor-${readingId}`);

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
          extractedData: extractedData,
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
 * Main processing function - simplified but functional
 */
async function processReadingsGeneration(data) {
  try {
    isProcessing = true;
    
    const { selectedReadings, chartData } = data;
    
    // Initialize readings inline
    const initialReadings = selectedReadings.map(reading => ({
      id: reading.id,
      title: reading.title,
      category: reading.category,
      description: reading.description,
      content: '',
      loading: true,
      error: null,
    }));
    
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
      
      // Generate the reading using AI
      const result = await generateSingleReading(reading.id, { readingId: reading.id });
      
      if (result.success && result.reading) {
        // Update reading inline
        completedReadings[i] = {
          ...reading,
          content: result.reading.content,
          error: null,
          loading: false,
          extractedData: { readingId: reading.id }
        };
      } else {
        // Update reading with error inline
        completedReadings[i] = {
          ...reading,
          content: '',
          error: result.error,
          loading: false,
        };
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