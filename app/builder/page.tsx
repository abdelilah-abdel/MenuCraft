'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Menu } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { MenuBuilder } from '@/components/builder/MenuBuilder';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { MenuPreview } from '@/components/preview/MenuPreview';
import { QRCodeDisplay } from '@/components/preview/QRCodeDisplay';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

type ViewMode = 'edit' | 'template' | 'daily' | 'share';

function BuilderContent() {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id');

  const [menu, setMenu] = useState<Menu>(() => MenuService.createDefaultMenu());

  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceError, setWorkspaceError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOwnerWorkspace() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const result = await response.json() as { owner?: { id: string } | null };
        if (!response.ok || !result.owner) {
          window.location.assign('/sign-in?next=%2Fbuilder');
          return;
        }

        const ownerMenus = MenuService.getMenusForOwner(result.owner.id);
        const currentMenu = menuId
          ? ownerMenus.find((savedMenu) => savedMenu.id === menuId)
          : ownerMenus[0];

        if (isMounted) {
          setMenu(currentMenu || ownerMenus[0] || MenuService.createDefaultMenu(result.owner.id));
          setIsLoadingWorkspace(false);
        }
      } catch {
        if (isMounted) {
          setWorkspaceError('Unable to load your workspace. Please refresh and try again.');
          setIsLoadingWorkspace(false);
        }
      }
    }

    void loadOwnerWorkspace();
    return () => {
      isMounted = false;
    };
  }, [menuId]);

  const handleSave = (updatedMenu: Menu) => {
    setMenu(updatedMenu);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTemplateChange = (template: typeof menu.template) => {
    setMenu((prev) => ({ ...prev, template }));
  };

  const handleExport = () => {
    const json = MenuService.exportMenuAsJSON(menu);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${menu.restaurantName.toLowerCase().replace(/\s+/g, '-')}-menu.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoadingWorkspace || workspaceError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-menu-cream-200 px-6">
        <div className="text-center max-w-md">
          {workspaceError ? (
            <>
              <p role="alert" className="text-menu-charcoal-700">{workspaceError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-semibold text-menu-gold-700 underline underline-offset-2"
              >
                Try again
              </button>
            </>
          ) : (
            <>
              <div className="menu-ornament mb-6 animate-pulse"></div>
              <p className="font-serif text-xl text-menu-charcoal-700">Loading your workspace…</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-menu-cream-200 flex flex-col">
      {/* Top Bar */}
      <header className="bg-menu-cream-50 border-b-menu border-menu-gold-300 shadow-menu sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo & Name */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl font-serif menu-title text-menu-charcoal-900">MenuCraft</span>
                <span className="text-menu-gold-500 text-sm">∗</span>
              </Link>
              <div className="h-6 w-px bg-menu-gold-300 hidden sm:block"></div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-lg text-menu-charcoal-900">{menu.restaurantName}</h1>
                <p className="text-xs text-menu-charcoal-500 uppercase tracking-wide">Menu Editor</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {isSaved && (
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-menu-gold-700 font-medium px-3 py-2 bg-menu-gold-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}

              <Button variant="outline" onClick={() => setShowPreviewModal(true)} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">Preview</span>
              </Button>

              <Button variant="outline" onClick={handleExport} size="sm" className="hidden md:inline-flex">
                Export
              </Button>

              <Link href={`/menu/${menu.id}`}>
                <Button variant="gold" size="sm">
                  <span className="hidden sm:inline">View Live</span>
                  <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b-menu border-menu-charcoal-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-2 px-6 py-4 transition-all whitespace-nowrap ${
                viewMode === 'edit'
                  ? 'border-b-4 border-menu-gold-500 text-menu-charcoal-900 font-semibold'
                  : 'border-b-4 border-transparent text-menu-charcoal-600 hover:text-menu-charcoal-900 hover:border-menu-gold-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm uppercase tracking-wide">Edit Menu</span>
            </button>

            <button
              onClick={() => setViewMode('template')}
              className={`flex items-center gap-2 px-6 py-4 transition-all whitespace-nowrap ${
                viewMode === 'template'
                  ? 'border-b-4 border-menu-gold-500 text-menu-charcoal-900 font-semibold'
                  : 'border-b-4 border-transparent text-menu-charcoal-600 hover:text-menu-charcoal-900 hover:border-menu-gold-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-sm uppercase tracking-wide">Template</span>
            </button>

            <button
              onClick={() => setViewMode('daily')}
              className={`flex items-center gap-2 px-6 py-4 transition-all whitespace-nowrap ${
                viewMode === 'daily'
                  ? 'border-b-4 border-menu-gold-500 text-menu-charcoal-900 font-semibold'
                  : 'border-b-4 border-transparent text-menu-charcoal-600 hover:text-menu-charcoal-900 hover:border-menu-gold-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm uppercase tracking-wide">Daily Special</span>
            </button>

            <button
              onClick={() => setViewMode('share')}
              className={`flex items-center gap-2 px-6 py-4 transition-all whitespace-nowrap ${
                viewMode === 'share'
                  ? 'border-b-4 border-menu-gold-500 text-menu-charcoal-900 font-semibold'
                  : 'border-b-4 border-transparent text-menu-charcoal-600 hover:text-menu-charcoal-900 hover:border-menu-gold-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm uppercase tracking-wide">Share & QR</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-menu-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {viewMode === 'edit' && (
            <div className="animate-fade-in">
              <MenuBuilder
                initialMenu={menu}
                onSave={handleSave}
                onPreview={(m) => setMenu(m)}
              />
            </div>
          )}

          {viewMode === 'template' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-serif menu-title text-menu-charcoal-900 mb-2">Choose Template</h2>
                <p className="menu-description text-sm">Select the style that fits your restaurant</p>
              </div>
              <TemplateSelector
                selectedTemplate={menu.template}
                onSelect={handleTemplateChange}
              />
            </div>
          )}

          {viewMode === 'daily' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-serif menu-title text-menu-charcoal-900 mb-2">Daily Special</h2>
                <p className="menu-description text-sm">Create today's special menu for social media</p>
              </div>

              <div className="space-y-6">
                <div className="menu-card p-6">
                  <h3 className="font-serif text-lg text-menu-charcoal-900 mb-4">Today's Specials</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Chef\'s Special', price: '24', tag: 'NEW' },
                      { name: 'Seasonal Soup', price: '12', tag: 'LIMITED' },
                      { name: 'Catch of the Day', price: '32', tag: 'FRESH' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-baseline border-b border-menu-charcoal-100 pb-3">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <h4 className="font-serif text-base text-menu-charcoal-900">{item.name}</h4>
                            <span className="text-xs px-2 py-0.5 bg-menu-gold-500 text-white uppercase tracking-wide">
                              {item.tag}
                            </span>
                          </div>
                        </div>
                        <span className="menu-price ml-4">${item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-menu-gold-300 space-y-3">
                    <Button variant="primary" size="sm" className="w-full">
                      Download Image
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Copy Shareable Link
                    </Button>
                  </div>
                </div>

                <div className="bg-menu-gold-50 border border-menu-gold-300 p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-menu-gold-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-menu-charcoal-900 mb-1 text-sm">Pro Tip</h4>
                      <p className="menu-description text-xs">
                        Update daily to keep customers engaged. Share on social media with #DailySpecial
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'share' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-serif menu-title text-menu-charcoal-900 mb-2">Share Your Menu</h2>
                <p className="menu-description text-sm">Download QR codes and share links</p>
              </div>

              <div className="space-y-6">
                <QRCodeDisplay
                  menuId={menu.id}
                  primaryColor={menu.customization.primaryColor}
                />

                <div className="menu-card p-6">
                  <h4 className="font-serif text-lg text-menu-charcoal-900 mb-4">How to Use</h4>
                  <div className="space-y-3">
                    {[
                      { step: 'Download QR code above' },
                      { step: 'Print on table tents or displays' },
                      { step: 'Customers scan to view menu' },
                      { step: 'Update anytime - QR stays same' }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="w-6 h-6 border border-menu-gold-500 flex items-center justify-center flex-shrink-0 font-serif text-sm text-menu-gold-600">
                          {index + 1}
                        </div>
                        <p className="menu-description text-sm pt-0.5">{item.step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setShowPreviewModal(false)}>
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-menu-cream-200 shadow-menu-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-menu-cream-50 border-b border-menu-charcoal-200 px-6 py-4 z-10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-menu-charcoal-900">Live Preview</h3>
                <p className="text-xs text-menu-charcoal-500 uppercase tracking-wide">Template: <span className="text-menu-gold-600 font-semibold">{menu.template}</span></p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-menu-cream-200 transition-colors"
              >
                <svg className="w-6 h-6 text-menu-charcoal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="max-w-4xl mx-auto">
                <MenuPreview menu={menu} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-menu-cream-200">
        <div className="text-center">
          <div className="menu-ornament mb-6 animate-pulse"></div>
          <p className="font-serif text-xl text-menu-charcoal-700">Loading Builder...</p>
          <p className="menu-description mt-2">Preparing your workspace</p>
        </div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
