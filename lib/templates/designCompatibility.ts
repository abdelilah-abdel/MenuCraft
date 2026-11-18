import type { Menu } from '../types/menu';
import type { TemplateConfig } from './registry';
import { resolveLayout, type ComponentStyles } from '../menuDesign';

/** Unsupported choices stay saved so returning to a compatible preset restores them. */
export function getDesignCompatibility(menu: Menu, config: TemplateConfig): string[] {
  const notes: string[] = [];
  for (const [kind, value] of Object.entries(menu.design?.componentStyles || {})) {
    if (!(config.componentStyles?.[kind as keyof ComponentStyles] as readonly string[] | undefined)?.includes(value)) {
      notes.push(`${kind === 'headings' ? 'Section headings' : kind === 'dishes' ? 'Dish treatment' : 'Price treatment'}: ${value} is saved; this design uses its signature treatment.`);
    }
  }
  const layout = menu.design?.layout;
  if (layout) {
    if (!config.layoutOptions) notes.push('Column, spacing, alignment and section placement choices are saved; this design uses its signature layout.');
    else {
      for (const key of ['columns', 'spacing', 'alignment'] as const) {
        const value = layout[key];
        if (value !== undefined && !(config.layoutOptions[key] as readonly unknown[]).includes(value)) notes.push(`Layout ${key}: ${value} is saved; this design uses its supported default.`);
      }
      const resolved = resolveLayout(menu, config);
      if (Object.values(layout.sectionRegions || {}).some(region => !resolved.regions.includes(region))) notes.push('Some section columns are unavailable here. Those placements stay saved; affected sections flow automatically.');
    }
  }
  const dishPlacements = new Set(menu.sections.flatMap(section => section.items.map(item => item.image ? item.imagePresentation?.placement : undefined)));
  for (const placement of dishPlacements) {
    if (placement && !(config.dishPhotoPlacements as readonly string[]).includes(placement)) notes.push(`Dish photos: ${placement} placement is saved; this design uses ${config.dishPhotoPlacements[0]}.`);
  }
  const sectionPlacements = new Set(menu.sections.map(section => section.image ? section.imagePresentation?.placement : undefined));
  for (const placement of sectionPlacements) {
    if (placement && !(config.sectionPhotoPlacements as readonly string[]).includes(placement)) notes.push(`Section photos: ${placement} placement is saved; this design uses ${config.sectionPhotoPlacements[0]}.`);
  }
  return notes;
}
