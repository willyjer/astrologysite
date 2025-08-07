/**
 * Production Error Monitoring Utilities
 * 
 * This file provides utilities for comprehensive production error monitoring,
 * analytics, and alerting in production environments.
 */

// Dynamic Sentry import to avoid initialization issues
let Sentry: any = null;

async function getSentry() {
  if (!Sentry) {
    try {
      Sentry = await import('@sentry/nextjs');
    } catch (error) {
      console.warn('Sentry not available:', error);
      return null;
    }
  }
  return Sentry;
}

/**
 * Production error monitoring configuration
 */
export const PRODUCTION_MONITORING_CONFIG = {
  // Error sampling rates
  ERROR_SAMPLE_RATE: 1.0, // Capture all errors in production
  PERFORMANCE_SAMPLE_RATE: 0.1, // Sample 10% of performance data
  
  // Alert thresholds
  ERROR_RATE_THRESHOLD: 0.05, // 5% error rate
  RESPONSE_TIME_THRESHOLD: 3000, // 3 seconds
  
  // Error grouping
  MAX_ERROR_GROUPS: 100,
  ERROR_GROUP_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Enhanced error tracking for production
 */
export async function trackProductionError(
  error: Error,
  context: {
    component?: string;
    operation?: string;
    userAction?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  } = {}
) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Get Sentry dynamically
  const SentryInstance = await getSentry();
  if (!SentryInstance) {
    console.warn('Sentry not available for error tracking');
    return;
  }

  const { component, operation, userAction, severity = 'medium', tags = {}, extra = {} } = context;

  // Add context to error message
  let enhancedMessage = error.message;
  if (operation) {
    enhancedMessage = `${operation}: ${enhancedMessage}`;
  }
  if (component) {
    enhancedMessage = `${enhancedMessage} (in ${component})`;
  }

  // Create enhanced error
  const enhancedError = new Error(enhancedMessage);
  enhancedError.stack = error.stack;
  enhancedError.name = error.name;

  // Capture error with enhanced context
  SentryInstance.captureException(enhancedError, {
    level: severity === 'critical' ? 'fatal' : severity,
    tags: {
      ...tags,
      component: component || 'unknown',
      operation: operation || 'unknown',
      userAction: userAction || 'unknown',
      severity,
      environment: 'production',
    },
    extra: {
      ...extra,
      originalError: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      context: {
        component,
        operation,
        userAction,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      },
    },
  });
}

/**
 * Performance monitoring for critical operations
 */
export function trackPerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  options: {
    tags?: Record<string, string>;
    threshold?: number;
    onSlowOperation?: (duration: number) => void;
  } = {}
): Promise<T> {
  const { threshold = PRODUCTION_MONITORING_CONFIG.RESPONSE_TIME_THRESHOLD, onSlowOperation } = options;
  
  const startTime = performance.now();
  
  return fn().finally(() => {
    const duration = performance.now() - startTime;
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERFORMANCE] ${operation} completed in ${duration.toFixed(2)}ms`);
    }

    // Alert on slow operations
    if (duration > threshold && onSlowOperation) {
      onSlowOperation(duration);
    }
  });
}

/**
 * User journey tracking
 */
export function trackUserJourney(
  step: string,
  data: {
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  } = {}
) {
  // Only track in production for now
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // For now, just log the journey step
  console.log(`[USER JOURNEY] ${step}`, data);
}

/**
 * Error rate monitoring
 */
export class ErrorRateMonitor {
  private _errorCount = 0;
  private totalRequests = 0;
  private lastResetTime = Date.now();
  private readonly resetInterval = 60 * 1000; // 1 minute

  get errorCount() {
    return this._errorCount;
  }

  trackError() {
    this._errorCount++;
    this.checkAndReset();
  }

  trackRequest() {
    this.totalRequests++;
    this.checkAndReset();
  }

  private checkAndReset() {
    const now = Date.now();
    if (now - this.lastResetTime > this.resetInterval) {
      this.reset();
    }
  }

  private reset() {
    this._errorCount = 0;
    this.totalRequests = 0;
    this.lastResetTime = Date.now();
  }

  getErrorRate(): number {
    if (this.totalRequests === 0) return 0;
    return this.errorCount / this.totalRequests;
  }

  shouldAlert(): boolean {
    return this.getErrorRate() > PRODUCTION_MONITORING_CONFIG.ERROR_RATE_THRESHOLD;
  }
}

/**
 * Production alerting system
 */
export class ProductionAlerting {
  private static instance: ProductionAlerting;
  private errorRateMonitor = new ErrorRateMonitor();
  private alertHistory: Array<{
    type: string;
    message: string;
    timestamp: Date;
    data?: any;
  }> = [];

  static getInstance(): ProductionAlerting {
    if (!ProductionAlerting.instance) {
      ProductionAlerting.instance = new ProductionAlerting();
    }
    return ProductionAlerting.instance;
  }

  trackError(error: Error, context?: any) {
    this.errorRateMonitor.trackError();
    
    // Check if we should alert
    if (this.errorRateMonitor.shouldAlert()) {
      this.alert('HIGH_ERROR_RATE', {
        errorRate: this.errorRateMonitor.getErrorRate(),
        threshold: PRODUCTION_MONITORING_CONFIG.ERROR_RATE_THRESHOLD,
        recentErrors: this.errorRateMonitor.errorCount,
      });
    }

    // Track critical errors immediately
    if (this.isCriticalError(error)) {
      this.alert('CRITICAL_ERROR', {
        error: error.message,
        stack: error.stack,
        context,
      });
    }
  }

  trackRequest() {
    this.errorRateMonitor.trackRequest();
  }

  private isCriticalError(error: Error): boolean {
    const criticalKeywords = [
      'authentication',
      'authorization',
      'payment',
      'billing',
      'data corruption',
      'security',
    ];

    const message = error.message.toLowerCase();
    return criticalKeywords.some(keyword => message.includes(keyword));
  }

  private alert(type: string, data: any) {
    const alert = {
      type,
      message: this.getAlertMessage(type, data),
      timestamp: new Date(),
      data,
    };

    this.alertHistory.push(alert);

    // Log alert (in production, this would go to your logging service)
    console.error(`[PRODUCTION ALERT] ${alert.message}`, data);
  }

  private getAlertMessage(type: string, data: any): string {
    switch (type) {
      case 'HIGH_ERROR_RATE':
        return `High error rate detected: ${(data.errorRate * 100).toFixed(2)}% (${data.recentErrors} errors)`;
      case 'CRITICAL_ERROR':
        return `Critical error detected: ${data.error}`;
      default:
        return `Production alert: ${type}`;
    }
  }

  getAlertHistory() {
    return [...this.alertHistory];
  }

  clearAlertHistory() {
    this.alertHistory = [];
  }
}

/**
 * Error analytics and reporting
 */
export class ErrorAnalytics {
  private static instance: ErrorAnalytics;
  private errorStats: Record<string, {
    count: number;
    firstSeen: Date;
    lastSeen: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    contexts: string[];
  }> = {};

  static getInstance(): ErrorAnalytics {
    if (!ErrorAnalytics.instance) {
      ErrorAnalytics.instance = new ErrorAnalytics();
    }
    return ErrorAnalytics.instance;
  }

  trackError(error: Error, context: { component?: string; operation?: string; severity?: string } = {}) {
    const errorKey = this.getErrorKey(error);
    const now = new Date();

    if (!this.errorStats[errorKey]) {
      this.errorStats[errorKey] = {
        count: 0,
        firstSeen: now,
        lastSeen: now,
        severity: (context.severity as any) || 'medium',
        contexts: [],
      };
    }

    const stats = this.errorStats[errorKey];
    stats.count++;
    stats.lastSeen = now;

    if (context.component && !stats.contexts.includes(context.component)) {
      stats.contexts.push(context.component);
    }
  }

  private getErrorKey(error: Error): string {
    // Create a consistent key for similar errors
    return `${error.name}:${error.message.split('\n')[0]}`;
  }

  getErrorReport() {
    const report = {
      totalErrors: Object.values(this.errorStats).reduce((sum, stats) => sum + stats.count, 0),
      uniqueErrors: Object.keys(this.errorStats).length,
      errorBreakdown: Object.entries(this.errorStats).map(([key, stats]) => ({
        error: key,
        count: stats.count,
        firstSeen: stats.firstSeen,
        lastSeen: stats.lastSeen,
        severity: stats.severity,
        contexts: stats.contexts,
      })),
      severityBreakdown: this.getSeverityBreakdown(),
      topErrors: this.getTopErrors(10),
    };

    return report;
  }

  private getSeverityBreakdown() {
    const breakdown: Record<string, number> = {};
    
    Object.values(this.errorStats).forEach(stats => {
      breakdown[stats.severity] = (breakdown[stats.severity] || 0) + stats.count;
    });

    return breakdown;
  }

  private getTopErrors(limit: number) {
    return Object.entries(this.errorStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limit)
      .map(([key, stats]) => ({
        error: key,
        count: stats.count,
        severity: stats.severity,
      }));
  }

  clearStats() {
    this.errorStats = {};
  }
}

/**
 * Production monitoring initialization
 */
export function initializeProductionMonitoring() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Set up global error handlers
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('[GLOBAL ERROR]', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('[UNHANDLED REJECTION]', event.reason);
    });
  }
}

// Initialize monitoring when this module is loaded
if (typeof window !== 'undefined') {
  initializeProductionMonitoring();
} 