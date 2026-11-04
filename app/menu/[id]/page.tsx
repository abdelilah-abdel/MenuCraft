'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Menu } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { getTemplate } from '@/lib/templates';

export default function MenuPage() {
  const params = useParams();
  const menuId = params.id as string;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const foundMenu = await MenuService.getMenuById(menuId);
        setMenu(foundMenu);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600 mb-6">
            This menu doesn&apos;t exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Create Your Own Menu
          </a>
        </div>
      </div>
    );
  }

  const TemplateComponent = getTemplate(menu.template);

  return (
    <div>
      <TemplateComponent menu={menu} />
    </div>
  );
}
