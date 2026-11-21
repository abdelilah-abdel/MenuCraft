'use client';

import React from 'react';
import { MenuTemplate } from '@/lib/templates';
import { createTemplateExample } from '@/lib/templates/examples';

export function TemplateExample({ template }: { template: string }) {
  return <div data-template-example={template}>
    <MenuTemplate menu={createTemplateExample(template)} />
    <p className="bg-menu-paper-50 p-4 text-center text-sm">Example content for this design. Your own menu stays separate.</p>
  </div>;
}
