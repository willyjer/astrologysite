
import { rootsSecurityPrompt } from './roots-security';
import { editorRootsSecurityPrompt } from './editor-roots-security';
import { driveAmbitionPrompt } from './drive-ambition';
import { editorDriveAmbitionPrompt } from './editor-drive-ambition';
import { boundariesProtectionPrompt } from './boundaries-protection';
import { editorBoundariesProtectionPrompt } from './editor-boundaries-protection';
import { loveIntimacyPrompt } from './love-intimacy';
import { editorLoveIntimacyPrompt } from './editor-love-intimacy';
import { mindCommunicationPrompt } from './mind-communication';
import { editorMindCommunicationPrompt } from './editor-mind-communication';
import { selfWorthValuesPrompt } from './self-worth-values';
import { editorSelfWorthValuesPrompt } from './editor-self-worth-values';
import { healingTransformationPrompt } from './healing-transformation';
import { editorHealingTransformationPrompt } from './editor-healing-transformation';
import { meaningSpiritualGrowthPrompt } from './meaning-spiritual-growth';
import { editorMeaningSpiritualGrowthPrompt } from './editor-meaning-spiritual-growth';

export type PromptMap = {
  [key: string]: string;
};

export const prompts: PromptMap = {
  'roots-security': rootsSecurityPrompt,
  'editor-roots-security': editorRootsSecurityPrompt,
  'drive-ambition': driveAmbitionPrompt,
  'editor-drive-ambition': editorDriveAmbitionPrompt,
  'boundaries-protection': boundariesProtectionPrompt,
  'editor-boundaries-protection': editorBoundariesProtectionPrompt,
  'love-intimacy': loveIntimacyPrompt,
  'editor-love-intimacy': editorLoveIntimacyPrompt,
  'mind-communication': mindCommunicationPrompt,
  'editor-mind-communication': editorMindCommunicationPrompt,
  'self-worth-values': selfWorthValuesPrompt,
  'editor-self-worth-values': editorSelfWorthValuesPrompt,
  'healing-transformation': healingTransformationPrompt,
  'editor-healing-transformation': editorHealingTransformationPrompt,
  'meaning-spiritual-growth': meaningSpiritualGrowthPrompt,
  'editor-meaning-spiritual-growth': editorMeaningSpiritualGrowthPrompt,
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
