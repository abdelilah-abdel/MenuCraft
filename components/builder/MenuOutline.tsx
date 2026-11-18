import React, { useEffect, useState } from 'react';
import type { Menu, MenuItem, MenuSection } from '@/lib/types/menu';
import { Button } from '../ui/Button';
import { selectionKey, type DragPayload, type EditorSelection } from './editorSelection';

interface OutlineActions {
  lifecycle: (selection: EditorSelection, action: 'duplicate' | 'visibility' | 'remove') => void;
  edit: (selection: EditorSelection) => void;
  addSection: () => void;
  addSubsection: (sectionId: string) => void;
  addItem: (sectionId: string, subsectionId?: string) => void;
  moveSection: (sectionId: string, direction: -1 | 1) => void;
  moveItem: (sectionId: string, itemId: string, direction: -1 | 1) => void;
  startDrag: (event: React.DragEvent, payload: DragPayload) => void;
  endDrag: () => void;
  dragOver: (event: React.DragEvent, target: string) => void;
  dropSection: (event: React.DragEvent, sectionId: string) => void;
  dropItem: (event: React.DragEvent, sectionId: string, itemId: string) => void;
}

export function MenuOutline({
  menu,
  actions,
  focusedSectionId,
  dropTarget,
}: {
  menu: Menu;
  actions: OutlineActions;
  focusedSectionId?: string;
  dropTarget: string;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (focusedSectionId) setExpanded((previous) => new Set([...previous, focusedSectionId]));
  }, [focusedSectionId]);

  const entryActions = (target: EditorSelection, label: string, hidden?: boolean) => (
    <details className="relative shrink-0 text-xs">
      <summary className="cursor-pointer p-2" aria-label={`Actions for ${label}`}>•••</summary>
      <div className="absolute right-0 z-30 min-w-40 border bg-menu-paper-50 p-2 shadow-lg">
        {(['duplicate', 'visibility', 'remove'] as const).map(action => {
          const verb = action === 'duplicate' ? 'Duplicate' : action === 'remove' ? 'Remove' : hidden ? 'Show' : 'Hide';
          return <button key={action} type="button" className="block w-full p-2 text-left hover:bg-menu-paper-200" aria-label={`${verb} ${label}`} onClick={event => { event.currentTarget.closest('details')?.removeAttribute('open'); actions.lifecycle(target, action); }}>{verb}</button>;
        })}
      </div>
    </details>
  );

  const itemRow = (section: MenuSection, item: MenuItem, siblings: MenuItem[]) => (
    <li
      key={item.id}
      className={`flex min-w-0 items-center gap-2 border-t border-menu-ink-200 p-3 ${dropTarget === `item:${item.id}` ? 'ring-2 ring-inset ring-menu-stamp-500' : ''}`}
      onDragOver={(event) => {
        event.stopPropagation();
        actions.dragOver(event, `item:${item.id}`);
      }}
      onDrop={(event) => actions.dropItem(event, section.id, item.id)}
    >
      <button
        type="button"
        draggable
        onDragStart={(event) =>
          actions.startDrag(event, { type: 'item', sectionId: section.id, itemId: item.id })
        }
        onDragEnd={actions.endDrag}
        aria-label={`Drag ${item.name || 'dish'} to reorder`}
        className="cursor-grab px-1 text-menu-ink-500"
      >
        ⋮⋮
      </button>
      <button
        type="button"
        onClick={() => actions.edit({ kind: 'item', sectionId: section.id, itemId: item.id })}
        aria-label={`Edit ${item.name || 'untitled dish'}`}
        data-editor-target={selectionKey({ kind: 'item', sectionId: section.id, itemId: item.id })}
        className="min-w-0 flex-1 text-left focus-visible:outline-menu-stamp-500"
      >
        <span className="block truncate text-sm font-semibold text-menu-ink-900">
          {item.name || 'Untitled dish'}
        </span>
        <span className="block truncate text-xs text-menu-ink-500">
          {item.currency} {item.price.toFixed(2)}
          {item.hidden ? ' · Hidden' : !item.available ? ' · Sold out' : ''}
          {item.description ? ` · ${item.description}` : ''}
        </span>
      </button>
      {entryActions({ kind: 'item', sectionId: section.id, itemId: item.id }, `dish ${item.name}`, item.hidden)}
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          disabled={siblings[0]?.id === item.id}
          onClick={() => actions.moveItem(section.id, item.id, -1)}
          aria-label={`Move ${item.name} up`}
          className="px-2 py-1 disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={siblings.at(-1)?.id === item.id}
          onClick={() => actions.moveItem(section.id, item.id, 1)}
          aria-label={`Move ${item.name} down`}
          className="px-2 py-1 disabled:opacity-30"
        >
          ↓
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">Your menu</h2>
        <span className="text-xs text-menu-ink-500">{menu.sections.length} sections</span>
      </div>
      <button
        type="button"
        aria-label="Edit restaurant information"
        data-editor-target={selectionKey({ kind: 'restaurant' })}
        onClick={() => actions.edit({ kind: 'restaurant' })}
        className="w-full border border-menu-ink-900 bg-menu-paper-50 p-5 text-left hover:border-menu-stamp-500 focus-visible:outline-menu-stamp-500"
      >
        <span className="mb-2 block text-xs uppercase tracking-widest text-menu-stamp-600">
          Restaurant information ↗
        </span>
        <span className="block font-display text-xl font-bold">
          {menu.restaurantName || 'Your restaurant'}
        </span>
        <span className="mt-1 block truncate text-sm text-menu-ink-500">
          {menu.description || 'Add a name, description, and logo'}
        </span>
      </button>
      {menu.sections.map((section, index) => {
        const isExpanded = expanded.has(section.id);
        const groups = [...(section.subsections || [])].sort((a, b) => a.order - b.order);
        const ungrouped = section.items.filter(
          (item) => !groups.some((group) => group.id === item.subsectionId)
        );
        return (
          <section
            key={section.id}
            className={`border border-menu-ink-900 bg-menu-paper-50 ${dropTarget === `section:${section.id}` ? 'ring-2 ring-menu-stamp-500' : ''}`}
            onDragOver={(event) => actions.dragOver(event, `section:${section.id}`)}
            onDrop={(event) => actions.dropSection(event, section.id)}
          >
            <div className="flex items-center gap-1 p-3">
              <button
                type="button"
                draggable
                onDragStart={(event) => actions.startDrag(event, { type: 'section', sectionId: section.id })}
                onDragEnd={actions.endDrag}
                aria-label={`Drag section ${section.name} to reorder`}
                className="cursor-grab px-1 text-menu-ink-500"
              >
                ⋮⋮
              </button>
              <button
                type="button"
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.name || 'untitled section'}`}
                aria-expanded={isExpanded}
                aria-controls={`outline-section-${section.id}`}
                onClick={() =>
                  setExpanded((previous) => {
                    const next = new Set(previous);
                    if (next.has(section.id)) next.delete(section.id);
                    else next.add(section.id);
                    return next;
                  })
                }
                className="min-w-0 flex-1 text-left"
              >
                <span className="block truncate font-display text-lg font-bold">
                  {section.name || 'Untitled section'}
                </span>
                <span className="text-xs text-menu-ink-500">
                  {section.hidden ? 'Hidden · ' : ''}{section.items.length} dishes · {isExpanded ? '−' : '+'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => actions.edit({ kind: 'section', sectionId: section.id })}
                aria-label={`Edit section ${section.name}`}
                data-editor-target={selectionKey({ kind: 'section', sectionId: section.id })}
                className="p-2 text-sm text-menu-stamp-600"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => actions.moveSection(section.id, -1)}
                aria-label={`Move section ${section.name} up`}
                className="p-1 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === menu.sections.length - 1}
                onClick={() => actions.moveSection(section.id, 1)}
                aria-label={`Move section ${section.name} down`}
                className="p-1 disabled:opacity-30"
              >
                ↓
              </button>
              {entryActions({ kind: 'section', sectionId: section.id }, `section ${section.name}`, section.hidden)}
            </div>
            <div id={`outline-section-${section.id}`} hidden={!isExpanded}>
              <ul>{ungrouped.map((item) => itemRow(section, item, ungrouped))}</ul>
              {groups.map((group) => {
                const siblings = section.items.filter((item) => item.subsectionId === group.id);
                return (
                  <div key={group.id} className="border-t border-menu-ink-200">
                    <button
                      type="button"
                      aria-label={`Edit subsection ${group.name}`}
                      data-editor-target={selectionKey({
                        kind: 'subsection',
                        sectionId: section.id,
                        subsectionId: group.id,
                      })}
                      onClick={() =>
                        actions.edit({ kind: 'subsection', sectionId: section.id, subsectionId: group.id })
                      }
                      className="w-full bg-menu-paper-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide"
                    >
                      {group.name || 'Untitled subsection'}{' '}
                      <span className="float-right text-menu-stamp-600">Edit</span>
                    </button>
                    {entryActions({ kind: 'subsection', sectionId: section.id, subsectionId: group.id }, `subsection ${group.name}`, group.hidden)}
                    {group.hidden && <p className="px-4 text-xs">Hidden</p>}
                    <ul>{siblings.map((item) => itemRow(section, item, siblings))}</ul>
                    <button
                      type="button"
                      onClick={() => actions.addItem(section.id, group.id)}
                      className="px-4 py-3 text-xs font-semibold text-menu-stamp-600"
                    >
                      + Add dish to {group.name || 'subsection'}
                    </button>
                  </div>
                );
              })}
              {!section.items.length && <p className="px-4 py-3 text-sm text-menu-ink-500">No dishes yet.</p>}
              <div className="flex flex-wrap gap-2 border-t border-menu-ink-200 p-3">
                <Button type="button" size="sm" variant="outline" onClick={() => actions.addItem(section.id)}>
                  + Add dish
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => actions.addSubsection(section.id)}
                >
                  + Add subsection
                </Button>
              </div>
            </div>
          </section>
        );
      })}
      {!menu.sections.length && (
        <p className="border border-dashed border-menu-ink-300 p-6 text-sm text-menu-ink-500">
          Start with a section, such as Breakfast or Main courses, then add your dishes.
        </p>
      )}
      <Button type="button" variant="stamp" className="w-full" onClick={actions.addSection}>
        + Add section
      </Button>
    </div>
  );
}
