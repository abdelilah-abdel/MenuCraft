'use client';

import React from 'react';
import type { Menu } from '@/lib/types/menu';
import { resolveLayout, type MenuLayout } from '@/lib/menuDesign';
import { getTemplateConfig } from '@/lib/templates/config';

export function MenuLayoutPanel({ menu, onChange }: { menu: Menu; onChange: (update: (menu: Menu) => Menu) => void }) {
  const config = getTemplateConfig(menu.template);
  const options = config.layoutOptions;
  const layout = resolveLayout(menu, config);
  const update = (change: Partial<MenuLayout>) => onChange(current => ({ ...current, design: { ...current.design, layout: { ...current.design?.layout, ...change } } }));
  return <section className="space-y-4 border border-menu-ink-900 bg-menu-paper-50 p-5">
    <h2 className="font-display text-xl font-bold">Layout</h2>
    {options ? <>
      <p className="text-sm text-menu-ink-600">The restaurant header stays full width. Place whole sections in columns; dishes keep their content order. Columns stack on small screens.</p>
      <label className="block text-sm font-semibold">Menu columns<select aria-label="Menu columns" className="mt-1 block w-full border bg-white p-3" value={layout.columns} onChange={event => {
        const columns = Number(event.target.value) as 1 | 2 | 3;
        const sectionRegions = Object.fromEntries(Object.entries(menu.design?.layout?.sectionRegions || {}).map(([id, region]) => [id, Number(region.slice(-1)) > columns ? options.regions[0] : region]));
        update({ columns, sectionRegions });
      }}>{options.columns.map(count => <option key={count} value={count}>{count} {count === 1 ? 'column' : 'columns'}</option>)}</select></label>
      {(['spacing', 'alignment'] as const).map(kind => <label key={kind} className="block text-sm font-semibold">{kind === 'spacing' ? 'Menu spacing' : 'Menu alignment'}<select aria-label={kind === 'spacing' ? 'Menu spacing' : 'Menu alignment'} className="mt-1 block w-full border bg-white p-3" value={layout[kind]} onChange={event => update({ [kind]: event.target.value })}>{options[kind].map(choice => <option key={choice} value={choice}>{choice}</option>)}</select></label>)}
      <fieldset className="space-y-3 border-t pt-3"><legend className="font-semibold">Section placement</legend>
        {menu.sections.map(section => <label key={section.id} className="block text-sm">{section.name || 'Untitled section'}{section.hidden ? ' · Hidden' : ''}<select aria-label={`Place section ${section.name}`} className="mt-1 block w-full border bg-white p-3" value={menu.design?.layout?.sectionRegions?.[section.id] || ''} onChange={event => {
          const assignments = Object.fromEntries(Object.entries(menu.design?.layout?.sectionRegions || {}).filter(([id]) => id !== section.id));
          if (event.target.value) assignments[section.id] = event.target.value as NonNullable<MenuLayout['sectionRegions']>[string];
          update({ columns: layout.columns as 1 | 2 | 3, sectionRegions: assignments });
        }}><option value="">Automatic</option>{layout.regions.map(region => <option key={region} value={region}>{region.replace('-', ' ')}</option>)}</select></label>)}
      </fieldset>
      <button type="button" className="border px-4 py-2 text-sm font-semibold" onClick={() => onChange(current => ({ ...current, design: { ...current.design, layout: undefined } }))}>Reset layout</button>
      <p className="text-xs text-menu-ink-600">These controls arrange your web menu. Print pagination will be configured separately.</p>
    </> : <p className="text-sm">This design uses its signature layout. Choose Atlas Simple for column and section placement choices.</p>}
  </section>;
}
