// Performance monitoring service for intro page
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Track Core Web Vitals
    this.trackCoreWebVitals();
    
    // Track custom metrics
    this.trackCustomMetrics();
    
    this.isInitialized = true;
  }

  private trackCoreWebVitals() {
    // Track basic performance metrics without external dependencies
    if (typeof window !== 'undefined') {
      // Track page load time
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.trackMetric('page_load_time', loadTime);
      });

      // Track DOM content loaded
      document.addEventListener('DOMContentLoaded', () => {
        const domReadyTime = performance.now();
        this.trackMetric('dom_content_loaded', domReadyTime);
      });
    }
  }

  private trackCustomMetrics() {
    // Track page load time
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.trackMetric('page_load_time', loadTime);
      });

      // Track first paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
              this.trackMetric('first_paint', entry.startTime);
            }
            if (entry.name === 'first-contentful-paint') {
              this.trackMetric('first_contentful_paint', entry.startTime);
            }
          }
        });
        
        try {
          observer.observe({ entryTypes: ['paint'] });
                    } catch (performanceObserverError) {
          // PerformanceObserver not supported in this environment
        }
      }
    }
  }

  trackMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Send to monitoring service
    this.sendMetric(name, value);
  }

  private sendMetric(name: string, value: number) {
    const metricData = {
      name,
      value,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };
    
    // Future: Send to monitoring service
    // fetch('/api/metrics', {
    //   method: 'POST',
    //   body: JSON.stringify(metricData),
    // });
  }

  trackInteraction(action: string, duration?: number) {
    this.trackMetric('interaction', duration || 0);
  }

  getMetrics() {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        const sum = values.reduce((a: number, b: number) => a + b, 0);
        result[name] = {
          avg: sum / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        };
      }
    });
    
    return result;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor(); 