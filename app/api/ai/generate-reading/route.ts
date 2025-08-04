import { NextRequest, NextResponse } from 'next/server';

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
  if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413, headers }
    );
  }

  try {
    const body = await request.json();
    const { readingId, extractedData, prompt, rawReading } = body;

    // Check if this is an editor request (has rawReading) or writer request (has extractedData)
    const isEditorRequest = !!rawReading;
    
    // Choose model based on request type
    const model = isEditorRequest ? 'gpt-4o-mini' : 'gpt-4o-mini'; // Writers use 4.1-mini, editors use 4o-mini
    
    // Import sanitization utilities
    const { sanitizeReadingId, sanitizePrompt, sanitizeString } = await import('../../../lib/inputSanitization');
    
    // Sanitize inputs
    const sanitizedReadingId = sanitizeReadingId(readingId);
    const sanitizedPrompt = sanitizePrompt(prompt);
    const sanitizedRawReading = isEditorRequest ? sanitizeString(rawReading) : null;
    
    if (isEditorRequest) {
      // Editor request - format existing reading
      if (!sanitizedReadingId || !sanitizedRawReading || !sanitizedPrompt) {
        return NextResponse.json(
          { 
            error: 'Missing or invalid required fields: readingId, rawReading, prompt',
            details: {
              readingId: !sanitizedReadingId ? 'invalid' : 'valid',
              rawReading: !sanitizedRawReading ? 'invalid' : 'valid',
              prompt: !sanitizedPrompt ? 'invalid' : 'valid'
            }
          },
          { status: 400, headers }
        );
      }
    } else {
      // Writer request - generate new reading
      if (!sanitizedReadingId || !extractedData || !sanitizedPrompt) {
        return NextResponse.json(
          { 
            error: 'Missing or invalid required fields: readingId, extractedData, prompt',
            details: {
              readingId: !sanitizedReadingId ? 'invalid' : 'valid',
              extractedData: !extractedData ? 'invalid' : 'valid',
              prompt: !sanitizedPrompt ? 'invalid' : 'valid'
            }
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

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 500 });
    }

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        // Handle specific error cases based on latest API
        if (response.status === 401) {
          return NextResponse.json({ error: 'Invalid OpenAI API key' }, { status: 401 });
        } else if (response.status === 429) {
          return NextResponse.json({ error: 'Rate limit exceeded. Please try again in a moment.' }, { status: 429 });
        } else if (response.status === 500) {
          return NextResponse.json({ error: 'OpenAI service temporarily unavailable. Please try again.' }, { status: 500 });
        } else if (response.status === 503) {
          return NextResponse.json({ error: 'OpenAI service is overloaded. Please try again later.' }, { status: 503 });
        }
        
        return NextResponse.json(
          { error: `OpenAI API error: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      
      // Validate response structure based on latest API
      if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        return NextResponse.json(
          { error: 'Invalid response structure from OpenAI' },
          { status: 500 }
        );
      }

      const choice = data.choices[0];
      const content = choice.message?.content;

      if (!content) {
        return NextResponse.json(
          { error: 'No content received from OpenAI' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        content,
        readingId,
        usage: data.usage,
        finish_reason: choice.finish_reason,
        model: data.model,
        service_tier: data.service_tier,
      }, { headers });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 408, headers }
        );
      }
      
      return NextResponse.json(
        { error: 'Network error. Please check your connection and try again.' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500, headers }
    );
  }
} 