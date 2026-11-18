import React from 'react';
import type { Menu } from '../types/menu';
import { imageStyle } from '../imagePresentation';
import { usePreviewTarget } from './previewSelection';

export function RestaurantLogo({ menu, className }: { menu: Menu; className?: string }) {
  const target = usePreviewTarget();
  const { logoImage, logoPresentation, logoSize } = menu.customization;
  if (!logoImage || logoPresentation?.hidden) return null;
  return <img key={logoImage} {...target({ kind: 'restaurant' }, 'Edit restaurant logo in preview', true)} src={logoImage} alt={`${menu.restaurantName} logo`} className={className} style={{ ...imageStyle({ fit: 'contain', ...logoPresentation }), height: logoSize, pointerEvents: 'auto' }} onError={event => { event.currentTarget.style.display = 'none'; }} />;
}

export function RestaurantBanner({ menu, position }: { menu: Menu; position: 'above' | 'below' }) {
  const target = usePreviewTarget();
  const { bannerImage, bannerPresentation } = menu.customization;
  if (!bannerImage || bannerPresentation?.hidden || (bannerPresentation?.placement || 'above') !== position) return null;
  return <img key={bannerImage} {...target({ kind: 'restaurant', focus: 'banner' }, 'Edit restaurant banner in preview')} src={bannerImage} alt={`${menu.restaurantName} banner`} className="relative z-10 my-4 h-48 w-full" style={{ ...imageStyle(bannerPresentation), pointerEvents: 'auto' }} onError={event => { event.currentTarget.style.display = 'none'; }} />;
}
