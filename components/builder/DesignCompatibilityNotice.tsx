import React from 'react';
import type { Menu } from '@/lib/types/menu';
import { getTemplateConfig } from '@/lib/templates/config';
import { getDesignCompatibility } from '@/lib/templates/designCompatibility';

export function DesignCompatibilityNotice({ menu, onReset }: { menu: Menu; onReset: () => void }) {
  const notes = getDesignCompatibility(menu, getTemplateConfig(menu.template));
  return <section aria-label="Design compatibility" className="mb-5 border border-menu-ink-300 bg-menu-paper-50 p-4 text-sm">
    <h2 className="font-semibold">{notes.length ? 'Saved choices' : 'Your menu stays yours'}</h2>
    <p className="mt-2">Colors, typography, content and photo sources stay with your menu. Compatible styles and placements carry across. Switching designs only updates the preview until you save.</p>
    {notes.length > 0 && <>
      <ul className="my-3 list-disc space-y-2 pl-5">{notes.map(note => <li key={note}>{note}</li>)}</ul>
      <p>Return to a compatible design to restore these choices. Photo fit, focal position and visibility stay saved.</p>
      {(menu.design?.componentStyles || menu.design?.layout) && <button type="button" onClick={onReset} className="mt-3 border border-menu-ink-900 px-3 py-2 font-semibold">Reset saved style and layout choices</button>}
      <p className="mt-2 text-xs">Reset keeps appearance, content and photos. Undo restores the previous choices.</p>
    </>}
  </section>;
}
