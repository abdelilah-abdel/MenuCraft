'use client';

import React, { useRef, useState } from 'react';
import { Menu, MenuSection, MenuSubsection, MenuItem, MenuLanguage } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { imageService } from '@/lib/services/imageService';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

interface MenuBuilderProps {
  menu: Menu;
  onMenuChange: (update: Menu | ((current: Menu) => Menu), groupKey?: string) => void;
  onSave?: (menu: Menu, submittedMenu: Menu) => void;
}

type DragPayload =
  | { type: 'section'; sectionId: string }
  | { type: 'item'; sectionId: string; itemId: string };
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

export const MenuBuilder: React.FC<MenuBuilderProps> = ({
  menu,
  onMenuChange,
  onSave,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [descriptionDrafts, setDescriptionDrafts] = useState<Record<string, DescriptionDraft>>({});
  const [dropTarget, setDropTarget] = useState('');
  const dragPayload = useRef<DragPayload | null>(null);
  const descriptionRequestIds = useRef<Record<string, number>>({});

  const updateMenu = (updates: Partial<Menu>, groupKey?: string) => {
    onMenuChange((prev) => ({ ...prev, ...updates }), groupKey);
  };

  const updateCustomization = (updates: Partial<Menu['customization']>, groupKey?: string) => {
    onMenuChange((prev) => ({
      ...prev,
      customization: { ...prev.customization, ...updates },
    }), groupKey);
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
  };

  const updateSection = (sectionId: string, updates: Partial<MenuSection>, groupKey?: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }), groupKey);
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
        const subsections = [...(section.subsections || []), { ...subsection, order: section.subsections?.length || 0 }];
        return { ...section, subsections };
      }),
    }));
  };

  const updateSubsection = (sectionId: string, subsectionId: string, updates: Partial<MenuSubsection>, groupKey?: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => section.id !== sectionId ? section : {
        ...section,
        subsections: (section.subsections || []).map((subsection) => subsection.id === subsectionId ? { ...subsection, ...updates } : subsection),
      }),
    }), groupKey);
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
        return { ...section, subsections: subsections.map((subsection, order) => ({ ...subsection, order })) };
      }),
    }));
  };

  const deleteSubsection = (sectionId: string, subsectionId: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => section.id !== sectionId ? section : {
        ...section,
        subsections: (section.subsections || []).filter((subsection) => subsection.id !== subsectionId).map((subsection, order) => ({ ...subsection, order })),
        items: section.items.map((item) => item.subsectionId === subsectionId ? { ...item, subsectionId: undefined } : item),
      }),
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
      sections: prev.sections.map((section) => section.id === sectionId
        ? { ...section, items: [...section.items, newItem] }
        : section),
    }));
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    updates: Partial<MenuItem>,
    groupKey?: string,
  ) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => section.id === sectionId
        ? { ...section, items: section.items.map((item) => item.id === itemId ? { ...item, ...updates } : item) }
        : section),
    }), groupKey);
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    onMenuChange((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => section.id === sectionId
        ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
        : section),
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

  const moveItem = (sourceSectionId: string, itemId: string, targetSectionId: string, targetIndex: number) => {
    onMenuChange((prev) => {
      const sourceSection = prev.sections.find((section) => section.id === sourceSectionId);
      const targetSection = prev.sections.find((section) => section.id === targetSectionId);
      if (!sourceSection || !targetSection) return prev;
      const sourceIndex = sourceSection.items.findIndex((item) => item.id === itemId);
      if (sourceIndex < 0) return prev;

      const sourceItems = [...sourceSection.items];
      const [moving] = sourceItems.splice(sourceIndex, 1);
      const destinationItems = sourceSectionId === targetSectionId
        ? sourceItems
        : [...targetSection.items];
      const adjustedIndex = sourceSectionId === targetSectionId && sourceIndex < targetIndex
        ? targetIndex - 1
        : targetIndex;
      const insertionIndex = Math.max(0, Math.min(adjustedIndex, destinationItems.length));
      const movedItem = sourceSectionId === targetSectionId ? moving : { ...moving, subsectionId: undefined };
      destinationItems.splice(insertionIndex, 0, movedItem);

      if (sourceSectionId === targetSectionId &&
        destinationItems.every((item, index) => item.id === sourceSection.items[index]?.id)) {
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
    const index = section?.items.findIndex((item) => item.id === itemId) ?? -1;
    if (index >= 0) moveItem(sectionId, itemId, sectionId, index + (direction < 0 ? -1 : 2));
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
      moveSection(payload.sectionId, sectionId, event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after');
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
    moveItem(payload.sectionId, payload.itemId, sectionId, position);
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
      const result = await response.json() as { description?: string; error?: string };
      if (descriptionRequestIds.current[item.id] !== requestId) return;
      if (!response.ok || !result.description) {
        throw new Error(result.error || 'Could not create a suggestion. Your description was not changed; try again.');
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
        error: error instanceof Error ? error.message : 'The AI provider is unavailable. Your description was not changed; try again.',
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

  const handleImageUpload = async (
    file: File,
    sectionId: string,
    itemId: string
  ) => {
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

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    const submittedMenu = menu;
    try {
      const savedMenu = await MenuService.saveMenu(submittedMenu);
      onSave?.(savedMenu, submittedMenu);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your menu right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Basic Information */}
      <div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-menu-gold-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-menu-charcoal-900 uppercase tracking-wide">Basic Information</h2>
              <p className="text-xs text-menu-charcoal-600">Start by adding your restaurant details</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-menu-cream-100">
          <Input
            label="Restaurant Name *"
            value={menu.restaurantName}
            onChange={(e) => updateMenu({ restaurantName: e.target.value }, 'restaurant:name')}
            placeholder="e.g., La Bella Italia"
          />

          <div>
            <label htmlFor="original-language" className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
              Original Language
            </label>
            <select
              id="original-language"
              value={menu.originalLanguage}
              onChange={(event) => updateMenu({ originalLanguage: event.target.value as MenuLanguage })}
              className="w-full border border-menu-charcoal-300 bg-white px-4 py-3 text-sm text-menu-charcoal-900 focus:outline-none focus:ring-2 focus:ring-menu-gold-500"
            >
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
              <option value="en">English</option>
            </select>
            <p className="mt-1 text-xs text-menu-charcoal-500">AI description suggestions use this language.</p>
          </div>

          <Textarea
            label="Restaurant Description"
            value={menu.description || ''}
            onChange={(e) => updateMenu({ description: e.target.value }, 'restaurant:description')}
            placeholder="Brief description of your restaurant (optional)"
            rows={3}
          />

          <div>
            <label className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
              Restaurant Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {menu.customization.logoImage && (
                <div className="relative">
                  <img
                    src={menu.customization.logoImage}
                    alt="Logo"
                    className="h-20 w-20 object-contain border border-menu-charcoal-200/60"
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
                <div className="border border-dashed border-menu-charcoal-300/60 p-6 hover:border-menu-gold-500 hover:bg-white transition-all text-center bg-menu-cream-200">
                  <svg className="w-8 h-8 mx-auto mb-2 text-menu-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-menu-charcoal-700 font-semibold">Upload Logo</span>
                  <p className="text-xs text-menu-charcoal-500 mt-1">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Display Settings */}
      <div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-menu-gold-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-menu-charcoal-900 uppercase tracking-wide">Display Settings</h2>
              <p className="text-xs text-menu-charcoal-600">Control what appears on your menu</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-menu-cream-100">
          <div className="bg-menu-cream-200 border border-menu-charcoal-200/60 p-5 rounded-sm">
            <p className="text-xs font-bold text-menu-charcoal-700 uppercase tracking-wider mb-4">What to Display</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-cream-50 transition-colors rounded-sm">
                <input
                  type="checkbox"
                  checked={menu.customization.showPrices}
                  onChange={(e) =>
                    updateCustomization({ showPrices: e.target.checked })
                  }
                  className="w-5 h-5 text-menu-gold-600 rounded border border-menu-charcoal-300/60 focus:ring-2 focus:ring-menu-gold-500"
                />
                <div>
                  <span className="text-sm font-semibold text-menu-charcoal-900 block">Show Prices</span>
                  <span className="text-xs text-menu-charcoal-600">Display item prices on the menu</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-cream-50 transition-colors rounded-sm">
                <input
                  type="checkbox"
                  checked={menu.customization.showDescriptions}
                  onChange={(e) =>
                    updateCustomization({ showDescriptions: e.target.checked })
                  }
                  className="w-5 h-5 text-menu-gold-600 rounded border border-menu-charcoal-300/60 focus:ring-2 focus:ring-menu-gold-500"
                />
                <div>
                  <span className="text-sm font-semibold text-menu-charcoal-900 block">Show Descriptions</span>
                  <span className="text-xs text-menu-charcoal-600">Display item descriptions</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-menu-cream-50 transition-colors rounded-sm">
                <input
                  type="checkbox"
                  checked={menu.customization.showImages}
                  onChange={(e) =>
                    updateCustomization({ showImages: e.target.checked })
                  }
                  className="w-5 h-5 text-menu-gold-600 rounded border border-menu-charcoal-300/60 focus:ring-2 focus:ring-menu-gold-500"
                />
                <div>
                  <span className="text-sm font-semibold text-menu-charcoal-900 block">Show Images</span>
                  <span className="text-xs text-menu-charcoal-600">Display item photos</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
                Primary Color
              </label>
              <div className="flex gap-3 items-stretch">
                <input
                  type="color"
                  value={menu.customization.primaryColor}
                  onChange={(e) =>
                    updateCustomization({ primaryColor: e.target.value }, 'customization:primary-color')
                  }
                  className="h-auto w-16 cursor-pointer border border-menu-charcoal-200/60 rounded-sm"
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
              <label className="block text-xs font-semibold text-menu-charcoal-700 uppercase tracking-wider mb-2">
                Secondary Color
              </label>
              <div className="flex gap-3 items-stretch">
                <input
                  type="color"
                  value={menu.customization.secondaryColor}
                  onChange={(e) =>
                    updateCustomization({ secondaryColor: e.target.value }, 'customization:secondary-color')
                  }
                  className="h-auto w-16 cursor-pointer border border-menu-charcoal-200/60 rounded-sm"
                />
                <Input
                  value={menu.customization.secondaryColor}
                  onChange={(e) =>
                    updateCustomization({ secondaryColor: e.target.value }, 'customization:secondary-color')
                  }
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Menu Sections & Items */}
      <div className="bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu">
        <div className="bg-menu-cream-200 border-b border-menu-charcoal-200/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-menu-gold-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-menu-charcoal-900 uppercase tracking-wide">Menu Sections & Items</h2>
                <p className="text-xs text-menu-charcoal-600">Add your menu categories and dishes</p>
              </div>
            </div>
            <Button onClick={addSection} variant="gold" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Section
            </Button>
          </div>
        </div>

        <div className="p-6 bg-menu-cream-100">
          {menu.sections.length === 0 && (
            <div className="border border-dashed border-menu-charcoal-300/60 bg-menu-cream-200 p-12 text-center rounded-sm">
              <svg className="w-16 h-16 mx-auto mb-4 text-menu-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold text-menu-charcoal-900 mb-2 uppercase tracking-wide">No Sections Yet</h3>
              <p className="text-sm text-menu-charcoal-600 mb-6">Create your first menu section (e.g., Appetizers, Main Courses, Desserts)</p>
              <Button onClick={addSection} variant="gold">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Section
              </Button>
            </div>
          )}

          <div className="space-y-4">

        {menu.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className={`bg-white border border-menu-charcoal-200/60 shadow-menu rounded-sm transition-shadow ${dropTarget === `section:${section.id}` ? 'ring-2 ring-menu-gold-500' : ''}`}
            onDragOver={(event) => {
              if (!readDragPayload(event)) return;
              event.preventDefault();
              setDropTarget(`section:${section.id}`);
            }}
            onDrop={(event) => dropOnSection(event, section.id)}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDropTarget('');
              }
            }}
          >
            <div className="bg-menu-cream-100 border-b border-menu-charcoal-200/60 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => startDrag(event, { type: 'section', sectionId: section.id })}
                  onDragEnd={() => { dragPayload.current = null; setDropTarget(''); }}
                  aria-label={`Drag section ${section.name || sectionIndex + 1} to reorder`}
                  title="Drag to reorder this section"
                  className="cursor-grab touch-none px-1 text-lg text-menu-charcoal-500 active:cursor-grabbing"
                >
                  ⋮⋮
                </button>
                <span className="w-7 h-7 bg-menu-charcoal-700 text-white flex items-center justify-center text-sm font-bold">
                  {sectionIndex + 1}
                </span>
                <span className="text-sm font-bold text-menu-charcoal-900 uppercase tracking-wide">Section {sectionIndex + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveSectionBy(section.id, -1)}
                    disabled={sectionIndex === 0}
                    aria-label={`Move section ${section.name || sectionIndex + 1} up`}
                    title="Move section up"
                    className="border border-menu-charcoal-300 px-2 py-1 text-xs text-menu-charcoal-700 disabled:opacity-40"
                  >↑</button>
                  <button
                    type="button"
                    onClick={() => moveSectionBy(section.id, 1)}
                    disabled={sectionIndex === menu.sections.length - 1}
                    aria-label={`Move section ${section.name || sectionIndex + 1} down`}
                    title="Move section down"
                    className="border border-menu-charcoal-300 px-2 py-1 text-xs text-menu-charcoal-700 disabled:opacity-40"
                  >↓</button>
                </div>
              </div>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-red-600 hover:bg-red-50 p-2 transition-colors"
                title="Delete Section"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4 bg-menu-cream-50">
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
                  updateSection(section.id, { description: e.target.value }, `section:${section.id}:description`)
                }
                placeholder="Optional description for this section..."
                rows={2}
              />

              <div className="border border-menu-charcoal-200/60 bg-menu-cream-100 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-menu-charcoal-800">Subsections (Optional)</h3>
                    <p className="mt-1 text-xs text-menu-charcoal-500">Group dishes under headings such as Tagines, Couscous, or Mint Tea.</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={() => addSubsection(section.id)}>Add Subsection</Button>
                </div>
                {(section.subsections || []).length === 0 ? (
                  <p className="border border-dashed border-menu-charcoal-200 bg-white px-3 py-3 text-xs text-menu-charcoal-500">No subsections yet. Items can stay at this section level.</p>
                ) : (
                  <div className="space-y-3">
                    {[...(section.subsections || [])].sort((left, right) => left.order - right.order).map((subsection, subsectionIndex) => (
                      <div key={subsection.id} className="border border-menu-charcoal-200 bg-white p-3">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-menu-charcoal-500">Subsection {subsectionIndex + 1}</span>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveSubsectionBy(section.id, subsection.id, -1)} disabled={subsectionIndex === 0} aria-label={`Move subsection ${subsection.name} up`} className="border border-menu-charcoal-300 px-2 py-1 text-xs disabled:opacity-40">↑</button>
                            <button type="button" onClick={() => moveSubsectionBy(section.id, subsection.id, 1)} disabled={subsectionIndex === (section.subsections || []).length - 1} aria-label={`Move subsection ${subsection.name} down`} className="border border-menu-charcoal-300 px-2 py-1 text-xs disabled:opacity-40">↓</button>
                            <button type="button" onClick={() => deleteSubsection(section.id, subsection.id)} className="border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50">Delete</button>
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Input
                            label="Subsection Name"
                            value={subsection.name}
                            onChange={(event) => updateSubsection(section.id, subsection.id, { name: event.target.value }, `subsection:${subsection.id}:name`)}
                            placeholder="e.g., Chicken Tagines"
                          />
                          <Input
                            label="Subsection Description (Optional)"
                            value={subsection.description || ''}
                            onChange={(event) => updateSubsection(section.id, subsection.id, { description: event.target.value }, `subsection:${subsection.id}:description`)}
                            placeholder="A short note about this group"
                          />
                        </div>
                        <Button type="button" size="sm" variant="secondary" className="mt-3" onClick={() => addItem(section.id, subsection.id)}>Add Item to {subsection.name || 'Subsection'}</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-menu-charcoal-200/60 bg-white p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold text-menu-charcoal-900 uppercase tracking-wider">Items in this Section</h3>
                <Button size="sm" variant="secondary" onClick={() => addItem(section.id)}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-menu-cream-50 p-4 border border-menu-charcoal-200/60 rounded-sm transition-shadow ${dropTarget === `item:${item.id}` ? 'ring-2 ring-menu-gold-500' : ''}`}
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
                          onDragStart={(event) => startDrag(event, { type: 'item', sectionId: section.id, itemId: item.id })}
                          onDragEnd={() => { dragPayload.current = null; setDropTarget(''); }}
                          aria-label={`Drag ${item.name || 'menu item'} to reorder or move sections`}
                          title="Drag to reorder or move to another section"
                          className="cursor-grab touch-none px-1 text-lg text-menu-charcoal-500 active:cursor-grabbing"
                        >
                          ⋮⋮
                        </button>
                        <span className="text-xs font-semibold uppercase tracking-wide text-menu-charcoal-500">Move item</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveItemBy(section.id, item.id, -1)}
                          disabled={section.items[0]?.id === item.id}
                          aria-label={`Move ${item.name || 'menu item'} up`}
                          title="Move item up"
                          className="border border-menu-charcoal-300 px-2 py-1 text-xs text-menu-charcoal-700 disabled:opacity-40"
                        >↑</button>
                        <button
                          type="button"
                          onClick={() => moveItemBy(section.id, item.id, 1)}
                          disabled={section.items[section.items.length - 1]?.id === item.id}
                          aria-label={`Move ${item.name || 'menu item'} down`}
                          title="Move item down"
                          className="border border-menu-charcoal-300 px-2 py-1 text-xs text-menu-charcoal-700 disabled:opacity-40"
                        >↓</button>
                        <label className="sr-only" htmlFor={`move-item-${item.id}`}>Move {item.name || 'menu item'} to section</label>
                        <select
                          id={`move-item-${item.id}`}
                          value={section.id}
                          disabled={menu.sections.length < 2}
                          onChange={(event) => moveItemToSection(section.id, item.id, event.target.value)}
                          className="max-w-48 border border-menu-charcoal-300 bg-white px-2 py-1 text-xs text-menu-charcoal-700 disabled:opacity-50"
                        >
                          {menu.sections.map((targetSection) => (
                            <option key={targetSection.id} value={targetSection.id}>{targetSection.name || 'Untitled section'}</option>
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
                          updateItem(section.id, item.id, {
                            name: e.target.value,
                          }, `item:${item.id}:name`)
                        }
                        placeholder="Dish name"
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          label="Currency"
                          value={item.currency}
                          onChange={(e) =>
                            updateItem(section.id, item.id, {
                              currency: e.target.value,
                            }, `item:${item.id}:currency`)
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
                              updateItem(section.id, item.id, {
                                price: parseFloat(e.target.value) || 0,
                              }, `item:${item.id}:price`)
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 max-w-md">
                      <label htmlFor={`item-subsection-${item.id}`} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-menu-charcoal-700">Subsection</label>
                      <select
                        id={`item-subsection-${item.id}`}
                        value={(section.subsections || []).some((subsection) => subsection.id === item.subsectionId) ? item.subsectionId : ''}
                        onChange={(event) => updateItem(section.id, item.id, { subsectionId: event.target.value || undefined }, `item:${item.id}:subsection`)}
                        className="w-full border border-menu-charcoal-300 bg-white px-3 py-2.5 text-sm text-menu-charcoal-900 focus:outline-none focus:ring-2 focus:ring-menu-gold-500"
                      >
                        <option value="">Keep in {section.name || 'section'}</option>
                        {[...(section.subsections || [])].sort((left, right) => left.order - right.order).map((subsection) => <option key={subsection.id} value={subsection.id}>{subsection.name || 'Untitled subsection'}</option>)}
                      </select>
                      <p className="mt-1 text-xs text-menu-charcoal-500">The selected template will style this group as a nested menu heading.</p>
                    </div>

                    <Textarea
                      label="Description"
                      value={item.description || ''}
                      onChange={(e) =>
                        updateItem(section.id, item.id, {
                          description: e.target.value,
                        }, `item:${item.id}:description`)
                      }
                      placeholder="Describe this item..."
                      rows={2}
                      className="mb-4"
                    />

                    {(() => {
                      const suggestion = descriptionDrafts[item.id] || { facts: '' };
                      const draftIsStale = Boolean(suggestion.draft) && (
                        suggestion.requestedName !== item.name ||
                        suggestion.requestedFacts !== suggestion.facts ||
                        suggestion.requestedLanguage !== menu.originalLanguage
                      );

                      return (
                        <div className="mb-4 border border-menu-gold-300 bg-menu-gold-50 p-4">
                          <div className="mb-3">
                            <h4 className="text-sm font-bold text-menu-charcoal-900">AI description suggestion</h4>
                            <p className="mt-1 text-xs text-menu-charcoal-600">Add only confirmed facts. The current description stays unchanged until you apply a draft.</p>
                            <p className="mt-1 text-xs text-menu-charcoal-500">Only this dish name, your facts, and the Original Language are sent to your configured AI provider.</p>
                          </div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-menu-charcoal-700" htmlFor={`ai-facts-${item.id}`}>
                            Facts to include (optional)
                          </label>
                          <textarea
                            id={`ai-facts-${item.id}`}
                            value={suggestion.facts}
                            onChange={(event) => updateDescriptionDraft(item.id, { facts: event.target.value })}
                            maxLength={1200}
                            rows={2}
                            placeholder="For example: grilled on a charcoal fire; served with house-made sauce"
                            className="w-full border border-menu-charcoal-300 bg-white px-3 py-2 text-sm text-menu-charcoal-900 focus:outline-none focus:ring-2 focus:ring-menu-gold-500"
                          />
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="gold"
                              onClick={() => void generateDescription(item)}
                              disabled={!item.name.trim() || Boolean(suggestion.loading)}
                            >
                              {suggestion.loading ? 'Generating…' : suggestion.draft ? 'Regenerate' : 'Generate with AI'}
                            </Button>
                            {(suggestion.draft || suggestion.loading) && (
                              <Button type="button" size="sm" variant="outline" onClick={() => cancelDescriptionDraft(item.id)}>
                                Cancel
                              </Button>
                            )}
                          </div>
                          {suggestion.loading && <p role="status" className="mt-3 text-xs text-menu-charcoal-600">Preparing one description draft…</p>}
                          {suggestion.error && <p role="alert" className="mt-3 text-xs text-red-700">{suggestion.error}</p>}
                          {suggestion.draft && (
                            <div className="mt-4 border-t border-menu-gold-200 pt-4">
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-menu-charcoal-700" htmlFor={`ai-draft-${item.id}`}>
                                Review draft · {menu.originalLanguage.toUpperCase()}
                              </label>
                              <Textarea
                                id={`ai-draft-${item.id}`}
                                value={suggestion.draft}
                                onChange={(event) => updateDescriptionDraft(item.id, { draft: event.target.value })}
                                rows={3}
                                aria-label={`Review AI description for ${item.name}`}
                              />
                              {draftIsStale && <p role="status" className="mt-2 text-xs text-amber-800">Dish facts or language changed. Regenerate before applying this draft.</p>}
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="primary"
                                  disabled={draftIsStale || !suggestion.draft.trim() || Boolean(suggestion.loading)}
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
                        <label className="block text-sm font-medium text-menu-charcoal-700 uppercase tracking-wide mb-2">
                          Item Photo (Optional)
                        </label>
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-cover border-menu border-menu-charcoal-200"
                            />
                          )}
                          <label className="cursor-pointer flex-1">
                            <div className="border border-dashed border-menu-charcoal-300/60 px-4 py-2.5 hover:border-menu-gold-500 hover:bg-white transition-all text-center rounded-sm bg-menu-cream-100">
                              <span className="text-sm text-menu-charcoal-700 uppercase tracking-wide">
                                {item.image ? 'Change photo' : 'Upload photo'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file)
                                    handleImageUpload(file, section.id, item.id);
                                }}
                                disabled={uploading}
                                className="hidden"
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
                            className="w-4 h-4 text-menu-gold-600 border-menu-charcoal-300"
                          />
                          <span className="text-sm text-menu-charcoal-600 uppercase tracking-wide">Available</span>
                        </label>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(section.id, item.id)}
                          className="!text-red-600 hover:!bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {section.items.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-menu-charcoal-300/60 bg-menu-cream-100 rounded-sm">
                    <svg className="w-12 h-12 mx-auto mb-3 text-menu-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="mb-4 text-sm font-semibold text-menu-charcoal-700">No Items Yet</p>
                    <Button size="sm" variant="gold" onClick={() => addItem(section.id)}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add First Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>

      {/* Save Actions */}
      <div className="sticky bottom-6 bg-menu-cream-50 border border-menu-charcoal-200/60 shadow-menu-lg p-4 rounded-sm">
        {saveError && <p role="alert" className="mb-3 text-sm text-red-700">{saveError}</p>}
        <div className="flex gap-4 justify-end">
          <Button onClick={handleSave} variant="primary" className="min-w-[160px]" disabled={isSaving}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {isSaving ? 'Saving…' : 'Save Menu'}
          </Button>
        </div>
      </div>
    </div>
  );
};
