'use client';

import React from 'react';
import type { Menu } from '@/lib/types/menu';
import { MENU_FONTS, TEXT_SIZES, resolveAppearance, type MenuAppearance } from '@/lib/menuDesign';
import { getTemplateConfig } from '@/lib/templates/config';

export function MenuDesignPanel({ menu, onChange }: { menu: Menu; onChange: (update: (menu: Menu) => Menu, groupKey?: string) => void }) {
  const config = getTemplateConfig(menu.template);
  const appearance = resolveAppearance(menu, config);
  const update = (change: Partial<MenuAppearance>, key: string) => onChange(current => ({ ...current, design: { ...current.design, appearance: { ...current.design?.appearance, ...change } } }), `appearance:${key}`);
  return <section className="space-y-4 border border-menu-ink-900 bg-menu-paper-50 p-5">
    <h2 className="font-display text-xl font-bold">Overall appearance</h2>
    <p className="text-sm text-menu-ink-600">Choose your menu colors and type. Reset restores this design’s defaults and keeps all your content.</p>
    {(['primaryColor', 'secondaryColor', 'backgroundColor'] as const).map((key, index) => <div key={key}>
      <label htmlFor={`appearance-${key}`} className="mb-1 block text-sm font-semibold">{['Primary color', 'Secondary color', 'Background color'][index]}</label>
      <input id={`appearance-${key}`} type="color" className="h-11 w-full cursor-pointer border bg-white p-1" value={appearance[key]} onInput={event => update({ [key]: event.currentTarget.value }, key)} onChange={event => update({ [key]: event.target.value }, key)} />
    </div>)}
    <div><label htmlFor="appearance-font" className="block text-sm font-semibold">Typography</label>
      <select id="appearance-font" className="mt-1 w-full border bg-white p-3" value={menu.design?.appearance?.fontFamily || (menu.design?.appearance?.inheritTemplate ? 'template' : appearance.bodyFont)} onChange={event => update({ fontFamily: event.target.value }, 'font')}>
        <option value="template">Template typography</option>{MENU_FONTS.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
      </select>
    </div>
    <div><label htmlFor="appearance-size" className="block text-sm font-semibold">Text size</label><select id="appearance-size" className="mt-1 w-full border bg-white p-3" value={appearance.textSize} onChange={event => update({ textSize: event.target.value as MenuAppearance['textSize'] }, 'size')}>{TEXT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}</select></div>
    <button type="button" className="border border-menu-ink-900 px-4 py-2 text-sm font-semibold" onClick={() => onChange(current => ({ ...current, design: { ...current.design, appearance: { inheritTemplate: true } } }))}>Reset appearance</button>
  </section>;
}
