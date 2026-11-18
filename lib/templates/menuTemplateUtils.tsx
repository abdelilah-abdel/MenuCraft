import React from 'react';
import { Menu, MenuItem, MenuLanguage, MenuSection, MenuSubsection } from '../types/menu';
import { imageService } from '../services/imageService';
import { useIsMenuPreview, usePreviewItemTarget, usePreviewTarget } from './previewSelection';

export interface MenuSectionGroup {
  subsection: MenuSubsection | null;
  items: MenuItem[];
}

export function getMenuSectionGroups(section: MenuSection, includeHidden = false): MenuSectionGroup[] {
  const allSubsections = section.subsections || [];
  const subsections = [...allSubsections].filter(group => includeHidden || !group.hidden).sort((left, right) => left.order - right.order);
  const subsectionIds = new Set(allSubsections.map((subsection) => subsection.id));
  const groups: MenuSectionGroup[] = [];
  const ungroupedItems = section.items.filter((item) => (includeHidden || !item.hidden) && (!item.subsectionId || !subsectionIds.has(item.subsectionId)));

  if (ungroupedItems.length > 0) {
    groups.push({ subsection: null, items: ungroupedItems });
  }

  for (const subsection of subsections) {
    const items = section.items.filter((item) => item.subsectionId === subsection.id && (includeHidden || !item.hidden));
    if (items.length > 0) groups.push({ subsection, items });
  }

  return groups;
}

export function getVisibleMenuSections(menu: Menu): MenuSection[] {
  return [...menu.sections].sort((a, b) => a.order - b.order).filter((section) => !section.hidden && getMenuSectionGroups(section).some((group) => group.items.length > 0));
}

export function menuDirection(menu: Menu): 'rtl' | 'ltr' {
  return menu.originalLanguage === 'ar' ? 'rtl' : 'ltr';
}

export function localizedMenuText(language: MenuLanguage, english: string, french: string, arabic: string): string {
  if (language === 'ar') return arabic;
  if (language === 'fr') return french;
  return english;
}

export function MenuItemPhoto({
  item,
  showImages,
  className,
}: {
  item: MenuItem;
  showImages: boolean;
  className: string;
}) {
  const target = usePreviewItemTarget(item);
  const previewTarget = usePreviewTarget();
  if (!showImages || !item.image) return null;

  return (
    <img
      {...(target ? previewTarget(target, `Edit photo for ${item.name || 'Untitled dish'} in preview`, true) : {})}
      src={imageService.getImageUrl(item.image)}
      alt={item.name}
      className={className}
      loading="lazy"
      onError={(event) => { event.currentTarget.style.display = 'none'; }}
    />
  );
}

export function MenuItemTags({ item, className = '' }: { item: MenuItem; className?: string }) {
  if (!item.tags?.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {item.tags.map((tag) => (
        <span key={tag} className="rounded-full border border-current/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function SoldOutLabel({ className = '', language = 'en' }: { className?: string; language?: MenuLanguage }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-800 ${className}`}>
      {localizedMenuText(language, 'Sold out', 'Épuisé', 'نفد')}
    </span>
  );
}

export function formatMenuPrice(item: MenuItem): string {
  const price = Number.isFinite(item.price) ? item.price.toFixed(2) : '0.00';
  return `${item.currency}${item.currency.trim() ? ' ' : ''}${price}`;
}

export function MenuEmptyState({ language }: { language: MenuLanguage }) {
  const preview = useIsMenuPreview();
  return <>{preview
    ? localizedMenuText(language, 'Add visible dishes to preview your menu.', 'Ajoutez des plats visibles pour prévisualiser votre menu.', 'أضف أطباقًا ظاهرة لمعاينة قائمتك.')
    : localizedMenuText(language, 'This menu is being updated. Please check back soon.', 'Cette carte est en cours de mise à jour.', 'يجري تحديث هذه القائمة. يرجى العودة قريبًا.')}</>;
}
