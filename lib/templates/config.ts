import type { TemplateType } from '../types/menu';

/** Formats a template is designed and tested for (idea.md §4.1). */
export type MenuOutputFormat =
  | 'A4'
  | 'A5'
  | 'A3'
  | 'BOOKLET'
  | 'WEB'
  | 'MOBILE'
  | 'TV_HORIZONTAL'
  | 'TV_VERTICAL'
  | 'TABLET'
  | 'TABLE_TENT';

export interface TemplateThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  inkColor: string;
  headingFont: string;
  bodyFont: string;
}

export type TemplateLayoutKind =
  | 'editorial'   // centered header, ruled item rows
  | 'cards'       // bold dish cards, optional images
  | 'minimal'     // sparse list, maximum whitespace
  | 'banded'      // full-width brand band, compact lists
  | 'garden';     // two-column photography-forward dishes

export interface TemplateLayoutConfig {
  kind: TemplateLayoutKind;
  columns: 1 | 2;
  imageStyle: 'none' | 'top-band' | 'cards' | 'row-thumbs';
  showSectionRules: boolean;
  showPricesWithLeaders: boolean;
  cornerRadius: 0 | 4 | 8 | 16;
}

/** Where the rendered output comes from. Legacy components are kept intact
 * while all future templates can be written as data configurations only. */
export interface TemplateConfig {
  id: TemplateType;
  name: string;
  category: 'Moroccan' | 'Fine dining' | 'Café' | 'Original';
  description: string;
  preview: string;
  formats: MenuOutputFormat[];
  renderer: 'legacy' | 'configurable';
  theme: TemplateThemeConfig;
  layout: TemplateLayoutConfig;
}

const legacyTheme = (
  primaryColor = '#17140F',
  backgroundColor = '#FAF7F0',
  headingFont = 'Georgia, serif',
  bodyFont = 'system-ui, sans-serif',
): TemplateThemeConfig => ({
  primaryColor,
  secondaryColor: primaryColor,
  backgroundColor,
  inkColor: primaryColor,
  headingFont,
  bodyFont,
});

export const TEMPLATE_CONFIGS: Record<TemplateType, TemplateConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    category: 'Original',
    description: 'Traditional elegant menu with a centered header and restrained spacing.',
    preview: 'Timeless serif design with classic centered styling',
    formats: ['A4', 'A5', 'WEB', 'MOBILE'],
    renderer: 'legacy',
    theme: legacyTheme(),
    layout: {
      kind: 'editorial', columns: 1, imageStyle: 'row-thumbs',
      showSectionRules: true, showPricesWithLeaders: true, cornerRadius: 0,
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    category: 'Original',
    description: 'Contemporary dark theme with bold typography and card-based layout.',
    preview: 'Sleek dishes, confident contrast, and a dark restaurant feel',
    formats: ['WEB', 'MOBILE', 'TV_HORIZONTAL'],
    renderer: 'legacy',
    theme: legacyTheme('#F4F1E8', '#141414', 'system-ui, sans-serif'),
    layout: {
      kind: 'cards', columns: 2, imageStyle: 'cards',
      showSectionRules: false, showPricesWithLeaders: false, cornerRadius: 8,
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    category: 'Original',
    description: 'Clean and simple design with the content doing all the talking.',
    preview: 'Minimalist spacing, quiet type, and subtle grayscale accents',
    formats: ['A4', 'A5', 'WEB', 'MOBILE'],
    renderer: 'legacy',
    theme: legacyTheme('#242424', '#FFFFFF', 'system-ui, sans-serif'),
    layout: {
      kind: 'minimal', columns: 1, imageStyle: 'none',
      showSectionRules: false, showPricesWithLeaders: false, cornerRadius: 0,
    },
  },
  'medina-cafe': {
    id: 'medina-cafe',
    name: 'Medina Café',
    category: 'Moroccan',
    description: 'A warm, ornamental all-day café menu with generous photography.',
    preview: 'Breakfast, tea time, mains, sweets, and Moroccan drinks',
    formats: ['A4', 'A5', 'WEB', 'MOBILE'],
    renderer: 'legacy',
    theme: legacyTheme('#8B4B2B', '#F5F0E3', 'Georgia, serif'),
    layout: {
      kind: 'editorial',
      columns: 1, imageStyle: 'top-band',
      showSectionRules: true, showPricesWithLeaders: false, cornerRadius: 8,
    },
  },
  'moroccan-fine-dining': {
    id: 'moroccan-fine-dining',
    name: 'Moroccan Fine Dining',
    category: 'Moroccan',
    description: 'An editorial, print-inspired layout for detailed dishes and set courses.',
    preview: 'Rich dish descriptions, elegant rules, and fine-dining photography',
    formats: ['A4', 'A5', 'A3', 'BOOKLET', 'WEB'],
    renderer: 'legacy',
    theme: legacyTheme('#332323', '#F7F4EE', 'Georgia, serif'),
    layout: {
      kind: 'editorial', columns: 2, imageStyle: 'top-band',
      showSectionRules: true, showPricesWithLeaders: true, cornerRadius: 0,
    },
  },
  'modern-moroccan-garden': {
    id: 'modern-moroccan-garden',
    name: 'Modern Moroccan Garden',
    category: 'Moroccan',
    description: 'A fresh, photo-forward layout for contemporary Moroccan restaurants.',
    preview: 'Local favorites, leafy color, shared plates, and drinks',
    formats: ['WEB', 'MOBILE', 'TV_HORIZONTAL', 'TV_VERTICAL', 'TABLET'],
    renderer: 'legacy',
    theme: legacyTheme('#526D49', '#F7F8F1', 'system-ui, sans-serif'),
    layout: {
      kind: 'garden', columns: 2, imageStyle: 'cards',
      showSectionRules: false, showPricesWithLeaders: false, cornerRadius: 16,
    },
  },
  'atlas-simple': {
    id: 'atlas-simple',
    name: 'Atlas Simple',
    category: 'Moroccan',
    description: 'A quiet, fully data-configured Moroccan editorial menu for kitchens that need clarity.',
    preview: 'Ruled item rows, terracotta section marks, and no photography required',
    formats: ['A4', 'A5', 'WEB', 'MOBILE'],
    renderer: 'configurable',
    theme: {
      primaryColor: '#873E25', secondaryColor: '#21484B',
      backgroundColor: '#F8F3E9', inkColor: '#25241F', headingFont: 'Georgia, serif',
      bodyFont: 'system-ui, sans-serif',
    },
    layout: {
      kind: 'editorial', columns: 1, imageStyle: 'none',
      showSectionRules: true, showPricesWithLeaders: true, cornerRadius: 0,
    },
  },
};

export function getTemplateConfig(template: TemplateType): TemplateConfig {
  return TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS.classic;
}
