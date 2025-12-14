'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Menu } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { MenuBuilder } from '@/components/builder/MenuBuilder';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { MenuPreview } from '@/components/preview/MenuPreview';
import { QRCodeDisplay } from '@/components/preview/QRCodeDisplay';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const menuId = searchParams.get('id');

  const [menu, setMenu] = useState<Menu>(() => {
    if (menuId) {
      const existingMenu = MenuService.getMenuById(menuId);
      return existingMenu || MenuService.createDefaultMenu();
    }
    return MenuService.createDefaultMenu();
  });

  const [activeTab, setActiveTab] = useState<'build' | 'template' | 'preview' | 'qr'>('build');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (menuId) {
      const existingMenu = MenuService.getMenuById(menuId);
      if (existingMenu) {
        setMenu(existingMenu);
      }
    }
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

  const tabs = [
    { id: 'build', label: 'Build Menu', icon: '🍽️' },
    { id: 'template', label: 'Template', icon: '🎨' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
    { id: 'qr', label: 'QR & Share', icon: '📱' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Logo & Menu Name */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center transition-transform group-hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-900">MenuCraft</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="font-semibold text-gray-900">{menu.restaurantName}</h1>
                <p className="text-xs text-gray-500">Menu Builder</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {isSaved && (
                <span className="flex items-center gap-1.5 text-sm text-gray-700 font-medium px-3 py-1.5 bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}
              <Button variant="outline" onClick={handleExport} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>
              <Link href={`/menu/${menu.id}`}>
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Live
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900 bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-8 px-6 lg:px-12">
        {activeTab === 'build' && (
          <div className="animate-fade-in">
            <MenuBuilder
              initialMenu={menu}
              onSave={handleSave}
              onPreview={(m) => {
                setMenu(m);
                setActiveTab('preview');
              }}
            />
          </div>
        )}

        {activeTab === 'template' && (
          <div className="max-w-5xl mx-auto px-6 lg:px-12 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <TemplateSelector
                selectedTemplate={menu.template}
                onSelect={handleTemplateChange}
              />
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="max-w-6xl mx-auto px-6 lg:px-12 animate-fade-in">
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Preview Mode</p>
                  <p className="text-sm text-gray-600">
                    This is how your menu will appear to customers. Switch templates to see different styles.
                  </p>
                </div>
              </div>
            </div>
            <MenuPreview menu={menu} />
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-6 animate-fade-in">
            <QRCodeDisplay
              menuId={menu.id}
              primaryColor={menu.customization.primaryColor}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">How to Use Your QR Code</h3>
                  <p className="text-gray-600">Follow these simple steps to share your menu</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  'Download the QR code image using the button above',
                  'Print it on table tents, menus, or window displays',
                  'Customers scan the code to instantly view your menu',
                  'Update your menu anytime - the QR code stays the same!'
                ].map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 font-semibold text-gray-900">
                      {index + 1}
                    </div>
                    <p className="text-gray-600 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading Builder...</p>
        </div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
