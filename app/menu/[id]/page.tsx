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
    const loadMenu = () => {
      try {
        const foundMenu = MenuService.getMenuById(menuId);
        setMenu(foundMenu);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600 mb-6">
            This menu doesn&apos;t exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
