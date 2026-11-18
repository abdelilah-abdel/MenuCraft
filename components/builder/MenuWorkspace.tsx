'use client';

import React, { useEffect, useState } from 'react';
import type { Menu } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { useMenuHistory } from '@/lib/hooks/useMenuHistory';
import { useMenuSave } from '@/lib/hooks/useMenuSave';
import { createSampleMenuSections, type SampleTemplateType } from '@/lib/templates/sampleMenus';
import { MenuBuilder } from './MenuBuilder';
import { MenuPreviewPane } from './MenuPreviewPane';
import { TemplateSelector } from './TemplateSelector';
import { QRCodeDisplay } from '../preview/QRCodeDisplay';
import { Button } from '../ui/Button';
import { pruneLayoutReferences } from '@/lib/menuDesign';
import { selectionExists, type EditorSelection } from './editorSelection';

type WorkspaceView = 'content' | 'customize' | 'template' | 'daily' | 'share';
const tabs: { view: WorkspaceView; label: string }[] = [
  { view: 'content', label: 'Content' },
  { view: 'customize', label: 'Customize' },
  { view: 'template', label: 'Templates' },
  { view: 'daily', label: 'Daily Special' },
  { view: 'share', label: 'Share & QR' },
];

export function MenuWorkspace({
  initialMenu,
  initiallyPublished,
  saveMenu = MenuService.saveMenu,
}: {
  initialMenu: Menu;
  initiallyPublished: boolean;
  saveMenu?: (menu: Menu) => Promise<Menu>;
}) {
  const { menu, update: recordUpdate, undo, redo, canUndo, canRedo, saved } = useMenuHistory(initialMenu);
  const update = (change: Menu | ((menu: Menu) => Menu), groupKey?: string) => recordUpdate(current => pruneLayoutReferences(typeof change === 'function' ? change(current) : change), groupKey);
  const publication = useMenuSave({ menu, initialMenu, initiallyPublished, saveMenu, onSaved: saved });
  const [view, setView] = useState<WorkspaceView>('content');
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');
  const selectFromPreview = (target: EditorSelection) => {
    setSelection(target);
    setView('content');
    setMobilePane('edit');
  };

  useEffect(() => {
    if (!selection || selectionExists(menu, selection)) return;
    if (selection.kind === 'item') {
      const destination = menu.sections.find((section) =>
        section.items.some((item) => item.id === selection.itemId)
      );
      if (destination) {
        setSelection({ ...selection, sectionId: destination.id });
        return;
      }
    }
    setSelection(null);
  }, [menu, selection]);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement)
      )
        return;
      if (event.altKey || !(event.metaKey || event.ctrlKey)) return;
      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === 'y') {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [undo, redo]);

  const useSample = (template: SampleTemplateType) => {
    const hasContent = menu.sections.some(
      (section) =>
        section.name.trim() ||
        section.items.length ||
        section.subsections?.length ||
        section.description?.trim()
    );
    if (
      hasContent &&
      !window.confirm(
        'Replace your menu sections and dishes with this editable example? Your restaurant information and display settings will stay as they are.'
      )
    )
      return;
    update((current) => ({
      ...current,
      template,
      sections: createSampleMenuSections(template, current.originalLanguage),
    }));
    setSelection(null);
    setView('content');
    setMobilePane('edit');
  };
  const exportMenu = () => {
    const blob = new Blob([MenuService.exportMenuAsJSON(menu)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${menu.restaurantName.toLowerCase().replace(/\s+/g, '-')}-menu.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 flex min-h-0 flex-col overflow-hidden bg-menu-paper-200 text-menu-ink-900">
      <header className="shrink-0 border-b border-menu-ink-900 bg-menu-paper-50 px-3 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <a href="/" className="font-display text-xl font-bold">
              MenuCraft <span className="text-menu-stamp-500">∗</span>
            </a>
            <h1 className="hidden max-w-64 truncate text-sm text-menu-ink-600 xl:block">
              {menu.restaurantName}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              role="status"
              aria-live="polite"
              className={`text-xs ${publication.error ? 'text-red-700' : 'text-menu-ink-600'}`}
            >
              {publication.status}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo menu change"
            >
              ↶<span className="hidden sm:inline"> Undo</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo menu change"
            >
              ↷<span className="hidden sm:inline"> Redo</span>
            </Button>
            <span className="hidden md:inline-flex">
              <Button type="button" variant="outline" size="sm" onClick={exportMenu}>
                Export
              </Button>
            </span>
            {publication.hasPublished && (
              <a
                href={`/menu/${menu.id}`}
                aria-label="View live menu"
                className="px-2 py-2 text-xs font-semibold underline"
              >
                <span className="hidden sm:inline">View live</span>
                <span aria-hidden="true" className="sm:hidden">
                  ↗
                </span>
              </a>
            )}
            <Button
              type="button"
              variant="stamp"
              size="sm"
              onClick={publication.save}
              disabled={publication.isSaving || (!publication.dirty && !publication.error)}
            >
              {publication.isSaving ? 'Saving…' : publication.error ? 'Retry save' : 'Save menu'}
            </Button>
          </div>
        </div>
        {publication.error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {publication.error} Your edits are still here. Try saving again.
          </p>
        )}
      </header>
      <nav
        aria-label="Menu workspace"
        className="flex shrink-0 items-center justify-between gap-2 border-b border-menu-ink-300 bg-menu-paper-50 px-3 sm:px-6"
      >
        <div className="flex min-w-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.view}
              type="button"
              onClick={() => {
                setView(tab.view);
                setMobilePane('edit');
              }}
              aria-current={view === tab.view ? 'page' : undefined}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold ${view === tab.view ? 'border-menu-stamp-500 text-menu-stamp-600' : 'border-transparent text-menu-ink-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={mobilePane === 'edit' ? 'Show live preview' : 'Return to editor'}
          aria-pressed={mobilePane === 'preview'}
          onClick={() => setMobilePane((pane) => (pane === 'edit' ? 'preview' : 'edit'))}
          className="shrink-0 border border-menu-ink-300 px-3 py-2 text-xs font-semibold lg:hidden"
        >
          {mobilePane === 'edit' ? 'Preview' : 'Edit'}
        </button>
      </nav>
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)]">
        <section
          aria-label="Menu editor"
          className={`min-h-0 min-w-0 overflow-y-auto p-4 sm:p-6 ${mobilePane === 'edit' ? 'block' : 'hidden'} lg:block`}
        >
          <div hidden={view !== 'content' && view !== 'customize'}>
            <MenuBuilder
              menu={menu}
              onMenuChange={update}
              view={view === 'customize' ? 'customize' : 'content'}
              selection={selection}
              onSelect={setSelection}
            />
          </div>
          {view === 'template' && (
            <TemplateSelector
              selectedTemplate={menu.template}
              onSelect={(template) => update((current) => ({ ...current, template }))}
              onUseSample={useSample}
            />
          )}
          {view === 'share' && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Share your menu</h2>
              <QRCodeDisplay menuId={menu.id} primaryColor={menu.customization.primaryColor} />
              <p className="text-sm text-menu-ink-600">
                Save your changes to update the menu at your public link.
              </p>
            </div>
          )}
          {view === 'daily' && <DailySpecial />}
        </section>
        <aside
          aria-label="Live menu preview"
          className={`min-h-0 min-w-0 flex-col overflow-hidden border-menu-ink-300 lg:border-l ${mobilePane === 'preview' ? 'flex' : 'hidden'} lg:flex`}
        >
          <MenuPreviewPane menu={menu} dirty={publication.dirty} selection={selection} onSelect={selectFromPreview} />
        </aside>
      </main>
    </div>
  );
}

function DailySpecial() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-display menu-title text-menu-ink-900 mb-2">Daily Special</h2>
        <p className="menu-description text-sm">Create today's special menu for social media</p>
      </div>

      <div className="space-y-6">
        <div className="menu-card p-6">
          <h3 className="font-display text-lg text-menu-ink-900 mb-4">Today's Specials</h3>
          <div className="space-y-4">
            {[
              { name: "Chef's Special", price: '24', tag: 'NEW' },
              { name: 'Seasonal Soup', price: '12', tag: 'LIMITED' },
              { name: 'Catch of the Day', price: '32', tag: 'FRESH' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-baseline border-b border-menu-ink-100 pb-3">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-display text-base text-menu-ink-900">{item.name}</h4>
                    <span className="text-xs px-2 py-0.5 bg-menu-stamp-500 text-white uppercase tracking-wide">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <span className="menu-price ml-4">${item.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-menu-stamp-300 space-y-3">
            <Button variant="primary" size="sm" className="w-full">
              Download Image
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Copy Shareable Link
            </Button>
          </div>
        </div>

        <div className="bg-menu-stamp-50 border border-menu-stamp-300 p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-menu-stamp-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-menu-ink-900 mb-1 text-sm">Pro Tip</h4>
              <p className="menu-description text-xs">
                Update daily to keep customers engaged. Share on social media with #DailySpecial
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
