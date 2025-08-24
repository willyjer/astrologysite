import type { IReadingExtractor, ReadingRegistry as IReadingRegistry } from './types';

export class ReadingRegistry implements IReadingRegistry {
  private static instance: ReadingRegistry;
  private extractors = new Map<string, IReadingExtractor>();

  private constructor() {}

  static getInstance(): ReadingRegistry {
    if (!ReadingRegistry.instance) {
      ReadingRegistry.instance = new ReadingRegistry();
    }
    return ReadingRegistry.instance;
  }

  register(extractor: IReadingExtractor): void {
    this.extractors.set(extractor.readingId, extractor);
  }

  get(readingId: string): IReadingExtractor | undefined {
    return this.extractors.get(readingId);
  }

  getAll(): IReadingExtractor[] {
    return Array.from(this.extractors.values());
  }

  getAvailableReadings(): string[] {
    return Array.from(this.extractors.keys());
  }

  // Helper method to check if a reading is available
  hasReading(readingId: string): boolean {
    return this.extractors.has(readingId);
  }
}

// Export singleton instance
export const readingRegistry = ReadingRegistry.getInstance();
