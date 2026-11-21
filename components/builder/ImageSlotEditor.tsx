'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ImagePresentation } from '@/lib/types/menu';
import { imageService } from '@/lib/services/imageService';
import { imageStyle } from '@/lib/imagePresentation';

export function ImageSlotEditor({ label, image, settings = {}, placements, focusTarget, onChange }: {
  label: string;
  image?: string;
  settings?: ImagePresentation;
  placements: readonly NonNullable<ImagePresentation['placement']>[];
  focusTarget: string;
  onChange: (image: string | undefined, settings: ImagePresentation) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(true);
  const latest = useRef({ image, settings, onChange });
  latest.current = { image, settings, onChange };
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const update = (change: Partial<ImagePresentation>) => onChange(image, { ...settings, ...change });
  return <fieldset className="my-4 min-w-0 space-y-3 border border-menu-ink-300 bg-menu-paper-100 p-4">
    <legend className="px-1 font-semibold">{label}</legend>
    {image && <img key={image} src={image} alt={`${label} crop preview`} className="h-32 w-full" style={imageStyle(settings)} onError={event => { event.currentTarget.style.display = 'none'; }} />}
    <label className="relative block cursor-pointer border border-dashed border-menu-ink-400 p-3 text-center focus-within:ring-2 focus-within:ring-menu-stamp-500">
      {loading ? 'Uploading…' : image ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
      <input data-editor-image-control={focusTarget} aria-label={`Upload ${label.toLowerCase()}`} type="file" accept="image/*" disabled={loading} className="sr-only" onChange={async event => {
        const file = event.target.files?.[0]; event.target.value = '';
        if (!file) return;
        setLoading(true); setError('');
        const result = await imageService.uploadImage(file);
        if (!active.current) return;
        setLoading(false);
        if (!result.success) { setError(result.error || 'Upload failed. Try again.'); return; }
        latest.current.onChange(result.url, latest.current.settings);
      }} />
    </label>
    <p className="text-xs text-menu-ink-600">Images up to 2MB. Focal position crops the view and keeps the original photo.</p>
    {error && <p role="alert" className="text-sm text-red-700">{error} Your current photo is kept.</p>}
    {image && <button type="button" className="border px-3 py-2 text-sm" onClick={() => onChange(undefined, settings)}>Remove {label.toLowerCase()}</button>}
    <label className="block text-sm"><input type="checkbox" checked={!settings.hidden} onChange={event => update({ hidden: !event.target.checked })} /> Show {label.toLowerCase()}</label>
    <label className="block text-sm">{label} placement<select aria-label={`${label} placement`} className="mt-1 block w-full border bg-white p-2" value={placements.includes(settings.placement!) ? settings.placement : placements[0]} onChange={event => update({ placement: event.target.value as ImagePresentation['placement'] })}>{placements.map(placement => <option key={placement} value={placement}>{placement.replace('-', ' ')}</option>)}</select></label>
    <label className="block text-sm">{label} fit<select aria-label={`${label} fit`} className="mt-1 block w-full border bg-white p-2" value={settings.fit || 'cover'} onChange={event => update({ fit: event.target.value as ImagePresentation['fit'] })}><option value="cover">Fill and crop</option><option value="contain">Fit whole image</option></select></label>
    {(['focalX', 'focalY'] as const).map((axis, index) => <label key={axis} className="block text-sm">{label} focal {index ? 'vertical' : 'horizontal'} · {settings[axis] ?? 50}%<input aria-label={`${label} focal ${index ? 'vertical' : 'horizontal'}`} className="block w-full" type="range" min="0" max="100" value={settings[axis] ?? 50} onChange={event => update({ [axis]: Number(event.target.value) })} /></label>)}
  </fieldset>;
}
