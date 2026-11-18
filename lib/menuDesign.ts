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
export interface MenuDesign { appearance?: MenuAppearance; componentStyles?: ComponentStyles }

export const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
export const isMenuFont = (value: unknown): value is string => MENU_FONTS.some(font => font.value === value);

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function isMenuDesign(value: unknown): value is MenuDesign | undefined {
  if (value === undefined) return true;
  if (!record(value) || Object.keys(value).some(key => !['appearance', 'componentStyles'].includes(key))) return false;
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
