'use client';

import React from 'react';
import { Menu } from '@/lib/types/menu';
import { MenuTemplate } from '@/lib/templates';

interface MenuPreviewProps {
  menu: Menu;
  className?: string;
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ menu, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <MenuTemplate menu={menu} />
    </div>
  );
};
