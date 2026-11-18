import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { MedinaCafeTemplate } from './MedinaCafeTemplate';
import { MoroccanFineDiningTemplate } from './MoroccanFineDiningTemplate';
import { ModernMoroccanGardenTemplate } from './ModernMoroccanGardenTemplate';
import { TemplateFromConfig } from './TemplateFromConfig';
import { TEMPLATE_CONFIGS, getTemplateConfig, isTemplateId } from './config';
import type { LegacyRendererId, TemplateRegistry } from './registry';
import { TemplateType, Menu } from '../types/menu';
import React from 'react';

/** Only legacy adapters need component registration; new presets are data. */
const legacyRenderers: Record<LegacyRendererId, React.FC<{ menu: Menu }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  'medina-cafe': MedinaCafeTemplate,
  'moroccan-fine-dining': MoroccanFineDiningTemplate,
  'modern-moroccan-garden': ModernMoroccanGardenTemplate,
};

/** Gallery metadata is derived from the same validated definitions. */
export const templateInfo = Object.fromEntries(
  Object.values(TEMPLATE_CONFIGS).map((config) => [
    config.id,
    {
      name: config.name,
      description: config.description,
      preview: config.preview,
      category: config.category,
    },
  ])
) as Record<TemplateType, { name: string; description: string; preview: string; category: string }>;

export function getTemplate(
  templateType: string,
  registry: TemplateRegistry = TEMPLATE_CONFIGS
): React.FC<{ menu: Menu }> {
  const definition = getTemplateConfig(templateType, registry);
  if (definition.renderer === 'legacy') return legacyRenderers[definition.legacyRenderer];
  return function ConfiguredTemplate({ menu }) {
    return <TemplateFromConfig menu={menu} config={definition} />;
  };
}

export const templates = Object.fromEntries(
  Object.values(TEMPLATE_CONFIGS).map((definition) => [definition.id, getTemplate(definition.id)])
) as Record<TemplateType, React.FC<{ menu: Menu }>>;

export function MenuTemplate({ menu }: { menu: Menu }) {
  if (!isTemplateId(menu.template)) {
    return (
      <section role="alert" className="p-6 text-center">
        <h2 className="text-xl font-semibold">Menu design unavailable</h2>
        <p>This menu design is unavailable. Please try again later.</p>
      </section>
    );
  }
  const Template = templates[menu.template];
  return <Template menu={menu} />;
}

export { TEMPLATE_CONFIGS, getTemplateConfig } from './config';
export type { TemplateConfig, MenuOutputFormat } from './config';
export { TemplateFromConfig } from './TemplateFromConfig';
