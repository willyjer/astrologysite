export type ExtractedReadingData = {
  readingId: string;
  extractedData: any;
};

export type AIReadingRequest = {
  readingId: string;
  extractedData: any;
  prompt: string;
};

export type AIEditorRequest = {
  readingId: string;
  rawReading: string;
  prompt: string;
};

export type AIReadingResponse = {
  success: boolean;
  content?: string;
  error?: string;
};

export type AICompleteReadingResponse = {
  success: boolean;
  rawReading?: string;
  formattedReading?: string;
  writerResponse?: string;
  editorResponse?: string;
  error?: string;
};

export class AIService {
  /**
   * Generate a reading using OpenAI GPT-4o-mini
   */
  static async generateReading(request: AIReadingRequest): Promise<AIReadingResponse> {
    try {
      const response = await fetch('/api/ai/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (apiError) {
      return {
        success: false,
        error: apiError instanceof Error ? apiError.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate multiple readings in parallel
   */
  static async generateMultipleReadings(requests: AIReadingRequest[]): Promise<AIReadingResponse[]> {
    const promises = requests.map(request => this.generateReading(request));
    return Promise.all(promises);
  }

  /**
   * Generate a formatted reading using the editor
   */
  static async generateFormattedReading(request: AIEditorRequest): Promise<AIReadingResponse> {
    try {
      const response = await fetch('/api/ai/generate-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (formattingError) {
      return {
        success: false,
        error: formattingError instanceof Error ? formattingError.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate a complete reading (raw + formatted) in two steps
   */
  static async generateCompleteReading(
    readingId: string, 
    extractedData: any, 
    writerPrompt: string, 
    editorPrompt: string
  ): Promise<AICompleteReadingResponse> {
    try {
      // Step 1: Generate raw reading
      const rawReadingRequest: AIReadingRequest = {
        readingId,
        extractedData,
        prompt: writerPrompt,
      };

      const rawResponse = await this.generateReading(rawReadingRequest);

      if (!rawResponse.success || !rawResponse.content) {
        return {
          success: false,
          error: rawResponse.error || 'Failed to generate raw reading',
        };
      }

      // Step 2: Format the reading
      const editorRequest: AIEditorRequest = {
        readingId,
        rawReading: rawResponse.content,
        prompt: editorPrompt,
      };

      const formattedResponse = await this.generateFormattedReading(editorRequest);

      if (!formattedResponse.success || !formattedResponse.content) {
        return {
          success: false,
          rawReading: rawResponse.content,
          error: formattedResponse.error || 'Failed to format reading',
        };
      }

      return {
        success: true,
        rawReading: rawResponse.content,
        formattedReading: formattedResponse.content,
        writerResponse: rawResponse.content,
        editorResponse: formattedResponse.content,
      };
    } catch (completeReadingError) {
      return {
        success: false,
        error: completeReadingError instanceof Error ? completeReadingError.message : 'Unknown error occurred',
      };
    }
  }
} 