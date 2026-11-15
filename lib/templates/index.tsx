import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { MedinaCafeTemplate } from './MedinaCafeTemplate';
import { MoroccanFineDiningTemplate } from './MoroccanFineDiningTemplate';
import { ModernMoroccanGardenTemplate } from './ModernMoroccanGardenTemplate';
import { TemplateType } from '../types/menu';
import { Menu } from '../types/menu';
import React from 'react';

export const templates: Record<TemplateType, React.FC<{ menu: Menu }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  'medina-cafe': MedinaCafeTemplate,
  'moroccan-fine-dining': MoroccanFineDiningTemplate,
  'modern-moroccan-garden': ModernMoroccanGardenTemplate,
} as const;

export const templateInfo: Record<TemplateType, { name: string; description: string; preview: string; category: string }> = {
  classic: {
    name: 'Classic',
    description: 'Traditional elegant menu with centered layout',
    preview: 'Timeless design with serif fonts and classic styling',
    category: 'Original',
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary dark theme with bold typography',
    preview: 'Sleek card-based layout with gradient headers',
    category: 'Original',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple design with focus on content',
    preview: 'Minimalist approach with subtle grayscale aesthetics',
    category: 'Original',
  },
  'medina-cafe': {
    name: 'Medina Café',
    description: 'A warm, all-day café menu with ornamental section framing.',
    preview: 'Breakfast, tea time, mains, sweets, and drinks',
    category: 'Moroccan',
  },
  'moroccan-fine-dining': {
    name: 'Moroccan Fine Dining',
    description: 'An editorial, print-inspired layout for detailed dishes and special courses.',
    preview: 'Elegant typography, rich descriptions, and refined dish photography',
    category: 'Moroccan',
  },
  'modern-moroccan-garden': {
    name: 'Modern Moroccan Garden',
    description: 'A fresh, photo-forward layout for contemporary Moroccan restaurants.',
    preview: 'Large dish cards, local favorites, sides, and drinks',
    category: 'Moroccan',
  },
} as const;

export function getTemplate(templateType: TemplateType) {
  return templates[templateType] || ClassicTemplate;
}

export { ClassicTemplate, ModernTemplate, MinimalTemplate, MedinaCafeTemplate, MoroccanFineDiningTemplate, ModernMoroccanGardenTemplate };
