'use client';

import React from 'react';
import { ErrorAnalytics, ProductionAlerting, trackUserJourney } from '../../lib/utils/productionMonitoring';
import styles from './ProductionMonitoringDashboard.module.css';

interface ProductionMonitoringDashboardProps {
  showInDevelopment?: boolean;
}

export function ProductionMonitoringDashboard({ 
  showInDevelopment = false 
}: ProductionMonitoringDashboardProps) {
  const [errorReport, setErrorReport] = React.useState<any>(null);
  const [alertHistory, setAlertHistory] = React.useState<any[]>([]);
  const [isVisible, setIsVisible] = React.useState(false);
  const [, setRefreshInterval] = React.useState<NodeJS.Timeout | null>(null);

  // Only show in production or if explicitly enabled in development
  const shouldShow = process.env.NODE_ENV === 'production' || showInDevelopment;

  React.useEffect(() => {
    if (!shouldShow) return;

    // Initialize monitoring
    const analytics = ErrorAnalytics.getInstance();
    const alerting = ProductionAlerting.getInstance();

    // Set up refresh interval
    const interval = setInterval(() => {
      setErrorReport(analytics.getErrorReport());
      setAlertHistory(alerting.getAlertHistory());
    }, 5000); // Refresh every 5 seconds

    setRefreshInterval(interval);

    // Initial load
    setErrorReport(analytics.getErrorReport());
    setAlertHistory(alerting.getAlertHistory());

    // Track dashboard access
    trackUserJourney('production-monitoring-dashboard', {
      metadata: { environment: process.env.NODE_ENV }
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shouldShow]);

  const handleClearStats = () => {
    const analytics = ErrorAnalytics.getInstance();
    const alerting = ProductionAlerting.getInstance();
    
    analytics.clearStats();
    alerting.clearAlertHistory();
    
    setErrorReport(analytics.getErrorReport());
    setAlertHistory(alerting.getAlertHistory());
  };

  const handleSimulateError = () => {
    const analytics = ErrorAnalytics.getInstance();
    const alerting = ProductionAlerting.getInstance();
    
    // Simulate a test error
    const testError = new Error('Test error for monitoring dashboard');
    analytics.trackError(testError, { component: 'dashboard', operation: 'test' });
    alerting.trackError(testError, { component: 'dashboard' });
    
    setErrorReport(analytics.getErrorReport());
    setAlertHistory(alerting.getAlertHistory());
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h2>Production Monitoring Dashboard</h2>
        <div className={styles.dashboardControls}>
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className={styles.toggleButton}
          >
            {isVisible ? 'Hide' : 'Show'} Dashboard
          </button>
          {isVisible && (
            <>
              <button 
                onClick={handleClearStats}
                className={styles.clearButton}
              >
                Clear Stats
              </button>
              <button 
                onClick={handleSimulateError}
                className={styles.testButton}
              >
                Test Error
              </button>
            </>
          )}
        </div>
      </div>

      {isVisible && (
        <div className={styles.dashboardContent}>
          <div className={styles.dashboardGrid}>
            {/* Error Analytics */}
            <div className={styles.dashboardSection}>
              <h3>Error Analytics</h3>
              {errorReport ? (
                <div className={styles.analyticsContent}>
                  <div className={styles.statRow}>
                    <span>Total Errors:</span>
                    <span className={styles.statValue}>{errorReport.totalErrors}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span>Unique Errors:</span>
                    <span className={styles.statValue}>{errorReport.uniqueErrors}</span>
                  </div>
                  
                  <div className={styles.severityBreakdown}>
                    <h4>Severity Breakdown</h4>
                    {Object.entries(errorReport.severityBreakdown).map(([severity, count]) => (
                      <div key={severity} className={styles.severityItem}>
                        <span className={styles.severityLabel}>{severity}:</span>
                        <span className={styles.severityCount}>{String(count)}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.topErrors}>
                    <h4>Top Errors</h4>
                    {errorReport.topErrors.slice(0, 5).map((error: any, index: number) => (
                      <div key={index} className={styles.errorItem}>
                        <div className={styles.errorMessage}>{error.error}</div>
                        <div className={styles.errorStats}>
                          <span className={styles.errorCount}>{error.count}</span>
                          <span className={styles.errorSeverity}>{error.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No error data available</p>
              )}
            </div>

            {/* Alert History */}
            <div className={styles.dashboardSection}>
              <h3>Alert History</h3>
              <div className={styles.alertHistory}>
                {alertHistory.length > 0 ? (
                  alertHistory.slice(-10).reverse().map((alert, index) => (
                    <div key={index} className={styles.alertItem}>
                      <div className={styles.alertHeader}>
                        <span className={styles.alertType}>{alert.type}</span>
                        <span className={styles.alertTime}>
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={styles.alertMessage}>{alert.message}</div>
                      {alert.data && (
                        <details className={styles.alertDetails}>
                          <summary>Details</summary>
                          <pre className={styles.alertData}>
                            {JSON.stringify(alert.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No alerts in history</p>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className={styles.dashboardSection}>
              <h3>System Health</h3>
              <div className={styles.healthContent}>
                <div className={styles.healthItem}>
                  <span>Environment:</span>
                  <span className={styles.healthValue}>{process.env.NODE_ENV}</span>
                </div>
                <div className={styles.healthItem}>
                  <span>Build Time:</span>
                  <span className={styles.healthValue}>
                    {process.env.NEXT_PUBLIC_BUILD_TIME || 'Unknown'}
                  </span>
                </div>
                <div className={styles.healthItem}>
                  <span>Version:</span>
                  <span className={styles.healthValue}>
                    {process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}
                  </span>
                </div>
                <div className={styles.healthItem}>
                  <span>Memory Usage:</span>
                  <span className={styles.healthValue}>
                    {typeof window !== 'undefined' && 'memory' in performance
                      ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductionMonitoringDashboard; 