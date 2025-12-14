'use client';

import React from 'react';
import { Menu } from '@/lib/types/menu';
import { getTemplate } from '@/lib/templates';

interface MenuPreviewProps {
  menu: Menu;
  className?: string;
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ menu, className = '' }) => {
  const TemplateComponent = getTemplate(menu.template);

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <TemplateComponent menu={menu} />
    </div>
  );
};
