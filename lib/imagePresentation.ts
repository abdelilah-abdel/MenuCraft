import type { ImagePresentation } from './types/menu';

export function isImagePresentation(value: unknown): value is ImagePresentation | undefined {
  if (value === undefined) return true;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const settings = value as Record<string, unknown>;
  return (settings.hidden === undefined || typeof settings.hidden === 'boolean') &&
    (settings.fit === undefined || settings.fit === 'cover' || settings.fit === 'contain') &&
    ['focalX', 'focalY'].every(key => settings[key] === undefined || (typeof settings[key] === 'number' && Number.isFinite(settings[key]) && settings[key] >= 0 && settings[key] <= 100)) &&
    (settings.placement === undefined || (typeof settings.placement === 'string' && ['thumbnail', 'card-top', 'text-side', 'banner', 'heading-side', 'above', 'below'].includes(settings.placement)));
}

export function imageStyle(settings?: ImagePresentation): React.CSSProperties {
  return { objectFit: settings?.fit || 'cover', objectPosition: `${settings?.focalX ?? 50}% ${settings?.focalY ?? 50}%` };
}
