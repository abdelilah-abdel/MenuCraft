import { COMPONENT_STYLES, LAYOUT_REGIONS, LAYOUT_SPACING, LAYOUT_ALIGNMENT, type LayoutCapabilities, type ComponentCapabilities } from '../menuDesign';
export const LEGACY_RENDERER_IDS = [
  'classic',
  'modern',
  'minimal',
  'medina-cafe',
  'moroccan-fine-dining',
  'modern-moroccan-garden',
] as const;
export type LegacyRendererId = (typeof LEGACY_RENDERER_IDS)[number];

/** Output intentions; actual format qualification is recorded separately. */
const OUTPUT_FORMATS = [
  'A4',
  'A5',
  'A3',
  'BOOKLET',
  'WEB',
  'MOBILE',
  'TV_HORIZONTAL',
  'TV_VERTICAL',
  'TABLET',
  'TABLE_TENT',
] as const;
export type MenuOutputFormat = (typeof OUTPUT_FORMATS)[number];
const CATEGORIES = ['Moroccan', 'Fine dining', 'Café', 'Original'] as const;
const LAYOUT_KINDS = ['editorial', 'cards', 'minimal', 'banded', 'garden'] as const;
const IMAGE_STYLES = ['none', 'top-band', 'cards', 'row-thumbs'] as const;
const CORNER_RADII = [0, 4, 8, 16] as const;

export interface TemplateThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  inkColor: string;
  headingFont: string;
  bodyFont: string;
}

export type TemplateLayoutKind = (typeof LAYOUT_KINDS)[number];
export interface TemplateLayoutConfig {
  kind: TemplateLayoutKind;
  columns: 1 | 2;
  imageStyle: (typeof IMAGE_STYLES)[number];
  showSectionRules: boolean;
  showPricesWithLeaders: boolean;
  cornerRadius: (typeof CORNER_RADII)[number];
}

export const TEMPLATE_BLOCK_TYPES = ['restaurant-header', 'menu-sections'] as const;
export type TemplateBlockType = (typeof TEMPLATE_BLOCK_TYPES)[number];

export const DISH_PHOTO_PLACEMENTS = ['thumbnail', 'card-top', 'text-side'] as const;

interface TemplateMetadata {
  layoutOptions?: LayoutCapabilities;
  componentStyles?: ComponentCapabilities;
  sectionPhotoPlacements: readonly ('banner' | 'heading-side')[];
  headerImagePlacements: { defaultLogoSize: number; logo: readonly ['above']; banner: readonly ('above' | 'below')[] };
  dishPhotoPlacements: readonly (typeof DISH_PHOTO_PLACEMENTS)[number][];
  id: string;
  name: string;
  category: (typeof CATEGORIES)[number];
  description: string;
  preview: string;
  formats: readonly MenuOutputFormat[];
  theme: TemplateThemeConfig;
  layout: TemplateLayoutConfig;
}

export type TemplateConfig = TemplateMetadata &
  (
    | { renderer: 'legacy'; legacyRenderer: LegacyRendererId; composition?: never }
    | { renderer: 'configurable'; composition: readonly TemplateBlockType[]; legacyRenderer?: never }
  );
export type TemplateRegistry = Readonly<Record<string, TemplateConfig>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateDefinition(id: string, value: unknown): asserts value is TemplateConfig {
  const check = (condition: unknown, message: string): void => {
    if (!condition) throw new Error(`Invalid template "${id}": ${message}.`);
  };
  if (!isRecord(value)) throw new Error(`Invalid template "${id}": expected a definition.`);
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && value.id === id, 'ID must match its registry key');
  for (const field of ['name', 'description', 'preview']) {
    check(
      typeof value[field] === 'string' && value[field].trim().length > 0,
      `${field} must be non-empty text`
    );
  }
  check(
    CATEGORIES.some((category) => category === value.category),
    'unknown category'
  );
  check(
    Array.isArray(value.formats) &&
      value.formats.length > 0 &&
      value.formats.every((format: unknown) => OUTPUT_FORMATS.some((allowed) => allowed === format)) &&
      new Set(value.formats).size === value.formats.length,
    'unknown, empty, or repeated output formats'
  );
  if (!isRecord(value.theme) || !isRecord(value.layout)) {
    throw new Error(`Invalid template "${id}": theme and layout are required.`);
  }
  check(Array.isArray(value.dishPhotoPlacements) && value.dishPhotoPlacements.length > 0 && value.dishPhotoPlacements.every((placement: unknown) => DISH_PHOTO_PLACEMENTS.some(allowed => allowed === placement)), 'invalid dish photo capabilities');
  check(isRecord(value.headerImagePlacements) && Array.isArray(value.headerImagePlacements.logo) && value.headerImagePlacements.logo.length === 1 && value.headerImagePlacements.logo[0] === 'above' && Array.isArray(value.headerImagePlacements.banner) && value.headerImagePlacements.banner.length > 0 && value.headerImagePlacements.banner.every((placement: unknown) => placement === 'above' || placement === 'below'), 'invalid header image capabilities');
  check(Array.isArray(value.sectionPhotoPlacements) && value.sectionPhotoPlacements.length > 0 && value.sectionPhotoPlacements.every((placement: unknown) => placement === 'banner' || placement === 'heading-side'), 'invalid section photo capabilities');
  if (value.componentStyles !== undefined) {
    check(isRecord(value.componentStyles), 'invalid component styles');
    const capabilities = value.componentStyles as Record<string, unknown>;
    for (const [key, choices] of Object.entries(COMPONENT_STYLES)) {
      check(Array.isArray(capabilities[key]) && (capabilities[key] as unknown[]).length > 0 && (capabilities[key] as unknown[]).every(style => (choices as readonly unknown[]).includes(style)), `invalid ${key} styles`);
    }
  }
  if (value.layoutOptions !== undefined) {
    check(isRecord(value.layoutOptions), 'invalid layout capabilities');
    const options = value.layoutOptions as Record<string, unknown>;
    check(options.header === 'full-width', 'header must stay full width');
    for (const [key, choices] of Object.entries({ columns: [1, 2, 3], regions: LAYOUT_REGIONS, spacing: LAYOUT_SPACING, alignment: LAYOUT_ALIGNMENT })) {
      check(Array.isArray(options[key]) && (options[key] as unknown[]).length > 0 && (options[key] as unknown[]).every(choice => (choices as readonly unknown[]).includes(choice)), `invalid layout ${key}`);
    }
    const maxColumns = Math.max(...options.columns as number[]);
    check((options.regions as unknown[]).length >= maxColumns && LAYOUT_REGIONS.slice(0, maxColumns).every(region => (options.regions as unknown[]).includes(region)), 'missing column regions');
  }
  const theme = value.theme;
  const layout = value.layout;
  for (const field of [
    'primaryColor',
    'secondaryColor',
    'backgroundColor',
    'inkColor',
    'headingFont',
    'bodyFont',
  ]) {
    check(
      typeof theme[field] === 'string' && theme[field].trim().length > 0,
      `theme.${field} is required`
    );
  }
  check(
    LAYOUT_KINDS.some((kind) => kind === layout.kind),
    'unknown layout kind'
  );
  check(layout.columns === 1 || layout.columns === 2, 'unsupported column count');
  check(
    IMAGE_STYLES.some((style) => style === layout.imageStyle),
    'unknown image style'
  );
  check(
    CORNER_RADII.some((radius) => radius === layout.cornerRadius),
    'unsupported corner radius'
  );
  check(
    typeof layout.showSectionRules === 'boolean' &&
      typeof layout.showPricesWithLeaders === 'boolean',
    'layout visibility must be boolean'
  );
  if (value.renderer === 'legacy') {
    check(
      LEGACY_RENDERER_IDS.some((renderer) => renderer === value.legacyRenderer),
      'unknown legacy renderer reference'
    );
    check(value.composition === undefined, 'a legacy renderer cannot declare a block composition');
  } else if (value.renderer === 'configurable') {
    check(value.legacyRenderer === undefined, 'a configurable template cannot declare a legacy renderer');
    const composition = value.composition;
    check(
      Array.isArray(composition) &&
        composition.length === TEMPLATE_BLOCK_TYPES.length &&
        TEMPLATE_BLOCK_TYPES.every(
          (block) => composition.filter((entry: unknown) => entry === block).length === 1
        ),
      'composition must reference each supported block exactly once'
    );
  } else {
    throw new Error(`Invalid template "${id}": unknown renderer.`);
  }
}

/** Validate the authoring boundary once, before definitions reach UI or storage. */
export function defineTemplateRegistry<const T extends Record<string, TemplateConfig>>(
  definitions: T
): Readonly<T> {
  if (!isRecord(definitions) || Object.keys(definitions).length === 0)
    throw new Error('A template registry cannot be empty.');
  for (const [id, definition] of Object.entries(definitions)) validateDefinition(id, definition);
  return Object.freeze(definitions);
}

export function getTemplateOptions<T extends TemplateRegistry>(registry: T): T[keyof T][] {
  return Object.values(registry) as T[keyof T][];
}
