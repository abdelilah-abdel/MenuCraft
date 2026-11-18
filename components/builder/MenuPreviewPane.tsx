import React, { useEffect, useRef, useState } from 'react';
import type { Menu } from '@/lib/types/menu';
import { MenuPreview } from '../preview/MenuPreview';

const CANVAS_WIDTH = 800;

export function MenuPreviewPane({ menu, dirty }: { menu: Menu; dirty: boolean }) {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(CANVAS_WIDTH);
  const [height, setHeight] = useState(1);
  const [zoom, setZoom] = useState('fit');
  useEffect(() => {
    const area = viewport.current;
    const content = canvas.current;
    if (!area || !content) return;
    setAvailableWidth(Math.max(1, area.clientWidth - 32));
    const areaObserver = new ResizeObserver(([entry]) =>
      setAvailableWidth(Math.max(1, entry.contentRect.width))
    );
    const contentObserver = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    areaObserver.observe(area);
    contentObserver.observe(content);
    return () => {
      areaObserver.disconnect();
      contentObserver.disconnect();
    };
  }, []);
  const scale = zoom === 'fit' ? Math.min(1, availableWidth / CANVAS_WIDTH) : Number(zoom);

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-menu-ink-200 bg-menu-paper-100 px-4 py-3">
        <div>
          <h2 className="font-display text-lg font-bold">Live Preview</h2>
          <p className="text-xs text-menu-ink-500">
            {dirty ? 'Unsaved preview' : 'Published version'} · {menu.template}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="preview-zoom" className="text-xs text-menu-ink-600">
            Zoom
          </label>
          <select
            id="preview-zoom"
            value={zoom}
            onChange={(event) => setZoom(event.target.value)}
            className="max-w-32 border border-menu-ink-300 bg-white px-2 py-1 text-sm"
          >
            <option value="fit">Fit width</option>
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
          </select>
          <span className="min-w-10 text-right text-xs tabular-nums text-menu-ink-500">
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>
      <div
        ref={viewport}
        className="min-h-0 flex-1 overflow-auto bg-menu-paper-200 p-4"
        tabIndex={0}
        aria-label="Scrollable menu preview"
      >
      <div className="mx-auto overflow-hidden" style={{ width: CANVAS_WIDTH * scale, height: height * scale }}>
          <div
            ref={canvas}
            style={{ width: CANVAS_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            <MenuPreview menu={menu} />
          </div>
        </div>
      </div>
    </>
  );
}
