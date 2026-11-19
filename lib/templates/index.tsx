import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { MedinaCafeTemplate } from './MedinaCafeTemplate';
import { MoroccanFineDiningTemplate } from './MoroccanFineDiningTemplate';
import { ModernMoroccanGardenTemplate } from './ModernMoroccanGardenTemplate';
import { TemplateFromConfig } from './TemplateFromConfig';
import { TEMPLATE_CONFIGS, getTemplateConfig } from './config';
import { TemplateType, Menu } from '../types/menu';
import React from 'react';

/** Rendering registry: six original components are preserved while new designs
 * can ship as configuration alone via TemplateFromConfig. */
export const templates: Record<TemplateType, React.FC<{ menu: Menu }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  'medina-cafe': MedinaCafeTemplate,
  'moroccan-fine-dining': MoroccanFineDiningTemplate,
  'modern-moroccan-garden': ModernMoroccanGardenTemplate,
  'atlas-simple': (props) => <TemplateFromConfig {...props} config={getTemplateConfig('atlas-simple')} />,
};

/** Gallery metadata is sourced from the template configuration, not hardcoded
 * in the selector. Categories other than Moroccan render in "More layouts" for
 * backwards compatibility with the existing sample-menu flow. */
export const templateInfo = Object.fromEntries(
  Object.values(TEMPLATE_CONFIGS).map((config) => [
    config.id,
    {
      name: config.name,
      description: config.description,
      preview: config.preview,
      category: config.category === 'Moroccan' ? 'Moroccan' : 'Original',
    },
  ]),
) as Record<TemplateType, { name: string; description: string; preview: string; category: string }>;

export function getTemplate(templateType: TemplateType) {
  return templates[templateType] || ClassicTemplate;
}

export { TEMPLATE_CONFIGS, getTemplateConfig } from './config';
export type { TemplateConfig, MenuOutputFormat } from './config';
export { TemplateFromConfig } from './TemplateFromConfig';
