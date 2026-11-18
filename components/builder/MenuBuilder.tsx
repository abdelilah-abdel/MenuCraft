'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Menu, MenuSection, MenuSubsection, MenuItem, MenuLanguage } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { imageService } from '@/lib/services/imageService';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { MenuOutline } from './MenuOutline';
import { getMenuSectionGroups } from '@/lib/templates/menuTemplateUtils';
import { selectionKey, type DragPayload, type EditorSelection } from './editorSelection';

interface MenuBuilderProps {
  menu: Menu;
  onMenuChange: (update: Menu | ((current: Menu) => Menu), groupKey?: string) => void;
  view: 'content' | 'customize';
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection | null) => void;
}

type DescriptionDraft = {
  facts: string;
  draft?: string;
  error?: string;
  requestedName?: string;
  requestedFacts?: string;
  requestedLanguage?: MenuLanguage;
  loading?: boolean;
};

const DRAG_DATA_TYPE = 'application/x-menucraft-menu-content';

function normalizeSectionOrder(sections: MenuSection[]): MenuSection[] {
  return sections.map((section, order) => ({ ...section, order }));
}

function getItemSiblings(section: MenuSection, itemId: string): MenuItem[] {
  return (
    getMenuSectionGroups(section).find((group) => group.items.some((item) => item.id === itemId))?.items || []
  );
}

export const MenuBuilder: React.FC<MenuBuilderProps> = ({
  menu,
  onMenuChange,
  view,
  selection,
  onSelect,
}) => {
  const [uploading, setUploading] = useState(false);
  const [descriptionDrafts, setDescriptionDrafts] = useState<Record<string, DescriptionDraft>>({});
  const [dropTarget, setDropTarget] = useState('');
  const dragPayload = useRef<DragPayload | null>(null);
  const descriptionRequestIds = useRef<Record<string, number>>({});
  const outline = useRef<HTMLDivElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const previousSelection = useRef<EditorSelection | null>(null);

  useEffect(() => {
    if (view !== 'content') return;
    if (selection) {
      const editor = detailHeading.current?.closest<HTMLElement>('[aria-label="Menu editor"]');
      if ('focus' in selection && selection.focus === 'image') {
        const imageControl = editor?.querySelector<HTMLInputElement>(
          `[data-editor-image-control="${selection.kind === 'restaurant' ? 'restaurant' : 'item'}"]`
        );
        imageControl?.focus({ preventScroll: true });
        if (editor && imageControl) {
          editor.scrollTop +=
            imageControl.getBoundingClientRect().top -
            editor.getBoundingClientRect().top -
            editor.clientHeight / 2;
        }
      } else {
        detailHeading.current?.focus({ preventScroll: true });
        if (editor) editor.scrollTop = 0;
      }
    } else if (previousSelection.current) {
      const target = selectionKey(previousSelection.current);
      const buttons = [
        ...(outline.current?.querySelectorAll<HTMLButtonElement>('button[data-editor-target]') || []),
      ];
      const previous = previousSelection.current;
      const sectionTarget =
        previous.kind !== 'restaurant'
          ? selectionKey({ kind: 'section', sectionId: previous.sectionId })
          : null;
      (
        buttons.find((button) => button.dataset.editorTarget === target) ||
        buttons.find((button) => button.dataset.editorTarget === sectionTarget) ||
        buttons[0]
      )?.focus();
    }
    previousSelection.current = selection;
  }, [selection, view]);

  const updateMenu = (updates: Partial<Menu>, groupKey?: string) => {
    onMenuChange((prev) => ({ ...prev, ...updates }), groupKey);
  };

  const updateCustomization = (updates: Partial<Menu['customization']>, groupKey?: string) => {
    onMenuChange(
      (prev) => ({
        ...prev,
        customization: { ...prev.customization, ...updates },
      }),
      groupKey
    );
  };

  const addSection = () => {
    const newSection: MenuSection = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      description: '',
      items: [],
      order: menu.sections.length,
    };
    onMenuChange((prev) => ({
      ...prev,
      sections: normalizeSectionOrder([...prev.sections, newSection]),
    }));
    onSelect({ kind: 'section', sectionId: newSection.id });
  };

  const updateSection = (sectionId: string, updates: Partial<MenuSection>, groupKey?: string) => {
    onMenuChange(
      (prev) => ({
        ...prev,
        sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
      }),
      groupKey
    );
  };

  const addSubsection = (sectionId: string) => {
    const subsection: MenuSubsection = {
      id: MenuService.generateId(),
      name: 'New Subsection',
      description: '',
      order: 0,
    };
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const subsections = [
          ...(section.subsections || []),
          { ...subsection, order: section.subsections?.length || 0 },
        ];
        return { ...section, subsections };
      }),
    }));
    onSelect({ kind: 'subsection', sectionId, subsectionId: subsection.id });
  };

  const updateSubsection = (
    sectionId: string,
    subsectionId: string,
    updates: Partial<MenuSubsection>,
    groupKey?: string
  ) => {
    onMenuChange(
      (prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id !== sectionId
            ? section
            : {
                ...section,
                subsections: (section.subsections || []).map((subsection) =>
                  subsection.id === subsectionId ? { ...subsection, ...updates } : subsection
                ),
              }
        ),
      }),
      groupKey
    );
  };

  const moveSubsectionBy = (sectionId: string, subsectionId: string, direction: -1 | 1) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const subsections = [...(section.subsections || [])];
        const from = subsections.findIndex((subsection) => subsection.id === subsectionId);
        const to = from + direction;
        if (from < 0 || to < 0 || to >= subsections.length) return section;
        [subsections[from], subsections[to]] = [subsections[to], subsections[from]];
        return {
          ...section,
          subsections: subsections.map((subsection, order) => ({ ...subsection, order })),
        };
      }),
    }));
  };

  const deleteSubsection = (sectionId: string, subsectionId: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              subsections: (section.subsections || [])
                .filter((subsection) => subsection.id !== subsectionId)
                .map((subsection, order) => ({ ...subsection, order })),
              items: section.items.map((item) =>
                item.subsectionId === subsectionId ? { ...item, subsectionId: undefined } : item
              ),
            }
      ),
    }));
  };

  const deleteSection = (sectionId: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: normalizeSectionOrder(prev.sections.filter((s) => s.id !== sectionId)),
    }));
  };

  const addItem = (sectionId: string, subsectionId?: string) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: 'New Item',
      description: '',
      price: 0,
      currency: 'MAD',
      subsectionId,
      available: true,
    };

    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, items: [...section.items, newItem] } : section
      ),
    }));
    onSelect({ kind: 'item', sectionId, itemId: newItem.id });
  };

  const updateItem = (sectionId: string, itemId: string, updates: Partial<MenuItem>, groupKey?: string) => {
    onMenuChange(
      (prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
              }
            : section
        ),
      }),
      groupKey
    );
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
          : section
      ),
    }));
  };

  const moveSection = (sourceId: string, targetId: string, position: 'before' | 'after') => {
    onMenuChange((prev) => {
      if (sourceId === targetId) return prev;
      const sections = [...prev.sections];
      const sourceIndex = sections.findIndex((section) => section.id === sourceId);
      if (sourceIndex < 0) return prev;
      const [moving] = sections.splice(sourceIndex, 1);
      const targetIndex = sections.findIndex((section) => section.id === targetId);
      if (targetIndex < 0) return prev;
      sections.splice(targetIndex + (position === 'after' ? 1 : 0), 0, moving);
      return { ...prev, sections: normalizeSectionOrder(sections) };
    });
  };

  const moveSectionBy = (sectionId: string, direction: -1 | 1) => {
    onMenuChange((prev) => {
      const from = prev.sections.findIndex((section) => section.id === sectionId);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= prev.sections.length) return prev;
      const sections = [...prev.sections];
      [sections[from], sections[to]] = [sections[to], sections[from]];
      return { ...prev, sections: normalizeSectionOrder(sections) };
    });
  };

  const moveItem = (
    sourceSectionId: string,
    itemId: string,
    targetSectionId: string,
    targetIndex: number,
    targetSubsectionId?: string | null
  ) => {
    onMenuChange((prev) => {
      const sourceSection = prev.sections.find((section) => section.id === sourceSectionId);
      const targetSection = prev.sections.find((section) => section.id === targetSectionId);
      if (!sourceSection || !targetSection) return prev;
      const sourceIndex = sourceSection.items.findIndex((item) => item.id === itemId);
      if (sourceIndex < 0) return prev;

      const sourceItems = [...sourceSection.items];
      const [moving] = sourceItems.splice(sourceIndex, 1);
      const destinationItems = sourceSectionId === targetSectionId ? sourceItems : [...targetSection.items];
      const adjustedIndex =
        sourceSectionId === targetSectionId && sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
      const insertionIndex = Math.max(0, Math.min(adjustedIndex, destinationItems.length));
      const movedItem =
        targetSubsectionId !== undefined
          ? { ...moving, subsectionId: targetSubsectionId || undefined }
          : sourceSectionId === targetSectionId
            ? moving
            : { ...moving, subsectionId: undefined };
      destinationItems.splice(insertionIndex, 0, movedItem);

      if (
        sourceSectionId === targetSectionId &&
        movedItem.subsectionId === moving.subsectionId &&
        destinationItems.every((item, index) => item.id === sourceSection.items[index]?.id)
      ) {
        return prev;
      }

      return {
        ...prev,
        sections: prev.sections.map((section) => {
          if (section.id === sourceSectionId && section.id === targetSectionId) {
            return { ...section, items: destinationItems };
          }
          if (section.id === sourceSectionId) return { ...section, items: sourceItems };
          if (section.id === targetSectionId) return { ...section, items: destinationItems };
          return section;
        }),
      };
    });
  };

  const moveItemBy = (sectionId: string, itemId: string, direction: -1 | 1) => {
    const section = menu.sections.find((entry) => entry.id === sectionId);
    if (!section) return;
    const siblings = getItemSiblings(section, itemId);
    const index = siblings.findIndex((item) => item.id === itemId);
    const neighbor = siblings[index + direction];
    if (index < 0 || !neighbor) return;
    const target = section.items.findIndex((item) => item.id === neighbor.id);
    moveItem(sectionId, itemId, sectionId, target + (direction > 0 ? 1 : 0));
  };

  const moveItemToSection = (sourceSectionId: string, itemId: string, targetSectionId: string) => {
    const target = menu.sections.find((section) => section.id === targetSectionId);
    if (target) moveItem(sourceSectionId, itemId, targetSectionId, target.items.length);
  };

  const readDragPayload = (event: React.DragEvent): DragPayload | null => {
    if (dragPayload.current) return dragPayload.current;
    try {
      const raw = event.dataTransfer.getData(DRAG_DATA_TYPE) || event.dataTransfer.getData('text/plain');
      const value = JSON.parse(raw) as DragPayload;
      return value && (value.type === 'section' || value.type === 'item') ? value : null;
    } catch {
      return null;
    }
  };

  const startDrag = (event: React.DragEvent, payload: DragPayload) => {
    dragPayload.current = payload;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify(payload));
    event.dataTransfer.setData('text/plain', JSON.stringify(payload));
  };

  const dropOnSection = (event: React.DragEvent, sectionId: string) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = readDragPayload(event);
    if (!payload) return;
    if (payload.type === 'item') {
      const section = menu.sections.find((entry) => entry.id === sectionId);
      if (section) moveItem(payload.sectionId, payload.itemId, sectionId, section.items.length);
    } else {
      const bounds = event.currentTarget.getBoundingClientRect();
      moveSection(
        payload.sectionId,
        sectionId,
        event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after'
      );
    }
    setDropTarget('');
    dragPayload.current = null;
  };

  const dropOnItem = (event: React.DragEvent, sectionId: string, itemId: string) => {
    const payload = readDragPayload(event);
    if (!payload || payload.type !== 'item') return;
    event.preventDefault();
    event.stopPropagation();
    const section = menu.sections.find((entry) => entry.id === sectionId);
    const targetIndex = section?.items.findIndex((item) => item.id === itemId) ?? -1;
    if (!section || targetIndex < 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < bounds.top + bounds.height / 2 ? targetIndex : targetIndex + 1;
    const targetGroup = section.items[targetIndex].subsectionId;
    const validGroup = section.subsections?.some((group) => group.id === targetGroup) ? targetGroup : null;
    moveItem(payload.sectionId, payload.itemId, sectionId, position, validGroup);
    setDropTarget('');
    dragPayload.current = null;
  };

  const updateDescriptionDraft = (itemId: string, updates: Partial<DescriptionDraft>) => {
    setDescriptionDrafts((previous) => ({
      ...previous,
      [itemId]: { ...(previous[itemId] || { facts: '' }), ...updates },
    }));
  };

  const generateDescription = async (item: MenuItem) => {
    const current = descriptionDrafts[item.id] || { facts: '' };
    if (!item.name.trim()) return;
    const requestId = (descriptionRequestIds.current[item.id] || 0) + 1;
    descriptionRequestIds.current[item.id] = requestId;
    updateDescriptionDraft(item.id, { loading: true, error: undefined });

    try {
      const response = await fetch('/api/ai/menu-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, facts: current.facts, language: menu.originalLanguage }),
      });
      const result = (await response.json()) as { description?: string; error?: string };
      if (descriptionRequestIds.current[item.id] !== requestId) return;
      if (!response.ok || !result.description) {
        throw new Error(
          result.error || 'Could not create a suggestion. Your description was not changed; try again.'
        );
      }
      updateDescriptionDraft(item.id, {
        draft: result.description,
        requestedName: item.name,
        requestedFacts: current.facts,
        requestedLanguage: menu.originalLanguage,
        loading: false,
        error: undefined,
      });
    } catch (error) {
      if (descriptionRequestIds.current[item.id] !== requestId) return;
      updateDescriptionDraft(item.id, {
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'The AI provider is unavailable. Your description was not changed; try again.',
      });
    }
  };

  const cancelDescriptionDraft = (itemId: string) => {
    descriptionRequestIds.current[itemId] = (descriptionRequestIds.current[itemId] || 0) + 1;
    setDescriptionDrafts((previous) => {
      const next = { ...previous };
      delete next[itemId];
      return next;
    });
  };

  const handleImageUpload = async (file: File, sectionId: string, itemId: string) => {
    setUploading(true);
    try {
      const result = await imageService.uploadImage(file);
      if (result.success) {
        updateItem(sectionId, itemId, { image: result.url });
      } else {
        alert(result.error || 'Failed to upload image');
      }
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await imageService.uploadImage(file);
      if (result.success) {
        updateCustomization({ logoImage: result.url });
      } else {
        alert(result.error || 'Failed to upload logo');
      }
    } catch (error) {
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const selectedSection =
    selection && selection.kind !== 'restaurant'
      ? menu.sections.find((section) => section.id === selection.sectionId)
      : undefined;
  const endDrag = () => {
    dragPayload.current = null;
    setDropTarget('');
  };

  return (
    <div className="space-y-5">
      <div ref={outline} hidden={view !== 'content' || selection !== null}>
        <MenuOutline
          menu={menu}
          focusedSectionId={selection && selection.kind !== 'restaurant' ? selection.sectionId : undefined}
          dropTarget={dropTarget}
          actions={{
            edit: onSelect,
            addSection,
            addSubsection,
            addItem,
            moveSection: moveSectionBy,
            moveItem: moveItemBy,
            startDrag,
            endDrag,
            dropSection: dropOnSection,
            dropItem: dropOnItem,
            dragOver: (event, target) => {
              if (readDragPayload(event)) {
                event.preventDefault();
                setDropTarget(target);
              }
            },
          }}
        />
      </div>
      {view === 'content' && selection && (
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 ref={detailHeading} tabIndex={-1} className="font-display text-2xl font-bold">
              {selection.kind === 'restaurant'
                ? 'Restaurant information'
                : selection.kind === 'item'
                  ? 'Edit dish'
                  : selection.kind === 'subsection'
                    ? 'Edit subsection'
                    : 'Edit section'}
            </h2>
            <Button type="button" variant="stamp" onClick={() => onSelect(null)}>
              Done
            </Button>
          </div>
          {selection.kind === 'restaurant' && (
            <>
              {/* Step 1: Basic Information */}
              <div className="bg-menu-paper-50 border-[1.5px] border-menu-ink-900">
                <div className="bg-menu-paper-200 border-b border-menu-ink-900 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-menu-stamp-600 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-menu-ink-900 uppercase tracking-wide">
                        Basic Information
                      </h2>
                      <p className="text-xs text-menu-ink-600">Start by adding your restaurant details</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5 bg-menu-paper-100">
                  <Input
                    label="Restaurant Name *"
                    value={menu.restaurantName}
                    onChange={(e) => updateMenu({ restaurantName: e.target.value }, 'restaurant:name')}
                    placeholder="e.g., La Bella Italia"
                  />

                  <div>
                    <label
                      htmlFor="original-language"
                      className="block text-xs font-semibold text-menu-ink-700 uppercase tracking-wider mb-2"
                    >
                      Original Language
                    </label>
                    <select
                      id="original-language"
                      value={menu.originalLanguage}
                      onChange={(event) =>
                        updateMenu({ originalLanguage: event.target.value as MenuLanguage })
                      }
                      className="w-full border border-menu-ink-300 bg-white px-4 py-3 text-sm text-menu-ink-900 focus:outline-none focus:ring-2 focus:ring-menu-stamp-500"
                    >
                      <option value="ar">Arabic</option>
                      <option value="fr">French</option>
                      <option value="en">English</option>
                    </select>
                    <p className="mt-1 text-xs text-menu-ink-500">
                      AI description suggestions use this language.
                    </p>
                  </div>

                  <Textarea
                    label="Restaurant Description"
                    value={menu.description || ''}
                    onChange={(e) => updateMenu({ description: e.target.value }, 'restaurant:description')}
                    placeholder="Brief description of your restaurant (optional)"
                    rows={3}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-menu-ink-700 uppercase tracking-wider mb-2">
                      Restaurant Logo (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      {menu.customization.logoImage && (
                        <div className="relative">
                          <img
                            src={menu.customization.logoImage}
                            alt="Logo"
                            className="h-20 w-20 object-contain border border-menu-ink-200/60"
                          />
                          <button
                            onClick={() => updateCustomization({ logoImage: '' })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="border border-dashed border-menu-ink-300/60 p-6 hover:border-menu-stamp-500 hover:bg-white focus-within:outline focus-within:outline-2 focus-within:outline-menu-stamp-500 transition-all text-center bg-menu-paper-200">
                          <svg
                            className="w-8 h-8 mx-auto mb-2 text-menu-ink-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span className="text-sm text-menu-ink-700 font-semibold">Upload Logo</span>
                          <p className="text-xs text-menu-ink-500 mt-1">PNG, JPG up to 5MB</p>
                          <input
                            data-editor-image-control="restaurant"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file);
                            }}
                            className="sr-only"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {selectedSection &&
            [selectedSection].map((section) => (
              <div key={section.id} className="space-y-4">
                {selection.kind === 'section' && (
                  <div className="space-y-4 border border-menu-ink-900 bg-menu-paper-50 p-5">
                    <Input
                      label={`Section Name *`}
                      value={section.name}
                      onChange={(e) =>
                        updateSection(section.id, { name: e.target.value }, `section:${section.id}:name`)
                      }
                      placeholder="e.g., Appetizers, Main Courses, Desserts"
                    />

                    <Textarea
                      label="Section Description (Optional)"
                      value={section.description || ''}
                      onChange={(e) =>
                        updateSection(
                          section.id,
                          { description: e.target.value },
                          `section:${section.id}:description`
                        )
                      }
                      placeholder="Optional description for this section..."
                      rows={2}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => deleteSection(section.id)}
                      className="!text-red-700"
                    >
                      Delete section
                    </Button>
                  </div>
                )}
                {selection.kind === 'subsection' &&
                  [...(section.subsections || [])]
                    .sort((left, right) => left.order - right.order)
                    .map(
                      (subsection, subsectionIndex) =>
                        subsection.id === selection.subsectionId && (
                          <div key={subsection.id} className="border border-menu-ink-200 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-menu-ink-500">
                                Subsection {subsectionIndex + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveSubsectionBy(section.id, subsection.id, -1)}
                                  disabled={subsectionIndex === 0}
                                  aria-label={`Move subsection ${subsection.name} up`}
                                  className="border border-menu-ink-300 px-2 py-1 text-xs disabled:opacity-40"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveSubsectionBy(section.id, subsection.id, 1)}
                                  disabled={subsectionIndex === (section.subsections || []).length - 1}
                                  aria-label={`Move subsection ${subsection.name} down`}
                                  className="border border-menu-ink-300 px-2 py-1 text-xs disabled:opacity-40"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSubsection(section.id, subsection.id)}
                                  className="border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <Input
                                label="Subsection Name"
                                value={subsection.name}
                                onChange={(event) =>
                                  updateSubsection(
                                    section.id,
                                    subsection.id,
                                    { name: event.target.value },
                                    `subsection:${subsection.id}:name`
                                  )
                                }
                                placeholder="e.g., Chicken Tagines"
                              />
                              <Input
                                label="Subsection Description (Optional)"
                                value={subsection.description || ''}
                                onChange={(event) =>
                                  updateSubsection(
                                    section.id,
                                    subsection.id,
                                    { description: event.target.value },
                                    `subsection:${subsection.id}:description`
                                  )
                                }
                                placeholder="A short note about this group"
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              className="mt-3"
                              onClick={() => addItem(section.id, subsection.id)}
                            >
                              Add Item to {subsection.name || 'Subsection'}
                            </Button>
                          </div>
                        )
                    )}
                {selection.kind === 'item' &&
                  section.items
                    .filter((entry) => entry.id === selection.itemId)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`bg-menu-paper-50 p-4 border border-menu-ink-900 transition-shadow ${dropTarget === `item:${item.id}` ? 'ring-2 ring-menu-stamp-500' : ''}`}
                        onDragOver={(event) => {
                          const payload = readDragPayload(event);
                          if (!payload || payload.type !== 'item') return;
                          event.preventDefault();
                          event.stopPropagation();
                          setDropTarget(`item:${item.id}`);
                        }}
                        onDrop={(event) => dropOnItem(event, section.id, item.id)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              draggable
                              onDragStart={(event) =>
                                startDrag(event, { type: 'item', sectionId: section.id, itemId: item.id })
                              }
                              onDragEnd={() => {
                                dragPayload.current = null;
                                setDropTarget('');
                              }}
                              aria-label={`Drag ${item.name || 'menu item'} to reorder or move sections`}
                              title="Drag to reorder or move to another section"
                              className="cursor-grab touch-none px-1 text-lg text-menu-ink-500 active:cursor-grabbing"
                            >
                              ⋮⋮
                            </button>
                            <span className="text-xs font-semibold uppercase tracking-wide text-menu-ink-500">
                              Move item
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveItemBy(section.id, item.id, -1)}
                              disabled={getItemSiblings(section, item.id)[0]?.id === item.id}
                              aria-label={`Move ${item.name || 'menu item'} up`}
                              title="Move item up"
                              className="border border-menu-ink-300 px-2 py-1 text-xs text-menu-ink-700 disabled:opacity-40"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItemBy(section.id, item.id, 1)}
                              disabled={getItemSiblings(section, item.id).at(-1)?.id === item.id}
                              aria-label={`Move ${item.name || 'menu item'} down`}
                              title="Move item down"
                              className="border border-menu-ink-300 px-2 py-1 text-xs text-menu-ink-700 disabled:opacity-40"
                            >
                              ↓
                            </button>
                            <label className="sr-only" htmlFor={`move-item-${item.id}`}>
                              Move {item.name || 'menu item'} to section
                            </label>
                            <select
                              id={`move-item-${item.id}`}
                              value={section.id}
                              disabled={menu.sections.length < 2}
                              onChange={(event) => moveItemToSection(section.id, item.id, event.target.value)}
                              className="max-w-48 border border-menu-ink-300 bg-white px-2 py-1 text-xs text-menu-ink-700 disabled:opacity-50"
                            >
                              {menu.sections.map((targetSection) => (
                                <option key={targetSection.id} value={targetSection.id}>
                                  {targetSection.name || 'Untitled section'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="Item Name"
                            value={item.name}
                            maxLength={120}
                            onChange={(e) =>
                              updateItem(
                                section.id,
                                item.id,
                                {
                                  name: e.target.value,
                                },
                                `item:${item.id}:name`
                              )
                            }
                            placeholder="Dish name"
                          />

                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              label="Currency"
                              value={item.currency}
                              onChange={(e) =>
                                updateItem(
                                  section.id,
                                  item.id,
                                  {
                                    currency: e.target.value,
                                  },
                                  `item:${item.id}:currency`
                                )
                              }
                              placeholder="$"
                            />
                            <div className="col-span-2">
                              <Input
                                label="Price"
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) =>
                                  updateItem(
                                    section.id,
                                    item.id,
                                    {
                                      price: parseFloat(e.target.value) || 0,
                                    },
                                    `item:${item.id}:price`
                                  )
                                }
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 max-w-md">
                          <label
                            htmlFor={`item-subsection-${item.id}`}
                            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-menu-ink-700"
                          >
                            Subsection
                          </label>
                          <select
                            id={`item-subsection-${item.id}`}
                            value={
                              (section.subsections || []).some(
                                (subsection) => subsection.id === item.subsectionId
                              )
                                ? item.subsectionId
                                : ''
                            }
                            onChange={(event) =>
                              updateItem(
                                section.id,
                                item.id,
                                { subsectionId: event.target.value || undefined },
                                `item:${item.id}:subsection`
                              )
                            }
                            className="w-full border border-menu-ink-300 bg-white px-3 py-2.5 text-sm text-menu-ink-900 focus:outline-none focus:ring-2 focus:ring-menu-stamp-500"
                          >
                            <option value="">Keep in {section.name || 'section'}</option>
                            {[...(section.subsections || [])]
                              .sort((left, right) => left.order - right.order)
                              .map((subsection) => (
                                <option key={subsection.id} value={subsection.id}>
                                  {subsection.name || 'Untitled subsection'}
                                </option>
                              ))}
                          </select>
                          <p className="mt-1 text-xs text-menu-ink-500">
                            The selected template will style this group as a nested menu heading.
                          </p>
                        </div>

                        <Textarea
                          label="Description"
                          value={item.description || ''}
                          onChange={(e) =>
                            updateItem(
                              section.id,
                              item.id,
                              {
                                description: e.target.value,
                              },
                              `item:${item.id}:description`
                            )
                          }
                          placeholder="Describe this item..."
                          rows={2}
                          className="mb-4"
                        />

                        {(() => {
                          const suggestion = descriptionDrafts[item.id] || { facts: '' };
                          const draftIsStale =
                            Boolean(suggestion.draft) &&
                            (suggestion.requestedName !== item.name ||
                              suggestion.requestedFacts !== suggestion.facts ||
                              suggestion.requestedLanguage !== menu.originalLanguage);

                          return (
                            <div className="mb-4 border border-menu-stamp-300 bg-menu-stamp-50 p-4">
                              <div className="mb-3">
                                <h4 className="text-sm font-bold text-menu-ink-900">
                                  AI description suggestion
                                </h4>
                                <p className="mt-1 text-xs text-menu-ink-600">
                                  Add only confirmed facts. The current description stays unchanged until you
                                  apply a draft.
                                </p>
                                <p className="mt-1 text-xs text-menu-ink-500">
                                  Only this dish name, your facts, and the Original Language are sent to your
                                  configured AI provider.
                                </p>
                              </div>
                              <label
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-menu-ink-700"
                                htmlFor={`ai-facts-${item.id}`}
                              >
                                Facts to include (optional)
                              </label>
                              <textarea
                                id={`ai-facts-${item.id}`}
                                value={suggestion.facts}
                                onChange={(event) =>
                                  updateDescriptionDraft(item.id, { facts: event.target.value })
                                }
                                maxLength={1200}
                                rows={2}
                                placeholder="For example: grilled on a charcoal fire; served with house-made sauce"
                                className="w-full border border-menu-ink-300 bg-white px-3 py-2 text-sm text-menu-ink-900 focus:outline-none focus:ring-2 focus:ring-menu-stamp-500"
                              />
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="stamp"
                                  onClick={() => void generateDescription(item)}
                                  disabled={!item.name.trim() || Boolean(suggestion.loading)}
                                >
                                  {suggestion.loading
                                    ? 'Generating…'
                                    : suggestion.draft
                                      ? 'Regenerate'
                                      : 'Generate with AI'}
                                </Button>
                                {(suggestion.draft || suggestion.loading) && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => cancelDescriptionDraft(item.id)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                              {suggestion.loading && (
                                <p role="status" className="mt-3 text-xs text-menu-ink-600">
                                  Preparing one description draft…
                                </p>
                              )}
                              {suggestion.error && (
                                <p role="alert" className="mt-3 text-xs text-red-700">
                                  {suggestion.error}
                                </p>
                              )}
                              {suggestion.draft && (
                                <div className="mt-4 border-t border-menu-stamp-200 pt-4">
                                  <label
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-menu-ink-700"
                                    htmlFor={`ai-draft-${item.id}`}
                                  >
                                    Review draft · {menu.originalLanguage.toUpperCase()}
                                  </label>
                                  <Textarea
                                    id={`ai-draft-${item.id}`}
                                    value={suggestion.draft}
                                    onChange={(event) =>
                                      updateDescriptionDraft(item.id, { draft: event.target.value })
                                    }
                                    rows={3}
                                    aria-label={`Review AI description for ${item.name}`}
                                  />
                                  {draftIsStale && (
                                    <p role="status" className="mt-2 text-xs text-amber-800">
                                      Dish facts or language changed. Regenerate before applying this draft.
                                    </p>
                                  )}
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="primary"
                                      disabled={
                                        draftIsStale ||
                                        !suggestion.draft.trim() ||
                                        Boolean(suggestion.loading)
                                      }
                                      onClick={() => {
                                        updateItem(section.id, item.id, { description: suggestion.draft });
                                        cancelDescriptionDraft(item.id);
                                      }}
                                    >
                                      Apply suggestion
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        <div className="flex items-end justify-between gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-menu-ink-700 uppercase tracking-wide mb-2">
                              Item Photo (Optional)
                            </label>
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-16 w-16 object-cover border-menu border-menu-ink-200"
                                />
                              )}
                              <label className="cursor-pointer flex-1">
                                <div className="border border-dashed border-menu-ink-300/60 px-4 py-2.5 hover:border-menu-stamp-500 hover:bg-white focus-within:outline focus-within:outline-2 focus-within:outline-menu-stamp-500 transition-all text-center rounded-none bg-menu-paper-100">
                                  <span className="text-sm text-menu-ink-700 uppercase tracking-wide">
                                    {item.image ? 'Change photo' : 'Upload photo'}
                                  </span>
                                  <input
                                    data-editor-image-control="item"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, section.id, item.id);
                                    }}
                                    disabled={uploading}
                                    className="sr-only"
                                  />
                                </div>
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.available}
                                onChange={(e) =>
                                  updateItem(section.id, item.id, {
                                    available: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 text-menu-stamp-600 border-menu-ink-300"
                              />
                              <span className="text-sm text-menu-ink-600 uppercase tracking-wide">
                                Available
                              </span>
                            </label>

                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`Delete ${item.name || 'dish'}`}
                              onClick={() => deleteItem(section.id, item.id)}
                              className="!text-red-600 hover:!bg-red-50"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            ))}
        </div>
      )}
      {view === 'customize' && (
        <>
          {/* Step 2: Display Settings */}
          <div className="bg-menu-paper-50 border-[1.5px] border-menu-ink-900">
            <div className="bg-menu-paper-200 border-b border-menu-ink-900 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-menu-stamp-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-bold text-menu-ink-900 uppercase tracking-wide">
                    Display Settings
                  </h2>
                  <p className="text-xs text-menu-ink-600">Control what appears on your menu</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5 bg-menu-paper-100">
              <div className="bg-menu-paper-200 border border-menu-ink-200/60 p-5 rounded-none">
                <p className="text-xs font-bold text-menu-ink-700 uppercase tracking-wider mb-4">
                  What to Display
                </p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-paper-50 transition-colors rounded-none">
                    <input
                      type="checkbox"
                      checked={menu.customization.showPrices}
                      onChange={(e) => updateCustomization({ showPrices: e.target.checked })}
                      className="w-5 h-5 text-menu-stamp-600 rounded border border-menu-ink-300/60 focus:ring-2 focus:ring-menu-stamp-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-menu-ink-900 block">Show Prices</span>
                      <span className="text-xs text-menu-ink-600">Display item prices on the menu</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-paper-50 transition-colors rounded-none">
                    <input
                      type="checkbox"
                      checked={menu.customization.showDescriptions}
                      onChange={(e) => updateCustomization({ showDescriptions: e.target.checked })}
                      className="w-5 h-5 text-menu-stamp-600 rounded border border-menu-ink-300/60 focus:ring-2 focus:ring-menu-stamp-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-menu-ink-900 block">Show Descriptions</span>
                      <span className="text-xs text-menu-ink-600">Display item descriptions</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-paper-50 transition-colors rounded-none">
                    <input
                      type="checkbox"
                      checked={menu.customization.showImages}
                      onChange={(e) => updateCustomization({ showImages: e.target.checked })}
                      className="w-5 h-5 text-menu-stamp-600 rounded border border-menu-ink-300/60 focus:ring-2 focus:ring-menu-stamp-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-menu-ink-900 block">Show Images</span>
                      <span className="text-xs text-menu-ink-600">Display item photos</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-menu-ink-700 uppercase tracking-wider mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-3 items-stretch">
                    <input
                      type="color"
                      value={menu.customization.primaryColor}
                      onChange={(e) =>
                        updateCustomization({ primaryColor: e.target.value }, 'customization:primary-color')
                      }
                      className="h-auto w-16 cursor-pointer border border-menu-ink-200/60 rounded-none"
                    />
                    <Input
                      value={menu.customization.primaryColor}
                      onChange={(e) =>
                        updateCustomization({ primaryColor: e.target.value }, 'customization:primary-color')
                      }
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-menu-ink-700 uppercase tracking-wider mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-3 items-stretch">
                    <input
                      type="color"
                      value={menu.customization.secondaryColor}
                      onChange={(e) =>
                        updateCustomization(
                          { secondaryColor: e.target.value },
                          'customization:secondary-color'
                        )
                      }
                      className="h-auto w-16 cursor-pointer border border-menu-ink-200/60 rounded-none"
                    />
                    <Input
                      value={menu.customization.secondaryColor}
                      onChange={(e) =>
                        updateCustomization(
                          { secondaryColor: e.target.value },
                          'customization:secondary-color'
                        )
                      }
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
