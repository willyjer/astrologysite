import { useRef, useState, useEffect } from 'react';

/**
 * Web Worker utilities for AI processing
 * Handles communication between main thread and AI processing worker
 */

export type WorkerMessage = {
  type: string;
  data: any;
};

export type WorkerResponse = {
  type: string;
  data: any;
};

export const MESSAGE_TYPES = {
  GENERATE_READINGS: 'GENERATE_READINGS',
  READING_COMPLETE: 'READING_COMPLETE',
  ALL_READINGS_COMPLETE: 'ALL_READINGS_COMPLETE',
  ERROR: 'ERROR',
  PROGRESS_UPDATE: 'PROGRESS_UPDATE',
  WORKER_READY: 'WORKER_READY',
} as const;

export type MessageType = keyof typeof MESSAGE_TYPES;

/**
 * Web Worker manager for AI processing
 */
export class AIWorkerManager {
  private worker: Worker | null = null;
  private isReady = false;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  /**
   * Initialize the worker
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker('/workers/aiProcessor.worker.js');
        
        // Handle worker messages
        this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          const { type, data } = event.data;
          
          if (type === MESSAGE_TYPES.WORKER_READY) {
            this.isReady = true;
            resolve();
            return;
          }
          
          // Call registered handlers
          const handler = this.messageHandlers.get(type);
          if (handler) {
            handler(data);
          }
        };
        
        // Handle worker errors
        this.worker.onerror = (error) => {
          console.error('Worker error:', error);
          const handler = this.messageHandlers.get(MESSAGE_TYPES.ERROR);
          if (handler) {
            handler({ error: 'Worker error: ' + error.message });
          }
          reject(error);
        };
        
        // Timeout if worker doesn't initialize
        setTimeout(() => {
          if (!this.isReady) {
            reject(new Error('Worker initialization timeout'));
          }
        }, 5000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Register a message handler
   */
  onMessage(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Send a message to the worker
   */
  postMessage(type: string, data: any): void {
    if (!this.worker || !this.isReady) {
      throw new Error('Worker not initialized');
    }
    
    this.worker.postMessage({ type, data });
  }

  /**
   * Generate readings using the worker
   */
  generateReadings(selectedReadings: any[], chartData: any): void {
    this.postMessage(MESSAGE_TYPES.GENERATE_READINGS, {
      selectedReadings,
      chartData,
    });
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.messageHandlers.clear();
    }
  }

  /**
   * Check if worker is ready
   */
  isWorkerReady(): boolean {
    return this.isReady;
  }
}

/**
 * Hook to manage AI worker
 */
export function useAIWorker() {
  const workerRef = useRef<AIWorkerManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize worker on mount
  useEffect(() => {
    const initWorker = async () => {
      try {
        if (!workerRef.current) {
          workerRef.current = new AIWorkerManager();
          await workerRef.current.initialize();
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize AI worker:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize worker');
      }
    };

    initWorker();

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return {
    worker: workerRef.current,
    isInitialized,
    error,
  };
}