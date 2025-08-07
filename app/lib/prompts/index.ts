import { coreSelfPrompt } from './core-self';
import { editorCoreSelfPrompt } from './editor-core-self';
import { chartRulerPrompt } from './chart-ruler';
import { editorChartRulerPrompt } from './editor-chart-ruler';
import { innerWarriorPrompt } from './inner-warrior';
import { editorInnerWarriorPrompt } from './editor-inner-warrior';
import { selfBeliefPrompt } from './self-belief';
import { editorSelfBeliefPrompt } from './editor-self-belief';

export type PromptMap = {
  [key: string]: string;
};

export const prompts: PromptMap = {
  'core-self': coreSelfPrompt,
  'editor-core-self': editorCoreSelfPrompt,
  'chart-ruler': chartRulerPrompt,
  'editor-chart-ruler': editorChartRulerPrompt,
  'inner-warrior': innerWarriorPrompt,
  'editor-inner-warrior': editorInnerWarriorPrompt,
  'self-belief': selfBeliefPrompt,
  'editor-self-belief': editorSelfBeliefPrompt,
  'self-belief-inner-light': selfBeliefPrompt,
  'editor-self-belief-inner-light': editorSelfBeliefPrompt,
};

export function getPrompt(readingId: string): string {
  const prompt = prompts[readingId];
  if (prompt) {
    return prompt;
  }
  return 'Write an astrology reading based on this data.';
}

export function getAvailablePrompts(): string[] {
  return Object.keys(prompts);
}
