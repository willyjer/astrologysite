import { NextResponse } from 'next/server';

// The TimeZoneDB API with environment variable
const API_KEY = process.env.TIMEZONEDB_API_KEY;

export async function GET(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const timestamp = searchParams.get('timestamp');

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Timezone API not configured' },
      { status: 500, headers }
    );
  }

  // Import sanitization utilities
  const { sanitizeCoordinates } = await import('../../lib/inputSanitization');

  // Sanitize coordinates
  const sanitizedCoords = sanitizeCoordinates(lat, lng);

  if (sanitizedCoords.lat === null || sanitizedCoords.lng === null) {
    return NextResponse.json(
      {
        error: 'Missing or invalid lat/lng parameters',
        details: {
          lat: sanitizedCoords.lat === null ? 'invalid' : 'valid',
          lng: sanitizedCoords.lng === null ? 'invalid' : 'valid',
        },
      },
      { status: 400, headers }
    );
  }

  // Validate coordinate ranges
  if (sanitizedCoords.lat < -90 || sanitizedCoords.lat > 90) {
    return NextResponse.json(
      {
        error: 'Invalid latitude value. Must be between -90 and 90',
      },
      { status: 400, headers }
    );
  }

  if (sanitizedCoords.lng < -180 || sanitizedCoords.lng > 180) {
    return NextResponse.json(
      {
        error: 'Invalid longitude value. Must be between -180 and 180',
      },
      { status: 400, headers }
    );
  }

  try {
    let url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${sanitizedCoords.lat}&lng=${sanitizedCoords.lng}`;

    // Add timestamp if provided (for historical timezone data)
    if (timestamp) {
      url += `&time=${timestamp}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid TimeZoneDB API key' },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'TimeZoneDB API rate limit exceeded' },
          { status: 429 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid coordinates provided to TimeZoneDB API' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `TimeZoneDB API returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { headers });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch timezone data' },
      { status: 500, headers }
    );
  }
}
