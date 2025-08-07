import { NextRequest, NextResponse } from 'next/server';

// Types for the astrology API
type AstrologyChartRequest = {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
  house_type?: string;
};

type Planet = {
  name: string;
  sign: string;
  full_degree: number;
  is_retro: string;
};

type House = {
  start_degree: number;
  end_degree: number;
  sign: string;
  house_id: number;
  planets: Planet[];
};

type Aspect = {
  aspecting_planet: string;
  aspected_planet: string;
  aspecting_planet_id: number;
  aspected_planet_id: number;
  type: string;
  orb: number;
  diff: number;
};

type AstrologyChartResponse = {
  houses: House[];
  aspects: Aspect[];
};

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
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413, headers }
    );
  }

  try {
    const body = await request.json();

    // Import sanitization utilities
    const { validateAndSanitizeBirthData, validateBirthDataRanges } =
      await import('../../lib/inputSanitization');

    // Sanitize and validate birth data
    const sanitizedData = validateAndSanitizeBirthData(body);
    const validation = validateBirthDataRanges(sanitizedData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid birth data',
          details: validation.errors,
        },
        { status: 400, headers }
      );
    }

    const { day, month, year, hour, min, lat, lon, tzone } = sanitizedData;
    const house_type = body.house_type || 'placidus';

    // Prepare the request payload - we know these are valid numbers after validation
    const astrologyPayload: AstrologyChartRequest = {
      day: day!,
      month: month!,
      year: year!,
      hour: hour!,
      min: min!,
      lat: lat!,
      lon: lon!,
      tzone: tzone!,
      house_type,
    };

    // Get API credentials from environment variables
    const userId = process.env.ASTROLOGY_API_USER_ID;
    const apiKey = process.env.ASTROLOGY_API_KEY;

    if (!userId || !apiKey) {
      return NextResponse.json(
        { error: 'Astrology API not configured' },
        { status: 500 }
      );
    }

    // Create Basic Auth header
    const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');

    // Make the API call to astrology API
    const response = await fetch(
      'https://json.astrologyapi.com/v1/western_chart_data',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en',
        },
        body: JSON.stringify(astrologyPayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid astrology API credentials' },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Astrology API rate limit exceeded' },
          { status: 429 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid request data sent to astrology API' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: `Astrology API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const chartData: AstrologyChartResponse = await response.json();

    // Return the chart data
    return NextResponse.json(
      {
        success: true,
        chart: chartData,
      },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch astrology chart' },
      { status: 500, headers }
    );
  }
}
