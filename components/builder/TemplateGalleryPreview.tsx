'use client';

import React, { useEffect, useRef, useState } from 'react';

/** A separate viewport uses the real renderer, CSS and example route. */
export function TemplateGalleryPreview({ id, name }: { id: string; name: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(280);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    if (frame.current) observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => setStatus(current => current === 'loading' ? 'error' : current), 20000);
    return () => window.clearTimeout(timer);
  }, [attempt]);
  return <div ref={frame} className="relative h-64 w-full overflow-hidden border border-menu-ink-900 bg-menu-paper-100" data-gallery-preview={id}>
    {status !== 'error' && <iframe key={attempt} title={`${name} example preview`} src={`/templates/${id}/preview`} tabIndex={-1} aria-hidden="true" inert
      className="pointer-events-none absolute left-0 top-0 border-0" style={{ width: 800, height: 1000, transform: `scale(${width / 800})`, transformOrigin: 'top left' }}
      onLoad={event => setStatus(event.currentTarget.contentDocument?.querySelector('[data-template-example]') ? 'ready' : 'error')}
      onError={() => setStatus('error')} />}
    {status === 'loading' && <p role="status" className="absolute inset-0 grid place-content-center bg-menu-paper-100 text-sm">Loading example…</p>}
    {status === 'error' && <div role="alert" className="absolute inset-0 grid place-content-center gap-3 p-4 text-sm"><p>Example preview could not load.</p><button type="button" className="border p-2" aria-label={`Retry ${name} preview`} onClick={() => { setStatus('loading'); setAttempt(value => value + 1); }}>Retry preview</button></div>}
  </div>;
}
