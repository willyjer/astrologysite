import { Reading } from '../types';
import { getAllReadingConfigs } from '../../../lib/readings/config';

// Get readings from the centralized config
const readingConfigs = getAllReadingConfigs();

export const readings: Reading[] = readingConfigs.map(config => ({
  id: config.id,
  name: config.name,
  promise: config.promise,
  category: config.category,
  length: config.length,
  delivery: config.delivery,
  icon: config.icon,
}));
