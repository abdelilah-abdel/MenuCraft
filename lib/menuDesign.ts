import type { Menu } from './types/menu';
import type { TemplateConfig } from './templates/registry';

export const MENU_FONTS = [
  { value: 'Georgia, serif', label: 'Georgia · serif' },
  { value: 'system-ui, sans-serif', label: 'System · sans serif' },
  { value: 'Arial, sans-serif', label: 'Arial · sans serif' },
  { value: 'Inter, sans-serif', label: 'Inter · sans serif' },
] as const;
export const TEXT_SIZES = ['small', 'medium', 'large'] as const;
export interface MenuAppearance {
  inheritTemplate?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  textSize?: typeof TEXT_SIZES[number];
}
export const COMPONENT_STYLES = { headings: ['ruled', 'plain'], dishes: ['plain', 'outlined'], prices: ['aligned', 'dotted'] } as const;
export type ComponentStyles = { [K in keyof typeof COMPONENT_STYLES]?: typeof COMPONENT_STYLES[K][number] };
export type ComponentCapabilities = { [K in keyof typeof COMPONENT_STYLES]: readonly typeof COMPONENT_STYLES[K][number][] };
export const LAYOUT_REGIONS = ['column-1', 'column-2', 'column-3'] as const;
export const LAYOUT_SPACING = ['compact', 'comfortable', 'airy'] as const;
export const LAYOUT_ALIGNMENT = ['start', 'center'] as const;
export interface MenuLayout {
  columns?: 1 | 2 | 3;
  spacing?: typeof LAYOUT_SPACING[number];
  alignment?: typeof LAYOUT_ALIGNMENT[number];
  sectionRegions?: Record<string, typeof LAYOUT_REGIONS[number]>;
}
export interface LayoutCapabilities {
  columns: readonly (1 | 2 | 3)[];
  regions: readonly typeof LAYOUT_REGIONS[number][];
  spacing: readonly typeof LAYOUT_SPACING[number][];
  alignment: readonly typeof LAYOUT_ALIGNMENT[number][];
  header: 'full-width';
}
export interface MenuDesign { layout?: MenuLayout; appearance?: MenuAppearance; componentStyles?: ComponentStyles }

export const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
export const isMenuFont = (value: unknown): value is string => MENU_FONTS.some(font => font.value === value);

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function isMenuDesign(value: unknown, sectionIds?: readonly string[]): value is MenuDesign | undefined {
  if (value === undefined) return true;
  if (!record(value) || Object.keys(value).some(key => !['appearance', 'componentStyles', 'layout'].includes(key))) return false;
  if (value.layout !== undefined) {
    const layout = value.layout;
    if (!record(layout) || Object.keys(layout).some(key => !['columns', 'spacing', 'alignment', 'sectionRegions'].includes(key))) return false;
    if (layout.columns !== undefined && ![1, 2, 3].includes(layout.columns as number)) return false;
    if (layout.spacing !== undefined && !LAYOUT_SPACING.some(choice => choice === layout.spacing)) return false;
    if (layout.alignment !== undefined && !LAYOUT_ALIGNMENT.some(choice => choice === layout.alignment)) return false;
    if (layout.sectionRegions !== undefined) {
      if (!record(layout.sectionRegions)) return false;
      for (const [id, region] of Object.entries(layout.sectionRegions)) {
        if (sectionIds && !sectionIds.includes(id)) return false;
        if (!(LAYOUT_REGIONS.slice(0, (layout.columns as number | undefined) || 1) as readonly unknown[]).includes(region)) return false;
      }
    }
  }
  if (value.componentStyles !== undefined) {
    if (!record(value.componentStyles)) return false;
    for (const [key, style] of Object.entries(value.componentStyles)) {
      if (!Object.hasOwn(COMPONENT_STYLES, key) || !(COMPONENT_STYLES[key as keyof ComponentStyles] as readonly unknown[]).includes(style)) return false;
    }
  }
  const appearance = value.appearance;
  if (appearance === undefined) return true;
  if (!record(appearance) || Object.keys(appearance).some(key => !['inheritTemplate', 'primaryColor', 'secondaryColor', 'backgroundColor', 'fontFamily', 'textSize'].includes(key))) return false;
  return (appearance.inheritTemplate === undefined || typeof appearance.inheritTemplate === 'boolean') &&
    ['primaryColor', 'secondaryColor', 'backgroundColor'].every(key => appearance[key] === undefined || isColor(appearance[key])) &&
    (appearance.fontFamily === undefined || appearance.fontFamily === 'template' || isMenuFont(appearance.fontFamily)) &&
    (appearance.textSize === undefined || TEXT_SIZES.some(size => size === appearance.textSize));
}

// Keep harmless legacy CSS colors/font stacks, but never emit URLs, declarations or markup.
const legacyColor = (value: string, fallback: string) => /^(#[0-9a-f]{3,8}|[a-z]{3,24}|(?:rgb|hsl)a?\([0-9.,% /+-]+\))$/i.test(value) ? value : fallback;
const legacyFont = (value: string, fallback: string) => /^[a-z0-9 ,"'\-]+$/i.test(value) ? value : fallback;

/** Existing customization fields are explicit owner choices until an explicit reset. */
export function resolveAppearance(menu: Menu, config: TemplateConfig) {
  const appearance = menu.design?.appearance;
  const inherit = appearance?.inheritTemplate;
  return {
    ...config.theme,
    primaryColor: appearance?.primaryColor ?? (inherit ? config.theme.primaryColor : legacyColor(menu.customization.primaryColor, config.theme.primaryColor)),
    secondaryColor: appearance?.secondaryColor ?? (inherit ? config.theme.secondaryColor : legacyColor(menu.customization.secondaryColor, config.theme.secondaryColor)),
    backgroundColor: appearance?.backgroundColor ?? config.theme.backgroundColor,
    bodyFont: appearance?.fontFamily === 'template' ? config.theme.bodyFont : appearance?.fontFamily ?? (inherit ? config.theme.bodyFont : legacyFont(menu.customization.fontFamily, config.theme.bodyFont)),
    headingFont: appearance?.fontFamily === 'template' ? config.theme.headingFont : appearance?.fontFamily ?? (inherit ? config.theme.headingFont : legacyFont(menu.customization.fontFamily, config.theme.bodyFont)),
    textSize: appearance?.textSize ?? 'medium',
  };
}

export function resolveComponentStyles(menu: Menu, config: TemplateConfig): Required<ComponentStyles> {
  const defaults: Required<ComponentStyles> = { headings: config.layout.showSectionRules ? 'ruled' : 'plain', dishes: 'plain', prices: config.layout.showPricesWithLeaders ? 'dotted' : 'aligned' };
  const overrides = menu.design?.componentStyles;
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => {
    const kind = key as keyof ComponentStyles;
    const value = overrides?.[kind];
    return [key, value && (config.componentStyles?.[kind] as readonly string[] | undefined)?.includes(value) ? value : fallback];
  })) as Required<ComponentStyles>;
}

export function resolveLayout(menu: Menu, config: TemplateConfig) {
  const capabilities = config.layoutOptions;
  const requested = menu.design?.layout;
  const columns = requested?.columns && capabilities?.columns.includes(requested.columns) ? requested.columns : config.layout.columns;
  const regions = capabilities?.regions.slice(0, columns) || LAYOUT_REGIONS.slice(0, columns);
  return {
    columns,
    regions,
    spacing: requested?.spacing && capabilities?.spacing.includes(requested.spacing) ? requested.spacing : 'comfortable',
    alignment: requested?.alignment && capabilities?.alignment.includes(requested.alignment) ? requested.alignment : 'start',
    regionFor(sectionId: string, index: number) {
      const assigned = requested?.sectionRegions?.[sectionId];
      return assigned && regions.includes(assigned) ? assigned : regions[index % regions.length];
    },
  };
}

/** Content deletion/sample replacement cleans only references to sections that no longer exist. */
export function pruneLayoutReferences(menu: Menu): Menu {
  const placements = menu.design?.layout?.sectionRegions;
  if (!placements) return menu;
  const valid = new Set(menu.sections.map(section => section.id));
  const entries = Object.entries(placements).filter(([id]) => valid.has(id));
  if (entries.length === Object.keys(placements).length) return menu;
  return { ...menu, design: { ...menu.design, layout: { ...menu.design?.layout, sectionRegions: Object.fromEntries(entries) } } };
}
