import React, { createContext, useContext, useMemo } from 'react';
import type { Menu, MenuItem } from '../types/menu';
import { selectionKey, type EditorSelection } from '../types/editorSelection';

type PreviewContextValue = {
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection) => void;
  itemTargets: Map<MenuItem, Extract<EditorSelection, { kind: 'item' }>>;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

export function PreviewSelectionProvider({
  menu,
  selection,
  onSelect,
  children,
}: {
  menu: Menu;
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection) => void;
  children: React.ReactNode;
}) {
  const itemTargets = useMemo(() => {
    const targets = new Map<MenuItem, Extract<EditorSelection, { kind: 'item' }>>();
    for (const section of menu.sections) {
      for (const item of section.items) {
        targets.set(item, { kind: 'item', sectionId: section.id, itemId: item.id });
      }
    }
    return targets;
  }, [menu.sections]);
  return (
    <PreviewContext.Provider value={{ selection, onSelect, itemTargets }}>
      {children}
    </PreviewContext.Provider>
  );
}

/** Adds edit actions only while rendering inside the owner Live Preview. */
export function usePreviewTarget() {
  const context = useContext(PreviewContext);
  return (target: EditorSelection, label: string, image = false) => {
    if (!context) return {};
    const selected = context.selection && selectionKey(context.selection) === selectionKey(target);
    const activate = () => context.onSelect(image && (target.kind === 'item' || target.kind === 'restaurant')
      ? { ...target, focus: 'image' }
      : target);
    return {
      'data-preview-target': selectionKey(target),
      'data-preview-selected': selected ? 'true' : undefined,
      'data-preview-image': image ? 'true' : undefined,
      role: 'button' as const,
      tabIndex: 0,
      'aria-label': label,
      'aria-current': selected ? 'true' as const : undefined,
      onClick: (event: React.MouseEvent) => {
        event.stopPropagation();
        activate();
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        event.stopPropagation();
        activate();
      },
    };
  };
}

export function usePreviewItemTarget(item: MenuItem) {
  return useContext(PreviewContext)?.itemTargets.get(item);
}

export function PreviewHeading({
  as: Heading,
  target,
  editLabel,
  children,
  style,
  ...headingProps
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as: 'h1' | 'h2' | 'h3';
  target: EditorSelection;
  editLabel: string;
  children: string;
}) {
  const context = useContext(PreviewContext);
  const previewTarget = usePreviewTarget();
  return (
    <Heading
      {...headingProps}
      aria-label={context ? children : headingProps['aria-label']}
      style={context ? { ...style, position: 'relative' } : style}
    >
      {children}
      {context && (
        <button
          type="button"
          {...previewTarget(target, editLabel)}
          className="absolute inset-0 z-10 h-full w-full"
          style={{ background: 'transparent', border: 0, padding: 0, outlineOffset: '-4px', pointerEvents: 'auto' }}
        />
      )}
    </Heading>
  );
}

/** A hero photograph is sourced from a dish, so its editor action follows that dish. */
export function PreviewHeroImageTarget({ item }: { item: MenuItem }) {
  const target = usePreviewItemTarget(item);
  const previewTarget = usePreviewTarget();
  if (!target) return null;
  return (
    <button
      type="button"
      {...previewTarget(target, `Edit hero photo for ${item.name || 'Untitled dish'} in preview`, true)}
      className="absolute inset-0 z-0 h-full w-full"
      style={{ background: 'transparent', border: 0, padding: 0, outlineOffset: '-4px' }}
    />
  );
}
