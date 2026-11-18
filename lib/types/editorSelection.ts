import type { Menu } from './menu';

export type EditorSelection =
  | { kind: 'restaurant'; focus?: 'image' | 'banner' }
  | { kind: 'section'; sectionId: string; focus?: 'section-image' }
  | { kind: 'subsection'; sectionId: string; subsectionId: string }
  | { kind: 'item'; sectionId: string; itemId: string; focus?: 'image' };

export function selectionKey(selection: EditorSelection): string {
  switch (selection.kind) {
    case 'restaurant':
      return JSON.stringify(['restaurant']);
    case 'section':
      return JSON.stringify(['section', selection.sectionId]);
    case 'subsection':
      return JSON.stringify(['subsection', selection.sectionId, selection.subsectionId]);
    case 'item':
      return JSON.stringify(['item', selection.sectionId, selection.itemId]);
  }
}

export function selectionExists(menu: Menu, selection: EditorSelection): boolean {
  if (selection.kind === 'restaurant') return true;
  const section = menu.sections.find((entry) => entry.id === selection.sectionId);
  if (!section) return false;
  if (selection.kind === 'section') return true;
  return selection.kind === 'item'
    ? section.items.some((entry) => entry.id === selection.itemId)
    : Boolean(section.subsections?.some((entry) => entry.id === selection.subsectionId));
}
