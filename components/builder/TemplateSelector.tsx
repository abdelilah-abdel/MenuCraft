'use client';

import React from 'react';
import type { TemplateType } from '@/lib/types/menu';
import { getTemplateOptions, TEMPLATE_CONFIGS, type TemplateConfig } from '@/lib/templates/config';
import { TemplateGalleryPreview } from './TemplateGalleryPreview';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
  onUseSample: (template: TemplateType) => void;
}

function TemplateCard({ definition, selected, onSelect, onUseSample }: {
  definition: TemplateConfig; selected: boolean; onSelect: () => void; onUseSample: () => void;
}) {
  const planned = definition.formats.filter(format => !definition.verifiedFormats.includes(format));
  return <article className={`flex min-w-0 flex-col gap-3 border-[1.5px] bg-menu-paper-50 p-4 ${selected ? 'border-menu-stamp-500 ring-2 ring-menu-stamp-500/30' : 'border-menu-ink-900'}`}>
    <span className="text-xs font-bold uppercase text-menu-stamp-600">{definition.category}</span>
    <h3 className="font-display text-xl font-bold">{definition.name}</h3>
    <TemplateGalleryPreview id={definition.id} name={definition.name} />
    <a href={`/templates/${definition.id}/preview`} target="_blank" rel="noreferrer" className="text-sm underline" aria-label={`View ${definition.name} full example`}>View full example ↗</a>
    <p className="text-xs text-menu-ink-500">Top of an example menu, separate from your content.</p>
    <p className="text-sm text-menu-ink-600">{definition.description}</p>
    <p className="text-xs">Verified: {definition.verifiedFormats.join(', ') || 'None yet'}</p>
    {planned.length > 0 && <p className="text-xs text-menu-ink-500">Planned, not yet verified: {planned.join(', ')}</p>}
    <button type="button" aria-label={`Use ${definition.name} design`} aria-pressed={selected} onClick={onSelect} className="mt-auto border border-menu-ink-900 bg-menu-ink-900 px-3 py-3 text-sm font-semibold text-menu-paper-50 focus-visible:ring-2 focus-visible:ring-menu-stamp-500">{selected ? 'Currently selected ✓' : 'Use this design'}</button>
    <button type="button" aria-label={`Load ${definition.name} example menu`} onClick={onUseSample} className="border border-menu-ink-900 px-3 py-3 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-menu-stamp-500">Load example content</button>
  </article>;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect, onUseSample }) => <div className="space-y-6">
  <div>
    <h2 className="font-display text-3xl font-bold">Choose a menu design</h2>
    <p className="mt-2 text-sm text-menu-ink-600">Examples use the same renderer as your menu. Use a design to keep your content, or separately load its editable example sections and dishes.</p>
  </div>
  <div className="grid gap-5 md:grid-cols-2">
    {getTemplateOptions(TEMPLATE_CONFIGS).map(definition => <TemplateCard key={definition.id} definition={definition} selected={selectedTemplate === definition.id} onSelect={() => onSelect(definition.id)} onUseSample={() => onUseSample(definition.id)} />)}
  </div>
  <p className="text-xs text-menu-ink-500">Example dish photos use Unsplash images and are illustrative. Replace them with your own uploads before publishing.</p>
</div>;
