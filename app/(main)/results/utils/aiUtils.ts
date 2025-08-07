import type {
  GeneratedReading,
  ReadingGenerationResult,
} from '../types';
import type { AICompleteReadingResponse } from '../../../lib/ai-service';
import type { ExtractedReadingData } from '../../../lib/readings';
import { AIService } from '../../../lib/ai-service';
import { getPrompt } from '../../../lib/prompts';
import { updateReadingWithContent } from './readingUtils';

/**
 * Generate a single reading using AI
 */
export async function generateReading(
  readingId: string,
  extractedData: ExtractedReadingData
): Promise<ReadingGenerationResult> {
  try {
    const writerPrompt = getPrompt(readingId);
    const editorPrompt = getPrompt(`editor-${readingId}`);

    const response: AICompleteReadingResponse =
      await AIService.generateCompleteReading(
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
          title: '', // Will be set by caller
          content: response.formattedReading,
          loading: false,
        },
      };
    } else {
      console.error(
        `❌ AI generation failed for ${readingId}:`,
        response.error
      );
      return {
        success: false,
        error: response.error || 'Failed to generate reading',
      };
    }
  } catch (generationError) {
    console.error(
      `❌ Exception in generateReading for ${readingId}:`,
      generationError
    );
    return {
      success: false,
      error:
        generationError instanceof Error
          ? generationError.message
          : 'Failed to generate reading',
    };
  }
}

/**
 * Generate multiple readings in parallel
 */
export async function generateMultipleReadings(
  readings: GeneratedReading[],
  extractedReadings: ExtractedReadingData[]
): Promise<GeneratedReading[]> {
  const readingPromises = readings.map(async (reading) => {
    try {
      const extractedData = extractedReadings.find(
        (er) => er.readingId === reading.id
      );
      if (!extractedData) {
        console.error(`❌ No extracted data found for reading: ${reading.id}`);
        throw new Error(`No extracted data found for reading: ${reading.id}`);
      }

      const result = await generateReading(reading.id, extractedData);

      if (result.success && result.reading) {
        const updatedReading = updateReadingWithContent(
          reading,
          result.reading.content
        );
        return updatedReading;
      } else {
        console.error(
          `❌ Failed to generate reading ${reading.id}:`,
          result.error
        );
        return updateReadingWithContent(reading, '', result.error);
      }
    } catch (generationError) {
      console.error(
        `❌ Error generating reading ${reading.id}:`,
        generationError
      );
      return updateReadingWithContent(
        reading,
        '',
        generationError instanceof Error
          ? generationError.message
          : 'Failed to generate reading'
      );
    }
  });

  const results = await Promise.all(readingPromises);
  return results;
}

/**
 * Handle AI errors and return user-friendly messages
 */
export function handleAIError(error: any): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('rate limit') ||
      message.includes('too many requests')
    ) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (message.includes('timeout') || message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }

    if (message.includes('api key') || message.includes('authentication')) {
      return 'Service temporarily unavailable. Please try again later.';
    }

    if (message.includes('quota') || message.includes('billing')) {
      return 'Service temporarily unavailable. Please try again later.';
    }

    return 'Failed to generate readings. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Validate AI service response
 */
export function validateAIResponse(response: AICompleteReadingResponse): {
  isValid: boolean;
  error?: string;
} {
  if (!response.success) {
    return {
      isValid: false,
      error: response.error || 'AI service returned failure',
    };
  }

  if (!response.formattedReading) {
    return {
      isValid: false,
      error: 'No formatted reading content received',
    };
  }

  if (response.formattedReading.trim().length === 0) {
    return {
      isValid: false,
      error: 'Empty reading content received',
    };
  }

  return { isValid: true };
}

/**
 * Retry AI generation with exponential backoff
 */
export async function retryAIGeneration(
  readingId: string,
  extractedData: ExtractedReadingData,
  maxRetries: number = 3
): Promise<ReadingGenerationResult> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateReading(readingId, extractedData);

      if (result.success) {
        return result;
      }

      // If it's the last attempt, return the error
      if (attempt === maxRetries) {
        return result;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (retryError) {
      // Attempt failed for reading

      if (attempt === maxRetries) {
        return {
          success: false,
          error:
            retryError instanceof Error
              ? retryError.message
              : 'Failed to generate reading',
        };
      }
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
  };
}

/**
 * Check if AI service is available
 */
export async function checkAIServiceHealth(): Promise<boolean> {
  try {
    // Try a simple test request
    const testResponse = await fetch('/api/ai/generate-reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        readingId: 'test',
        extractedData: {},
        prompt: 'test',
      }),
    });

    return testResponse.ok;
  } catch (healthCheckError) {
    // AI Service health check failed
    return false;
  }
}

/**
 * Get AI generation progress
 */
export function getAIGenerationProgress(
  totalReadings: number,
  completedReadings: number
): {
  percentage: number;
  completed: number;
  remaining: number;
} {
  const percentage = Math.round((completedReadings / totalReadings) * 100);

  return {
    percentage,
    completed: completedReadings,
    remaining: totalReadings - completedReadings,
  };
}
