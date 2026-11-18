import type { MenuLanguage, TemplateType } from '../types/menu';
import { getTemplateConfig } from './config';
import { createSampleSections } from './sampleContent';

export type SampleTemplateType = TemplateType;
export function createSampleMenuSections(template: SampleTemplateType, language: MenuLanguage) {
  return createSampleSections(getTemplateConfig(template).example.source, language);
}
