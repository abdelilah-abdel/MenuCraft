'use client';

import React from 'react';
import { TemplateType } from '@/lib/types/menu';
import { templateInfo } from '@/lib/templates';
import { getTemplateOptions, TEMPLATE_CONFIGS } from '@/lib/templates/config';
import { hasSampleMenu, type SampleTemplateType } from '@/lib/templates/sampleMenus';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
  /** Load an editable example only for legacy Moroccan collections;
   * configurable new templates select directly. */
  onUseSample: (template: SampleTemplateType) => void;
}

const availableTemplates = getTemplateOptions(TEMPLATE_CONFIGS);
const moroccanTemplates = availableTemplates.filter((definition) => definition.category === 'Moroccan').map((definition) => definition.id);
const originalTemplates = availableTemplates.filter((definition) => definition.category !== 'Moroccan').map((definition) => definition.id);

const demoPhotos = {
  tagine: 'https://images.unsplash.com/photo-1517314597476-e1788060b6cb?auto=format&fit=crop&w=900&q=80',
  tea: 'https://images.unsplash.com/photo-1591299089616-c9604047b1a6?auto=format&fit=crop&w=600&q=80',
  couscous: 'https://images.unsplash.com/photo-1739217744880-472f59559cc5?auto=format&fit=crop&w=700&q=80',
};

function TemplateMiniature({ template }: { template: TemplateType }) {
  if (template === 'medina-cafe') {
    return (
      <div className="h-full overflow-hidden rounded-md bg-[#f5f0e3] text-[#352b22]">
        <div className="relative h-20 bg-[#1e6b70]">
          <img src={demoPhotos.tagine} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white"><span className="text-[7px] uppercase tracking-[.3em]">Cuisine du Maroc</span><span className="mt-1 font-display text-lg">Dar Medina</span></div>
        </div>
        <div className="p-3">
          <div className="mb-2 flex justify-center gap-1.5">{['Matin', 'Déjeuner', 'Thé'].map((label) => <span key={label} className="rounded-full border border-[#cbb890] px-2 py-0.5 text-[6px] uppercase tracking-wide">{label}</span>)}</div>
          <p className="border-b border-[#d8c8a5] pb-1 text-center font-display text-[10px] font-semibold text-[#8b4b2b]">Les classiques du jour</p>
          <div className="mt-2 space-y-1.5">{['Salades marocaines', 'Tajines & couscous', 'Douceurs maison'].map((label, i) => <div key={label} className="flex items-center gap-2"><span className="h-px flex-1 bg-[#d8c8a5]"/><span className="text-[7px] text-[#74685a]">{label}</span><span className="h-px w-5 bg-[#c98b48]" /></div>)}</div>
        </div>
      </div>
    );
  }

  if (template === 'moroccan-fine-dining') {
    return (
      <div className="h-full overflow-hidden rounded-md bg-[#f7f4ee] text-[#352b2b]">
        <div className="grid h-24 grid-cols-[1fr_1.15fr] bg-[#332323] text-[#f7f1e7]">
          <div className="flex flex-col justify-center px-4"><span className="text-[6px] uppercase tracking-[.3em] text-[#d8bd8a]">L’art de recevoir</span><span className="mt-1 font-display text-sm">La Table Royale</span><span className="mt-1 text-[7px] text-white/60">Menu de saison</span></div>
          <img src={demoPhotos.couscous} alt="" className="h-full w-full object-cover opacity-85" />
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {['Entrées', 'Poissons', 'Viandes', 'Desserts'].map((label, i) => <div key={label} className="border-b border-[#d6c9b6] pb-1"><span className="block font-display text-[9px] text-[#8b6a38]">{label}</span><span className="mt-1 block h-1 w-4/5 rounded bg-[#b9ada0]"/><span className="mt-1 block h-1 w-3/5 rounded bg-[#d3cbc1]"/></div>)}
        </div>
      </div>
    );
  }

  if (template === 'modern-moroccan-garden') {
    return (
      <div className="h-full overflow-hidden rounded-md bg-[#f7f8f1] text-[#2f3b2c]">
        <div className="relative h-24 bg-[#526d49]"><img src={demoPhotos.tea} alt="" className="h-full w-full object-cover opacity-75"/><div className="absolute inset-0 bg-gradient-to-r from-[#263b2a]/90 to-transparent"/><div className="absolute inset-y-0 left-4 flex flex-col justify-center text-white"><span className="text-[6px] uppercase tracking-[.3em] text-[#e5d4a8]">Du jardin à la table</span><span className="mt-1 font-display text-lg">Jardin d’Atlas</span></div></div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {[['Local', demoPhotos.couscous], ['À partager', demoPhotos.tagine]].map(([label, image]) => <div key={label} className="overflow-hidden rounded-md border border-[#dbe3d2] bg-white"><img src={image} alt="" className="h-14 w-full object-cover"/><div className="flex items-center justify-between p-1.5"><span className="text-[7px] font-semibold">{label}</span><span className="h-1 w-5 rounded bg-[#90a27b]"/></div></div>)}
        </div>
      </div>
    );
  }

  if (template === 'modern') {
    return <div className="h-full rounded-md bg-[#101010] p-3"><div className="h-8 rounded bg-gradient-to-r from-emerald-600 to-teal-800"/><div className="mt-3 grid grid-cols-2 gap-2"><div className="h-20 rounded bg-zinc-800"/><div className="h-20 rounded bg-zinc-800"/></div></div>;
  }
  if (template === 'minimal') {
    return <div className="h-full rounded-md bg-white p-4"><div className="mx-auto h-2 w-1/2 bg-gray-900"/><div className="mt-6 space-y-3">{[0, 1, 2].map((entry) => <div key={entry} className="flex justify-between border-b border-gray-200 pb-2"><span className="h-1.5 w-1/2 rounded bg-gray-400"/><span className="h-1.5 w-1/6 rounded bg-gray-300"/></div>)}</div></div>;
  }
  return <div className="h-full rounded-md bg-[#faf9f6] p-4"><div className="mx-auto h-2 w-3/4 rounded bg-[#292524]"/><div className="mx-auto mt-2 h-1 w-1/2 rounded bg-[#cbb890]"/><div className="mt-6 space-y-4">{[0, 1, 2].map((entry) => <div key={entry} className="flex justify-between border-b border-gray-200 pb-2"><span className="h-1.5 w-2/5 rounded bg-gray-500"/><span className="h-1.5 w-1/6 rounded bg-gray-300"/></div>)}</div></div>;
}

function TemplateCard({ template, selected, onSelect, onUseSample }: { template: TemplateType; selected: boolean; onSelect: (template: TemplateType) => void; onUseSample?: () => void }) {
  const info = templateInfo[template];
  return (
    <article className={`group relative flex h-full flex-col border-[1.5px] border-menu-ink-900 bg-menu-paper-50 p-4 transition sm:p-5 ${selected ? 'border-menu-stamp-500 ring-2 ring-menu-stamp-500/30' : 'hover:bg-menu-paper-100'}`}>
      {selected && <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-menu-stamp-500 text-white" aria-label="Selected template">✓</span>}
      <button type="button" aria-pressed={selected} onClick={() => onSelect(template)} className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-stamp-500">
        <div className="mb-4 flex items-start justify-between gap-3 pr-8">
          <div><span className={`mb-2 inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${info.category === 'Moroccan' ? 'bg-menu-stamp-50 text-menu-stamp-600 border border-menu-stamp-500' : 'bg-menu-paper-200 text-menu-ink-600 border border-menu-ink-300'}`}>{info.category}</span><h4 className="font-display text-xl font-bold text-menu-ink-900">{info.name}</h4></div>
        </div>
        <div className="mb-4 h-52 overflow-hidden border border-menu-ink-900"><TemplateMiniature template={template} /></div>
        <p className="text-sm leading-relaxed text-menu-ink-500">{info.description}</p>
        <p className="mt-2 text-xs text-[#857a6b]">{info.preview}</p>
        <span className={`mt-auto pt-5 text-center text-sm font-semibold ${selected ? 'text-menu-stamp-600' : 'text-menu-ink-600 group-hover:text-menu-ink-900'}`}>{selected ? 'Currently selected' : 'Use this design'}</span>
      </button>
      {onUseSample && <button type="button" onClick={onUseSample} className="mt-3 w-full border border-menu-ink-900 bg-menu-paper-100 px-3 py-2.5 text-sm font-semibold text-menu-ink-700 transition hover:bg-menu-ink-900 hover:text-menu-paper-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-stamp-500">Load full example menu</button>}
    </article>
  );
}

function useSampleForTemplate(
  template: TemplateType,
  onUseSample: TemplateSelectorProps['onUseSample'],
): (() => void) | undefined {
  if (!hasSampleMenu(template)) return undefined;
  return () => onUseSample(template);
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect, onUseSample }) => (
  <div className="space-y-8">
    <div>
      <h3 className="font-display text-3xl font-bold text-menu-ink-900">Choose a full menu design</h3>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-menu-ink-500">Each preset changes the full menu presentation—header, section hierarchy, subsection styling, item layout, and photography treatment. Switching designs keeps your content; use “Load full example menu” to try editable sample dishes and photos.</p>
    </div>

    <section aria-labelledby="moroccan-template-heading">
      <div className="mb-4"><h4 id="moroccan-template-heading" className="font-display text-xl font-bold text-menu-ink-900">Moroccan collection</h4><p className="mt-1 text-sm text-menu-ink-500">Original designs informed by restaurant menus from Morocco, plus configuration-only library designs.</p></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{moroccanTemplates.map((template) => <TemplateCard key={template} template={template} selected={selectedTemplate === template} onSelect={onSelect} onUseSample={useSampleForTemplate(template, onUseSample)} />)}</div>
    </section>

    <section aria-labelledby="original-template-heading">
      <div className="mb-4"><h4 id="original-template-heading" className="font-display text-xl font-bold text-menu-ink-900">More layouts</h4><p className="mt-1 text-sm text-menu-ink-500">Your existing designs remain available for saved menus.</p></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{originalTemplates.map((template) => <TemplateCard key={template} template={template} selected={selectedTemplate === template} onSelect={onSelect} />)}</div>
    </section>

    <p className="text-xs text-[#857a6b]">Template and sample menu photos: <a className="underline underline-offset-2" href="https://unsplash.com/photos/flavored-food-on-bowl-beside-plate-on-top-of-table-wGzO3Qvp98Q" target="_blank" rel="noreferrer">Annie Spratt</a>, <a className="underline underline-offset-2" href="https://unsplash.com/photos/clear-drinking-glass-with-green-leaves-Bmek6EYG9Uk" target="_blank" rel="noreferrer">Jaida Stewart</a>, <a className="underline underline-offset-2" href="https://unsplash.com/photos/a-white-plate-topped-with-rice-and-vegetables-lOMCKZ1LHQ4" target="_blank" rel="noreferrer">Mourad HARKAT</a>, and <a className="underline underline-offset-2" href="https://unsplash.com/photos/stainless-steel-cooking-pot-on-black-stove-cNdUiKmmTRs" target="_blank" rel="noreferrer">Eduardo Casajús Gorostiaga</a> / Unsplash. Photos in your own menu can also come from your uploads.</p>
  </div>
);
