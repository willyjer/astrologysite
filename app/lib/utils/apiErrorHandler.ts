import { NextResponse } from 'next/server';

export interface APIErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, any>;
  retryAfter?: number;
}

export interface APIErrorOptions {
  status?: number;
  code?: string;
  details?: Record<string, any>;
  retryAfter?: number;
}

/**
 * Create a consistent error response format
 */
export function createErrorResponse(
  message: string,
  options: APIErrorOptions = {}
): NextResponse<APIErrorResponse> {
  const { status = 500, code, details, retryAfter } = options;

  const response: APIErrorResponse = {
    error: message,
  };

  if (code) {
    response.code = code;
  }

  if (details) {
    response.details = details;
  }

  if (retryAfter) {
    response.retryAfter = retryAfter;
  }

  return NextResponse.json(response, { status });
}

/**
 * Handle common API errors with consistent responses
 */
export function handleAPIError(error: unknown): NextResponse<APIErrorResponse> {
  if (error instanceof Error) {
    // Network errors
    if (error.name === 'AbortError') {
      return createErrorResponse('Request timed out. Please try again.', {
        status: 408,
        code: 'TIMEOUT',
      });
    }

    // Validation errors
    if (error.message.includes('validation')) {
      return createErrorResponse('Invalid request data', {
        status: 400,
        code: 'VALIDATION_ERROR',
      });
    }

    // Rate limiting
    if (error.message.includes('rate limit')) {
      return createErrorResponse('Rate limit exceeded. Please try again later.', {
        status: 429,
        code: 'RATE_LIMIT',
        retryAfter: 60,
      });
    }
  }

  // Default error
  return createErrorResponse('An unexpected error occurred', {
    status: 500,
    code: 'INTERNAL_ERROR',
  });
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(requiredVars: string[]): string | null {
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      return varName;
    }
  }
  return null;
}

/**
 * Create user-friendly error messages
 */
export function getUserFriendlyMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'Invalid OpenAI API key': 'Service configuration error. Please try again later.',
    'Rate limit exceeded': 'Too many requests. Please wait a moment and try again.',
    'Request timed out': 'The request took too long. Please try again.',
    'Network error': 'Connection problem. Please check your internet and try again.',
    'Invalid request data': 'Please check your input and try again.',
  };

  return errorMap[error] || 'Something went wrong. Please try again.';
} 