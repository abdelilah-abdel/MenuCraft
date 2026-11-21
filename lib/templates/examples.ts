import type { Menu } from '../types/menu';
import { getTemplateConfig } from './config';
import type { TemplateRegistry } from './registry';
import { createSampleSections } from './sampleContent';

/** Examples never read owner data and never share mutable content with an editor. */
export function createTemplateExample(template: string, registry?: TemplateRegistry): Menu {
  const config = getTemplateConfig(template, registry);
  return {
    id: `example-${template}`, template: config.id as Menu['template'],
    restaurantName: config.example.restaurantName, description: config.example.description,
    originalLanguage: 'en', sections: createSampleSections(config.example.source, 'en'),
    design: { appearance: { inheritTemplate: true } },
    customization: { primaryColor: config.theme.primaryColor, secondaryColor: config.theme.secondaryColor, fontFamily: config.theme.bodyFont, showImages: true, showPrices: true, showDescriptions: true },
    createdAt: '2026-11-18T00:00:00.000Z', updatedAt: '2026-11-18T00:00:00.000Z',
  };
}
