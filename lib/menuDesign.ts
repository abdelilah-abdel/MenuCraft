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
export interface MenuDesign { appearance?: MenuAppearance }

export const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
export const isMenuFont = (value: unknown): value is string => MENU_FONTS.some(font => font.value === value);

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function isMenuDesign(value: unknown): value is MenuDesign | undefined {
  if (value === undefined) return true;
  if (!record(value) || Object.keys(value).some(key => key !== 'appearance')) return false;
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
