import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, validateEnvironment, getUserFriendlyMessage } from '../../../lib/utils/apiErrorHandler';

export async function POST(request: NextRequest) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

      // Check request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      // 1MB limit
      return createErrorResponse('Request too large', {
        status: 413,
        code: 'REQUEST_TOO_LARGE',
      });
    }

  try {
    const body = await request.json();
    const { readingId, extractedData, prompt, rawReading } = body;

    // Check if this is an editor request (has rawReading) or writer request (has extractedData)
    const isEditorRequest = !!rawReading;

    // Choose model based on request type
    const model = isEditorRequest ? 'gpt-4.1-mini' : 'gpt-4.1-mini'; // Writers use gpt-4.1-mini, editors use 4.1-mini

    // Import sanitization utilities
    const { sanitizeReadingId, sanitizePrompt, sanitizeString } = await import(
      '../../../lib/inputSanitization'
    );

    // Sanitize inputs
    const sanitizedReadingId = sanitizeReadingId(readingId);
    const sanitizedPrompt = sanitizePrompt(prompt);
    const sanitizedRawReading = isEditorRequest
      ? sanitizeString(rawReading)
      : null;

    if (isEditorRequest) {
      // Editor request - format existing reading
      if (!sanitizedReadingId || !sanitizedRawReading || !sanitizedPrompt) {
        return NextResponse.json(
          {
            error:
              'Missing or invalid required fields: readingId, rawReading, prompt',
            details: {
              readingId: !sanitizedReadingId ? 'invalid' : 'valid',
              rawReading: !sanitizedRawReading ? 'invalid' : 'valid',
              prompt: !sanitizedPrompt ? 'invalid' : 'valid',
            },
          },
          { status: 400, headers }
        );
      }
    } else {
      // Writer request - generate new reading
      if (!sanitizedReadingId || !extractedData || !sanitizedPrompt) {
        return NextResponse.json(
          {
            error:
              'Missing or invalid required fields: readingId, extractedData, prompt',
            details: {
              readingId: !sanitizedReadingId ? 'invalid' : 'valid',
              extractedData: !extractedData ? 'invalid' : 'valid',
              prompt: !sanitizedPrompt ? 'invalid' : 'valid',
            },
          },
          { status: 400, headers }
        );
      }

      // Validate extractedData is a valid object
      if (!extractedData || typeof extractedData !== 'object') {
        return NextResponse.json(
          { error: 'extractedData must be a valid object' },
          { status: 400, headers }
        );
      }
    }

    // Validate environment variables
    const missingVar = validateEnvironment(['OPENAI_API_KEY']);
    if (missingVar) {
      return createErrorResponse('Service not properly configured', {
        status: 500,
        code: 'CONFIGURATION_ERROR',
      });
    }

    const apiKey = process.env.OPENAI_API_KEY!;

    // Prepare the message for GPT-4o-mini
    let message: string;

    if (isEditorRequest) {
      // Editor request - format the raw reading
      message = `${sanitizedPrompt}\n\nRaw Reading to Format:\n${sanitizedRawReading}`;
    } else {
      // Writer request - generate new reading from extracted data
      message = `${sanitizedPrompt}\n\nExtracted Data:\n${JSON.stringify(extractedData, null, 2)}`;
    }

    // Make request to OpenAI API with timeout and latest parameters
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
            temperature: 0.7,
            max_tokens: 10000, // Increased from 10000 to prevent truncation
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1,
            n: 1, // Generate single response
            stream: false, // No streaming for now
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));

        // Handle specific error cases with user-friendly messages
        const errorMessage = getUserFriendlyMessage(errorData.error || 'Unknown error');
        
        if (response.status === 401) {
          return createErrorResponse(errorMessage, {
            status: 401,
            code: 'AUTHENTICATION_ERROR',
          });
        } else if (response.status === 429) {
          return createErrorResponse(errorMessage, {
            status: 429,
            code: 'RATE_LIMIT',
            retryAfter: 60,
          });
        } else if (response.status === 500) {
          return createErrorResponse(errorMessage, {
            status: 500,
            code: 'SERVICE_UNAVAILABLE',
          });
        } else if (response.status === 503) {
          return createErrorResponse(errorMessage, {
            status: 503,
            code: 'SERVICE_OVERLOADED',
            retryAfter: 120,
          });
        }

        return createErrorResponse(errorMessage, {
          status: response.status,
          code: 'API_ERROR',
        });
      }

      const data = await response.json();

      // Validate response structure based on latest API
      if (
        !data.choices ||
        !Array.isArray(data.choices) ||
        data.choices.length === 0
      ) {
        return createErrorResponse('Invalid response from AI service', {
          status: 500,
          code: 'INVALID_RESPONSE',
        });
      }

      const choice = data.choices[0];
      const content = choice.message?.content;

      if (!content) {
        return createErrorResponse('No content received from AI service', {
          status: 500,
          code: 'EMPTY_RESPONSE',
        });
      }

      return NextResponse.json(
        {
          success: true,
          content,
          readingId,
          usage: data.usage,
          finish_reason: choice.finish_reason,
          model: data.model,
          service_tier: data.service_tier,
        },
        { headers }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return createErrorResponse('Request timed out. Please try again.', {
          status: 408,
          code: 'TIMEOUT',
        });
      }

      return createErrorResponse('Network error. Please check your connection and try again.', {
        status: 500,
        code: 'NETWORK_ERROR',
      });
    }
  } catch (error) {
    return createErrorResponse('Failed to generate reading', {
      status: 500,
      code: 'GENERATION_FAILED',
    });
  }
}
