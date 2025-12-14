import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { TemplateType } from '../types/menu';

export const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
} as const;

export const templateInfo = {
  classic: {
    name: 'Classic',
    description: 'Traditional elegant menu with centered layout',
    preview: 'Timeless design with serif fonts and classic styling',
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary dark theme with bold typography',
    preview: 'Sleek card-based layout with gradient headers',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple design with focus on content',
    preview: 'Minimalist approach with subtle grayscale aesthetics',
  },
} as const;

export function getTemplate(templateType: TemplateType) {
  return templates[templateType];
}

export { ClassicTemplate, ModernTemplate, MinimalTemplate };
