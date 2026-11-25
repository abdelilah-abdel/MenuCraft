'use client';

import React, { useEffect, useState } from 'react';

const allowedElements = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
  'defs', 'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'use', 'style',
]);
const allowedAttributes = new Set([
  'xmlns', 'viewbox', 'width', 'height', 'preserveaspectratio', 'fill', 'fill-opacity',
  'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin',
  'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'transform',
  'd', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'points',
  'id', 'class', 'offset', 'stop-color', 'stop-opacity', 'gradientunits', 'gradienttransform',
  'clip-path', 'mask', 'style', 'href', 'xlink:href', 'xmlns:xlink',
]);

function sanitizeSvg(source: string, prefix: string) {
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  const root = parsed.documentElement;
  if (root.localName.toLowerCase() !== 'svg' || parsed.querySelector('parsererror')) return '';
  const idMap = new Map<string, string>();
  root.querySelectorAll('[id]').forEach((element) => {
    const original = element.getAttribute('id');
    if (original) { const next = `${prefix}-${original.replace(/[^a-zA-Z0-9_-]/g, '-')}`; idMap.set(original, next); element.setAttribute('id', next); }
  });
  const nodes = [root, ...Array.from(root.querySelectorAll('*'))];
  for (const element of nodes) {
    if (!allowedElements.has(element.localName.toLowerCase())) { element.remove(); continue; }
    if (element.localName.toLowerCase() === 'style' && /@import|url\((?!\s*['"]?#)/i.test(element.textContent || '')) { element.remove(); continue; }
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;
      if (name.startsWith('on') || !allowedAttributes.has(name) || /javascript:|https?:|data:/i.test(value)) { element.removeAttribute(attribute.name); continue; }
      if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#')) { element.removeAttribute(attribute.name); continue; }
      if (name === 'style' && /url\((?!\s*['"]?#)/i.test(value)) { element.removeAttribute(attribute.name); continue; }
      if (name === 'style') {
        const safe = value.split(';').filter((rule) => !/expression|@import|behavior/i.test(rule)).join(';');
        element.setAttribute(attribute.name, safe);
      }
    }
  }
  let markup = new XMLSerializer().serializeToString(root);
  for (const [oldId, newId] of idMap) markup = markup.replaceAll(`url(#${oldId})`, `url(#${newId})`).replaceAll(`href="#${oldId}"`, `href="#${newId}"`);
  return markup;
}

export function CanvasVectorVisual({ src, sourceColors, colors, label, className }: {
  src: string;
  sourceColors: readonly string[];
  colors: string[];
  label: string;
  className?: string;
}) {
  const [markup, setMarkup] = useState('');
  useEffect(() => {
    let cancelled = false;
    fetch(src).then((response) => response.ok ? response.text() : '').then((source) => {
      if (!source || cancelled) return;
      let tagged = source;
      sourceColors.forEach((value, index) => {
        const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        tagged = tagged.replace(new RegExp(escaped, 'gi'), `__CANVAS_COLOR_${index}__`);
      });
      let safeMarkup = sanitizeSvg(tagged, `vector-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
      sourceColors.forEach((sourceColor, index) => { safeMarkup = safeMarkup.replaceAll(`__CANVAS_COLOR_${index}__`, colors[index] || sourceColor); });
      if (!cancelled) setMarkup(safeMarkup);
    }).catch(() => { if (!cancelled) setMarkup(''); });
    return () => { cancelled = true; };
  }, [src, label, sourceColors.join('|'), colors.join('|')]);
  return <div role="img" aria-label={label} className={className} style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: markup }} />;
}
