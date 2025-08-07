// Simple in-memory cache (in production, you'd use Redis or a database)
const chartCache = new Map<string, any>();

export type AstrologyChartRequest = {
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

export type AstrologyChartResponse = {
  houses: Array<{
    start_degree: number;
    end_degree: number;
    sign: string;
    house_id: number;
    planets: Array<{
      name: string;
      sign: string;
      full_degree: number;
      is_retro: string;
    }>;
  }>;
  aspects: Array<{
    aspecting_planet: string;
    aspected_planet: string;
    aspecting_planet_id: number;
    aspected_planet_id: number;
    type: string;
    orb: number;
    diff: number;
  }>;
};

export class AstrologyService {
  /**
   * Get natal chart data for a user
   * Uses caching to avoid duplicate API calls
   */
  static async getNatalChart(
    birthData: AstrologyChartRequest
  ): Promise<AstrologyChartResponse> {
    // Create a cache key based on birth data
    const cacheKey = `${birthData.day}-${birthData.month}-${birthData.year}-${birthData.hour}-${birthData.min}-${birthData.lat}-${birthData.lon}-${birthData.tzone}`;

    // Check if we have cached data
    if (chartCache.has(cacheKey)) {
      return chartCache.get(cacheKey)!;
    }

    // Fetch new data from API
    const response = await fetch('/api/astrology-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch natal chart');
    }

    const data = await response.json();

    // Cache the result
    chartCache.set(cacheKey, data.chart);

    return data.chart;
  }

  /**
   * Clear cache for a specific user (useful for testing)
   */
  static clearCache(birthData?: AstrologyChartRequest) {
    if (birthData) {
      const cacheKey = `${birthData.day}-${birthData.month}-${birthData.year}-${birthData.hour}-${birthData.min}-${birthData.lat}-${birthData.lon}-${birthData.tzone}`;
      chartCache.delete(cacheKey);
    } else {
      chartCache.clear();
    }
  }

  /**
   * Get cache size (for debugging)
   */
  static getCacheSize(): number {
    return chartCache.size;
  }
}
